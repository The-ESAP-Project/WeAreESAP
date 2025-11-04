// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

/**
 * 通用工具函数
 */

/**
 * 格式化日期
 * @param date 日期字符串或 Date 对象
 * @param format 格式化模式 (目前支持 'YYYY-MM-DD' 和 'YYYY/MM/DD')
 */
export function formatDate(
  date: string | Date,
  format: "YYYY-MM-DD" | "YYYY/MM/DD" = "YYYY-MM-DD"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const separator = format === "YYYY-MM-DD" ? "-" : "/";
  return `${year}${separator}${month}${separator}${day}`;
}

/**
 * 类名合并工具（简单版）
 * @param classes 类名数组
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 截断文本
 * @param text 要截断的文本
 * @param maxLength 最大长度
 * @param suffix 后缀（默认为 '...'）
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix = "..."
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 防抖函数
 * @param fn 要防抖的函数
 * @param delay 延迟时间（毫秒）
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * 节流函数
 * @param fn 要节流的函数
 * @param limit 时间限制（毫秒）
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 将图片路径转换为完整 URL（用于 SEO metadata）
 * @param path 图片路径（可以是相对路径或完整 URL）
 * @param siteUrl 网站根 URL（可选，默认使用环境变量）
 * @returns 完整的图片 URL
 */
export function getImageUrl(
  path: string | undefined,
  siteUrl?: string
): string {
  const baseUrl =
    siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://weare.esaps.net";

  // 如果路径为空，返回默认图标
  if (!path) {
    return `${baseUrl}/favicon.ico`;
  }

  // 如果已经是完整 URL，直接返回
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // 如果是相对路径，拼接域名
  return path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
}

/**
 * 计算颜色的相对亮度（基于 WCAG 标准）
 * @param color 十六进制颜色值（如 '#FFFFFF'）
 * @returns 0-1 之间的亮度值，1 为最亮（白色），0 为最暗（黑色）
 */
export function getColorLuminance(color: string): number {
  // 移除 # 符号
  const hex = color.replace("#", "");

  // 解析 RGB 值
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // 应用 sRGB 伽马校正
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // 计算相对亮度
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

/**
 * 根据颜色亮度调整文本颜色，确保在浅色和深色背景上都有足够的对比度
 * @param color 原始颜色（十六进制格式）
 * @returns 调整后的颜色，确保在任何主题下都可见
 */
export function getContrastTextColor(color: string): string {
  const luminance = getColorLuminance(color);

  // 如果颜色太亮（接近白色），在浅色主题下会不可见，需要变暗
  // 阈值设为 0.9，即非常亮的颜色才需要调整
  if (luminance > 0.9) {
    // 将颜色变暗 - 将 RGB 值乘以 0.3 左右
    const hex = color.replace("#", "");
    const r = Math.floor(parseInt(hex.substring(0, 2), 16) * 0.3);
    const g = Math.floor(parseInt(hex.substring(2, 4), 16) * 0.3);
    const b = Math.floor(parseInt(hex.substring(4, 6), 16) * 0.3);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  // 其他颜色直接返回原色
  return color;
}
