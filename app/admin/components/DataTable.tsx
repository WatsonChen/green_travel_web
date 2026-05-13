'use client';

import { Table, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Action<T> {
  label: string;
  onClick: (record: T) => void;
  danger?: boolean;
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed';
}

interface DataTableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  actions?: Action<T>[];
}

function DataTable<T extends { key: string }>({
  columns,
  dataSource,
  loading = false,
  actions,
}: DataTableProps<T>) {
  const columnsWithActions: ColumnsType<T> = actions
    ? [
        ...columns,
        {
          title: '操作',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  type={action.type || 'link'}
                  danger={action.danger}
                  onClick={() => action.onClick(record)}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          ),
        },
      ]
    : columns;

  return <Table columns={columnsWithActions} dataSource={dataSource} loading={loading} />;
}

export default DataTable;
