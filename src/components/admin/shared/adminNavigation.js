import { LayoutDashboard, Store, Users, PackageSearch, FolderTree, ShoppingBag, Boxes, RotateCcw, Star, Truck, CreditCard, Percent, WalletCards, Banknote, TicketPercent, Megaphone, Images, PanelTop, ChartNoAxesCombined, Search, FileBarChart, Headphones, Bell, ShieldAlert, UserCog, KeyRound, History, Settings } from 'lucide-react';

export const adminNavigation = [
  { label: 'Overview', items: [{ label: 'Dashboard', path: '/admin', icon: LayoutDashboard }] },
  { label: 'Marketplace', items: [
    { label: 'Shops', path: '/admin/shops', icon: Store },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Products', path: '/admin/products', icon: PackageSearch },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
  ] },
  { label: 'Commerce', items: [
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Returns', path: '/admin/returns', icon: RotateCcw },
    { label: 'Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Delivery', path: '/admin/delivery', icon: Truck },
  ] },
  { label: 'Finance', items: [
    { label: 'Transactions', path: '/admin/finance/transactions', icon: CreditCard },
    { label: 'Commissions', path: '/admin/finance/commissions', icon: Percent },
    { label: 'Withdrawals', path: '/admin/finance/withdrawals', icon: WalletCards },
    { label: 'Refunds', path: '/admin/finance/refunds', icon: Banknote },
  ] },
  { label: 'Marketing', items: [
    { label: 'Coupons', path: '/admin/marketing/coupons', icon: TicketPercent },
    { label: 'Campaigns', path: '/admin/marketing/campaigns', icon: Megaphone },
    { label: 'Banners', path: '/admin/marketing/banners', icon: Images },
    { label: 'Homepage CMS', path: '/admin/marketing/homepage', icon: PanelTop },
  ] },
  { label: 'Analytics', items: [
    { label: 'Analytics', path: '/admin/analytics', icon: ChartNoAxesCombined },
    { label: 'Search Analytics', path: '/admin/analytics/search', icon: Search },
    { label: 'Reports', path: '/admin/reports', icon: FileBarChart },
  ] },
  { label: 'Operations', items: [
    { label: 'Support', path: '/admin/support', icon: Headphones },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Risk & Fraud', path: '/admin/risk', icon: ShieldAlert },
  ] },
  { label: 'System', items: [
    { label: 'Admin Users', path: '/admin/admin-users', icon: UserCog },
    { label: 'Roles & Permissions', path: '/admin/roles', icon: KeyRound },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ] },
];
