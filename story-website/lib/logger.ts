// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

function createLogger(level: LogLevel) {
  return (...args: unknown[]): void => {
    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint/suspicious/noConsole: Intentional dev-only logging
      console[level](...args);
    }
  };
}

export const logger = {
  log: createLogger("log"),
  info: createLogger("info"),
  warn: createLogger("warn"),
  error: createLogger("error"),
  debug: createLogger("debug"),
};

export default logger;
