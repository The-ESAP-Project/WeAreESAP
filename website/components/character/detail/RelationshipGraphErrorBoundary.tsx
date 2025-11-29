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

import { Component, ReactNode } from "react";
import { Icon } from "@/components/ui";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 关系图谱错误边界组件
 * 捕获图谱渲染过程中的错误，防止整个页面崩溃
 */
export class RelationshipGraphErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 只在开发环境输出详细错误信息
    logger.error("关系图谱渲染错误:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4 p-8">
          <div className="flex items-center gap-3 text-destructive">
            <Icon name="Warning" size={24} />
            <h3 className="text-lg font-semibold">关系图谱加载失败</h3>
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            图谱数据可能存在问题或渲染出错。请尝试刷新页面，如果问题持续存在，请联系管理员。
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-4 w-full max-w-2xl">
              <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                查看错误详情
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-40">
                {this.state.error.toString()}
                {"\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
