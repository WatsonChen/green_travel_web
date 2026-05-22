'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Typography, Form, Input, InputNumber, Button, App,
  Row, Col, Card, Divider, Select, Radio, Spin, Tag, Drawer,
} from 'antd';
import RocDateSelect from '../../../components/RocDateSelect';
import {
  ClockCircleOutlined, EnvironmentOutlined, UserOutlined,
  MailOutlined, PhoneOutlined, TeamOutlined, FormOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../../lib/api';
import { useUserAuth } from '../../../context/UserAuthContext';
import { twIdRule, twPhoneRule } from '../../../lib/validators';

const { Title, Text } = Typography;

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [mobileForm] = Form.useForm();
  const desktopQty: number = Form.useWatch('quantity', form) ?? 1;
  const mobileQty: number = Form.useWatch('quantity', mobileForm) ?? 1;

  useEffect(() => {
    api.get(`/itineraries/${params?.id}`)
      .then(({ data }) => setItinerary(data))
      .catch(() => message.error('找不到此行程'))
      .finally(() => setLoading(false));
  }, [params?.id]);

  useEffect(() => {
    if (user) {
      const prefill = {
        contact_name: user.name || undefined,
        contact_email: user.email || undefined,
        contact_phone: user.phone || undefined,
        id_number: user.id_number || undefined,
        gender: user.gender || undefined,
        birthday: user.birthday ? dayjs(user.birthday) : undefined,
      };
      form.setFieldsValue(prefill);
      mobileForm.setFieldsValue(prefill);
    }
  }, [user]);

  const onFinish = async (values: Record<string, unknown>) => {
    if (!user) {
      message.warning('請先登入再報名');
      router.push('/auth');
      return;
    }
    if (!itinerary) return;

    setSubmitting(true);
    try {
      const { quantity, contact_name, contact_email, contact_phone, birthday, gender, id_number, ...rest } = values;
      const qty = (quantity as number) || 1;

      // Separate additional participant fields from custom fields
      const customData: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(rest)) {
        if (!/^p\d+_/.test(key)) customData[key] = val;
      }

      // Build participant list: participant 1 = contact person, rest from dynamic fields
      type Participant = { name: unknown; id_number: unknown; birthday: unknown; gender: unknown; phone: unknown };
      const participants: Participant[] = [
        { name: contact_name, id_number, birthday, gender, phone: contact_phone },
      ];
      for (let i = 2; i <= qty; i++) {
        participants.push({
          name: values[`p${i}_name`],
          id_number: values[`p${i}_id_number`],
          birthday: values[`p${i}_birthday`],
          gender: values[`p${i}_gender`],
          phone: values[`p${i}_phone`],
        });
      }

      const { data: order } = await api.post('/orders', {
        itinerary_id: itinerary.id,
        quantity: qty,
        contact_name,
        contact_email,
        contact_phone,
      });

      await Promise.all(
        participants.map((p, idx) =>
          api.post('/registrations', {
            order_id: order.id,
            itinerary_id: itinerary.id,
            applicant_name: p.name,
            email: idx === 0 ? contact_email : null,
            phone: p.phone || null,
            birthday: (p.birthday as { format?: (s: string) => string })?.format?.('YYYY-MM-DD') || null,
            gender: p.gender,
            id_number: p.id_number,
            custom_field_data: customData,
          })
        )
      );

      const { data: payResult } = await api.post('/payments/initiate', { order_id: order.id });

      if (payResult.mock) {
        await api.post('/payments/mock-pay', { order_id: order.id });
        message.success(itinerary.confirmation_message || '報名成功！我們將盡快與您聯繫。');
        router.push('/profile');
      } else {
        const htmlForm = document.createElement('form');
        htmlForm.method = 'POST';
        htmlForm.action = payResult.apiUrl;
        Object.entries({
          MerchantID: payResult.merchantId,
          TradeInfo: payResult.tradeInfo,
          TradeSha: payResult.tradeSha,
          Version: payResult.version,
        }).forEach(([k, v]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = k;
          input.value = v as string;
          htmlForm.appendChild(input);
        });
        document.body.appendChild(htmlForm);
        htmlForm.submit();
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

  // 額外旅客欄位（第 2 位起）
  const extraParticipantFields = (n: number) => (
    <React.Fragment key={n}>
      <Divider orientation="left" style={{ color: '#555', fontSize: 14 }}>第 {n} 位旅客</Divider>
      <Form.Item name={`p${n}_name`} label="姓名" rules={[{ required: true, message: '請輸入姓名' }]}>
        <Input prefix={<UserOutlined />} placeholder="王小明" />
      </Form.Item>
      <Form.Item name={`p${n}_id_number`} label="身分證字號" rules={[{ required: true, message: '請輸入身分證字號' }, twIdRule]}>
        <Input placeholder="A123456789" />
      </Form.Item>
      <Form.Item name={`p${n}_birthday`} label="出生年月日（民國）" rules={[{ required: true, message: '請選擇出生年月日' }]}>
        <RocDateSelect />
      </Form.Item>
      <Form.Item name={`p${n}_gender`} label="性別" rules={[{ required: true, message: '請選擇性別' }]}>
        <Radio.Group>
          <Radio value="男">男</Radio>
          <Radio value="女">女</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name={`p${n}_phone`} label="行動電話" rules={[{ required: true, message: '請輸入電話' }, twPhoneRule]}>
        <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxxx" />
      </Form.Item>
    </React.Fragment>
  );

  // 報名表單欄位（桌機 & 手機 Drawer 共用）
  const formFields = (watchedQty: number) => (
    <>
      {watchedQty > 1 && (
        <Divider orientation="left" style={{ color: '#555', fontSize: 14 }}>第 1 位旅客（聯絡人）</Divider>
      )}
      {user && (
        <p className="text-xs text-gray-400 mb-3">
          已從個人資料帶入部分欄位。
          <Link href="/profile" className="ml-1 underline" style={{ color: '#97c618' }}>
            前往個人資料頁完善資料
          </Link>
        </p>
      )}
      <Form.Item name="contact_name" label="姓名" rules={[{ required: true }]}>
        <Input prefix={<UserOutlined />} placeholder="王小明" />
      </Form.Item>
      <Form.Item name="id_number" label="身分證字號" rules={[{ required: true, message: '請輸入身分證字號' }, twIdRule]}>
        <Input placeholder="A123456789" />
      </Form.Item>
      <Form.Item name="birthday" label="出生年月日（民國）" rules={[{ required: true, message: '請選擇出生年月日' }]}>
        <RocDateSelect />
      </Form.Item>
      <Form.Item name="contact_phone" label="行動電話" rules={[{ required: true, message: '請輸入電話' }, twPhoneRule]}>
        <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxxx" />
      </Form.Item>
      <Form.Item name="contact_email" label="Email" rules={[{ type: 'email', message: '請輸入有效的 Email 格式' }]}>
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
      {/* 額外旅客 */}
      {Array.from({ length: Math.max(0, watchedQty - 1) }, (_, i) => extraParticipantFields(i + 2))}
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
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      {/* Hero */}
      <div className="relative h-72 lg:h-90 w-full bg-gray-300">
        {itinerary.cover_image && (
          <img src={itinerary.cover_image} alt={itinerary.title} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 p-6 lg:p-8 text-white">
          <Title level={2} className="lg:text-4xl!" style={{ color: 'white', marginBottom: 8 }}>
            {itinerary.title}
          </Title>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base lg:text-lg">
            <span className="whitespace-nowrap flex items-center gap-1">
              <EnvironmentOutlined />{itinerary.destination}
            </span>
            <span className="whitespace-nowrap flex items-center gap-1">
              <ClockCircleOutlined />{days} 天
            </span>
            <span className="whitespace-nowrap flex items-center gap-1">
              <TeamOutlined />剩餘 {itinerary.available_seats} 名
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <Row gutter={[48, 24]}>
          {/* 行程資訊 */}
          <Col xs={24} lg={14}>
            <Card className="mb-6 shadow-sm rounded-xl">
              <Title level={3}>行程說明</Title>
              <div
                className="text-base leading-relaxed text-gray-600 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: itinerary.description }}
              />
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

          {/* 桌機報名表單 */}
          <Col xs={0} lg={10}>
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
                {formFields(desktopQty)}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 手機版固定報名按鈕 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs text-gray-500">每人費用</div>
            <div className="text-xl font-bold" style={{ color: '#97c618' }}>
              NT$ {itinerary.price.toLocaleString()}
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<FormOutlined />}
            disabled={soldOut}
            onClick={() => setDrawerOpen(true)}
            style={{ backgroundColor: '#97c618', borderColor: '#97c618', height: 48, paddingLeft: 24, paddingRight: 24 }}
          >
            {soldOut ? '已額滿' : '立即報名'}
          </Button>
        </div>
      </div>

      {/* 手機版 Drawer */}
      <Drawer
        title={
          <div>
            <div className="font-bold text-base">{itinerary.title}</div>
            <div className="text-sm font-normal" style={{ color: '#97c618' }}>
              NT$ {itinerary.price.toLocaleString()} / 人
            </div>
          </div>
        }
        placement="bottom"
        height="92dvh"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{ body: { paddingBottom: 80 } }}
      >
        {soldOut ? (
          <div className="text-center py-12 text-gray-400">此行程已額滿</div>
        ) : (
          <Form form={mobileForm} layout="vertical" onFinish={onFinish} size="large">
            {formFields(mobileQty)}
          </Form>
        )}
      </Drawer>
    </div>
  );
}
