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

"use client";

import { useEffect, useMemo, useState, memo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { Character } from "@/types/character";
import { Relationship } from "@/types/relationship";
import { RelationshipNodeData } from "@/types/relationship-node";
import CharacterNode, { CharacterNodeData } from "./graph/CharacterNode";
import RelationshipEdge, {
  RelationshipEdgeData,
} from "./graph/RelationshipEdge";
import { useTranslations } from "next-intl";
import { getLayoutedElements } from "@/lib/graph-layout";

interface RelationshipGraphProps {
  character: Character;
  relationships: Relationship[];
  relatedCharactersData: Record<string, RelationshipNodeData>;
}

// 注册自定义节点和边类型（组件外部定义配置）
const nodeTypesConfig = {
  character: CharacterNode,
} as const;

const edgeTypesConfig = {
  relationship: RelationshipEdge,
} as const;

const RelationshipGraph = memo(function RelationshipGraph({
  character,
  relationships,
  relatedCharactersData,
}: RelationshipGraphProps) {
  const t = useTranslations("characters");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLayouting, setIsLayouting] = useState(true);

  // 使用 useMemo 稳定化类型对象的引用，避免 React Flow 警告
  const nodeTypes = useMemo<NodeTypes>(() => nodeTypesConfig, []);
  const edgeTypes = useMemo<EdgeTypes>(() => edgeTypesConfig, []);

  // 构建图谱数据并应用自动布局
  useEffect(() => {
    if (relationships.length === 0) {
      setIsLayouting(false);
      return;
    }

    const layoutGraph = async () => {
      setIsLayouting(true);

      // 创建中心节点（当前角色）
      const centerNode: Node<CharacterNodeData> = {
        id: `node-${character.id}`,
        type: "character",
        position: { x: 0, y: 0 }, // 初始位置，将被布局算法更新
        data: {
          characterId: character.id,
          characterName: character.name,
          color: character.color.primary,
          isCenter: true,
        },
      };

      // 创建关联角色节点
      const relatedNodes: Node<CharacterNodeData>[] = relationships.map(
        (rel) => {
          const relatedChar = relatedCharactersData[rel.targetId];

          return {
            id: `node-${rel.targetId}`,
            type: "character",
            position: { x: 0, y: 0 }, // 初始位置
            data: {
              characterId: rel.targetId,
              characterName: relatedChar?.name || `AptS:${rel.targetId}`,
              color: relatedChar?.color || "#6b7280",
              isCenter: false,
            },
          };
        }
      );

      // 创建边
      const relationshipEdges: Edge<RelationshipEdgeData>[] = relationships.map(
        (rel) => ({
          id: `edge-${character.id}-${rel.targetId}`,
          type: "relationship",
          source: `node-${character.id}`,
          target: `node-${rel.targetId}`,
          data: {
            label: rel.label,
            type: rel.type,
            description: rel.description,
          },
        })
      );

      const allNodes = [centerNode, ...relatedNodes];

      // 应用自动布局
      const layoutedNodes = await getLayoutedElements(
        allNodes,
        relationshipEdges
      );

      setNodes(layoutedNodes);
      setEdges(relationshipEdges);
      setIsLayouting(false);
    };

    layoutGraph();
    // 只依赖必要的字段，避免不必要的重新渲染
  }, [
    character.id,
    character.name,
    character.color.primary,
    relationships,
    relatedCharactersData,
    setNodes,
    setEdges,
  ]);

  // 加载状态
  if (isLayouting) {
    return (
      <div className="w-full h-[600px] rounded-xl overflow-hidden border border-border bg-background/50 relative flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            {t("detail.relationships.loading")}
          </p>
        </div>
      </div>
    );
  }

  // 空状态：只有在真正没有关系数据时才显示
  if (relationships.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {t("detail.relationships.noData")}
        </p>
      </div>
    );
  }

  // 如果有关系数据但节点未生成，说明布局失败或仍在进行
  // 这种情况下应该显示加载状态（已在前面处理）或等待
  if (nodes.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            {t("detail.relationships.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-border bg-background/50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1.5,
        }}
        minZoom={0.3}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
        // 添加动画配置
        defaultEdgeOptions={{
          animated: false,
        }}
        // 启用节点拖拽
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background className="bg-background/50" />
        <Controls className="!bg-background/80 !border-border !shadow-lg" />
      </ReactFlow>

      {/* 提示文字 */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border">
        {t("detail.relationships.graphHint")}
      </div>
    </div>
  );
});

export default RelationshipGraph;
