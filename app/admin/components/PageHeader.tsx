'use client';

import React from 'react';
import { Card } from 'antd';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, extra, children }) => {
  return (
    <Card className="surface-card" title={title} extra={extra} bordered>
      {children}
    </Card>
  );
};

export default PageHeader;
