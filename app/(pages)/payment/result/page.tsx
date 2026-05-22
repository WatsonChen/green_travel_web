'use client';

import { useEffect, useState } from 'react';
import { Button, Result, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';

export default function PaymentResultPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // 等待後端 NotifyURL 處理完成後查詢最新訂單狀態
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get('/orders');
        const latestOrder = data[0];
        if (latestOrder?.payment_status === 'paid') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" tip="確認付款結果中..." />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Result
        status={status === 'success' ? 'success' : 'error'}
        title={status === 'success' ? '付款成功！' : '付款失敗'}
        subTitle={
          status === 'success'
            ? '您的報名已確認，請至「我的訂單」查看詳情。'
            : '付款未完成，請至「我的訂單」確認狀態或重新嘗試。'
        }
        extra={[
          <Button type="primary" key="profile" onClick={() => router.push('/profile')}>
            前往我的訂單
          </Button>,
          <Button key="home" onClick={() => router.push('/')}>
            回首頁
          </Button>,
        ]}
      />
    </div>
  );
}
