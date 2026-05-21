export interface AdminModule {
  key: string;
  label: string;
  path: string;
  icon: 'TeamOutlined' | 'NotificationOutlined' | 'FileTextOutlined' | 'ShoppingOutlined' | 'DollarOutlined';
}

export const adminModules: AdminModule[] = [
  { key: 'members', label: '會員管理', path: '/admin/members', icon: 'TeamOutlined' },
  { key: 'itineraries', label: '行程上架', path: '/admin/itineraries', icon: 'FileTextOutlined' },
  { key: 'orders', label: '報名 & 訂單', path: '/admin/orders', icon: 'ShoppingOutlined' },
  { key: 'payments', label: '金流紀錄', path: '/admin/payments', icon: 'DollarOutlined' },
  { key: 'announcements', label: '公告布告欄', path: '/admin/announcements', icon: 'NotificationOutlined' },
];
