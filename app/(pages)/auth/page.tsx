'use client';

import { useState } from 'react';
import { Tabs, Form, Input, Button, App, Divider } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../../context/UserAuthContext';

type Mode = 'login-email' | 'login-otp' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const { loginWithEmail, loginWithOtp, sendOtp, register } = useUserAuth();
  const [mode, setMode] = useState<Mode>('login-email');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    const phone = form.getFieldValue('phone');
    if (!phone) return message.error('請輸入手機號碼');
    try {
      await sendOtp(phone);
      setOtpSent(true);
      startCountdown();
      message.success('驗證碼已發送（測試模式請查看後端 console）');
    } catch {
      message.error('發送失敗，請稍後再試');
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    try {
      if (mode === 'login-email') {
        await loginWithEmail(values.email, values.password);
      } else if (mode === 'login-otp') {
        await loginWithOtp(values.phone, values.code);
      } else {
        await register({ name: values.name, email: values.email, password: values.password });
      }
      message.success('登入成功！');
      router.push('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '操作失敗';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Green Travel 會員</h1>

        <Tabs
          activeKey={mode}
          onChange={(k) => { setMode(k as Mode); form.resetFields(); setOtpSent(false); }}
          items={[
            { key: 'login-email', label: 'Email 登入' },
            { key: 'login-otp', label: '手機驗證碼' },
            { key: 'register', label: '註冊' },
          ]}
          centered
        />

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          {mode === 'register' && (
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '請輸入姓名' }]}>
              <Input prefix={<UserOutlined />} size="large" placeholder="真實姓名" />
            </Form.Item>
          )}

          {(mode === 'login-email' || mode === 'register') && (
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: '請輸入有效 Email' }]}>
              <Input prefix={<MailOutlined />} size="large" placeholder="your@email.com" />
            </Form.Item>
          )}

          {mode === 'login-otp' && (
            <Form.Item name="phone" label="手機號碼" rules={[{ required: true, message: '請輸入手機號碼' }]}>
              <Input
                prefix={<PhoneOutlined />}
                size="large"
                placeholder="09xxxxxxxx"
                addonAfter={
                  <Button
                    type="link"
                    size="small"
                    disabled={countdown > 0}
                    onClick={handleSendOtp}
                    style={{ padding: 0 }}
                  >
                    {countdown > 0 ? `${countdown}s` : '發送驗證碼'}
                  </Button>
                }
              />
            </Form.Item>
          )}

          {mode === 'login-otp' && otpSent && (
            <Form.Item name="code" label="驗證碼" rules={[{ required: true, message: '請輸入驗證碼' }]}>
              <Input size="large" placeholder="6 位數驗證碼" maxLength={6} />
            </Form.Item>
          )}

          {(mode === 'login-email' || mode === 'register') && (
            <Form.Item name="password" label="密碼" rules={[{ required: true, min: 6, message: '密碼至少 6 個字元' }]}>
              <Input.Password prefix={<LockOutlined />} size="large" placeholder="••••••" />
            </Form.Item>
          )}

          {mode === 'register' && (
            <Form.Item
              name="confirmPassword"
              label="確認密碼"
              dependencies={['password']}
              rules={[
                { required: true, message: '請再次輸入密碼' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('兩次密碼輸入不一致'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} size="large" placeholder="••••••" />
            </Form.Item>
          )}

          {mode === 'login-email' && (
            <div className="text-right mb-3">
              <Button type="link" size="small" onClick={() => router.push('/forgot-password')}>
                忘記密碼？
              </Button>
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            disabled={mode === 'login-otp' && !otpSent}
          >
            {mode === 'register' ? '立即註冊' : '登入'}
          </Button>
        </Form>

        <Divider />
        <p className="text-center text-gray-500 text-sm">
          長輩或需要協助？請電洽 <strong>02-xxxx-xxxx</strong> 由客服協助登入
        </p>
      </div>
    </div>
  );
}
