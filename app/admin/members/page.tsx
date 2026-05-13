'use client';

import { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { Member } from '../data/mockData';
import { members } from '../data/mockData';

const MembersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form] = Form.useForm();

  const [tableData, setTableData] = useState<Member[]>(members);

  const handleEdit = (record: Member) => {
    setEditingMember(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record: Member) => {
    setTableData((prev) => prev.filter((item) => item.key !== record.key));
    message.success('會員已刪除');
  };

  const handleAdd = () => {
    setEditingMember(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingMember) {
          setTableData((prev) =>
            prev.map((item) => (item.key === editingMember.key ? { ...item, ...values } : item))
          );
          message.success('會員更新成功！');
        } else {
          const nextKey = `${Date.now()}`;
          setTableData((prev) => [
            ...prev,
            {
              key: nextKey,
              joinDate: new Date().toISOString().slice(0, 10),
              status: 'active',
              ...values,
            },
          ]);
          message.success('會員新增成功！');
        }
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch(() => {
        message.error('請填寫完整資料');
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '電子郵件', dataIndex: 'email', key: 'email' },
    { title: '電話', dataIndex: 'phone', key: 'phone' },
    { title: '加入日期', dataIndex: 'joinDate', key: 'joinDate' },
    { title: '狀態', dataIndex: 'status', key: 'status' },
  ];

  const actions = [
    { label: '編輯', onClick: handleEdit, type: 'link' as const },
    { label: '刪除', onClick: handleDelete, type: 'link' as const, danger: true },
  ];

  return (
    <>
      <PageHeader
        title="會員管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增會員
          </Button>
        }
      >
        <DataTable columns={columns} dataSource={tableData} actions={actions} />
      </PageHeader>

      <Modal
        title={editingMember ? '編輯會員' : '新增會員'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="確定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '請輸入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="電子郵件"
            rules={[{ required: true, type: 'email', message: '請輸入有效電子郵件' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="電話"
            rules={[{ required: true, message: '請輸入電話' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MembersPage;
