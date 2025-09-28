export function normalize(inputPath?: string): string {
  if (!inputPath) return '/';

  // Remove leading and trailing whitespace
  let path = String(inputPath).trim();

  // 确保以斜杠开头
  if (!path.startsWith('/')) path = '/' + path;

  // Collapse duplicate slashes (for internal paths only, protocol scenarios not applicable)
  path = path.replace(/\/+/, '/');
  path = path.replace(/\/{2,}/g, '/');

  // 去除末尾斜杠（根路径除外）
  if (path.length > 1 && path.endsWith('/')) path = path.replace(/\/+$/g, '');

  return path;
}
