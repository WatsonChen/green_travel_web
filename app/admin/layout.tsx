'use client';

import { useMemo, useState } from 'react';
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
} from '@ant-design/icons';
import { adminModules } from './lib/moduleConfig';

const { Header, Sider, Content } = Layout;

const iconMap: Record<string, React.ReactNode> = {
  TeamOutlined: <TeamOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  NotificationOutlined: <NotificationOutlined />,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(
    () =>
      adminModules.map((module) => ({
        key: module.path,
        icon: iconMap[module.icon] || <FileTextOutlined />,
        label: module.label,
      })),
    []
  );

  const activeKey = useMemo(() => {
    const exact = menuItems.find((item) => item.key === pathname);
    if (exact) return exact.key;
    const prefix = menuItems.find((item) => pathname?.startsWith(item.key));
    return prefix?.key || menuItems[0]?.key || '/admin/members';
  }, [menuItems, pathname]);

  const currentNav = menuItems.find((item) => item.key === activeKey);

  const handleLogout = () => {
    router.push('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'logout',
        label: '登出',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout className="notion-shell">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={256}
        collapsedWidth={92}
        className="notion-sider"
      >
        <div className="sider-brand">
          <Link href="/admin/members">
            <div className="brand-mark">GT</div>
          </Link>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title">Green Travel</span>
              <span className="brand-sub">Workspace</span>
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
          <Button type="text" icon={<PlusOutlined />} className="ghost-btn">
            {!collapsed ? '快速建立' : '新增'}
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
                items={[
                  { title: 'Green Travel' },
                  { title: currentNav?.label || '控制台' },
                ]}
              />
              <div className="crumb-title">{currentNav?.label || '控制台'}</div>
              <div className="crumb-sub">Workspace</div>
            </div>
          </div>
          <div className="header-right">
            <Input
              className="notion-search"
              placeholder="搜尋成員、行程或報名表單"
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
