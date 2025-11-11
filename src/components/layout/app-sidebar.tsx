'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { NAV_LINKS } from '@/lib/constants';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-provider';
import { useUser, useAuth } from '@/firebase';
import { Button } from '../ui/button';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function AppSidebar() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const { t } = useLanguage();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // AuthStateGate will handle the redirection to /login
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">{t('app.name')}</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {NAV_LINKS.map(link => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={{ children: t(link.tooltipKey), side: 'right' }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{t(link.labelKey)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto w-full items-center justify-start gap-3 p-2 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.photoURL || userAvatar?.imageUrl}
                  alt={user?.displayName || 'User'}
                  data-ai-hint={userAvatar?.imageHint}
                />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                <span className="font-medium truncate max-w-[120px]">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {user?.email || 'Welcome'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="mb-2">
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
