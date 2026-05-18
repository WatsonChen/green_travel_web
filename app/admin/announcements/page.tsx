'use client';

import { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select, App, Descriptions, Tag, Popconfirm, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import { adminApi } from '../../lib/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'urgent';
  status: 'published' | 'draft';
  publish_date?: string;
  expiry_date?: string;
  author: string;
  created_at: string;
  updated_at: string;
}

const priorityColor: Record<string, string> = { high: 'red', medium: 'orange', urgent: 'volcano' };
const priorityLabel: Record<string, string> = { high: '高', medium: '中', urgent: '緊急' };
const statusColor: Record<string, string> = { published: 'green', draft: 'default' };
const statusLabel: Record<string, string> = { published: '已發佈', draft: '草稿' };

export default function AnnouncementsPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [viewing, setViewing] = useState<Announcement | null>(null);
  const [form] = Form.useForm();

  const fetchAll = () => {
    adminApi.get('/announcements/admin/all')
      .then(({ data: rows }) => setData(rows))
      .catch(() => message.error('載入失敗'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: 'draft', priority: 'medium' });
    setModalOpen(true);
  };

  const openEdit = (record: Announcement) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      priority: record.priority,
      status: record.status,
      publish_date: record.publish_date || '',
      expiry_date: record.expiry_date || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        const { data: updated } = await adminApi.put(`/announcements/${editing.id}`, values);
        setData((prev) => prev.map((r) => r.id === editing.id ? updated : r));
        message.success('公告更新成功');
      } else {
        const { data: created } = await adminApi.post('/announcements', { ...values, author: '系統管理員' });
        setData((prev) => [created, ...prev]);
        message.success('公告新增成功');
      }
      setModalOpen(false);
    } catch (err: unknown) {
      if ((err as { errorFields?: unknown[] })?.errorFields) return;
      message.error('儲存失敗');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.delete(`/announcements/${id}`);
      setData((prev) => prev.filter((r) => r.id !== id));
      message.success('公告已刪除');
    } catch {
      message.error('刪除失敗');
    }
  };

  const columns = [
    { title: '標題', dataIndex: 'title', key: 'title' },
    {
      title: '優先級',
      dataIndex: 'priority',
      key: 'priority',
      render: (v: string) => <Tag color={priorityColor[v]}>{priorityLabel[v]}</Tag>,
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <Tag color={statusColor[v]}>{statusLabel[v]}</Tag>,
    },
    { title: '發布日期', dataIndex: 'publish_date', key: 'publish_date', render: (v: string) => v || '—' },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, r: Announcement) => (
        <span className="flex gap-2">
          <Button type="link" size="small" onClick={() => { setViewing(r); setViewModal(true); }}>查看</Button>
          <Button type="link" size="small" onClick={() => openEdit(r)}>編輯</Button>
          <Popconfirm title="確定刪除？" onConfirm={() => handleDelete(r.id)} okText="刪除" cancelText="取消">
            <Button type="link" danger size="small">刪除</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="公告布告欄"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>新增公告</Button>}
      >
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </PageHeader>

      <Modal
        title={editing ? '編輯公告' : '新增公告'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="儲存"
        cancelText="取消"
        width={680}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="標題" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="content" label="內容" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="priority" label="優先級" rules={[{ required: true }]}>
              <Select options={[{ value: 'high', label: '高' }, { value: 'medium', label: '中' }, { value: 'urgent', label: '緊急' }]} />
            </Form.Item>
            <Form.Item name="status" label="狀態" rules={[{ required: true }]}>
              <Select options={[{ value: 'published', label: '已發佈' }, { value: 'draft', label: '草稿' }]} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="publish_date" label="發布日期"><Input type="date" /></Form.Item>
            <Form.Item name="expiry_date" label="過期日期"><Input type="date" /></Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal title="公告詳情" open={viewModal} onCancel={() => setViewModal(false)} footer={<Button onClick={() => setViewModal(false)}>關閉</Button>} width={680}>
        {viewing && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="標題">{viewing.title}</Descriptions.Item>
            <Descriptions.Item label="內容"><div style={{ whiteSpace: 'pre-wrap' }}>{viewing.content}</div></Descriptions.Item>
            <Descriptions.Item label="優先級"><Tag color={priorityColor[viewing.priority]}>{priorityLabel[viewing.priority]}</Tag></Descriptions.Item>
            <Descriptions.Item label="狀態"><Tag color={statusColor[viewing.status]}>{statusLabel[viewing.status]}</Tag></Descriptions.Item>
            <Descriptions.Item label="發布日期">{viewing.publish_date || '—'}</Descriptions.Item>
            <Descriptions.Item label="過期日期">{viewing.expiry_date || '—'}</Descriptions.Item>
            <Descriptions.Item label="作者">{viewing.author}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
}
