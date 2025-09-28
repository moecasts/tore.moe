import { Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getCookie, setCookie } from '@/lib/utils';

export function ThemeToggle() {
  const { t } = useTranslation();
  // mode: 'light' | 'dark' | 'system'
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  // Apply dark class name to documentElement
  const applyDocumentClass = useCallback((isDark: boolean) => {
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  }, []);

  // Get whether system prefers dark mode
  const getSystemPrefersDark = useCallback(
    () => window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false,
    []
  );

  // Utility function to read cookie
  const readThemeCookie = useCallback((): 'light' | 'dark' | null => {
    const value = getCookie('theme');
    if (value === 'light' || value === 'dark') return value;
    return null;
  }, []);

  const writeThemeCookie = useCallback((value: 'light' | 'dark') => {
    setCookie('theme', value, {
      expires: new Date('2099-12-31'),
    });
  }, []);

  // Initialize: prioritize cookie config, otherwise follow system and listen for changes
  useEffect(() => {
    const cookieTheme = readThemeCookie();
    if (cookieTheme === 'light' || cookieTheme === 'dark') {
      setMode(cookieTheme);
      applyDocumentClass(cookieTheme === 'dark');
      return;
    }

    // No stored preference, follow system
    setMode('system');
    const isDark = getSystemPrefersDark();
    applyDocumentClass(isDark);

    if (typeof window !== 'undefined' && window?.matchMedia) {
      mediaQueryRef.current = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        // Only respond to system changes in system mode
        setMode((current) => {
          if (current === 'system') {
            applyDocumentClass(e.matches);
          }
          return current;
        });
      };
      mediaQueryRef.current?.addEventListener('change', handler);
      return () => {
        mediaQueryRef.current?.removeEventListener('change', handler);
      };
    }
  }, [applyDocumentClass, getSystemPrefersDark, readThemeCookie]);

  // Toggle light/dark: write cookie and apply
  const toggleTheme = useCallback(() => {
    const next =
      mode === 'dark' || (mode === 'system' && getSystemPrefersDark()) ? 'light' : 'dark';
    const run = () => {
      flushSync(() => {
        setMode(next);
        writeThemeCookie(next);
        applyDocumentClass(next === 'dark');
      });
    };

    const prefersReduce =
      window?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    // Call directly on document to avoid Illegal invocation
    const startVT = (document as any)?.startViewTransition as
      | undefined
      | ((cb: () => void) => { finished: Promise<void> });
    if (!prefersReduce && typeof startVT === 'function') {
      startVT.call(document, run);
    } else {
      run();
    }
  }, [applyDocumentClass, getSystemPrefersDark, mode, writeThemeCookie]);

  return (
    <Button variant="ghost" size="icon" className="size-7" onClick={toggleTheme}>
      <Sun className="w-[1.2rem] h-[1.2rem] rotate-0 dark:-rotate-90 scale-100 dark:scale-0 transition-all" />
      <Moon className="absolute w-[1.2rem] h-[1.2rem] rotate-90 dark:rotate-0 scale-0 dark:scale-100 transition-all" />
      <span className="sr-only">{t('Toggle theme')}</span>
    </Button>
  );
}
