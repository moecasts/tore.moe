import {
  format as baseFormat,
  formatDuration as baseFormatDuration,
  type Duration,
  type FormatDurationOptions,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { zhCN } from 'date-fns/locale/zh-CN';
import i18n from 'i18next';

/**
 * Get date-fns locale based on current i18n language
 */
const getDateFnsLocale = () => {
  const currentLanguage = i18n.language || 'en-US';

  // Map i18n language codes to date-fns locales
  const localeMap: Record<string, typeof enUS | typeof zhCN> = {
    'zh-CN': zhCN,
    'en-US': enUS,
  };

  return localeMap[currentLanguage] || enUS;
};

export const format = (date: Date, formatStr: string) => {
  return baseFormat(date, formatStr, {
    locale: getDateFnsLocale(),
  });
};

export const formatDuration = (duration: Duration, options: FormatDurationOptions) => {
  return baseFormatDuration(duration, {
    locale: getDateFnsLocale(),
    ...options,
  });
};
