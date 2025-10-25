import { Fragment, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getThemeConfig, type MenuConfig } from '@/config';
import { normalize } from '@/lib/normalize';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

export const BlogSidebar = (props: { currentPath?: string }) => {
  const { t, i18n } = useTranslation();
  const config = getThemeConfig(i18n.language);
  const items = config.menu || [];

  const isActiveLink = (link?: string) => {
    if (!link) {
      return;
    }

    const currentPath = normalize(props.currentPath || '');
    const itemHref = normalize(link);
    const itemHrefWithPagination = normalize(`${itemHref}/${config.pagination?.prefix}/`);
    const itemHrefWithFilter = normalize(`${itemHref}/filters/`);

    return (
      currentPath === itemHref ||
      currentPath.startsWith(itemHrefWithFilter) ||
      currentPath.startsWith(itemHrefWithPagination)
    );
  };

  const renderItems = (items: MenuConfig): ReactNode[] => {
    return items.map((item) => {
      if (item.children && item.children?.length > 0) {
        return (
          <Fragment key={item.id}>
            <SidebarGroupLabel asChild>
              <li>
                <span>{item.name}</span>
              </li>
            </SidebarGroupLabel>
            {renderItems(item.children)}
          </Fragment>
        );
      }

      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton asChild size={'lg'} isActive={isActiveLink(item.href)}>
            <a href={item.href}>
              <span className={cn(item.icon, 'size-4.5')}></span>
              <span>{item.name}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col justify-center gap-2 pt-4">
          <div className="flex flex-col justify-center items-center">
            <img
              src={config.profile?.avatar}
              alt={config.profile?.name}
              className="rounded-full size-24"
            />
          </div>
          {config.profile?.name && (
            <div className="flex justify-center text-lg">
              <p>{config.profile.name}</p>
            </div>
          )}

          {config.profile?.bio && (
            <div className="flex justify-center text-sm text-center">
              <p>{config.profile.bio}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {config.profile?.email && (
            <Button variant={'ghost'} size={'icon'} asChild>
              <a href={`mailto:${config.profile?.email}`} aria-label={t('Send me an email')}>
                <span className={cn('icon-[tabler--mail]', 'size-4.5')}></span>
              </a>
            </Button>
          )}
          {config.profile?.github && (
            <Button variant={'ghost'} size={'icon'} asChild>
              <a href={config.profile?.github} aria-label="Github">
                <span className={cn('icon-[tabler--brand-github]', 'size-4.5')}></span>
              </a>
            </Button>
          )}
        </div>

        <div className="mt-2 bg-sidebar-border w-full h-[1px]" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(items)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex flex-col flex-1 justify-end gap-2 py-6">
          {config.site?.copyright && (
            <div className="flex justify-center">
              <span className="text-sidebar-foreground text-sm text-center">
                {config.site?.copyright}
              </span>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
