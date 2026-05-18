'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import ItineraryCard, { ItineraryProps } from './ItineraryCard';
import api from '../lib/api';

interface ApiItinerary {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  price: number;
  cover_image: string | null;
  tags: string[] | null;
  available_seats: number;
}

function calcDays(start: string, end: string): number {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1;
}

function toCardProps(it: ApiItinerary): ItineraryProps {
  const tags = it.tags || [];
  const isDomestic = tags.some(t => t.includes('國內') || t.includes('台灣'));
  return {
    id: it.id,
    title: it.title,
    image: it.cover_image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
    price: Number(it.price),
    days: calcDays(it.start_date, it.end_date),
    location: it.destination,
    tags: tags.filter(t => !t.includes('國內') && !t.includes('國外') && !t.includes('台灣')),
    category: isDomestic ? 'domestic' : 'international',
  };
}

const ItineraryContent: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeTab, setActiveTab] = useState<'international' | 'domestic'>(
    categoryParam === 'domestic' ? 'domestic' : 'international'
  );
  const [items, setItems] = useState<ItineraryProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/itineraries')
      .then(({ data }) => setItems((data as ApiItinerary[]).map(toCardProps)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (categoryParam === 'domestic' || categoryParam === 'international') {
      setActiveTab(categoryParam);
    }
  }, [categoryParam]);

  const filtered = items.filter(it => it.category === activeTab);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-center mb-12">
        <div className="flex gap-2 border-b-2 border-gray-100">
          {(['international', 'domestic'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="hover:text-[#97c618] transition-colors duration-200"
              style={{
                fontSize: '18px',
                fontWeight: 600,
                padding: '10px 32px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === key ? '2px solid #97c618' : '2px solid transparent',
                color: activeTab === key ? '#97c618' : '#595959',
                marginBottom: '-2px',
              }}
            >
              {key === 'international' ? '國外旅遊' : '國內旅遊'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <Row gutter={[24, 24]}>
          {filtered.map(item => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <ItineraryCard data={item} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="目前沒有相關行程" />
      )}
    </div>
  );
};

const ItineraryList: React.FC = () => (
  <Suspense fallback={<div className="flex justify-center py-32"><Spin size="large" /></div>}>
    <ItineraryContent />
  </Suspense>
);

export default ItineraryList;
