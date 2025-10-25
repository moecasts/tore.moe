import { themeConfig } from '@/config';

/**
 * Get filter configuration
 */
export const getFilterConfig = () => {
  return themeConfig.filter;
};

/**
 * get filter column configuration
 */
export const getFilterColumn = () => {
  return (getFilterConfig()?.column || 'filters') as 'filters';
};
