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
 * 日志工具 - 根据环境控制日志输出
 *
 * 在生产环境下，日志会被静默处理，不会输出到控制台
 * 在开发环境下，日志会正常输出
 */

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

/**
 * 判断是否为开发环境
 */
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * 创建日志函数
 * @param level 日志级别
 * @returns 日志函数
 */
function createLogger(level: LogLevel) {
  return (...args: unknown[]): void => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console[level](...args);
    }
    // 生产环境下静默处理
  };
}

/**
 * 日志工具对象
 *
 * @example
 * ```ts
 * import { logger } from '@/lib/logger';
 *
 * logger.log('普通日志');
 * logger.info('信息日志');
 * logger.warn('警告日志');
 * logger.error('错误日志');
 * logger.debug('调试日志');
 * ```
 */
export const logger = {
  /**
   * 普通日志
   */
  log: createLogger("log"),

  /**
   * 信息日志
   */
  info: createLogger("info"),

  /**
   * 警告日志
   */
  warn: createLogger("warn"),

  /**
   * 错误日志
   */
  error: createLogger("error"),

  /**
   * 调试日志
   */
  debug: createLogger("debug"),
};

/**
 * 默认导出
 */
export default logger;
