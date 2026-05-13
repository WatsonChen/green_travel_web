'use client';

import React from 'react';
import { Row, Col, Typography, Space } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const linkStyle: React.CSSProperties = {
  color: '#d1d5db',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

const linkHoverStyle = {
  color: '#97c618',
};

const iconStyle: React.CSSProperties = {
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

const Footer: React.FC = () => {
  return (
    <footer 
      className="text-white py-12"
      style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto brightness-0 invert" />
              <span className="ml-2 text-xl font-bold">Green Travel</span>
            </div>
            <Text className="!text-white block mb-4">
              我們致力於提供最優質的旅遊體驗，帶您探索世界的美好角落。
            </Text>
            <Space size="large">
              <a 
                href="#" 
                style={{ ...linkStyle, ...iconStyle }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = linkHoverStyle.color;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.15)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = linkStyle.color!;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                }}
              >
                <FacebookOutlined style={{ fontSize: '24px' }} />
              </a>
              <a 
                href="#" 
                style={{ ...linkStyle, ...iconStyle }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = linkHoverStyle.color;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.15)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = linkStyle.color!;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                }}
              >
                <InstagramOutlined style={{ fontSize: '24px' }} />
              </a>
              <a 
                href="#" 
                style={{ ...linkStyle, ...iconStyle }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = linkHoverStyle.color;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.15)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = linkStyle.color!;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                }}
              >
                <TwitterOutlined style={{ fontSize: '24px' }} />
              </a>
            </Space>
          </Col>
          
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: 24 }}>快速連結</Title>
            <Space direction="vertical">
              <Link 
                href="/" 
                style={linkStyle}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkHoverStyle.color}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkStyle.color!}
              >
                首頁
              </Link>
              <Link 
                href="/?category=domestic" 
                style={linkStyle}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkHoverStyle.color}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkStyle.color!}
              >
                國內旅遊
              </Link>
              <Link 
                href="/?category=international" 
                style={linkStyle}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkHoverStyle.color}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkStyle.color!}
              >
                國外旅遊
              </Link>
              <Link 
                href="/about" 
                style={linkStyle}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkHoverStyle.color}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkStyle.color!}
              >
                關於我們
              </Link>
              <Link 
                href="#" 
                style={linkStyle}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkHoverStyle.color}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color = linkStyle.color!}
              >
                聯絡我們
              </Link>
            </Space>
          </Col>

          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: 24 }}>聯絡資訊</Title>
            <Space direction="vertical" className="!text-white">
              <Text className="!text-white">電話：02-1234-5678</Text>
              <Text className="!text-white">信箱：info@greentravel.com</Text>
              <Text className="!text-white">地址：台北市信義區信義路五段7號</Text>
            </Space>
          </Col>
        </Row>
        
        <div 
          className="mt-12 pt-8 text-center text-gray-500"
          style={{
            borderTop: '1px solid transparent',
            borderImage: 'linear-gradient(90deg, transparent 0%, rgba(151, 198, 24, 0.3) 50%, transparent 100%) 1',
          }}
        >
          © {new Date().getFullYear()} Green Travel. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
