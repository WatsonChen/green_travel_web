'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Typography, Form, Input, InputNumber, Button, App,
  Row, Col, Card, Divider, DatePicker, Select, Radio, Spin, Tag,
} from 'antd';
import {
  ClockCircleOutlined, EnvironmentOutlined, UserOutlined,
  MailOutlined, PhoneOutlined, TeamOutlined,
} from '@ant-design/icons';
import api from '../../../lib/api';
import { useUserAuth } from '../../../context/UserAuthContext';

const { Title, Paragraph, Text } = Typography;

interface CustomField {
  label: string;
  type: 'text' | 'select' | 'radio';
  required: boolean;
  options?: string[];
}

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  available_seats: number;
  max_seats: number;
  venue: string | null;
  cover_image: string | null;
  custom_fields: CustomField[];
  confirmation_message: string | null;
}

export default function ItineraryDetail() {
  const { message } = App.useApp();
  const params = useParams();
  const router = useRouter();
  const { user } = useUserAuth();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    api.get(`/itineraries/${params?.id}`)
      .then(({ data }) => setItinerary(data))
      .catch(() => message.error('找不到此行程'))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const onFinish = async (values: Record<string, unknown>) => {
    if (!user) {
      message.warning('請先登入再報名');
      router.push('/auth');
      return;
    }
    if (!itinerary) return;

    setSubmitting(true);
    try {
      // 分離固定欄位與自訂欄位
      const { quantity, contact_name, contact_email, contact_phone, birthday, gender, id_number, ...customData } = values;

      // 1. 建立訂單
      const { data: order } = await api.post('/orders', {
        itinerary_id: itinerary.id,
        quantity: quantity || 1,
        contact_name,
        contact_email,
        contact_phone,
      });

      // 2. 建立報名表單（帶自訂欄位）
      await api.post('/registrations', {
        order_id: order.id,
        itinerary_id: itinerary.id,
        applicant_name: contact_name,
        email: contact_email,
        phone: contact_phone,
        birthday: (birthday as { format?: (s: string) => string })?.format?.('YYYY-MM-DD') || null,
        gender,
        id_number,
        custom_field_data: customData,
      });

      // 3. 藍新金流（mock 環境直接模擬付款）
      const { data: payResult } = await api.post('/payments/initiate', { order_id: order.id });

      if (payResult.mock) {
        // 開發模式：自動付款
        await api.post('/payments/mock-pay', { order_id: order.id });
        message.success(itinerary.confirmation_message || '報名成功！我們將盡快與您聯繫。');
        router.push('/profile');
      } else {
        // 正式藍新金流：建立表單送出
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payResult.apiUrl;
        const fields = {
          MerchantID: payResult.merchantId,
          TradeInfo: payResult.tradeInfo,
          TradeSha: payResult.tradeSha,
          Version: payResult.version,
        };
        Object.entries(fields).forEach(([k, v]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = k;
          input.value = v as string;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '報名失敗';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spin size="large" /></div>;
  if (!itinerary) return <div className="p-12 text-center text-gray-500">找不到此行程</div>;

  const days = Math.ceil((new Date(itinerary.end_date).getTime() - new Date(itinerary.start_date).getTime()) / 86400000) + 1;
  const soldOut = itinerary.available_seats === 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero */}
      <div className="relative h-90 w-full bg-gray-300">
        {itinerary.cover_image && (
          <img src={itinerary.cover_image} alt={itinerary.title} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>{itinerary.title}</Title>
          <div className="flex items-center gap-6 text-lg">
            <span><EnvironmentOutlined className="mr-1" />{itinerary.destination}</span>
            <span><ClockCircleOutlined className="mr-1" />{days} 天</span>
            <span><TeamOutlined className="mr-1" />剩餘 {itinerary.available_seats} 名</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Row gutter={[48, 24]}>
          {/* 行程資訊 */}
          <Col xs={24} lg={14}>
            <Card className="mb-6 shadow-sm rounded-xl">
              <Title level={3}>行程說明</Title>
              <Paragraph className="text-base leading-relaxed text-gray-600 whitespace-pre-line">
                {itinerary.description}
              </Paragraph>
              {itinerary.venue && (
                <>
                  <Divider />
                  <div className="flex items-center gap-2 text-gray-600">
                    <EnvironmentOutlined />
                    <span>{itinerary.venue}</span>
                  </div>
                </>
              )}
            </Card>
          </Col>

          {/* 報名表單 */}
          <Col xs={24} lg={10}>
            <Card
              className="shadow-md rounded-xl sticky top-8 border-t-4"
              style={{ borderTopColor: '#97c618' }}
              title={<Title level={3} style={{ margin: 0 }}>立即報名</Title>}
            >
              <div className="mb-4">
                <Text type="secondary">每人費用</Text>
                <div className="text-3xl font-bold" style={{ color: '#97c618' }}>
                  NT$ {itinerary.price.toLocaleString()}
                </div>
                <div className="mt-1">
                  {soldOut
                    ? <Tag color="red">已額滿</Tag>
                    : <Tag color="green">尚有名額 {itinerary.available_seats} 人</Tag>
                  }
                </div>
              </div>

              <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                {/* 固定欄位 */}
                <Form.Item name="contact_name" label="姓名" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} placeholder="王小明" />
                </Form.Item>
                <Form.Item name="id_number" label="身分證字號" rules={[{ required: true, message: '請輸入身分證字號' }]}>
                  <Input placeholder="A123456789" />
                </Form.Item>
                <Form.Item name="birthday" label="生日" rules={[{ required: true }]}>
                  <DatePicker className="w-full" placeholder="選擇生日" />
                </Form.Item>
                <Form.Item name="contact_phone" label="行動電話" rules={[{ required: true }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxxx" />
                </Form.Item>
                <Form.Item name="contact_email" label="Email">
                  <Input prefix={<MailOutlined />} placeholder="your@email.com" />
                </Form.Item>
                <Form.Item name="gender" label="性別" rules={[{ required: true }]}>
                  <Radio.Group>
                    <Radio value="男">男</Radio>
                    <Radio value="女">女</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="quantity" label="報名人數" initialValue={1} rules={[{ required: true }]}>
                  <InputNumber min={1} max={itinerary.available_seats || 1} className="w-full" />
                </Form.Item>

                {/* 自訂欄位 */}
                {(itinerary.custom_fields || []).map((field, idx) => (
                  <Form.Item
                    key={idx}
                    name={`custom_${idx}`}
                    label={field.label}
                    rules={field.required ? [{ required: true, message: `請填寫${field.label}` }] : []}
                  >
                    {field.type === 'select' ? (
                      <Select placeholder={`請選擇${field.label}`} options={field.options?.map((o) => ({ value: o, label: o }))} />
                    ) : field.type === 'radio' ? (
                      <Radio.Group options={field.options?.map((o) => ({ value: o, label: o }))} />
                    ) : (
                      <Input />
                    )}
                  </Form.Item>
                ))}

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={submitting}
                  disabled={soldOut}
                  style={{ backgroundColor: '#97c618', borderColor: '#97c618', height: 50 }}
                >
                  {soldOut ? '已額滿' : '立即報名並付款'}
                </Button>

                {!user && (
                  <p className="text-center text-sm text-gray-400 mt-2">送出前需先登入</p>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
