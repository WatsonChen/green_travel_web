'use client';

import { Tag } from 'antd';
import type { ReactNode } from 'react';

interface StatusTagProps {
  status: string;
  config: Record<string, { color: string; label: string }>;
}

const StatusTag: React.FC<StatusTagProps> = ({ status, config }) => {
  const statusInfo = config[status] || { color: 'default', label: status };
  return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
};

export default StatusTag;
