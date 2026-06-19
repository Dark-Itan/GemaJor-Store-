'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { setToken } from '../../lib/auth';
import Toast from '../../components/Toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Login de Admin
    if (form.email === 'admin@test.com' && form.password === 'admin123') {
      const { ok, data } = await api('POST', '/auth/login', {
        userId: 'admin-123',
        role: 'admin',
      });
      if (ok && data?.token) {
        setToken(data.token, 'admin');
        setToast({ msg: 'Admin - Inicio de sesión exitoso', type: 'success' });
        setTimeout(() => router.push('/dashboard'), 1000);
      }
      return;
    }

    // Login de Cliente
    const custRes = await api('GET', `/customers?search=${form.email}`);
    const customer = custRes.data?.data?.[0];

    if (!customer) {
      setToast({ msg: 'Cliente no encontrado. Verifica tu email o regístrate.', type: 'error' });
      return;
    }

    const { ok, data } = await api('POST', '/auth/login', {
      userId: customer.id,
      role: 'customer',
    });

    if (ok && data?.token) {
      setToken(data.token, 'customer');
      setToast({ msg: 'Inicio de sesión exitoso', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 1000);
    } else {
      setToast({ msg: 'Error al iniciar sesión', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-black text-indigo-900 mb-1">Iniciar Sesión</h1>
        <p className="text-sm text-gray-400 mb-6">Accede a tu cuenta en GemaJor Store</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2.5 rounded-lg text-sm text-black"
            placeholder="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="relative">
            <input
              className="w-full border p-2.5 rounded-lg text-sm text-black pr-10"
              placeholder="Contraseña"
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? '🙈' : '🐵'}
            </button>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
            Ingresar
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">
          ¿No tienes cuenta? <Link href="/register" className="text-indigo-600 font-medium">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}