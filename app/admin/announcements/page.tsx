'use client';

import { useState } from 'react';
import { Button, Modal, Form, Input, Select, message, Descriptions, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { Announcement } from '../data/mockData';
import { announcements } from '../data/mockData';

const priorityConfig = {
  high: { color: 'red', label: '高' },
  medium: { color: 'orange', label: '中' },
  urgent: { color: 'volcano', label: '緊急' },
};

const statusConfig = {
  published: { color: 'green', label: '已發佈' },
  draft: { color: 'default', label: '草稿' },
};

const AnnouncementsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<Announcement[]>(announcements);

  const handleEdit = (record: Announcement) => {
    setEditingAnnouncement(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record: Announcement) => {
    setTableData((prev) => prev.filter((item) => item.key !== record.key));
    message.success('公告已刪除');
  };

  const handleView = (record: Announcement) => {
    setViewingAnnouncement(record);
    setIsViewModalOpen(true);
  };

  const handleAdd = () => {
    setEditingAnnouncement(null);
    form.resetFields();
    form.setFieldsValue({ status: 'draft', priority: 'medium' });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload: Announcement = {
          key: editingAnnouncement?.key || `${Date.now()}`,
          title: values.title,
          content: values.content,
          priority: values.priority,
          status: values.status,
          publishDate: values.publishDate,
          expiryDate: values.expiryDate,
          author: '系統管理員',
          createdAt: editingAnnouncement?.createdAt || new Date().toLocaleString('zh-TW'),
          updatedAt: new Date().toLocaleString('zh-TW'),
        };

        setTableData((prev) => {
          if (editingAnnouncement) {
            return prev.map((item) => (item.key === payload.key ? payload : item));
          }
          return [payload, ...prev];
        });

        setIsModalOpen(false);
        form.resetFields();
        message.success(editingAnnouncement ? '公告更新成功！' : '公告新增成功！');
      })
      .catch(() => {
        message.error('請填寫完整資料');
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setViewingAnnouncement(null);
  };

  const columns = [
    { title: '標題', dataIndex: 'title', key: 'title' },
    { title: '內容', dataIndex: 'content', key: 'content' },
    { title: '優先級', dataIndex: 'priority', key: 'priority' },
    { title: '狀態', dataIndex: 'status', key: 'status' },
    { title: '發布日期', dataIndex: 'publishDate', key: 'publishDate' },
  ];

  const actions = [
    { label: '查看', onClick: handleView, type: 'link' as const },
    { label: '編輯', onClick: handleEdit, type: 'link' as const },
    { label: '刪除', onClick: handleDelete, type: 'link' as const, danger: true },
  ];

  return (
    <>
      <PageHeader
        title="公告布告欄"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增公告
          </Button>
        }
      >
        <DataTable columns={columns} dataSource={tableData} actions={actions} />
      </PageHeader>

      <Modal
        title={editingAnnouncement ? '編輯公告' : '新增公告'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="確定"
        cancelText="取消"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="標題"
            rules={[{ required: true, message: '請輸入標題' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="內容"
            rules={[{ required: true, message: '請輸入內容' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="priority" label="優先級" rules={[{ required: true }]}> 
            <Select>
              <Select.Option value="high">高</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="urgent">緊急</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="狀態" rules={[{ required: true }]}> 
            <Select>
              <Select.Option value="published">已發佈</Select.Option>
              <Select.Option value="draft">草稿</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="publishDate" label="發布日期">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="expiryDate" label="過期日期">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="公告詳情"
        open={isViewModalOpen}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            關閉
          </Button>,
        ]}
        width={700}
      >
        {viewingAnnouncement && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="標題">{viewingAnnouncement.title}</Descriptions.Item>
            <Descriptions.Item label="內容">
              <div style={{ whiteSpace: 'pre-wrap' }}>{viewingAnnouncement.content}</div>
            </Descriptions.Item>
            <Descriptions.Item label="優先級">
              <Tag color={priorityConfig[viewingAnnouncement.priority].color}>
                {priorityConfig[viewingAnnouncement.priority].label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="狀態">
              <Tag color={statusConfig[viewingAnnouncement.status].color}>
                {statusConfig[viewingAnnouncement.status].label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="發布日期">{viewingAnnouncement.publishDate || '-'}</Descriptions.Item>
            <Descriptions.Item label="過期日期">{viewingAnnouncement.expiryDate || '-'}</Descriptions.Item>
            <Descriptions.Item label="作者">{viewingAnnouncement.author}</Descriptions.Item>
            <Descriptions.Item label="創建時間">{viewingAnnouncement.createdAt}</Descriptions.Item>
            <Descriptions.Item label="更新時間">{viewingAnnouncement.updatedAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default AnnouncementsPage;
