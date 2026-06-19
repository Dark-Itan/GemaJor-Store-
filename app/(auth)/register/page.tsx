'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import Toast from '../../components/Toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ok, data } = await api('POST', '/customers', form);
    if (ok) {
      setToast({ msg: 'Registro exitoso. Redirigiendo al inicio de sesión...', type: 'success' });
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setToast({ msg: data?.message || 'Error al registrarse', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-black text-indigo-900 mb-1">Crear Cuenta</h1>
        <p className="text-sm text-gray-400 mb-6">Regístrate en GemaJor Store</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border p-2.5 rounded-lg text-sm text-black" placeholder="Nombre" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <input className="w-full border p-2.5 rounded-lg text-sm text-black" placeholder="Apellido" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <input className="w-full border p-2.5 rounded-lg text-sm text-black" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full border p-2.5 rounded-lg text-sm text-black" placeholder="Teléfono (opcional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="w-full border p-2.5 rounded-lg text-sm text-black" placeholder="Contraseña" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-colors">Crear Cuenta</button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">
          ¿Ya tienes cuenta? <Link href="/login" className="text-indigo-600 font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}