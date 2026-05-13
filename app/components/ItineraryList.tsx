'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Tabs, Row, Col, Empty } from 'antd';
import { useSearchParams } from 'next/navigation';
import ItineraryCard from './ItineraryCard';
import { itineraries } from '../data/itineraries';

const ItineraryContent: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeTab, setActiveTab] = useState<string>('international');

  useEffect(() => {
    if (categoryParam && (categoryParam === 'domestic' || categoryParam === 'international')) {
      setActiveTab(categoryParam);
    }
  }, [categoryParam]);

  const filteredData = itineraries.filter(item => item.category === activeTab);

  const items = [
    {
      key: 'international',
      label: '國外旅遊',
    },
    {
      key: 'domestic',
      label: '國內旅遊',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-center mb-12">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          size="large"
          centered
          className="w-full max-w-md"
          tabBarStyle={{ 
            borderBottom: '2px solid #f0f0f0',
          }}
          items={items.map(item => ({
            ...item,
            label: (
              <span 
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  padding: '8px 16px',
                  transition: 'all 0.3s ease',
                }}
                className="hover:text-[#97c618]"
              >
                {item.label}
              </span>
            )
          }))}
          tabBarGutter={48}
        />
      </div>
      
      {filteredData.length > 0 ? (
        <Row gutter={[24, 24]}>
          {filteredData.map(item => (
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

const ItineraryList: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItineraryContent />
    </Suspense>
  );
};

export default ItineraryList;
