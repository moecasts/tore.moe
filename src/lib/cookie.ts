/**
 * Cookie 工具函数
 * 提供统一的 cookie 操作接口
 */

export interface CookieOptions {
  expires?: Date | number; // 过期时间，可以是 Date 对象或天数
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * 获取 cookie 值
 * @param name cookie 名称
 * @returns cookie 值，如果不存在则返回 null
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }

  return null;
};

/**
 * 设置 cookie
 * @param name cookie 名称
 * @param value cookie 值
 * @param options cookie 选项
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  if (typeof document === 'undefined') return;

  const {
    expires = 30, // 默认 30 天
    path = '/',
    domain,
    secure,
    sameSite = 'lax'
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  // 处理过期时间
  if (expires) {
    let expiresDate: Date;
    if (typeof expires === 'number') {
      expiresDate = new Date();
      expiresDate.setTime(expiresDate.getTime() + expires * 24 * 60 * 60 * 1000);
    } else {
      expiresDate = expires;
    }
    cookieString += `;expires=${expiresDate.toUTCString()}`;
  }

  // 添加其他选项
  if (path) cookieString += `;path=${path}`;
  if (domain) cookieString += `;domain=${domain}`;
  if (secure) cookieString += ';secure';
  if (sameSite) cookieString += `;samesite=${sameSite}`;

  document.cookie = cookieString;
};

/**
 * 删除 cookie
 * @param name cookie 名称
 * @param options cookie 选项（主要是 path 和 domain）
 */
export const removeCookie = (
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0) // 设置为过去的时间来删除
  });
};

/**
 * 检查 cookie 是否存在
 * @param name cookie 名称
 * @returns 是否存在
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * 获取所有 cookie
 * @returns cookie 对象
 */
export const getAllCookies = (): Record<string, string> => {
  if (typeof document === 'undefined') return {};

  const cookies: Record<string, string> = {};

  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
};

/**
 * 清除所有 cookie（仅限当前路径和域名）
 */
export const clearAllCookies = (): void => {
  const cookies = getAllCookies();
  Object.keys(cookies).forEach(name => {
    removeCookie(name);
  });
};
