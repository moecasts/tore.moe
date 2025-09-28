import { getLocalizedPathname } from 'astro-react-i18next/utils';

export const getLocaleURL = () => {
  console.log('debug1', getLocalizedPathname('rss.xml'));
};
