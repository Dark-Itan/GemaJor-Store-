'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from './lib/auth';
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <p className="text-indigo-600 font-medium">Redirigiendo...</p>
    </div>
  );
}