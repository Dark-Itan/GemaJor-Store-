'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-pulse ${
        type === 'success'
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}
    >
      {type === 'success' ? '✅' : '❌'} {message}
    </div>
  );
}