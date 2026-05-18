'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, App } from 'antd';
import PageHeader from '../components/PageHeader';
import { adminApi } from '../../lib/api';

interface Payment {
  id: string;
  order_no: string;
  user_name: string;
  amount: number;
  status: string;
  provider: string;
  trade_no: string | null;
  created_at: string;
}

const statusColor: Record<string, string> = {
  pending: 'orange',
  paid: 'green',
  failed: 'red',
};

export default function PaymentsPage() {
  const { message } = App.useApp();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/payments/admin/all')
      .then(({ data }) => setPayments(data))
      .catch(() => message.error('載入失敗'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: '訂單編號', dataIndex: 'order_no', key: 'order_no' },
    { title: '會員', dataIndex: 'user_name', key: 'user_name' },
    {
      title: '金額',
      dataIndex: 'amount',
      key: 'amount',
      render: (v: number) => `NT$ ${Number(v).toLocaleString()}`,
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => (
        <Tag color={statusColor[v] || 'default'}>
          {v === 'paid' ? '付款成功' : v === 'failed' ? '付款失敗' : '處理中'}
        </Tag>
      ),
    },
    { title: '金流平台', dataIndex: 'provider', key: 'provider', render: (v: string) => v === 'newebpay' ? '藍新金流' : v },
    { title: '交易序號', dataIndex: 'trade_no', key: 'trade_no', render: (v: string | null) => v || '—' },
    {
      title: '時間',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string) => new Date(v).toLocaleString('zh-TW'),
    },
  ];

  return (
    <PageHeader title="金流紀錄">
      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{ pageSize: 20 }}
      />
    </PageHeader>
  );
}
