import { redirect } from 'next/navigation';

// 舊有 /login 路由改為導向後台登入頁
export default function OldLoginRedirect() {
  redirect('/admin/login');
}
