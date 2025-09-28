import type { CollectionEntry } from 'astro:content';
import { Trans } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface PortfolioCardProps {
  portfolio: CollectionEntry<'portfolios'>;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const { data, slug } = portfolio;
  const portfolioSlug = data.slug ?? slug;

  return (
    <Card className="relative flex flex-col hover:shadow-l py-0 pb-4 h-full overflow-hidden transition-all">
      {data.pin && (
        <Badge
          className="top-2 right-2 z-1 absolute shadow-sm pointer-events-none"
          variant={'secondary'}
        >
          <span className="icon-[tabler--pin-filled]"></span>
        </Badge>
      )}

      {data.thumbnail && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={data.thumbnail}
            alt={data.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="flex-1 gap-4">
        <CardTitle className="line-clamp-2">
          <a href={`/portfolios/${portfolioSlug}`} className="hover:text-primary transition-colors">
            {data.title}
          </a>
        </CardTitle>
        {data.description && (
          <CardDescription className="line-clamp-3">{data.description}</CardDescription>
        )}
      </CardHeader>

      <CardFooter className="flex gap-2">
        <a
          href={`/portfolios/${portfolioSlug}`}
          className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'flex-1')}
        >
          <span className="sm:mr-1 !text-lg icon-[tabler--eye]" />
          <span className="hidden sm:inline-block">
            <Trans>View</Trans>
          </span>
        </a>
        {data.demo && (
          <a
            href={data.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            title="View Demo"
          >
            <span className="icon-[tabler--external-link]" />
          </a>
        )}
        {data.github && (
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            title="View on GitHub"
          >
            <span className="icon-[tabler--brand-github]" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
