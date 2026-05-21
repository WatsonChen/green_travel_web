'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Tag, Select, Drawer, Button, Descriptions, Divider, App, Radio, Input, Popconfirm, Tooltip, Space } from 'antd';
import { FileTextOutlined, SearchOutlined, CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import { adminApi } from '../../lib/api';

interface OrderRow {
  id: string;
  order_no: string;
  itinerary_title: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  quantity: number;
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
  // 報名個資
  reg_id: string | null;
  id_number: string | null;
  birthday: string | null;
  gender: string | null;
  custom_field_data: Record<string, string> | null;
  reg_note: string | null;
  reg_status: string | null;
}

const orderStatusOptions = [
  { value: 'pending', label: '待確認' },
  { value: 'confirmed', label: '已確認' },
  { value: 'cancelled', label: '已取消' },
];

const paymentStatusOptions = [
  { value: 'unpaid', label: '未付款' },
  { value: 'paid', label: '已付款' },
];

const orderStatusColor: Record<string, string> = { pending: 'orange', confirmed: 'green', cancelled: 'red' };
const paymentStatusColor: Record<string, string> = { unpaid: 'red', paid: 'green' };

export default function OrdersPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [payFilter, setPayFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [itineraryFilter, setItineraryFilter] = useState<string>('all');
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<OrderRow | null>(null);

  useEffect(() => {
    adminApi.get('/orders/admin/all')
      .then(({ data: rows }) => setData(rows))
      .catch(() => message.error('載入失敗'))
      .finally(() => setLoading(false));
  }, []);

  const updateOrder = async (id: string, payload: Record<string, string>) => {
    try {
      const { data: updated } = await adminApi.patch(`/orders/admin/${id}`, payload);
      setData((prev) => prev.map((o) => o.id === id ? { ...o, ...updated } : o));
      if (selected?.id === id) setSelected((s) => s ? { ...s, ...updated } : s);
      message.success('已更新');
    } catch {
      message.error('更新失敗');
    }
  };

  const itineraryOptions = useMemo(() => {
    const titles = [...new Set(data.map((o) => o.itinerary_title).filter(Boolean))];
    return [{ value: 'all', label: '所有行程' }, ...titles.map((t) => ({ value: t, label: t }))];
  }, [data]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return data.filter((o) => {
      if (payFilter !== 'all' && o.payment_status !== payFilter) return false;
      if (itineraryFilter !== 'all' && o.itinerary_title !== itineraryFilter) return false;
      if (kw && !o.contact_name?.toLowerCase().includes(kw) && !o.contact_phone?.includes(kw)) return false;
      return true;
    });
  }, [data, payFilter, itineraryFilter, keyword]);

  const columns = [
    { title: '訂單編號', dataIndex: 'order_no', key: 'order_no', width: 160 },
    { title: '行程', dataIndex: 'itinerary_title', key: 'itinerary_title' },
    { title: '報名者', dataIndex: 'contact_name', key: 'contact_name' },
    { title: '電話', dataIndex: 'contact_phone', key: 'contact_phone' },
    {
      title: '人數 / 金額',
      key: 'qty_price',
      render: (_: unknown, r: OrderRow) =>
        `${r.quantity} 人 / NT$${Number(r.total_price).toLocaleString()}`,
    },
    {
      title: '付款狀態',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (v: string) => (
        <Tag color={paymentStatusColor[v]}>
          {paymentStatusOptions.find((o) => o.value === v)?.label}
        </Tag>
      ),
    },
    {
      title: (
        <Space size={4}>
          訂單狀態
          <Tooltip title="管理員手動更新的行政確認狀態，例如確認收到護照影本、完成座位安排後改為「已確認」">
            <QuestionCircleOutlined style={{ color: '#8c8c8c', cursor: 'help' }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (v: string, r: OrderRow) => (
        <Select
          value={v}
          size="small"
          options={orderStatusOptions}
          onChange={(val) => updateOrder(r.id, { status: val })}
          style={{ width: 90 }}
        />
      ),
    },
    {
      title: '日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string) => new Date(v).toLocaleDateString('zh-TW'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, r: OrderRow) => (
        <Button type="link" size="small" icon={<FileTextOutlined />} onClick={() => setSelected(r)}>
          詳情
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="報名 & 訂單管理">
        {/* 篩選列 */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Radio.Group
            value={payFilter}
            onChange={(e) => setPayFilter(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="all">全部（{data.length}）</Radio.Button>
            <Radio.Button value="unpaid">
              未付款（{data.filter((o) => o.payment_status === 'unpaid').length}）
            </Radio.Button>
            <Radio.Button value="paid">
              已付款（{data.filter((o) => o.payment_status === 'paid').length}）
            </Radio.Button>
          </Radio.Group>

          <Select
            value={itineraryFilter}
            onChange={setItineraryFilter}
            options={itineraryOptions}
            style={{ minWidth: 180 }}
            placeholder="篩選行程"
          />

          <Input
            placeholder="搜尋報名者姓名或電話"
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 20 }}
          rowClassName={(r) => r.payment_status === 'unpaid' ? 'bg-orange-50' : ''}
        />
      </PageHeader>

      {/* 詳情 Drawer */}
      <Drawer
        title={`訂單詳情 — ${selected?.order_no || ''}`}
        placement="right"
        width={480}
        open={!!selected}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <Descriptions title="訂單資訊" column={1} bordered size="small" className="mb-6">
              <Descriptions.Item label="行程">{selected.itinerary_title}</Descriptions.Item>
              <Descriptions.Item label="人數">{selected.quantity} 人</Descriptions.Item>
              <Descriptions.Item label="總金額">NT$ {Number(selected.total_price).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="付款狀態">
                <Space>
                  <Tag color={paymentStatusColor[selected.payment_status]}>
                    {paymentStatusOptions.find((o) => o.value === selected.payment_status)?.label}
                  </Tag>
                  {selected.payment_status === 'unpaid' && (
                    <Popconfirm
                      title="確認手動標記為已收款？"
                      description="適用於匯款或現金付款，請確認款項已實際入帳。"
                      onConfirm={() => updateOrder(selected.id, { payment_status: 'paid' })}
                      okText="確認收款"
                      cancelText="取消"
                    >
                      <Button size="small" type="dashed" icon={<CheckCircleOutlined />}>
                        確認收款
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="訂單狀態">
                <Select
                  value={selected.status}
                  size="small"
                  options={orderStatusOptions}
                  onChange={(val) => updateOrder(selected.id, { status: val })}
                  style={{ width: 120 }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="建立時間">
                {new Date(selected.created_at).toLocaleString('zh-TW')}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="報名者個資" column={1} bordered size="small">
              <Descriptions.Item label="姓名">{selected.contact_name || '—'}</Descriptions.Item>
              <Descriptions.Item label="電話">{selected.contact_phone || '—'}</Descriptions.Item>
              <Descriptions.Item label="Email">{selected.contact_email || '—'}</Descriptions.Item>
              <Descriptions.Item label="身分證字號">{selected.id_number || '—'}</Descriptions.Item>
              <Descriptions.Item label="生日">{selected.birthday || '—'}</Descriptions.Item>
              <Descriptions.Item label="性別">{selected.gender || '—'}</Descriptions.Item>
            </Descriptions>

            {selected.custom_field_data && Object.keys(selected.custom_field_data).length > 0 && (
              <>
                <Divider />
                <Descriptions title="自訂欄位" column={1} bordered size="small">
                  {Object.entries(selected.custom_field_data).map(([k, v]) => (
                    <Descriptions.Item key={k} label={k}>{v}</Descriptions.Item>
                  ))}
                </Descriptions>
              </>
            )}

            {selected.reg_note && (
              <>
                <Divider />
                <div className="text-sm text-gray-500"><strong>備註：</strong>{selected.reg_note}</div>
              </>
            )}
          </>
        )}
      </Drawer>
    </>
  );
}
