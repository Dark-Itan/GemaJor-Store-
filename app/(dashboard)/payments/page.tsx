'use client';

import { useState } from 'react';
import { api } from '../../../lib/api';
import { getRole } from '../../../lib/auth';
import Toast from '../../../components/Toast';

export default function PaymentsPage() {
  const role = getRole();
  const [payments, setPayments] = useState<any[]>([]);
  const [form, setForm] = useState({ amount: '', paymentMethod: 'card' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const loadPayments = async () => {
    const { ok, data } = await api('GET', '/payments?page=1&limit=20');
    if (ok) setPayments(data.data || []);
  };

  const createPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ok, data } = await api('POST', '/payments', {
      amount: parseFloat(form.amount),
      currency: 'MXN',
      paymentMethod: form.paymentMethod,
    });
    setToast({ msg: ok ? 'Pago procesado exitosamente' : data?.message || 'Error', type: ok ? 'success' : 'error' });
    if (ok) { setForm({ amount: '', paymentMethod: 'card' }); loadPayments(); }
  };

  const approvePayment = async (id: string) => {
    await api('PATCH', `/payments/${id}`, { status: 'approved' });
    loadPayments();
  };

  const rejectPayment = async (id: string) => {
    await api('PATCH', `/payments/${id}`, { status: 'rejected' });
    loadPayments();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-indigo-800 mb-4">💳 Procesar Pago</h2>
        <form onSubmit={createPayment} className="flex gap-3">
          <input className="flex-1 border p-2 rounded-lg text-sm text-black" placeholder="Monto" type="number" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <select className="border p-2 rounded-lg text-sm text-black" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
            <option value="cash">Efectivo</option>
          </select>
          <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700">Pagar</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-indigo-800">📋 Historial de Pagos</h2>
          <button onClick={loadPayments} className="text-sm bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">Cargar</button>
        </div>
        {payments.map((p: any) => (
          <div key={p.id} className="border-b py-3 flex justify-between items-center text-sm text-gray-700">
            <div>
              <span className="font-medium">${p.amount}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{p.status}</span>
            </div>
            {role === 'admin' && p.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => approvePayment(p.id)} className="text-emerald-600 hover:text-emerald-800 text-xs font-bold">Aprobar</button>
                <button onClick={() => rejectPayment(p.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Rechazar</button>
              </div>
            )}
          </div>
        ))}
        {payments.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay pagos registrados.</p>}
      </div>
    </div>
  );
}