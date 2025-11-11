'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PAGE_TITLES } from '@/lib/constants';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/language-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function AppHeader() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const titleKey = Object.keys(PAGE_TITLES).find(
    key => PAGE_TITLES[key as keyof typeof PAGE_TITLES].href === pathname
  );
  const title = titleKey ? t(PAGE_TITLES[titleKey as keyof typeof PAGE_TITLES].titleKey) : 'Bhumy';
  const { setLocale } = useLanguage();


  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      {isMobile && <SidebarTrigger />}
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Languages className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Change language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLocale('en')}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocale('hi')}>
              हिन्दी (Hindi)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
