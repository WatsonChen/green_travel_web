export type Member = {
  key: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
};

export type Announcement = {
  key: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'urgent';
  status: 'published' | 'draft';
  publishDate?: string;
  expiryDate?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export type Itinerary = {
  key: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: number;
};

export type Registration = {
  key: string;
  itinerary: string;
  applicantName: string;
  email: string;
  submissionDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
};

export const members: Member[] = [
  {
    key: '1',
    name: 'John Brown',
    email: 'john@example.com',
    phone: '123-456-7890',
    joinDate: '2023-01-15',
    status: 'active',
  },
  {
    key: '2',
    name: 'Jim Green',
    email: 'jim@example.com',
    phone: '098-765-4321',
    joinDate: '2023-02-20',
    status: 'inactive',
  },
  {
    key: '3',
    name: 'Joe Black',
    email: 'joe@example.com',
    phone: '111-222-3333',
    joinDate: '2023-03-10',
    status: 'active',
  },
];

export const announcements: Announcement[] = [
  {
    key: '1',
    title: '系統維護通知',
    content: '本系統將於本週六凌晨 2:00-4:00 進行系統維護，屆時將暫停服務，請各位提前做好準備。',
    priority: 'high',
    status: 'published',
    publishDate: '2024-01-15',
    author: '系統管理員',
    createdAt: '2024-01-10 10:30',
    updatedAt: '2024-01-10 10:30',
  },
  {
    key: '2',
    title: '新功能上線公告',
    content: '我們很高興地宣布，新的會員積分系統已經上線！會員可以通過參與活動獲得積分，兌換精美禮品。',
    priority: 'medium',
    status: 'published',
    publishDate: '2024-01-20',
    expiryDate: '2024-02-20',
    author: '產品經理',
    createdAt: '2024-01-18 14:20',
    updatedAt: '2024-01-18 14:20',
  },
  {
    key: '3',
    title: '春節假期安排',
    content: '春節期間(2月10日-2月17日)客服工作時間調整為 10:00-18:00，請各位知悉。',
    priority: 'urgent',
    status: 'published',
    publishDate: '2024-02-01',
    author: '人事部',
    createdAt: '2024-01-25 09:00',
    updatedAt: '2024-01-25 09:00',
  },
];

export const itineraries: Itinerary[] = [
  {
    key: '1',
    title: 'Kyoto Spring Tour',
    destination: 'Kyoto, Japan',
    startDate: '2024-04-01',
    endDate: '2024-04-07',
    price: 2500,
  },
  {
    key: '2',
    title: 'Swiss Alps Adventure',
    destination: 'Interlaken, Switzerland',
    startDate: '2024-06-15',
    endDate: '2024-06-22',
    price: 3200,
  },
];

export const registrations: Registration[] = [
  {
    key: '1',
    itinerary: 'Kyoto Spring Tour',
    applicantName: 'Alice Smith',
    email: 'alice@example.com',
    submissionDate: '2024-01-20',
    status: 'pending',
  },
  {
    key: '2',
    itinerary: 'Swiss Alps Adventure',
    applicantName: 'Bob Johnson',
    email: 'bob@example.com',
    submissionDate: '2024-02-15',
    status: 'confirmed',
  },
];
