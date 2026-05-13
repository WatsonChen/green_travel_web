export interface ItineraryProps {
  id: string;
  title: string;
  image: string;
  price: number;
  days: number;
  location: string;
  tags: string[];
  category: 'domestic' | 'international';
  description?: string;
}

export const itineraries: ItineraryProps[] = [
  {
    id: '1',
    title: '京都大阪深度文化之旅',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
    price: 35900,
    days: 7,
    location: '日本',
    tags: ['文化', '美食', '歷史'],
    category: 'international',
    description: '深入京都古寺，體驗大阪美食，感受日本傳統與現代的完美融合。行程包含清水寺、金閣寺、道頓堀等著名景點，並安排茶道體驗與懷石料理。',
  },
  {
    id: '2',
    title: '花蓮太魯閣峽谷探險',
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?q=80&w=2070&auto=format&fit=crop',
    price: 8900,
    days: 3,
    location: '台灣花蓮',
    tags: ['自然', '健行'],
    category: 'domestic',
    description: '探索世界級的太魯閣峽谷，漫步砂卡礑步道，欣賞清水斷崖的壯麗景色。入住五星級飯店，享受舒適的度假時光。',
  },
  {
    id: '3',
    title: '巴黎浪漫漫遊',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    price: 65000,
    days: 8,
    location: '法國',
    tags: ['浪漫', '城市', '藝術'],
    category: 'international',
    description: '漫步塞納河畔，登上艾菲爾鐵塔，參觀羅浮宮藝術殿堂。品嚐法式甜點，感受巴黎的浪漫氛圍。',
  },
  {
    id: '4',
    title: '阿里山日出雲海之旅',
    image: 'https://images.unsplash.com/photo-1558588942-930faae5a389?q=80&w=2070&auto=format&fit=crop',
    price: 6500,
    days: 2,
    location: '台灣嘉義',
    tags: ['生態', '自然'],
    category: 'domestic',
    description: '搭乘森林小火車，迎接阿里山的第一道曙光。漫步巨木群棧道，呼吸充滿芬多精的清新空氣。',
  },
  {
    id: '5',
    title: '瑞士阿爾卑斯滑雪趣',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2070&auto=format&fit=crop',
    price: 88000,
    days: 10,
    location: '瑞士',
    tags: ['滑雪', '冬季', '奢華'],
    category: 'international',
    description: '入住阿爾卑斯山腳下的度假村，享受世界級的滑雪設施。搭乘景觀列車，飽覽壯麗的雪山美景。',
  },
  {
    id: '6',
    title: '墾丁陽光沙灘派對',
    image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=1974&auto=format&fit=crop',
    price: 5500,
    days: 3,
    location: '台灣屏東',
    tags: ['海灘', '派對'],
    category: 'domestic',
    description: '享受南台灣的熱情陽光，體驗刺激的水上活動。晚上逛墾丁大街，品嚐在地小吃。',
  },
];
