import { getThemeConfig } from '../config';

/**
 * Flatten nested menu items recursively
 */
export function flattenMenuItems(items: any[]): any[] {
  const flattened: any[] = [];

  for (const item of items) {
    if (item) {
      flattened.push(item);
      if (item.children && Array.isArray(item.children)) {
        flattened.push(...flattenMenuItems(item.children));
      }
    }
  }

  return flattened;
}

/**
 * Get flattened menu items from theme config
 */
export function getFlattenedMenu(locale: string = 'zh-CN'): any[] {
  const config = getThemeConfig(locale);
  const menu = config.menu ?? [];
  return flattenMenuItems(menu);
}

/**
 * Find menu item by id (case-insensitive)
 */
export function findMenuItemById(id: string, locale: string = 'zh-CN'): any | undefined {
  const flattenedMenu = getFlattenedMenu(locale);
  return flattenedMenu.find((item) => item.id && item.id.toLowerCase() === id.toLowerCase());
}

/**
 * Find menu item by href
 */
export function findMenuItemByHref(href: string, locale: string = 'zh-CN'): any | undefined {
  const flattenedMenu = getFlattenedMenu(locale);
  return flattenedMenu.find((item) => item.href === href);
}
