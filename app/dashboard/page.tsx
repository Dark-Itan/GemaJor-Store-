'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '../lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const role = getRole();
    if (role === 'admin') {
      router.replace('/dashboard/products');
    } else if (role === 'customer') {
      router.replace('/dashboard/payments');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin text-3xl mb-3">⚙️</div>
        <p className="text-gray-400 font-medium">Cargando tu panel...</p>
      </div>
    </div>
  );
}
