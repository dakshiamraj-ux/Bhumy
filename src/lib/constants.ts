import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Lightbulb,
  Mic,
  ScanLine,
  Store,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
};

export const NAV_LINKS: NavLink[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    tooltip: 'Dashboard',
  },
  {
    href: '/scanner',
    label: 'Waste Scanner',
    icon: ScanLine,
    tooltip: 'Waste Scanner',
  },
  {
    href: '/footprint',
    label: 'Footprint',
    icon: BarChart3,
    tooltip: 'Waste Footprint',
  },
  {
    href: '/rewards',
    label: 'Rewards',
    icon: Trophy,
    tooltip: 'Community Rewards',
  },
  {
    href: '/marketplace',
    label: 'Marketplace',
    icon: Store,
    tooltip: 'Waste-to-Value Marketplace',
  },
  {
    href: '/policy-advisor',
    label: 'Policy Advisor',
    icon: Lightbulb,
    tooltip: 'AI Policy Advisor',
  },
  {
    href: '/chat',
    label: 'Bhumy Chat',
    icon: Mic,
    tooltip: 'Chat with Bhumy',
  },
  {
    href: '/education',
    label: 'Learn',
    icon: BookOpen,
    tooltip: 'Education Hub',
  },
];

export const PAGE_TITLES: { [key: string]: string } = {
  '/': 'Dashboard',
  '/scanner': 'Smart Waste Scanner',
  '/footprint': 'Waste Footprint Tracker',
  '/rewards': 'Community Rewards',
  '/marketplace': 'Waste-to-Value Marketplace',
  '/policy-advisor': 'AI Local Policy Advisor',
  '/chat': 'Chat with Bhumy',
  '/education': 'Environmental Education Hub',
};
