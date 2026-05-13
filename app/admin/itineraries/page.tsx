'use client';

import { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { Itinerary } from '../data/mockData';
import { itineraries } from '../data/mockData';

const ItinerariesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<Itinerary[]>(itineraries);

  const handleEdit = (record: Itinerary) => {
    setEditingItinerary(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record: Itinerary) => {
    setTableData((prev) => prev.filter((item) => item.key !== record.key));
    message.success('行程已刪除');
  };

  const handleAdd = () => {
    setEditingItinerary(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload: Itinerary = {
          key: editingItinerary?.key || `${Date.now()}`,
          title: values.title,
          destination: values.destination,
          startDate: values.startDate,
          endDate: values.endDate,
          price: Number(values.price),
        };

        setTableData((prev) => {
          if (editingItinerary) {
            return prev.map((item) => (item.key === payload.key ? payload : item));
          }
          return [payload, ...prev];
        });

        setIsModalOpen(false);
        form.resetFields();
        message.success(editingItinerary ? '行程更新成功！' : '行程新增成功！');
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
    { title: '標題', dataIndex: 'title', key: 'title' },
    { title: '目的地', dataIndex: 'destination', key: 'destination' },
    { title: '開始日期', dataIndex: 'startDate', key: 'startDate' },
    { title: '結束日期', dataIndex: 'endDate', key: 'endDate' },
    { title: '價格 ($)', dataIndex: 'price', key: 'price' },
  ];

  const actions = [
    { label: '編輯', onClick: handleEdit, type: 'link' as const },
    { label: '刪除', onClick: handleDelete, type: 'link' as const, danger: true },
  ];

  return (
    <>
      <PageHeader
        title="行程上架管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增行程
          </Button>
        }
      >
        <DataTable columns={columns} dataSource={tableData} actions={actions} />
      </PageHeader>

      <Modal
        title={editingItinerary ? '編輯行程' : '新增行程'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="確定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="行程標題"
            rules={[{ required: true, message: '請輸入行程標題！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="destination"
            label="目的地"
            rules={[{ required: true, message: '請輸入目的地！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="開始日期"
            rules={[{ required: true, message: '請輸入開始日期！' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="結束日期"
            rules={[{ required: true, message: '請輸入結束日期！' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="price"
            label="價格"
            rules={[{ required: true, message: '請輸入價格！' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ItinerariesPage;
