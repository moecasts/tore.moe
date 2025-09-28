import {
  format as baseFormat,
  formatDuration as baseFormatDuration,
  type Duration,
  type FormatDurationOptions,
} from 'date-fns';
import { zhCN } from 'date-fns/locale/zh-CN';

export const format = (date: Date, formatStr: string) => {
  return baseFormat(date, formatStr, {
    locale: zhCN,
  });
};

export const formatDuration = (duration: Duration, options: FormatDurationOptions) => {
  return baseFormatDuration(duration, {
    locale: zhCN,
    ...options,
  });
};
