'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Select, App } from 'antd';
import PageHeader from '../components/PageHeader';
import { adminApi } from '../../lib/api';

interface Member {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  id_number: string | null;
  status: string;
  created_at: string;
}

const statusOptions = [
  { value: 'active', label: '啟用' },
  { value: 'inactive', label: '停用' },
];

export default function MembersPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/members')
      .then(({ data: rows }) => setData(rows))
      .catch(() => message.error('載入失敗'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.patch(`/members/${id}`, { status });
      setData((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      message.success('狀態已更新');
    } catch {
      message.error('更新失敗');
    }
  };

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (v: string | null) => v || '—' },
    { title: '電話', dataIndex: 'phone', key: 'phone', render: (v: string | null) => v || '—' },
    { title: '身分證字號', dataIndex: 'id_number', key: 'id_number', render: (v: string | null) => v || '—' },
    {
      title: '加入日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string) => new Date(v).toLocaleDateString('zh-TW'),
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (v: string, r: Member) => (
        <Select
          value={v}
          size="small"
          options={statusOptions}
          onChange={(val) => updateStatus(r.id, val)}
        />
      ),
    },
  ];

  return (
    <PageHeader title="會員管理">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: 700 }}
        pagination={{ pageSize: 20 }}
      />
    </PageHeader>
  );
}
