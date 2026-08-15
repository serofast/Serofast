export const nav = [
  ['Overview', [['Dashboard','/admin','layout-dashboard']]],
  ['Marketplace', [['Shops','/admin/shops','store'],['Customers','/admin/customers','users'],['Products','/admin/products','package-search'],['Categories','/admin/categories','folders']]],
  ['Commerce', [['Orders','/admin/orders','shopping-bag'],['Inventory','/admin/inventory','boxes'],['Returns','/admin/returns','rotate-ccw'],['Reviews','/admin/reviews','star'],['Delivery','/admin/delivery','truck']]],
  ['Finance', [['Transactions','/admin/finance/transactions','credit-card'],['Commissions','/admin/finance/commissions','percent'],['Withdrawals','/admin/finance/withdrawals','wallet-cards'],['Refunds','/admin/finance/refunds','banknote']]],
  ['Marketing', [['Coupons','/admin/marketing/coupons','ticket-percent'],['Campaigns','/admin/marketing/campaigns','megaphone'],['Banners','/admin/marketing/banners','images'],['Homepage CMS','/admin/marketing/homepage','panel-top']]],
  ['Analytics', [['Analytics','/admin/analytics','chart-no-axes-combined'],['Search Analytics','/admin/analytics/search','search'],['Reports','/admin/reports','file-bar-chart']]],
  ['Operations', [['Support','/admin/support','headphones'],['Notifications','/admin/notifications','bell'],['Risk & Fraud','/admin/risk','shield-alert']]],
  ['System', [['Admin Users','/admin/admin-users','user-cog'],['Roles & Permissions','/admin/roles','key-round'],['Audit Logs','/admin/audit-logs','history'],['Settings','/admin/settings','settings']]],
];

export const stats = [
  ['Total Sales','₹12,48,500','+12.4%','red'],['Today\'s Orders','428','+8.2%','blue'],['Active Shops','1,284','+4.1%','green'],['Registered Customers','18,492','+9.8%','amber'],['Pending Orders','76','Needs attention','purple'],['Pending Shop Approvals','23','Review now','rose']
].map(([label,value,change,tone])=>({label,value,change,tone}));

