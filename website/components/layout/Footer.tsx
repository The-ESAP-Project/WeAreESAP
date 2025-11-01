// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

/**
 * 全局底部栏组件
 */
export function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground space-y-2">
        <p className="italic">"天上没有星星，但我们造了一颗"</p>
        <p>
          <strong>The ESAP Project</strong> © 2021-2025 by AptS:1547,
          AptS:1548 and contributors
        </p>
        <p>
          本作品采用{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/deed.zh-hans"
            target="_blank"
            rel="noopener noreferrer"
            className="text-esap-blue hover:underline transition-colors"
          >
            CC-BY 4.0
          </a>{" "}
          协议授权
        </p>
      </div>
    </footer>
  );
}
