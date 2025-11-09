// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Link } from "@/i18n/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  MouseEvent,
  ReactNode,
  AnchorHTMLAttributes,
  useCallback,
} from "react";
import { useTransition } from "./TransitionContext";

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

/**
 * 带过渡效果的链接组件
 * 点击时触发过渡动画，路由加载完成后自动结束
 */
export function TransitionLink({
  href,
  children,
  onClick,
  className,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { startTransition, isTransitioning, finishTransition } =
    useTransition();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      // 如果有自定义 onClick，先执行
      if (onClick) {
        onClick(e);
      }

      // 如果是外部链接或特殊按键，使用默认行为
      if (
        href.startsWith("http") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      e.preventDefault();

      // 如果是当前页面，不执行跳转
      if (pathname === href) {
        return;
      }

      // 开始过渡（会自动监听路由变化并结束）
      startTransition();

      // 立即执行路由跳转，添加错误处理
      try {
        router.push(href);
      } catch (error) {
        // 路由跳转失败时，结束过渡动画
        console.error("Navigation error:", error);
        finishTransition();
        // 这里可以添加错误提示逻辑，比如使用 toast
      }
    },
    [onClick, href, pathname, startTransition, router, finishTransition]
  );

  return (
    <Link
      href={href}
      onClick={handleClick}
      prefetch={true}
      className={`${className || ""} ${isTransitioning ? "pointer-events-none opacity-60" : ""}`}
      {...props}
    >
      {children}
    </Link>
  );
}
