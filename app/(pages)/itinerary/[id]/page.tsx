'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Typography, Form, Input, DatePicker, InputNumber, Button, message, Row, Col, Card, Divider } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

import { itineraries } from '../../../data/itineraries';

// Mock data lookup (in a real app this would be an API call)
const getItineraryData = (id: string) => {
  return itineraries.find(item => item.id === id);
};

export default function ItineraryDetail() {
  const params = useParams();
  const id = params?.id as string;
  const data = getItineraryData(id);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    message.success('報名成功！我們會盡快與您聯繫。');
    form.resetFields();
  };

  if (!data) {
    return <div className="p-12 text-center">找不到行程</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <img 
          src={data.image} 
          alt={data.title} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 p-8 text-white w-full max-w-7xl mx-auto">
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>{data.title}</Title>
          <div className="flex items-center space-x-6 text-lg">
            <span className="flex items-center"><EnvironmentOutlined className="mr-2" /> {data.location}</span>
            <span className="flex items-center"><ClockCircleOutlined className="mr-2" /> {data.days} 天</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Row gutter={[48, 24]}>
          {/* Left Column: Description */}
          <Col xs={24} lg={14}>
            <Card className="mb-8 shadow-sm rounded-xl">
              <Title level={3}>行程特色</Title>
              <Paragraph className="text-lg leading-relaxed text-gray-600">
                {data.description}
              </Paragraph>
              <Divider />
              <Title level={4}>費用包含</Title>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>全程交通接送</li>
                <li>精選住宿</li>
                <li>景點門票</li>
                <li>專業導遊解說</li>
                <li>保險</li>
              </ul>
            </Card>
          </Col>

          {/* Right Column: Booking Form */}
          <Col xs={24} lg={10}>
            <Card 
              className="shadow-md rounded-xl sticky top-8 border-t-4" 
              style={{ borderTopColor: '#97c618' }}
              title={<Title level={3} style={{ margin: 0 }}>立即報名</Title>}
            >
              <div className="mb-6">
                <Text type="secondary">每人費用</Text>
                <div className="text-3xl font-bold text-primary">
                  NT$ {data.price.toLocaleString()} <span className="text-sm text-gray-400 font-normal">起</span>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
              >
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '請輸入您的姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="王小明" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="聯絡電話"
                  rules={[{ required: true, message: '請輸入您的聯絡電話' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="0912-345-678" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="電子信箱"
                  rules={[
                    { required: true, message: '請輸入您的電子信箱' },
                    { type: 'email', message: '請輸入有效的電子信箱格式' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="example@email.com" />
                </Form.Item>

                <Form.Item
                  name="date"
                  label="預計出發日期"
                  rules={[{ required: true, message: '請選擇出發日期' }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  name="travelers"
                  label="報名人數"
                  initialValue={1}
                  rules={[{ required: true, message: '請輸入報名人數' }]}
                >
                  <InputNumber min={1} max={20} className="w-full" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: '#97c618', borderColor: '#97c618', height: '50px', fontSize: '1.1rem' }}>
                    送出報名
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
