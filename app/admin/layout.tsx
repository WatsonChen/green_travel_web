'use client';

import { useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Input,
  Breadcrumb,
  Spin,
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SearchOutlined,
  PlusOutlined,
  ShoppingOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { AdminAuthProvider, useAdminAuth } from '../context/AdminAuthContext';
import { adminModules } from './lib/moduleConfig';

const { Header, Sider, Content } = Layout;

const iconMap: Record<string, React.ReactNode> = {
  TeamOutlined: <TeamOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  NotificationOutlined: <NotificationOutlined />,
  ShoppingOutlined: <ShoppingOutlined />,
  DollarOutlined: <DollarOutlined />,
};

// 預先計算 menuItems（非 hook，放在元件外避免每次 render 重建）
const menuItems = adminModules.map((module) => ({
  key: module.path,
  icon: iconMap[module.icon] || <FileTextOutlined />,
  label: module.label,
}));

function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, loading, logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  // 所有 hooks 必須在任何條件式 return 之前呼叫
  const activeKey = useMemo(() => {
    const exact = menuItems.find((item) => item.key === pathname);
    if (exact) return exact.key;
    const prefix = menuItems.find((item) => pathname?.startsWith(item.key));
    return prefix?.key || menuItems[0]?.key || '/admin/members';
  }, [pathname]);

  const currentNav = useMemo(
    () => menuItems.find((item) => item.key === activeKey),
    [activeKey]
  );

  useEffect(() => {
    if (!loading && !admin && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [admin, loading, isLoginPage, router]);

  // 登入頁不需要側邊欄 Shell
  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!admin) return null;

  const userMenu = {
    items: [
      {
        key: 'logout',
        label: '登出',
        icon: <LogoutOutlined />,
        onClick: () => { logout(); router.push('/admin/login'); },
      },
    ],
  };

  return (
    <Layout className="notion-shell">
      <Sider trigger={null} collapsible collapsed={collapsed} width={256} collapsedWidth={92} className="notion-sider">
        <div className="sider-brand">
          <Link href="/admin/members">
            <div className="brand-mark">GT</div>
          </Link>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title">Green Travel</span>
              <span className="brand-sub">後台管理</span>
            </div>
          )}
        </div>
        <Menu
          className="notion-menu"
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={({ key }) => router.push(key)}
          items={menuItems}
        />
        <div className="sider-footer">
          <Button
            type="text"
            icon={<PlusOutlined />}
            className="ghost-btn"
            onClick={() => router.push('/admin/itineraries/new')}
          >
            {!collapsed ? '新增行程' : '新增'}
          </Button>
        </div>
      </Sider>

      <Layout className="notion-main">
        <Header className="notion-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <div className="crumb-group">
              <Breadcrumb
                className="crumb-trail"
                separator=">"
                items={[{ title: 'Green Travel' }, { title: currentNav?.label || '控制台' }]}
              />
              <div className="crumb-title">{currentNav?.label || '控制台'}</div>
              <div className="crumb-sub">管理後台</div>
            </div>
          </div>
          <div className="header-right">
            <Input
              className="notion-search"
              placeholder="搜尋會員、行程或訂單"
              prefix={<SearchOutlined style={{ color: '#98a0a8' }} />}
              allowClear
              size="large"
            />
            <Dropdown menu={userMenu} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </div>
        </Header>

        <Content className="notion-content">
          <div className="notion-page">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
