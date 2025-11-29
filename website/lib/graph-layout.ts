// Copyright 2025 The ESAP Project
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * 图谱自动布局工具
 * 使用 elkjs 实现自动布局
 */

import ELK from "elkjs/lib/elk.bundled.js";
import { Node, Edge } from "reactflow";
import { logger } from "./logger";

// ELK 布局选项
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
  "elk.direction": "DOWN",
};

export interface LayoutedNode extends Node {
  position: { x: number; y: number };
}

/**
 * 回退布局：使用简单的圆形布局
 * 当 elkjs 失败时使用
 */
function getFallbackCircularLayout(nodes: Node[]): LayoutedNode[] {
  const centerX = 400;
  const centerY = 300;
  const radius = 200;

  return nodes.map((node) => {
    // 中心节点放在中间
    if (node.data.isCenter) {
      return {
        ...node,
        position: { x: centerX, y: centerY },
      };
    }

    // 其他节点按圆形分布
    const totalNonCenterNodes = nodes.filter((n) => !n.data.isCenter).length;
    const nonCenterIndex = nodes.filter((n) => !n.data.isCenter).indexOf(node);
    const angle =
      (nonCenterIndex / totalNonCenterNodes) * 2 * Math.PI - Math.PI / 2;

    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
    };
  });
}

/**
 * 使用 ELK 算法自动布局节点
 * @param nodes 节点数组
 * @param edges 边数组
 * @returns 布局后的节点数组
 */
export async function getLayoutedElements(
  nodes: Node[],
  edges: Edge[]
): Promise<LayoutedNode[]> {
  // 在函数内创建 ELK 实例，避免模块级实例常驻内存
  const elk = new ELK();

  const graph = {
    id: "root",
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      id: node.id,
      // 节点尺寸（需要与实际渲染尺寸匹配）
      width: node.data.isCenter ? 96 : 80, // w-24 = 96px, w-20 = 80px
      height: node.data.isCenter ? 96 : 80,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  try {
    logger.log("🎨 开始 ELK 布局计算...");
    logger.log("输入节点数:", nodes.length);
    logger.log("输入边数:", edges.length);

    const layoutedGraph = await elk.layout(graph);

    logger.log("✅ ELK 布局完成");
    logger.log("布局结果:", layoutedGraph);

    // 更新节点位置
    const layoutedNodes: LayoutedNode[] = nodes.map((node) => {
      const layoutedNode = layoutedGraph.children?.find(
        (n) => n.id === node.id
      );

      logger.log(`节点 ${node.id}:`, {
        原始位置: node.position,
        布局位置: { x: layoutedNode?.x, y: layoutedNode?.y },
      });

      return {
        ...node,
        position: {
          x: layoutedNode?.x ?? node.position.x,
          y: layoutedNode?.y ?? node.position.y,
        },
      };
    });

    return layoutedNodes;
  } catch (error) {
    // 布局失败，使用回退的圆形布局
    logger.error("❌ ELK 布局失败，使用回退圆形布局:", error);

    return getFallbackCircularLayout(nodes);
  }
}
