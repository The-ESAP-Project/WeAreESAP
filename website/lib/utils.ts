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
