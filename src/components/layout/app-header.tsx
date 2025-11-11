'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PAGE_TITLES } from '@/lib/constants';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppHeader() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const title = PAGE_TITLES[pathname] || 'Gaia Loop';

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      {isMobile && <SidebarTrigger />}
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
    </header>
  );
}
