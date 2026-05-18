'use client';

import { useEffect, useState } from 'react';
import { Button, Table, Tag, Select, App, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';
import { adminApi } from '../../lib/api';

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  price: number;
  max_seats: number;
  available_seats: number;
  status: string;
}

const statusColor: Record<string, string> = {
  draft: 'default',
  published: 'green',
  archived: 'red',
};

const statusLabel: Record<string, string> = {
  draft: '草稿',
  published: '已上架',
  archived: '已下架',
};

export default function ItinerariesPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAll = () => {
    adminApi.get('/itineraries/admin/all')
      .then(({ data: rows }) => setData(rows))
      .catch(() => message.error('載入失敗'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.put(`/itineraries/${id}`, { status });
      setData((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      message.success('狀態已更新');
    } catch {
      message.error('更新失敗');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.delete(`/itineraries/${id}`);
      setData((prev) => prev.filter((r) => r.id !== id));
      message.success('行程已刪除');
    } catch {
      message.error('刪除失敗');
    }
  };

  const columns = [
    { title: '行程名稱', dataIndex: 'title', key: 'title' },
    { title: '目的地', dataIndex: 'destination', key: 'destination' },
    { title: '出發日期', dataIndex: 'start_date', key: 'start_date' },
    { title: '結束日期', dataIndex: 'end_date', key: 'end_date' },
    {
      title: '費用',
      dataIndex: 'price',
      key: 'price',
      render: (v: number) => `NT$ ${Number(v).toLocaleString()}`,
    },
    {
      title: '名額',
      key: 'seats',
      render: (_: unknown, r: Itinerary) => `${r.available_seats} / ${r.max_seats}`,
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (v: string, r: Itinerary) => (
        <Select
          value={v}
          size="small"
          onChange={(val) => updateStatus(r.id, val)}
          options={[
            { value: 'draft', label: '草稿' },
            { value: 'published', label: '上架' },
            { value: 'archived', label: '下架' },
          ]}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, r: Itinerary) => (
        <span className="flex gap-2">
          <Button type="link" size="small" onClick={() => router.push(`/admin/itineraries/${r.id}/edit`)}>
            編輯
          </Button>
          <Popconfirm title="確定刪除此行程？" onConfirm={() => handleDelete(r.id)} okText="刪除" cancelText="取消">
            <Button type="link" danger size="small">刪除</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <PageHeader
      title="行程上架管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/admin/itineraries/new')}>
          新增行程
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 20 }}
      />
    </PageHeader>
  );
}
