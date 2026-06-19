'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <p className="text-indigo-600 font-medium">Verificando sesión...</p>
      </div>
    );
  }

  return <>{children}</>;
}