export const shops = [
 {id:'SHP-1021',shop:'Urban Styles',owner:'Sarah Joseph',category:'Fashion',products:128,orders:642,revenue:'₹3.4L',rating:'4.9',status:'Active',joined:'14 Aug 2026'},
 {id:'SHP-1034',shop:'Tech Haven',owner:'Alex Mathew',category:'Electronics',products:86,orders:488,revenue:'₹5.7L',rating:'4.8',status:'Active',joined:'12 Aug 2026'},
 {id:'SHP-1055',shop:'Glow & Grace',owner:'Priya Raj',category:'Beauty',products:73,orders:351,revenue:'₹2.1L',rating:'4.7',status:'Pending',joined:'12 Aug 2026'},
 {id:'SHP-1060',shop:'Home Nest',owner:'Arjun Kumar',category:'Home',products:154,orders:721,revenue:'₹4.2L',rating:'4.8',status:'Suspended',joined:'10 Aug 2026'},
 {id:'SHP-1068',shop:'Elite Fashion',owner:'Maya Thomas',category:'Fashion',products:112,orders:896,revenue:'₹6.8L',rating:'5.0',status:'Active',joined:'09 Aug 2026'},
 {id:'SHP-1080',shop:'Nila Saree House',owner:'Nila Devi',category:'Fashion',products:24,orders:0,revenue:'₹0',rating:'—',status:'Pending',joined:'15 Aug 2026'}
];
export const products=[
 {id:'PRD-4011',product:"Men's Casual Shirt",shop:'Urban Styles',category:'Fashion',price:'₹999',stock:18,status:'Active',rating:'4.7',created:'14 Aug 2026'},
 {id:'PRD-4012',product:'Noise ColorFit Pro 4',shop:'Tech Haven',category:'Electronics',price:'₹1,999',stock:7,status:'Active',rating:'4.6',created:'13 Aug 2026'},
 {id:'PRD-4013',product:'Premium Face Serum',shop:'Glow & Grace',category:'Beauty',price:'₹399',stock:4,status:'Low Stock',rating:'4.8',created:'12 Aug 2026'},
 {id:'PRD-4014',product:'Modern Sofa',shop:'Home Nest',category:'Home',price:'₹8,999',stock:2,status:'Low Stock',rating:'4.5',created:'11 Aug 2026'},
 {id:'PRD-4015',product:"Women's Dress",shop:'Elite Fashion',category:'Fashion',price:'₹1,499',stock:0,status:'Out of Stock',rating:'4.9',created:'10 Aug 2026'}
];
export const categories=[
 {id:'CAT-01',name:'Fashion',parent:'—',children:4,shops:318,products:4822,status:'Active'},
 {id:'CAT-02',name:'Electronics',parent:'—',children:6,shops:214,products:2894,status:'Active'},
 {id:'CAT-03',name:'Beauty',parent:'—',children:5,shops:185,products:2214,status:'Active'},
 {id:'CAT-04',name:'Home',parent:'—',children:7,shops:201,products:3178,status:'Active'},
];
export const orders=[
 {id:'#SF10294',customer:'Abinesh',shop:'Urban Styles',items:3,amount:'₹2,499',payment:'Paid',status:'Shipped',date:'15 Aug 2026'},
 {id:'#SF10293',customer:'Meena',shop:'Tech Haven',items:1,amount:'₹1,999',payment:'Paid',status:'Processing',date:'15 Aug 2026'},
 {id:'#SF10292',customer:'Arun',shop:'Elite Fashion',items:2,amount:'₹3,499',payment:'Paid',status:'Delivered',date:'14 Aug 2026'},
 {id:'#SF10291',customer:'Priya',shop:'Glow & Grace',items:4,amount:'₹1,899',payment:'Paid',status:'Returned',date:'14 Aug 2026'},
];
export const customers=[
 {id:'CUS-901',name:'Abinesh',email:'abinesh@example.com',orders:18,spent:'₹42,540',returns:1,status:'Active'},
 {id:'CUS-902',name:'Meena',email:'meena@example.com',orders:14,spent:'₹31,220',returns:0,status:'Active'},
 {id:'CUS-903',name:'Rahul',email:'rahul@example.com',orders:7,spent:'₹9,120',returns:2,status:'Blocked'},
 {id:'CUS-904',name:'Priya',email:'priya@example.com',orders:21,spent:'₹58,900',returns:1,status:'Active'},
];
export const withdrawals=[
 {id:'WD-2001',shop:'Tech Haven',owner:'Alex Mathew',amount:'₹18,500',method:'Bank',status:'Pending'},
 {id:'WD-2000',shop:'Urban Styles',owner:'Sarah Joseph',amount:'₹24,000',method:'Bank',status:'Approved'},
 {id:'WD-1999',shop:'Elite Fashion',owner:'Maya Thomas',amount:'₹36,400',method:'Bank',status:'Completed'},
];
export const generic = {
 transactions:[['TXN-10801','Order Payment','#SF10294','Abinesh','₹2,499','₹100','₹2,399','Completed'],['TXN-10800','Withdrawal','—','Tech Haven','₹18,500','₹0','₹18,500','Pending']],
 refunds:[['RF-4001','#SF10291','Priya','Glow & Grace','₹1,899','Damaged item','Pending'],['RF-4000','#SF10272','Rahul','Home Nest','₹8,999','Wrong item','Processed']],
 returns:[['RET-101','#SF10291','Priya','Glow & Grace',"Premium Face Serum",'Damaged item','₹1,899','Requested'],['RET-100','#SF10270','Meena','Elite Fashion',"Women's Dress",'Size issue','₹1,499','Approved']],
 reviews:[['REV-501','5','Great product and fast delivery.','Abinesh',"Men's Shirt",'Urban Styles','Published'],['REV-500','1','The package arrived damaged.','Priya','Premium Face Serum','Glow & Grace','Reported']],
 inventory:[['INV-301',"Women's Dress",'Elite Fashion',0,5,'Fast','Out of Stock'],['INV-302','Modern Sofa','Home Nest',2,5,'Slow','Low Stock'],['INV-303','Premium Face Serum','Glow & Grace',4,8,'Fast','Low Stock']],
 coupons:[['CPN-01','SAVE100','Fixed','₹100','₹999','184 / 500','Active'],['CPN-02','LOCAL10','Percent','10%','₹1,499','82 / 250','Active']],
 campaigns:[['CMP-01','Independence Weekend','All Customers','₹25,000','12,480','Running'],['CMP-02','Student Seller Push','Students','₹8,000','3,220','Scheduled']],
 banners:[['BNR-01','Buy from Your Favorite Shops','Hero','Active',1],['BNR-02','Local Fashion Week','Promotion','Scheduled',2]],
 support:[['SUP-1282','Order not received','Abinesh','Customer','High','Open'],['SUP-1281','Withdrawal pending','Tech Haven','Seller','Medium','In Progress']],
 notifications:[['NOT-01','Order confirmed','Push + In-app','Customer','Enabled'],['NOT-02','Order shipped','Push + Email','Customer','Enabled'],['NOT-03','Withdrawal completed','Email','Seller','Disabled']],
 admins:[['ADM-01','Antony Richards','antony@serofast.com','Super Admin','Active'],['ADM-02','Meera Finance','finance@serofast.com','Finance Admin','Active'],['ADM-03','Rohan Support','support@serofast.com','Support Admin','Active']],
 audit:[['AUD-9001','Antony Richards','Approved shop','Urban Styles','Shops','15 Aug 2026, 15:32'],['AUD-9000','Meera Finance','Approved withdrawal','₹18,500 · Tech Haven','Finance','15 Aug 2026, 15:40']],
 risk:[['RSK-01','Coupon abuse','Customer CUS-903','High','Open'],['RSK-02','Repeated refunds','Shop SHP-1060','Medium','Investigating']],
 delivery:[['SHP-7001','#SF10294','Urban Styles','Abinesh','SeroFast Express','SF-TRK-10294','Shipped'],['SHP-7000','#SF10293','Tech Haven','Meena','SeroFast Express','SF-TRK-10293','Processing']],
};
export const sales=[22,34,29,51,44,62,73,68,81,76,92,84];
export const topSearches=[['Saree',1384,100],['Men\'s Shirt',1120,81],['Shoes',982,71],['Laptop',741,54],['Perfume',622,45]];
export const noResult=[['Rayban sunglasses',482],['Traditional kasavu set',319],['Gaming chair under 5000',214]];

