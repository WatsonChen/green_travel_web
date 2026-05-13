'use client';

import { useState } from 'react';
import { Button, Modal, Descriptions } from 'antd';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { Registration } from '../data/mockData';
import { registrations } from '../data/mockData';

const statusConfig = {
  pending: { color: 'orange', label: '待處理' },
  confirmed: { color: 'green', label: '已確認' },
  cancelled: { color: 'red', label: '已取消' },
};

const RegistrationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [tableData] = useState<Registration[]>(registrations);

  const handleViewDetails = (record: Registration) => {
    setSelectedRegistration(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
  };

  const columns = [
    { title: '行程', dataIndex: 'itinerary', key: 'itinerary' },
    { title: '報名者姓名', dataIndex: 'applicantName', key: 'applicantName' },
    { title: '電子郵件', dataIndex: 'email', key: 'email' },
    { title: '提交日期', dataIndex: 'submissionDate', key: 'submissionDate' },
    { title: '狀態', dataIndex: 'status', key: 'status' },
  ];

  const actions = [{ label: '查看詳情', onClick: handleViewDetails, type: 'link' as const }];

  return (
    <>
      <PageHeader title="報名表單管理">
        <DataTable columns={columns} dataSource={tableData} actions={actions} />
      </PageHeader>

      <Modal
        title="報名詳情"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            關閉
          </Button>,
        ]}
      >
        {selectedRegistration && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="行程">{selectedRegistration.itinerary}</Descriptions.Item>
            <Descriptions.Item label="報名者姓名">{selectedRegistration.applicantName}</Descriptions.Item>
            <Descriptions.Item label="電子郵件">{selectedRegistration.email}</Descriptions.Item>
            <Descriptions.Item label="提交日期">{selectedRegistration.submissionDate}</Descriptions.Item>
            <Descriptions.Item label="狀態">
              <span style={{ color: statusConfig[selectedRegistration.status].color }}>
                {statusConfig[selectedRegistration.status].label}
              </span>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default RegistrationsPage;
