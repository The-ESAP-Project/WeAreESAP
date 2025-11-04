// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect } from "react";
import { useTransition } from "./TransitionContext";

/**
 * TransitionFinisher - 自动结束路由过渡动画的辅助组件
 *
 * 用途：在组件挂载后立即调用 finishTransition()，适用于静态内容页面
 *
 * 使用场景：
 * - 不需要异步数据加载的页面
 * - 内容主要是静态文本和图片
 * - 无复杂的客户端交互
 *
 * 使用方法：
 * 在页面组件的 JSX 中添加 <TransitionFinisher />
 *
 * @example
 * export default function Page() {
 *   return (
 *     <>
 *       <TransitionFinisher />
 *       <div>页面内容...</div>
 *     </>
 *   );
 * }
 */
export function TransitionFinisher() {
  const { finishTransition } = useTransition();

  useEffect(() => {
    // 组件挂载后立即结束过渡动画
    finishTransition();
  }, [finishTransition]);

  // 该组件不渲染任何内容
  return null;
}
