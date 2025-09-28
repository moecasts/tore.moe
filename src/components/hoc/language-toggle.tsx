import { changeLocale } from 'astro-react-i18next/utils';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageToggle() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (locale: string) => {
    changeLocale(locale);
  };

  const languages = [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en-US', name: 'English' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <Globe />
          <span className="sr-only">{t('Language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={i18n.language} onValueChange={handleLanguageChange}>
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language.code} value={language.code}>
              {language.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
