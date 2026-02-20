// Copyright 2021-2026 The ESAP Project
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
