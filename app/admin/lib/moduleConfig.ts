export interface AdminModule {
  key: string;
  label: string;
  path: string;
  icon: 'TeamOutlined' | 'NotificationOutlined' | 'FileTextOutlined';
}

export const adminModules: AdminModule[] = [
  {
    key: 'members',
    label: '會員管理',
    path: '/admin/members',
    icon: 'TeamOutlined',
  },
  {
    key: 'announcements',
    label: '公告布告欄',
    path: '/admin/announcements',
    icon: 'NotificationOutlined',
  },
  {
    key: 'itineraries',
    label: '行程上架',
    path: '/admin/itineraries',
    icon: 'FileTextOutlined',
  },
  {
    key: 'registrations',
    label: '報名表單管理',
    path: '/admin/registrations',
    icon: 'FileTextOutlined',
  },
];
