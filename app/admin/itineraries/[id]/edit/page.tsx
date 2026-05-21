'use client';

import { useState, useEffect } from 'react';
import {
  Button, Form, Input, InputNumber, DatePicker, Switch, Select, Radio, App, Space, Card, Spin,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { adminApi } from '../../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import RichTextEditor from '../../../../components/RichTextEditor';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type CustomFieldType = 'text' | 'select' | 'radio';

interface CustomField {
  label: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[];
}

export default function EditItineraryPage() {
  const { message } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form] = Form.useForm();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.get(`/itineraries/admin/all`)
      .then(({ data }) => {
        const it = (data as Record<string, unknown>[]).find((r) => r.id === id);
        if (!it) { message.error('找不到此行程'); return; }

        const start = it.start_date ? dayjs(it.start_date as string) : null;
        const end = it.end_date ? dayjs(it.end_date as string) : null;

        const tags = (it.tags as string[]) || [];
        const regionType = tags.includes('國內') ? 'domestic' : tags.includes('國外') ? 'international' : undefined;

        form.setFieldsValue({
          title: it.title,
          destination: it.destination,
          region_type: regionType,
          description: it.description,
          dateRange: start && end ? [start, end] : undefined,
          price: it.price,
          max_seats: it.max_seats,
          waitlist_enabled: it.waitlist_enabled,
          waitlist_limit: it.waitlist_limit,
          venue: it.venue,
          notification_email: it.notification_email,
          confirmation_message: it.confirmation_message,
          status: it.status,
        });

        if (it.custom_fields) {
          setCustomFields(it.custom_fields as CustomField[]);
        }
        if (it.cover_image) {
          setCoverImage(it.cover_image as string);
        }
      })
      .catch(() => message.error('載入失敗'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange || [];
      setSaving(true);

      await adminApi.put(`/itineraries/${id}`, {
        title: values.title,
        destination: values.destination,
        description: values.description,
        start_date: startDate?.format('YYYY-MM-DD'),
        end_date: endDate?.format('YYYY-MM-DD'),
        price: values.price,
        max_seats: values.max_seats,
        waitlist_enabled: values.waitlist_enabled || false,
        waitlist_limit: values.waitlist_enabled ? (values.waitlist_limit || null) : null,
        venue: values.venue,
        notification_email: values.notification_email,
        confirmation_message: values.confirmation_message,
        status: values.status,
        tags: [values.region_type === 'domestic' ? '國內' : '國外'],
        custom_fields: customFields,
        cover_image: coverImage || undefined,
      });

      message.success('行程已更新');
      router.push('/admin/itineraries');
    } catch (err) {
      if ((err as { errorFields?: unknown[] })?.errorFields) return;
      message.error('儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  const addField = () => setCustomFields([...customFields, { label: '', type: 'text', required: false }]);
  const updateField = (idx: number, patch: Partial<CustomField>) =>
    setCustomFields(customFields.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  const removeField = (idx: number) => setCustomFields(customFields.filter((_, i) => i !== idx));

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen"><Spin size="large" /></div>
  );

  return (
    <PageHeader title="編輯行程">
      <div className="max-w-2xl space-y-6">
        {/* 基本資料 */}
        <Card title="活動設定">
          <Form form={form} layout="vertical">
            <Form.Item name="title" label="行程名稱" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="region_type" label="旅遊類型" rules={[{ required: true, message: '請選擇旅遊類型' }]}>
              <Radio.Group>
                <Radio value="domestic">國內旅遊</Radio>
                <Radio value="international">國外旅遊</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="destination" label="旅遊地區" rules={[{ required: true }]}>
              <Input placeholder="例：澎湖、台灣 / 重慶、中國" />
            </Form.Item>
            <Form.Item name="dateRange" label="活動日期" rules={[{ required: true }]}>
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="price" label="報名費用（NT$）" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={(v) => `NT$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => Number(v?.replace(/NT\$\s?|(,*)/g, '') || 0) as unknown as 0}
              />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="max_seats" label="名額上限" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="waitlist_enabled" label="開放候補" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </div>

            <Form.Item noStyle dependencies={['waitlist_enabled']}>
              {({ getFieldValue }) =>
                getFieldValue('waitlist_enabled') ? (
                  <Form.Item name="waitlist_limit" label="候補人數上限" extra="留空表示無上限">
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="例：10" />
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            <Form.Item name="venue" label="集合地點">
              <Input placeholder="例：台北車站一號出口（選填）" />
            </Form.Item>
            <Form.Item name="description" label="行程說明" rules={[{ required: true }]}>
              <RichTextEditor minHeight={200} />
            </Form.Item>
            <Form.Item name="notification_email" label="通知 Email">
              <Input />
            </Form.Item>
            <Form.Item name="confirmation_message" label="報名完成提示訊息">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="status" label="狀態">
              <Select options={[
                { value: 'draft', label: '草稿' },
                { value: 'published', label: '上架' },
                { value: 'closed', label: '已結束' },
              ]} />
            </Form.Item>
          </Form>
        </Card>

        {/* 自訂報名欄位 */}
        <Card
          title="自訂報名欄位"
          extra={<Button size="small" icon={<PlusOutlined />} onClick={addField}>新增欄位</Button>}
        >
          {customFields.length === 0 && (
            <div className="text-gray-400 text-sm text-center py-4">尚無自訂欄位</div>
          )}
          {customFields.map((field, idx) => (
            <Card
              key={idx}
              size="small"
              className="mb-3"
              extra={
                <Button danger type="text" size="small" icon={<MinusCircleOutlined />} onClick={() => removeField(idx)} />
              }
            >
              <Space direction="vertical" className="w-full">
                <Input
                  placeholder="欄位名稱（例：餐食選擇）"
                  value={field.label}
                  onChange={(e) => updateField(idx, { label: e.target.value })}
                />
                <div className="flex gap-3">
                  <Select
                    value={field.type}
                    onChange={(v) => updateField(idx, { type: v })}
                    options={[
                      { value: 'text', label: '文字輸入' },
                      { value: 'select', label: '下拉選單' },
                      { value: 'radio', label: '單選' },
                    ]}
                    style={{ flex: 1 }}
                  />
                  <Select
                    value={field.required ? 'required' : 'optional'}
                    onChange={(v) => updateField(idx, { required: v === 'required' })}
                    options={[
                      { value: 'required', label: '必填' },
                      { value: 'optional', label: '選填' },
                    ]}
                    style={{ width: 100 }}
                  />
                </div>
                {(field.type === 'select' || field.type === 'radio') && (
                  <Input
                    placeholder="選項（用逗號分隔，例：葷食,素食）"
                    value={field.options?.join(',') || ''}
                    onChange={(e) => updateField(idx, { options: e.target.value.split(',').map((s) => s.trim()) })}
                  />
                )}
              </Space>
            </Card>
          ))}
        </Card>

        {/* 封面圖片 */}
        <Card title="封面圖片">
          <Input
            placeholder="圖片網址"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            prefix={<UploadOutlined />}
          />
          {coverImage && (
            <img src={coverImage} alt="preview" className="mt-4 rounded-lg max-h-48 object-cover w-full" />
          )}
        </Card>

        <div className="flex justify-between">
          <Button onClick={() => router.push('/admin/itineraries')}>取消</Button>
          <Button type="primary" loading={saving} onClick={handleSave}>儲存變更</Button>
        </div>
      </div>
    </PageHeader>
  );
}
