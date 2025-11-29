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
 * 调试工具
 * 用于控制开发环境的调试功能
 */

/**
 * 检查是否启用调试模式
 * 只有在开发环境且环境变量 NEXT_PUBLIC_DEBUG_HIDDEN_PROFILE=true 时才启用
 */
export function isDebugEnabled(): boolean {
  // 检查是否为开发环境
  const isDevelopment = process.env.NODE_ENV === "development";

  // 检查环境变量
  const debugEnv = process.env.NEXT_PUBLIC_DEBUG_HIDDEN_PROFILE === "true";

  return isDevelopment && debugEnv;
}

/**
 * 服务端/客户端通用的调试模式检查
 */
export const DEBUG_MODE = isDebugEnabled();
