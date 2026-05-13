export interface AnnouncementProps {
  id: string;
  title: string;
  content: string;
  type: 'important' | 'general' | 'promotional';
  publishDate: string;
  isPinned: boolean;
  link?: string;
  linkText?: string;
}

export const announcements: AnnouncementProps[] = [
  {
    id: '1',
    title: '🎉 春節特惠活動開跑！',
    content: '即日起至2月底，所有日本行程享85折優惠，早鳥預訂再送旅遊好禮！',
    type: 'promotional',
    publishDate: '2025-01-15',
    isPinned: true,
    link: '/?category=international',
    linkText: '查看優惠行程',
  },
  {
    id: '2',
    title: '📢 重要通知：春節期間營業時間調整',
    content: '農曆春節期間（2/8-2/14）客服營業時間調整為10:00-18:00，造成不便敬請見諒。',
    type: 'important',
    publishDate: '2025-01-20',
    isPinned: true,
  },
  {
    id: '3',
    title: '✈️ 新增歐洲深度遊行程',
    content: '全新推出義大利、西班牙深度遊行程，帶您探索歐洲的浪漫與文化。',
    type: 'general',
    publishDate: '2025-01-10',
    isPinned: false,
    link: '/?category=international',
    linkText: '了解更多',
  },
  {
    id: '4',
    title: '🌸 賞櫻季節即將到來',
    content: '日本賞櫻行程熱烈預訂中！3-4月限定，把握最美櫻花季。',
    type: 'promotional',
    publishDate: '2025-01-05',
    isPinned: false,
    link: '/?category=international',
    linkText: '立即預訂',
  },
];
