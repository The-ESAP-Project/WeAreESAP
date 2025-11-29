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

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLayoutedElements } from "../graph-layout";
import { Node, Edge } from "reactflow";
import * as logger from "../logger";

describe("graph-layout", () => {
  describe("getLayoutedElements", () => {
    it("应该成功布局包含中心节点的图谱", async () => {
      const nodes: Node[] = [
        {
          id: "1",
          data: { label: "中心节点", isCenter: true },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "2",
          data: { label: "普通节点1", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "3",
          data: { label: "普通节点2", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
      ];

      const edges: Edge[] = [
        {
          id: "e1-2",
          source: "1",
          target: "2",
        },
        {
          id: "e1-3",
          source: "1",
          target: "3",
        },
      ];

      const layoutedNodes = await getLayoutedElements(nodes, edges);

      // 验证返回的节点数量
      expect(layoutedNodes.length).toBe(nodes.length);

      // 验证所有节点都有位置
      layoutedNodes.forEach((node) => {
        expect(node.position).toBeDefined();
        expect(typeof node.position.x).toBe("number");
        expect(typeof node.position.y).toBe("number");
      });

      // 验证中心节点存在
      const centerNode = layoutedNodes.find((n) => n.data.isCenter);
      expect(centerNode).toBeDefined();
    });

    it("应该处理空节点数组", async () => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      const layoutedNodes = await getLayoutedElements(nodes, edges);

      expect(layoutedNodes.length).toBe(0);
    });

    it("应该处理只有一个节点的图谱", async () => {
      const nodes: Node[] = [
        {
          id: "1",
          data: { label: "单个节点", isCenter: true },
          position: { x: 0, y: 0 },
          type: "custom",
        },
      ];

      const edges: Edge[] = [];

      const layoutedNodes = await getLayoutedElements(nodes, edges);

      expect(layoutedNodes.length).toBe(1);
      expect(layoutedNodes[0].position).toBeDefined();
    });

    it("应该为节点分配不同的位置", async () => {
      const nodes: Node[] = [
        {
          id: "1",
          data: { label: "Node 1", isCenter: true },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "2",
          data: { label: "Node 2", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "3",
          data: { label: "Node 3", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
      ];

      const edges: Edge[] = [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e1-3", source: "1", target: "3" },
      ];

      const layoutedNodes = await getLayoutedElements(nodes, edges);

      // 验证节点位置都不同
      const positions = layoutedNodes.map(
        (n) => `${n.position.x},${n.position.y}`
      );
      const uniquePositions = new Set(positions);

      // 验证所有节点的位置都是唯一的
      expect(uniquePositions.size).toBe(nodes.length);
    });

    it("应该保留节点的原始数据", async () => {
      const nodes: Node[] = [
        {
          id: "1",
          data: { label: "Test", customField: "value", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
      ];

      const edges: Edge[] = [];

      const layoutedNodes = await getLayoutedElements(nodes, edges);

      expect(layoutedNodes[0].data.label).toBe("Test");
      expect(layoutedNodes[0].data.customField).toBe("value");
      expect(layoutedNodes[0].id).toBe("1");
    });
  });

  describe("ELK 布局失败时的回退机制", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("应该在 ELK 布局失败时使用圆形布局", async () => {
      // Mock ELK 抛出异常
      const elkModule = await import("elkjs/lib/elk.bundled.js");
      const mockLayout = vi.fn().mockRejectedValue(new Error("ELK 布局失败"));
      vi.spyOn(elkModule.default.prototype, "layout").mockImplementation(
        mockLayout
      );

      const errorSpy = vi.spyOn(logger.logger, "error");

      const nodes: Node[] = [
        {
          id: "center",
          data: { label: "中心", isCenter: true },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "node1",
          data: { label: "节点1", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "node2",
          data: { label: "节点2", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
      ];

      const edges: Edge[] = [];

      const layoutedNodes = await getLayoutedElements(nodes, edges);

      // 验证 logger.error 被调用
      expect(errorSpy).toHaveBeenCalled();
      expect(errorSpy.mock.calls[0][0]).toContain("ELK 布局失败");

      // 验证返回了节点
      expect(layoutedNodes.length).toBe(3);

      // 验证中心节点在中心位置 (400, 300)
      const centerNode = layoutedNodes.find((n) => n.id === "center");
      expect(centerNode?.position.x).toBe(400);
      expect(centerNode?.position.y).toBe(300);

      // 验证其他节点在圆周上
      const otherNodes = layoutedNodes.filter((n) => n.id !== "center");
      otherNodes.forEach((node) => {
        // 验证节点到中心的距离约等于半径 200
        const distance = Math.sqrt(
          Math.pow(node.position.x - 400, 2) +
            Math.pow(node.position.y - 300, 2)
        );
        expect(distance).toBeCloseTo(200, 0);
      });

      vi.restoreAllMocks();
    });
  });

  describe("圆形布局算法", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("应该正确布局只有中心节点的情况", async () => {
      // Mock ELK 失败以使用回退布局
      const elkModule = await import("elkjs/lib/elk.bundled.js");
      vi.spyOn(elkModule.default.prototype, "layout").mockRejectedValue(
        new Error("测试")
      );
      vi.spyOn(logger.logger, "error").mockImplementation(() => {});

      const nodes: Node[] = [
        {
          id: "center",
          data: { label: "中心", isCenter: true },
          position: { x: 0, y: 0 },
          type: "custom",
        },
      ];

      const layoutedNodes = await getLayoutedElements(nodes, []);

      expect(layoutedNodes.length).toBe(1);
      expect(layoutedNodes[0].position.x).toBe(400);
      expect(layoutedNodes[0].position.y).toBe(300);

      vi.restoreAllMocks();
    });

    it("应该正确布局只有普通节点的情况", async () => {
      // Mock ELK 失败
      const elkModule = await import("elkjs/lib/elk.bundled.js");
      vi.spyOn(elkModule.default.prototype, "layout").mockRejectedValue(
        new Error("测试")
      );
      vi.spyOn(logger.logger, "error").mockImplementation(() => {});

      const nodes: Node[] = [
        {
          id: "1",
          data: { label: "节点1", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "2",
          data: { label: "节点2", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "3",
          data: { label: "节点3", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
      ];

      const layoutedNodes = await getLayoutedElements(nodes, []);

      expect(layoutedNodes.length).toBe(3);

      // 验证所有节点都在圆周上
      layoutedNodes.forEach((node) => {
        const distance = Math.sqrt(
          Math.pow(node.position.x - 400, 2) +
            Math.pow(node.position.y - 300, 2)
        );
        expect(distance).toBeCloseTo(200, 0);
      });

      // 验证节点间角度均匀分布
      const angles = layoutedNodes.map((node) =>
        Math.atan2(node.position.y - 300, node.position.x - 400)
      );
      for (let i = 1; i < angles.length; i++) {
        const angleDiff = Math.abs(angles[i] - angles[i - 1]);
        const expectedDiff = (2 * Math.PI) / nodes.length;
        expect(angleDiff).toBeCloseTo(expectedDiff, 1);
      }

      vi.restoreAllMocks();
    });

    it("应该正确布局混合节点（中心+普通节点）", async () => {
      // Mock ELK 失败
      const elkModule = await import("elkjs/lib/elk.bundled.js");
      vi.spyOn(elkModule.default.prototype, "layout").mockRejectedValue(
        new Error("测试")
      );
      vi.spyOn(logger.logger, "error").mockImplementation(() => {});

      const nodes: Node[] = [
        {
          id: "center",
          data: { label: "中心", isCenter: true },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "1",
          data: { label: "节点1", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "2",
          data: { label: "节点2", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "3",
          data: { label: "节点3", isCenter: false },
          position: { x: 0, y: 0 },
          type: "custom",
        },
      ];

      const layoutedNodes = await getLayoutedElements(nodes, []);

      expect(layoutedNodes.length).toBe(4);

      // 验证中心节点在中心
      const centerNode = layoutedNodes.find((n) => n.data.isCenter);
      expect(centerNode?.position.x).toBe(400);
      expect(centerNode?.position.y).toBe(300);

      // 验证普通节点在圆周上
      const normalNodes = layoutedNodes.filter((n) => !n.data.isCenter);
      normalNodes.forEach((node) => {
        const distance = Math.sqrt(
          Math.pow(node.position.x - 400, 2) +
            Math.pow(node.position.y - 300, 2)
        );
        expect(distance).toBeCloseTo(200, 0);
      });

      vi.restoreAllMocks();
    });

    it("应该正确处理所有节点都是中心节点的边界情况", async () => {
      // Mock ELK 失败
      const elkModule = await import("elkjs/lib/elk.bundled.js");
      vi.spyOn(elkModule.default.prototype, "layout").mockRejectedValue(
        new Error("测试")
      );
      vi.spyOn(logger.logger, "error").mockImplementation(() => {});

      const nodes: Node[] = [
        {
          id: "center1",
          data: { label: "中心1", isCenter: true },
          position: { x: 0, y: 0 },
          type: "custom",
        },
        {
          id: "center2",
          data: { label: "中心2", isCenter: true },
          position: { x: 0, y: 0 },
          type: "custom",
        },
      ];

      const layoutedNodes = await getLayoutedElements(nodes, []);

      expect(layoutedNodes.length).toBe(2);

      // 所有节点都应该在中心位置
      layoutedNodes.forEach((node) => {
        expect(node.position.x).toBe(400);
        expect(node.position.y).toBe(300);
      });

      vi.restoreAllMocks();
    });
  });
});
