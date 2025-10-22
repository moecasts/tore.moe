import { Content as DialogContent } from '@radix-ui/react-dialog';
import { Command, Search as SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { unescapeHtml } from '@/lib/unescape-html';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Empty, EmptyContent, EmptyHeader, EmptyMedia } from '../ui/empty';
import { Kbd, KbdGroup } from '../ui/kbd';

interface SearchResult {
  url: string;
  content: string;
  word_count: number;
  filters: Record<string, string>;
  meta: {
    title: string;
    image?: string;
    image_alt?: string;
    date?: string;
  };
  anchors: Array<{
    element: string;
    id: string;
    text: string;
    location: number;
  }>;
  weighted_locations: Array<{
    weight: number;
    balanced_score: number;
    location: number;
  }>;
  locations: number[];
  raw_content: string;
  raw_url: string;
  excerpt: string;
  sub_results: SearchResult[];
}

interface PagefindInstance {
  search: (query: string) => Promise<{
    results: Array<{
      id: string;
      score: number;
      words: number[];
      data: () => Promise<SearchResult>;
    }>;
  }>;
  filters: () => Promise<Record<string, Record<string, number>>>;
}

export const Search = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const pagefindRef = useRef<PagefindInstance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Pagefind
  useEffect(() => {
    const initPagefind = async () => {
      if (typeof window !== 'undefined' && !pagefindRef.current) {
        try {
          // Dynamically load pagefind
          const pagefind = await import(/* @vite-ignore */ '/pagefind/pagefind.js' as string);
          await pagefind.init();

          pagefindRef.current = pagefind;
        } catch (error) {
          console.error('Failed to initialize Pagefind:', error);
        }
      }
    };

    initPagefind();
  }, []);

  // Search functionality
  const performSearch = async (searchQuery: string) => {
    if (!pagefindRef.current || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const search = await pagefindRef.current.search(searchQuery);
      const searchResults = await Promise.all(
        search.results.map(async (result) => {
          const data = await result.data();
          return data;
        })
      );

      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const highlightText = (text: string) => {
    if (!query.trim()) return text;

    const regex = /(<mark>.+?<\/mark>)/gi;
    const parts = unescapeHtml(text).split(regex);

    const markedParts = parts.map((part, index) => {
      if (part.startsWith('<mark>') && part.endsWith('</mark>')) {
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: this is a workaround for a bug in the linter
          <mark key={index} className="bg-accent px-1 rounded text-accent-foreground">
            {part.slice(6, -7)}
          </mark>
        );
      }

      return part;
    });

    return markedParts;
  };

  const renderContent = () => {
    if (query.trim() === '') {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Command className="opacity-60" />
            </EmptyMedia>
            <EmptyContent>{t('Search for posts')}</EmptyContent>
          </EmptyHeader>
        </Empty>
      );
    }

    if (results.length === 0 && !loading) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <span className="size-6 icon-[tabler--box-multiple]"></span>
            </EmptyMedia>
            <EmptyContent>{t('No results found')}</EmptyContent>
          </EmptyHeader>
        </Empty>
      );
    }

    return (
      <div className="divide-y">
        {results.map((result) => (
          <a
            key={result.url}
            className="flex gap-4 hover:bg-accent focus:bg-accent p-4 outline-none transition-colors cursor-pointer wrap-anywhere"
            href={result.url}
          >
            <img
              src={result.meta.image}
              className="rounded size-16 object-cover aspect-square"
              alt={result.meta.image_alt}
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-sm line-clamp-1">{result.meta.title}</h3>
              <p className="text-muted-foreground text-xs line-clamp-2">
                {highlightText(result.excerpt)}
              </p>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
                <div className="inline-flex items-center gap-1">
                  <span className="size-3.5 -translate-y-0.25 icon-[tabler--calendar]"></span>
                  <span>{result.meta.date}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="border-w-none">
        <Button
          variant="outline"
          size="sm"
          className="shadow-none sm:shadow-xs !px-1.5 border-0 sm:border-1 h-7 sm:h-8 font-normal text-muted-foreground"
          aria-label={t('Search')}
        >
          <SearchIcon />
          <span className="hidden sm:inline-flex">{t('Search')}...</span>
          <Kbd className="hidden sm:inline-flex bg-muted/60 dark:bg-muted border">⌘ K</Kbd>
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          aria-describedby={undefined}
          className={cn(
            'top-[10%] left-[50%] z-50 fixed bg-background shadow-lg p-0 border rounded-lg w-full max-w-[calc(100%-2rem)] sm:max-w-xl translate-x-[-50%]',
            'data-[state=closed]:animate-out data-[state=open]:animate-in',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:slide-out-to-top-[-10%] data-[state=open]:slide-in-from-top-[-10%]',
            'duration-300 ease-out'
          )}
        >
          <DialogTitle className="sr-only">{t('Search')}</DialogTitle>
          <div className="flex items-center px-3 border-b">
            <SearchIcon className="opacity-50 mr-2 w-4 h-4 shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('Search for posts')}
              className="flex bg-transparent disabled:opacity-50 shadow-none py-3 border-0 rounded-md outline-none focus-visible:ring-0 w-full h-11 text-sm disabled:cursor-not-allowed"
            />
            {loading && (
              <div className="mr-2 border-2 border-primary border-t-transparent rounded-full w-4 h-4 animate-spin" />
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">{renderContent()}</div>

          <div className="px-3 py-2 border-t">
            <p className="text-muted-foreground text-xs">
              <Trans
                i18nKey={
                  '<0>Tab</0> <0>Shift + Tab</0> to navigate · <0>Enter</0> to select · <0>Esc</0> to close'
                }
              >
                <Kbd>Tab</Kbd> <Kbd>Shift + Tab</Kbd> to navigate · <Kbd>Enter</Kbd> to select ·{' '}
                <Kbd>Esc</Kbd> to close
              </Trans>
            </p>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
