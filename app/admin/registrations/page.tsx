'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Select, Modal, Descriptions, Button, App } from 'antd';
import PageHeader from '../components/PageHeader';
import { adminApi } from '../../lib/api';

interface Registration {
  id: string;
  itinerary_title: string;
  applicant_name: string;
  email: string;
  phone: string;
  id_number: string;
  gender: string;
  birthday: string;
  submission_date: string;
  status: string;
  custom_field_data: Record<string, string>;
  note: string;
}

const statusOptions = [
  { value: 'pending', label: '待處理' },
  { value: 'confirmed', label: '已確認' },
  { value: 'cancelled', label: '已取消' },
];

const statusColor: Record<string, string> = {
  pending: 'orange',
  confirmed: 'green',
  cancelled: 'red',
};

export default function RegistrationsPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Registration | null>(null);

  useEffect(() => {
    adminApi.get('/registrations')
      .then(({ data: rows }) => setData(rows))
      .catch(() => message.error('載入失敗'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.patch(`/registrations/${id}`, { status });
      setData((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      message.success('狀態已更新');
    } catch {
      message.error('更新失敗');
    }
  };

  const columns = [
    { title: '行程', dataIndex: 'itinerary_title', key: 'itinerary_title' },
    { title: '報名者', dataIndex: 'applicant_name', key: 'applicant_name' },
    { title: '電話', dataIndex: 'phone', key: 'phone' },
    { title: '身分證字號', dataIndex: 'id_number', key: 'id_number' },
    { title: '提交日期', dataIndex: 'submission_date', key: 'submission_date' },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (v: string, r: Registration) => (
        <Select
          value={v}
          size="small"
          options={statusOptions}
          onChange={(val) => updateStatus(r.id, val)}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, r: Registration) => (
        <Button type="link" size="small" onClick={() => setSelected(r)}>查看詳情</Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="報名表單管理">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{ pageSize: 20 }}
        />
      </PageHeader>

      <Modal
        title="報名詳情"
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={<Button onClick={() => setSelected(null)}>關閉</Button>}
      >
        {selected && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="行程">{selected.itinerary_title}</Descriptions.Item>
            <Descriptions.Item label="姓名">{selected.applicant_name}</Descriptions.Item>
            <Descriptions.Item label="身分證字號">{selected.id_number}</Descriptions.Item>
            <Descriptions.Item label="生日">{selected.birthday || '—'}</Descriptions.Item>
            <Descriptions.Item label="性別">{selected.gender || '—'}</Descriptions.Item>
            <Descriptions.Item label="電話">{selected.phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="Email">{selected.email || '—'}</Descriptions.Item>
            <Descriptions.Item label="提交日期">{selected.submission_date}</Descriptions.Item>
            <Descriptions.Item label="狀態">
              <Tag color={statusColor[selected.status]}>
                {statusOptions.find((o) => o.value === selected.status)?.label}
              </Tag>
            </Descriptions.Item>
            {selected.custom_field_data && Object.keys(selected.custom_field_data).length > 0 && (
              <Descriptions.Item label="自訂欄位">
                {Object.entries(selected.custom_field_data).map(([k, v]) => (
                  <div key={k}><strong>{k}：</strong>{v}</div>
                ))}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </>
  );
}
