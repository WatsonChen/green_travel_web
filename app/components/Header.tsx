'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Button, Drawer, Avatar, Dropdown } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../context/UserAuthContext';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUserAuth();
  const router = useRouter();

  const menuItems = [
    { label: <Link href="/">首頁</Link>, key: 'home' },
    { label: <Link href="/?category=domestic">國內旅遊</Link>, key: 'domestic' },
    { label: <Link href="/?category=international">國外旅遊</Link>, key: 'international' },
    { label: <Link href="/about">關於我們</Link>, key: 'about' },
    { label: <Link href="#">聯絡我們</Link>, key: 'contact' },
  ];

  const userDropdown = {
    items: [
      {
        key: 'profile',
        label: '個人資料 & 訂單',
        icon: <OrderedListOutlined />,
        onClick: () => router.push('/profile'),
      },
      {
        key: 'logout',
        label: '登出',
        icon: <LogoutOutlined />,
        onClick: () => { logout(); router.push('/'); },
      },
    ],
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center">
            <Link href="/">
              <span className="text-xl font-bold text-gray-800">Green Travel</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <Menu
              mode="horizontal"
              items={menuItems}
              className="border-none min-w-100 justify-end"
              style={{ background: 'transparent', borderBottom: 'none' }}
            />
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Dropdown menu={userDropdown} placement="bottomRight">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar icon={<UserOutlined />} />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
              </Dropdown>
            ) : (
              <>
                <Link href="/auth">
                  <Button>登入</Button>
                </Link>
                <Link href="/auth">
                  <Button type="primary">免費註冊</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <Avatar icon={<UserOutlined />} onClick={() => router.push('/profile')} style={{ cursor: 'pointer' }} />
            ) : (
              <Link href="/auth">
                <Button type="primary" size="small">登入</Button>
              </Link>
            )}
            <Button type="text" icon={<MenuOutlined />} onClick={() => setOpen(true)} />
          </div>
        </div>
      </div>

      <Drawer title="選單" placement="right" onClose={() => setOpen(false)} open={open}>
        <Menu mode="vertical" items={menuItems} className="border-none" onClick={() => setOpen(false)} />
      </Drawer>
    </header>
  );
};

export default Header;
