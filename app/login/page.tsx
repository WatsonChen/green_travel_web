'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, message } from 'antd';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: { email: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (values.email === 'admin@greentravel.com' && values.password === 'password') {
        router.push('/admin/members');
      } else {
        message.error('帳號或密碼錯誤，請重新輸入。');
      }
    }, 500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card title="Green Travel Admin Login" className="w-full max-w-md shadow-lg">
        <Form name="login" layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="電子郵件"
            name="email"
            rules={[{ required: true, message: '請輸入電子郵件' }]}
          >
            <Input placeholder="admin@greentravel.com" />
          </Form.Item>

          <Form.Item
            label="密碼"
            name="password"
            rules={[{ required: true, message: '請輸入密碼' }]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登入後台
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </main>
  );
}
