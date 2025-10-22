/**
 * Component exports for theme customization
 * Users can import and override these components in their projects
 */

// UI Components (shadcn/ui based)
export { Badge } from './ui/badge';
export { Button } from './ui/button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
export { Empty } from './ui/empty';
export { Input } from './ui/input';
export { Kbd } from './ui/kbd';
export { Pagination, PaginationContent, PaginationItem } from './ui/pagination';
export { Separator } from './ui/separator';
export { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from './ui/sidebar';
export { Skeleton } from './ui/skeleton';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Higher-Order Components
export { FAB } from './hoc/fab';
export { LanguageToggle } from './hoc/language-toggle';
export { Search } from './hoc/search';
export { ThemeToggle } from './hoc/theme-toggle';

// Layout Components
export { BlogHeader } from './layouts/blog-header';
export { BlogLayout } from './layouts/blog-layout';
export { BlogSidebar } from './layouts/blog-sidebar';

// Portfolio Components
export { PortfolioCard } from './portfolio/portfolio-card';
