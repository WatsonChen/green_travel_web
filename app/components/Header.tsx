'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { label: <Link href="/">首頁</Link>, key: 'home' },
    { label: <Link href="/?category=domestic">國內旅遊</Link>, key: 'domestic' },
    { label: <Link href="/?category=international">國外旅遊</Link>, key: 'international' },
    { label: <Link href="/about">關於我們</Link>, key: 'about' },
    { label: <Link href="#">聯絡我們</Link>, key: 'contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <img className="h-8 w-auto" src="/logo.png" alt="Logo" />
            </Link>
            <span className="ml-2 text-xl font-bold text-gray-800">Green Travel</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <Menu 
              mode="horizontal" 
              items={menuItems} 
              className="border-none min-w-[400px] justify-end"
              style={{ background: 'transparent', borderBottom: 'none' }}
              theme="light"
            />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button type="primary">登入後台</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/login">
              <Button type="primary" size="small">
                後台
              </Button>
            </Link>
            <Button type="text" icon={<MenuOutlined />} onClick={showDrawer} />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer title="選單" placement="right" onClose={onClose} open={open}>
        <Menu 
          mode="vertical" 
          items={menuItems} 
          className="border-none"
          onClick={onClose}
        />
      </Drawer>
    </header>
  );
};

export default Header;