function rowsToRecords(rows, keys) {
  return rows.map((row) =>
    Object.fromEntries(keys.map((key, index) => [key, row[index]])),
  );
}

export const dashboardStats = stats;
export const salesSeries = sales;
export const zeroSearches = noResult;

export const transactions = rowsToRecords(generic.transactions, [
  'id', 'type', 'order', 'user', 'amount', 'fee', 'net', 'status',
]);
export const refunds = rowsToRecords(generic.refunds, [
  'id', 'order', 'customer', 'shop', 'amount', 'reason', 'status',
]);
export const returns = rowsToRecords(generic.returns, [
  'id', 'order', 'customer', 'shop', 'product', 'reason', 'refund', 'status',
]);
export const reviews = rowsToRecords(generic.reviews, [
  'id', 'rating', 'review', 'customer', 'product', 'shop', 'status',
]);
export const inventory = rowsToRecords(generic.inventory, [
  'id', 'product', 'shop', 'stock', 'threshold', 'velocity', 'status',
]);
export const coupons = rowsToRecords(generic.coupons, [
  'id', 'code', 'type', 'value', 'minOrder', 'usage', 'status',
]);
export const campaigns = rowsToRecords(generic.campaigns, [
  'id', 'name', 'audience', 'budget', 'reach', 'status',
]);
export const banners = rowsToRecords(generic.banners, [
  'id', 'title', 'placement', 'status', 'priority',
]);
export const supportTickets = rowsToRecords(generic.support, [
  'id', 'subject', 'requester', 'type', 'priority', 'status',
]);
export const adminUsers = rowsToRecords(generic.admins, [
  'id', 'name', 'email', 'role', 'status',
]);
export const auditLogs = rowsToRecords(generic.audit, [
  'id', 'actor', 'action', 'target', 'module', 'time',
]);
export const deliveryRows = rowsToRecords(generic.delivery, [
  'id', 'order', 'shop', 'customer', 'courier', 'tracking', 'status',
]);
export const shipments = deliveryRows;

