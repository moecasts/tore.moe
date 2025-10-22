import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../hoc/language-toggle';
import { Search } from '../hoc/search';
import { ThemeToggle } from '../hoc/theme-toggle';
import { SidebarTrigger } from '../ui/sidebar';

export const BlogHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="top-0 z-10 sticky flex justify-between items-center bg-background p-2 border-b h-14">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-3">
        <Search />
        <ThemeToggle />
      </div>
    </div>
  );
};
