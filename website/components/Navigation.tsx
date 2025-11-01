// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import Link from "next/link";
import { TriangleLogo } from "./TriangleLogo";
import { ThemeToggle } from "./ThemeToggle";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo 和站点名称 */}
          <Link href="/" className="flex items-center gap-3 group">
            <TriangleLogo size={40} animated={false} className="opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground group-hover:text-esap-yellow transition-colors">
                We Are ESAP
              </span>
              <span className="text-xs text-muted-foreground">
                向那卫星许愿
              </span>
            </div>
          </Link>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center gap-6">
            {/*
            <Link href="/project" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              项目企划
            </Link>
            <Link href="/characters" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              角色档案
            </Link>
            */}
            <Link href="/tech" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              技术设定
            </Link>
            <Link href="/timeline" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              时间线
            </Link>
          </div>

          {/* 主题切换按钮 */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
