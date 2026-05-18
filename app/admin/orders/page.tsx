'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Select, App } from 'antd';
import PageHeader from '../components/PageHeader';
import { adminApi } from '../../lib/api';

interface Order {
  id: string;
  order_no: string;
  itinerary_title: string;
  user_name: string;
  user_email: string;
  quantity: number;
  total_price: number;
  status: string;
  payment_status: string;
  contact_name: string;
  contact_phone: string;
  created_at: string;
}

const statusOptions = [
  { value: 'pending', label: '待確認' },
  { value: 'confirmed', label: '已確認' },
  { value: 'cancelled', label: '已取消' },
];

const paymentOptions = [
  { value: 'unpaid', label: '未付款' },
  { value: 'paid', label: '已付款' },
];

export default function OrdersPage() {
  const { message } = App.useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/orders/admin/all')
      .then(({ data }) => setOrders(data))
      .catch(() => message.error('載入失敗'))
      .finally(() => setLoading(false));
  }, []);

  const updateOrder = async (id: string, payload: Record<string, string>) => {
    try {
      const { data } = await adminApi.patch(`/orders/admin/${id}`, payload);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
      message.success('更新成功');
    } catch {
      message.error('更新失敗');
    }
  };

  const columns = [
    { title: '訂單編號', dataIndex: 'order_no', key: 'order_no', width: 160 },
    { title: '行程', dataIndex: 'itinerary_title', key: 'itinerary_title' },
    { title: '聯絡人', dataIndex: 'contact_name', key: 'contact_name' },
    { title: '電話', dataIndex: 'contact_phone', key: 'contact_phone' },
    {
      title: '人數 / 金額',
      key: 'qty_price',
      render: (_: unknown, r: Order) => `${r.quantity} 人 / NT$${Number(r.total_price).toLocaleString()}`,
    },
    {
      title: '訂單狀態',
      dataIndex: 'status',
      key: 'status',
      render: (v: string, r: Order) => (
        <Select
          value={v}
          size="small"
          options={statusOptions}
          onChange={(val) => updateOrder(r.id, { status: val })}
        />
      ),
    },
    {
      title: '付款狀態',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (v: string, r: Order) => (
        <Select
          value={v}
          size="small"
          options={paymentOptions}
          onChange={(val) => updateOrder(r.id, { payment_status: val })}
        />
      ),
    },
    {
      title: '建立時間',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string) => new Date(v).toLocaleDateString('zh-TW'),
    },
  ];

  return (
    <PageHeader title="訂單管理">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 20 }}
      />
    </PageHeader>
  );
}
