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
 * SVG 工具函数
 * 用于生成和计算 SVG 图形
 */

/**
 * ESAP 品牌色
 */
export const ESAP_COLORS = {
  yellow: "#ffd93d",
  pink: "#ff69b4",
  blue: "#4da6ff",
} as const;

export const ESAP_COLOR_ARRAY = [
  ESAP_COLORS.yellow,
  ESAP_COLORS.pink,
  ESAP_COLORS.blue,
] as const;

/**
 * 三角形顶点接口
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * 等边三角形路径数据
 */
export interface TrianglePaths {
  paths: string[];
  height: number;
  top: Point;
  bottomLeft: Point;
  bottomRight: Point;
}

/**
 * 计算等边三角形的高度
 */
export function calculateTriangleHeight(size: number): number {
  return (size * Math.sqrt(3)) / 2;
}

/**
 * 计算等边三角形的三个顶点
 * @param size - 三角形边长
 * @param padding - 内边距
 */
export function calculateTriangleVertices(
  size: number,
  padding: number = 10
): { top: Point; bottomLeft: Point; bottomRight: Point } {
  const height = calculateTriangleHeight(size);

  return {
    top: { x: size / 2, y: padding },
    bottomLeft: { x: padding, y: height - padding },
    bottomRight: { x: size - padding, y: height - padding },
  };
}

/**
 * 计算缩短的路径（用于在端点留出间隙）
 * @param x1 - 起点 x
 * @param y1 - 起点 y
 * @param x2 - 终点 x
 * @param y2 - 终点 y
 * @param gapStart - 起点间隙
 * @param gapEnd - 终点间隙
 * @returns SVG 路径字符串
 */
export function shortenPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  gapStart: number,
  gapEnd: number
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  const startX = x1 + (dx * gapStart) / length;
  const startY = y1 + (dy * gapStart) / length;
  const endX = x1 + (dx * (length - gapEnd)) / length;
  const endY = y1 + (dy * (length - gapEnd)) / length;

  return `M ${startX} ${startY} L ${endX} ${endY}`;
}

/**
 * 生成 ESAP 三角形的三条边路径
 * @param size - 三角形边长
 * @param gap - 边与边之间的间隙
 * @param padding - 三角形整体内边距
 * @returns 三条边的路径数据和顶点信息
 */
export function generateTrianglePaths(
  size: number,
  gap: number = 8,
  padding: number = 10
): TrianglePaths {
  const height = calculateTriangleHeight(size);
  const { top, bottomLeft, bottomRight } = calculateTriangleVertices(
    size,
    padding
  );

  // 三条边的路径（按照：左边-黄色、右边-粉色、底边-蓝色的顺序）
  const paths = [
    // 左边（从左下到顶部）
    shortenPath(bottomLeft.x, bottomLeft.y, top.x, top.y, gap, gap),
    // 右边（从顶部到右下）
    shortenPath(top.x, top.y, bottomRight.x, bottomRight.y, gap, gap),
    // 底边（从右下到左下）
    shortenPath(
      bottomRight.x,
      bottomRight.y,
      bottomLeft.x,
      bottomLeft.y,
      gap,
      gap
    ),
  ];

  return {
    paths,
    height,
    top,
    bottomLeft,
    bottomRight,
  };
}