export const notificationTemplates = rowsToRecords(generic.notifications, [
  'id', 'name', 'channels', 'audience', 'state',
]).map((template) => ({
  ...template,
  enabled: template.state === 'Enabled',
}));

export const riskAlerts = rowsToRecords(generic.risk, [
  'id', 'type', 'entity', 'score', 'status',
]);

export const shopApprovals = shops
  .filter((shop) => shop.status === 'Pending')
  .map((shop) => ({
    id: shop.id,
    name: shop.shop,
    owner: shop.owner,
    category: shop.category,
    verification: 'Documents submitted',
    submitted: shop.joined,
  }));

export const productApprovals = products.slice(0, 2).map((product) => ({
  id: product.id,
  name: product.product,
  shop: product.shop,
  category: product.category,
  price: product.price,
  submitted: product.created,
}));

export const roles = [
  {
    id: 'ROLE-01',
    name: 'Super Admin',
    permissions: ['Dashboard', 'Marketplace', 'Finance', 'Marketing', 'System'],
  },
  {
    id: 'ROLE-02',
    name: 'Operations Admin',
    permissions: ['Shops', 'Orders', 'Inventory', 'Delivery', 'Returns'],
  },
  {
    id: 'ROLE-03',
    name: 'Finance Admin',
    permissions: ['Transactions', 'Commissions', 'Withdrawals', 'Refunds'],
  },
  {
    id: 'ROLE-04',
    name: 'Support Admin',
    permissions: ['Customers', 'Support', 'Reviews', 'Notifications'],
  },
  {
    id: 'ROLE-05',
    name: 'Marketing Admin',
    permissions: ['Coupons', 'Campaigns', 'Banners', 'Homepage CMS'],
  },
  {
    id: 'ROLE-06',
    name: 'Catalog Admin',
    permissions: ['Products', 'Categories', 'Inventory', 'Reviews'],
  },
];

export const settingsSeed = [
  { id: 'SET-01', label: 'Marketplace maintenance mode', type: 'toggle', value: false },
  { id: 'SET-02', label: 'Default commission rate', type: 'text', value: '10%' },
  { id: 'SET-03', label: 'Automatic seller payouts', type: 'toggle', value: true },
];

export const homepageSections = [
  { id: 'HOME-01', name: 'Hero banners', priority: 1, status: 'Active' },
  { id: 'HOME-02', name: 'Featured shops', priority: 2, status: 'Active' },
  { id: 'HOME-03', name: 'Trending products', priority: 3, status: 'Active' },
];

export const reports = [
  { id: 'REP-01', name: 'Marketplace Sales', description: 'Orders, revenue and commissions.', format: 'CSV' },
  { id: 'REP-02', name: 'Seller Performance', description: 'Shop activity and fulfillment.', format: 'CSV' },
  { id: 'REP-03', name: 'Returns Summary', description: 'Returns, refunds and reasons.', format: 'CSV' },
];
