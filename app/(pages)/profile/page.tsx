'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, Form, Input, Button, Table, Tag, App, Spin, Radio } from 'antd';
import RocDateSelect from '../../components/RocDateSelect';
import dayjs from 'dayjs';
import { useUserAuth } from '../../context/UserAuthContext';
import api from '../../lib/api';

interface Order {
  id: string;
  order_no: string;
  itinerary_title: string;
  destination: string;
  start_date: string;
  quantity: number;
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
}

const statusColor: Record<string, string> = {
  pending: 'orange',
  confirmed: 'green',
  cancelled: 'red',
};

const paymentColor: Record<string, string> = {
  unpaid: 'red',
  paid: 'green',
};

export default function ProfilePage() {
  const { message } = App.useApp();
  const { user, loading, logout } = useUserAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/auth');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday ? dayjs(user.birthday) : null,
        gender: user.gender,
        id_number: user.id_number,
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data);
    } catch {
      message.error('載入訂單失敗');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveProfile = async (values: Record<string, unknown>) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        birthday: values.birthday ? (values.birthday as dayjs.Dayjs).format('YYYY-MM-DD') : undefined,
      };
      await api.patch('/auth/user/me', payload);
      message.success('資料已更新');
    } catch {
      message.error('更新失敗');
    } finally {
      setSaving(false);
    }
  };

  const orderColumns = [
    { title: '訂單編號', dataIndex: 'order_no', key: 'order_no' },
    { title: '行程', dataIndex: 'itinerary_title', key: 'itinerary_title' },
    { title: '出發日期', dataIndex: 'start_date', key: 'start_date' },
    { title: '人數', dataIndex: 'quantity', key: 'quantity' },
    {
      title: '總金額',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (v: number) => `NT$ ${v.toLocaleString()}`,
    },
    {
      title: '訂單狀態',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <Tag color={statusColor[v]}>{v === 'pending' ? '待確認' : v === 'confirmed' ? '已確認' : '已取消'}</Tag>,
    },
    {
      title: '付款狀態',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (v: string) => <Tag color={paymentColor[v]}>{v === 'paid' ? '已付款' : '未付款'}</Tag>,
    },
  ];

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spin size="large" /></div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的帳戶</h1>
        <Button onClick={() => { logout(); router.push('/'); }}>登出</Button>
      </div>

      <Tabs
        items={[
          {
            key: 'profile',
            label: '個人資料',
            children: (
              <div className="max-w-md">
                <Form form={form} layout="vertical" onFinish={handleSaveProfile}>
                  <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="id_number" label="身分證字號">
                    <Input placeholder="A123456789" />
                  </Form.Item>
                  <Form.Item name="birthday" label="出生年月日（民國）">
                    <RocDateSelect />
                  </Form.Item>
                  <Form.Item name="gender" label="性別">
                    <Radio.Group>
                      <Radio value="男">男</Radio>
                      <Radio value="女">女</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                  <Form.Item name="phone" label="手機號碼">
                    <Input />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" loading={saving}>儲存變更</Button>
                </Form>
              </div>
            ),
          },
          {
            key: 'orders',
            label: '訂單紀錄',
            children: (
              <Table
                columns={orderColumns}
                dataSource={orders}
                rowKey="id"
                loading={ordersLoading}
                scroll={{ x: 800 }}
                locale={{ emptyText: '尚無訂單記錄' }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
