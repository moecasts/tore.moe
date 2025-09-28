import type { ReactNode } from 'react';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { BlogHeader } from './blog-header';
import { BlogSidebar } from './blog-sidebar';

export const BlogLayout = (props: { children: ReactNode; currentPath?: string }) => {
  return (
    <SidebarProvider>
      <BlogSidebar currentPath={props.currentPath} />
      <SidebarInset>
        <BlogHeader />
        <div className="flex p-2">
          <div className="flex-1 w-0">{props.children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
