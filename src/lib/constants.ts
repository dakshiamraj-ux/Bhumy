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
  HardDrive,
} from 'lucide-react';

type NavLink = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  tooltipKey: string;
};

export const NAV_LINKS: NavLink[] = [
  {
    href: '/',
    labelKey: 'nav.dashboard',
    icon: LayoutDashboard,
    tooltipKey: 'nav.dashboard',
  },
  {
    href: '/scanner',
    labelKey: 'nav.wasteScanner',
    icon: ScanLine,
    tooltipKey: 'nav.wasteScanner',
  },
  {
    href: '/footprint',
    labelKey: 'nav.footprint',
    icon: BarChart3,
    tooltipKey: 'nav.wasteFootprint',
  },
  {
    href: '/rewards',
    labelKey: 'nav.rewards',
    icon: Trophy,
    tooltipKey: 'nav.communityRewards',
  },
  {
    href: '/marketplace',
    labelKey: 'nav.marketplace',
    icon: Store,
    tooltipKey: 'nav.wasteToValueMarketplace',
  },
  {
    href: '/devices',
    labelKey: 'nav.deviceHub',
    icon: HardDrive,
    tooltipKey: 'nav.deviceHub',
  },
  {
    href: '/policy-advisor',
    labelKey: 'nav.policyAdvisor',
    icon: Lightbulb,
    tooltipKey: 'nav.aiPolicyAdvisor',
  },
  {
    href: '/chat',
    labelKey: 'nav.bhumyChat',
    icon: Mic,
    tooltipKey: 'nav.chatWithBhumy',
  },
  {
    href: '/education',
    labelKey: 'nav.learn',
    icon: BookOpen,
    tooltipKey: 'nav.educationHub',
  },
];

type PageTitle = {
  href: string;
  titleKey: string;
}

export const PAGE_TITLES: { [key: string]: PageTitle } = {
  dashboard: { href: '/', titleKey: 'page_titles.dashboard' },
  scanner: { href: '/scanner', titleKey: 'page_titles.scanner' },
  footprint: { href: '/footprint', titleKey: 'page_titles.footprint' },
  rewards: { href: '/rewards', titleKey: 'page_titles.rewards' },
  marketplace: { href: '/marketplace', titleKey: 'page_titles.marketplace' },
  devices: { href: '/devices', titleKey: 'page_titles.devices' },
  policyAdvisor: { href: '/policy-advisor', titleKey: 'page_titles.policyAdvisor' },
  chat: { href: '/chat', titleKey: 'page_titles.chat' },
  education: { href: '/education', titleKey: 'page_titles.education' },
};
