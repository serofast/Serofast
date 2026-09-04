export * from './shared/adminData';
export const nav = [
  ['Overview', [['Dashboard','/admin','layout']]],
  ['Marketplace', [['Shops','/admin/shops','store'],['Customers','/admin/customers','users'],['Products','/admin/products','product'],['Categories','/admin/categories','folders']]],
  ['Commerce', [['Orders','/admin/orders','orders'],['Inventory','/admin/inventory','boxes'],['Returns','/admin/returns','returns'],['Reviews','/admin/reviews','reviews'],['Delivery','/admin/delivery','truck']]],
  ['Finance', [['Transactions','/admin/finance/transactions','credit'],['Commissions','/admin/finance/commissions','percent'],['Withdrawals','/admin/finance/withdrawals','wallet'],['Refunds','/admin/finance/refunds','refund']]],
  ['Marketing', [['Coupons','/admin/marketing/coupons','coupon'],['Campaigns','/admin/marketing/campaigns','campaign'],['Banners','/admin/marketing/banners','banner'],['Homepage CMS','/admin/marketing/homepage','home']]],
  ['Analytics', [['Analytics','/admin/analytics','analytics'],['Search Analytics','/admin/analytics/search','search'],['Reports','/admin/reports','reports']]],
  ['Operations', [['Support','/admin/support','support'],['Notifications','/admin/notifications','bell'],['Risk & Fraud','/admin/risk','risk']]],
  ['System', [['Admin Users','/admin/admin-users','admin'],['Roles & Permissions','/admin/roles','roles'],['Audit Logs','/admin/audit-logs','audit'],['Settings','/admin/settings','settings']]],
];
