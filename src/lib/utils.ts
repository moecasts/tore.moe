import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 重新导出 cookie 工具函数，方便使用
export {
  type CookieOptions,
  clearAllCookies,
  getAllCookies,
  getCookie,
  hasCookie,
  removeCookie,
  setCookie,
} from './cookie';
