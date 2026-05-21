'use client';

import React from 'react';
import { Card } from 'antd';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title?: string;
  extra?: ReactNode;
  children: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ extra, children }) => {
  return (
    <Card
      className="surface-card"
      bordered
      styles={{ header: extra ? undefined : { display: 'none' } }}
      extra={extra}
    >
      {children}
    </Card>
  );
};

export default PageHeader;
