import { getPaginationConfig } from './posts';

export function getRealTagFromParams(params: { tag: string; page?: string }) {
  const { tag, page } = params;
  const route = [tag, page].filter(Boolean).join('/');
  const result = route.split(`/${getPaginationConfig().prefix}/`);

  return result[0];
}
