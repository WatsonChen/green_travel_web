'use client';

import { useState } from 'react';
import { Steps, Button, Form, Input, InputNumber, DatePicker, Switch, Select, App, Space, Card } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../lib/api';
import PageHeader from '../../components/PageHeader';
import RichTextEditor from '../../../components/RichTextEditor';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type CustomFieldType = 'text' | 'select' | 'radio';

interface CustomField {
  label: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[];
}

// ─── Step 1: 活動設定 ─────────────────────────────────────────
function StepActivity({ form }: { form: ReturnType<typeof Form.useForm>[0] }) {
  return (
    <div className="max-w-2xl">
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="行程名稱" rules={[{ required: true, message: '請輸入行程名稱' }]}>
          <Input size="large" placeholder="例：長江三峽行攬月八日遊" />
        </Form.Item>

        <Form.Item name="destination" label="目的地" rules={[{ required: true }]}>
          <Input placeholder="例：重慶、中國" />
        </Form.Item>

        <Form.Item name="dateRange" label="活動日期" rules={[{ required: true, message: '請選擇日期' }]}>
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="price" label="報名費用（NT$）" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} formatter={(v) => `NT$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="max_seats" label="名額上限" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="waitlist_enabled" label="開放候補" valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </div>

        <Form.Item name="venue" label="活動地點">
          <Input placeholder="地址（選填）" />
        </Form.Item>

        <Form.Item name="description" label="行程說明" rules={[{ required: true }]}>
          <RichTextEditor placeholder="詳細介紹活動內容、行程安排等資訊..." minHeight={200} />
        </Form.Item>

        <Form.Item name="notification_email" label="通知 Email（報名成功時通知此信箱）">
          <Input placeholder="admin@greentravel.com" />
        </Form.Item>

        <Form.Item name="confirmation_message" label="報名完成提示訊息">
          <TextArea rows={3} placeholder="例：感謝您的報名！我們將於 3 個工作天內與您確認行程細節。" />
        </Form.Item>
      </Form>
    </div>
  );
}

// ─── Step 2: 報名表格 ─────────────────────────────────────────
function StepForm({ customFields, setCustomFields }: {
  customFields: CustomField[];
  setCustomFields: (f: CustomField[]) => void;
}) {
  const fixedFields = [
    { label: '姓名', required: true },
    { label: 'Email', required: false },
    { label: '生日', required: true },
    { label: '行動電話', required: true },
    { label: '身分證字號', required: true },
    { label: '性別', required: true },
  ];

  const addField = () => {
    setCustomFields([...customFields, { label: '', type: 'text', required: false }]);
  };

  const updateField = (idx: number, patch: Partial<CustomField>) => {
    setCustomFields(customFields.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  };

  const removeField = (idx: number) => {
    setCustomFields(customFields.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-2xl">
      <Card title="固定欄位（必填，不可修改）" className="mb-6">
        {fixedFields.map((f) => (
          <div key={f.label} className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">{f.label}</span>
            <span className="text-sm text-gray-500">{f.required ? '必填' : '選填'}</span>
          </div>
        ))}
      </Card>

      <Card
        title="自訂欄位"
        extra={
          <Button size="small" icon={<PlusOutlined />} onClick={addField}>
            新增欄位
          </Button>
        }
      >
        {customFields.length === 0 && (
          <div className="text-gray-400 text-sm text-center py-4">尚無自訂欄位，點擊右上角新增</div>
        )}
        {customFields.map((field, idx) => (
          <Card
            key={idx}
            size="small"
            className="mb-3"
            extra={
              <Button
                danger
                type="text"
                size="small"
                icon={<MinusCircleOutlined />}
                onClick={() => removeField(idx)}
              />
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
                  placeholder="選項（用逗號分隔，例：葷食,素食,海鮮）"
                  value={field.options?.join(',') || ''}
                  onChange={(e) => updateField(idx, { options: e.target.value.split(',').map((s) => s.trim()) })}
                />
              )}
            </Space>
          </Card>
        ))}
      </Card>
    </div>
  );
}

// ─── Step 3: 補充資訊 ─────────────────────────────────────────
function StepExtra({ coverImage, setCoverImage }: {
  coverImage: string;
  setCoverImage: (url: string) => void;
}) {
  return (
    <div className="max-w-2xl">
      <Card title="封面圖片">
        <p className="text-sm text-gray-500 mb-4">
          上傳行程封面圖片（建議寬度 850px 以上，PNG/JPG，1MB 以內）
        </p>
        {/* TODO: 接真實圖片上傳服務（S3 / Cloudinary），目前先用 URL 輸入 */}
        <Input
          placeholder="圖片網址（暫時先輸入 URL，之後接圖片上傳服務）"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          prefix={<UploadOutlined />}
        />
        {coverImage && (
          <img src={coverImage} alt="preview" className="mt-4 rounded-lg max-h-48 object-cover w-full" />
        )}
      </Card>
    </div>
  );
}

// ─── Step 4: 設定完成 ─────────────────────────────────────────
function StepDone({ summary }: { summary: Record<string, unknown> }) {
  return (
    <div className="max-w-2xl">
      <Card title="行程建立完成！">
        <div className="space-y-2">
          <div><span className="text-gray-500">行程名稱：</span><strong>{summary.title as string}</strong></div>
          <div><span className="text-gray-500">目的地：</span>{summary.destination as string}</div>
          <div><span className="text-gray-500">費用：</span>NT$ {Number(summary.price).toLocaleString()}</div>
          <div><span className="text-gray-500">名額：</span>{summary.max_seats as number} 人</div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
          行程已儲存為草稿，可在行程列表中將其設為「上架」狀態使其對外顯示。
        </div>
      </Card>
    </div>
  );
}

// ─── 主元件 ───────────────────────────────────────────────────
export default function NewItineraryPage() {
  const { message } = App.useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const stepsConfig = [
    { title: '活動設定', description: '名稱、日期、費用' },
    { title: '報名表格', description: '欄位設定' },
    { title: '補充資訊', description: '封面圖片' },
    { title: '設定完成', description: '' },
  ];

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        const values = await form.validateFields();
        const [startDate, endDate] = values.dateRange || [];
        setSubmitting(true);

        const payload = {
          title: values.title,
          destination: values.destination,
          description: values.description,
          start_date: startDate?.format('YYYY-MM-DD'),
          end_date: endDate?.format('YYYY-MM-DD'),
          price: values.price,
          max_seats: values.max_seats,
          waitlist_enabled: values.waitlist_enabled || false,
          venue: values.venue,
          notification_email: values.notification_email,
          confirmation_message: values.confirmation_message,
        };

        if (createdId) {
          await adminApi.put(`/itineraries/${createdId}`, payload);
        } else {
          const { data } = await adminApi.post('/itineraries', payload);
          setCreatedId(data.id);
        }
        setCurrentStep(1);
      } catch (err) {
        if ((err as { errorFields?: unknown[] })?.errorFields) return;
        message.error('儲存失敗，請確認後端已啟動');
      } finally {
        setSubmitting(false);
      }
    } else if (currentStep === 1) {
      if (createdId) {
        await adminApi.put(`/itineraries/${createdId}`, { custom_fields: customFields });
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (createdId && coverImage) {
        await adminApi.put(`/itineraries/${createdId}`, { cover_image: coverImage });
      }
      setCurrentStep(3);
    }
  };

  const handlePublish = async () => {
    if (createdId) {
      await adminApi.put(`/itineraries/${createdId}`, { status: 'published' });
      message.success('行程已上架！');
    }
    router.push('/admin/itineraries');
  };

  const formValues = form.getFieldsValue();

  return (
    <PageHeader title="新增行程">
      <Steps current={currentStep} items={stepsConfig} className="mb-8" />

      <div className="min-h-100">
        {currentStep === 0 && <StepActivity form={form} />}
        {currentStep === 1 && <StepForm customFields={customFields} setCustomFields={setCustomFields} />}
        {currentStep === 2 && <StepExtra coverImage={coverImage} setCoverImage={setCoverImage} />}
        {currentStep === 3 && <StepDone summary={{ ...formValues, price: formValues.price, max_seats: formValues.max_seats }} />}
      </div>

      <div className="flex justify-between mt-8">
        <Button disabled={currentStep === 0} onClick={() => setCurrentStep(currentStep - 1)}>
          上一步
        </Button>
        <Space>
          {currentStep < 3 ? (
            <Button type="primary" onClick={handleNext} loading={submitting}>
              {currentStep === 2 ? '完成設定' : '下一步（儲存）'}
            </Button>
          ) : (
            <>
              <Button onClick={() => router.push('/admin/itineraries')}>儲存草稿</Button>
              <Button type="primary" onClick={handlePublish}>立即上架</Button>
            </>
          )}
        </Space>
      </div>
    </PageHeader>
  );
}
