'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout, getRole } from '../lib/auth';
export default function Navbar() {
  const pathname = usePathname();
  const role = getRole();

  const linkClass = (path: string) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
      pathname === path
        ? 'bg-white text-indigo-700 shadow-sm'
        : 'text-gray-400 hover:text-white'
    }`;

  return (
    <nav className="bg-indigo-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-lg font-black tracking-tight">
          GemaJor Store
        </Link>
        <Link href="/dashboard/products" className={linkClass('/dashboard/products')}>
          📦 Productos
        </Link>
        <Link href="/dashboard/payments" className={linkClass('/dashboard/payments')}>
          💳 Pagos
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-indigo-300 bg-indigo-800 px-2 py-1 rounded-full">
          {role === 'admin' ? '👑 Admin' : '👤 Cliente'}
        </span>
        <button
          onClick={logout}
          className="text-sm text-red-300 hover:text-red-100 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}