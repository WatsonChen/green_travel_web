'use client';

import { useState } from 'react';
import { Form, Input, Button, App } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const { message } = App.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      router.replace('/admin');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '帳號或密碼錯誤';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-gray-800">GT</div>
          <div className="text-sm text-gray-500 mt-1">Green Travel 管理後台</div>
        </div>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="email" label="管理員帳號" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} size="large" placeholder="admin@greentravel.com" />
          </Form.Item>
          <Form.Item name="password" label="密碼" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} size="large" placeholder="••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            登入
          </Button>
        </Form>
      </div>
    </div>
  );
}
