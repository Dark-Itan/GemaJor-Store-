'use client';

import { useState } from 'react';

const API = 'http://localhost:3000/api/v1';

export default function Home() {
  const [tab, setTab] = useState<'customers' | 'products' | 'payments'>('customers');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  // Customers
  const [cust, setCust] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [login, setLogin] = useState({ userId: '', role: 'customer' });
  const [custId, setCustId] = useState('');

  // Products
  const [prod, setProd] = useState({ name: '', price: '', stock: '' });
  const [products, setProducts] = useState<any[]>([]);

  // Payments
  const [pay, setPay] = useState({ amount: '', currency: 'MXN', paymentMethod: 'card' });

  const call = async (method: string, path: string, body?: any) => {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    setStatus({ ok: res.ok, msg: res.ok ? '✅ Éxito' : `❌ ${data.message || 'Error inesperado'}` });
    return data;
  };

  const tabClass = (t: string) =>
    `flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
      tab === t ? 'bg-white text-indigo-700 shadow-md' : 'text-gray-400 hover:text-gray-600'
    }`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 md:p-8 font-sans">
      <header className="max-w-2xl mx-auto text-center mb-6">
        <h1 className="text-4xl font-black text-indigo-900 tracking-tight">GemaJor Store</h1>
        <p className="text-sm text-gray-400 mt-1">AWOS • Next.js + PostgreSQL</p>
        <div className="mt-4 flex gap-2 justify-center">
          <input
            className="text-xs border px-3 py-2 rounded-lg w-64 text-black"
            placeholder="Token JWT (para operaciones protegidas)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        {status && (
          <div className={`mt-2 text-sm font-medium ${status.ok ? 'text-emerald-600' : 'text-red-500'}`}>
            {status.msg}
          </div>
        )}
      </header>

      {/* TABS */}
      <nav className="max-w-md mx-auto flex gap-1 p-1.5 bg-gray-100 rounded-2xl mb-8">
        <button onClick={() => setTab('customers')} className={tabClass('customers')}>👤 Clientes</button>
        <button onClick={() => setTab('products')} className={tabClass('products')}>📦 Productos</button>
        <button onClick={() => setTab('payments')} className={tabClass('payments')}>💳 Pagos</button>
      </nav>

      {/* CUSTOMERS */}
      {tab === 'customers' && (
        <div className="max-w-lg mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-800 mb-4">🔐 Obtener Token</h2>
            <input className="w-full border p-2 rounded-lg text-sm mb-2 text-black" placeholder="User ID" value={login.userId} onChange={(e) => setLogin({ ...login, userId: e.target.value })} />
            <select className="w-full border p-2 rounded-lg text-sm mb-3 text-black" value={login.role} onChange={(e) => setLogin({ ...login, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={async () => { const d = await call('POST', '/auth/login', login); setToken(d.token); }} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700">Generar Token</button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-800 mb-4">📝 Registrar Cliente</h2>
            <input className="w-full border p-2 rounded-lg text-sm mb-2 text-black" placeholder="Nombre" value={cust.firstName} onChange={(e) => setCust({ ...cust, firstName: e.target.value })} />
            <input className="w-full border p-2 rounded-lg text-sm mb-2 text-black" placeholder="Apellido" value={cust.lastName} onChange={(e) => setCust({ ...cust, lastName: e.target.value })} />
            <input className="w-full border p-2 rounded-lg text-sm mb-2 text-black" placeholder="Email" value={cust.email} onChange={(e) => setCust({ ...cust, email: e.target.value })} />
            <input className="w-full border p-2 rounded-lg text-sm mb-2 text-black" placeholder="Teléfono" value={cust.phone} onChange={(e) => setCust({ ...cust, phone: e.target.value })} />
            <input className="w-full border p-2 rounded-lg text-sm mb-3 text-black" placeholder="Contraseña" type="password" value={cust.password} onChange={(e) => setCust({ ...cust, password: e.target.value })} />
            <button onClick={async () => { const d = await call('POST', '/customers', cust); if (d.id) setCustId(d.id); }} className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700">Crear Cliente</button>
            {custId && <p className="text-xs text-gray-400 mt-2">ID: {custId}</p>}
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {tab === 'products' && (
        <div className="max-w-lg mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-800 mb-4">➕ Agregar Producto (Admin)</h2>
            <input className="w-full border p-2 rounded-lg text-sm mb-2 text-black" placeholder="Nombre" value={prod.name} onChange={(e) => setProd({ ...prod, name: e.target.value })} />
            <input className="w-full border p-2 rounded-lg text-sm mb-2 text-black" placeholder="Precio" type="number" value={prod.price} onChange={(e) => setProd({ ...prod, price: e.target.value })} />
            <input className="w-full border p-2 rounded-lg text-sm mb-3 text-black" placeholder="Stock" type="number" value={prod.stock} onChange={(e) => setProd({ ...prod, stock: e.target.value })} />
            <button onClick={async () => { await call('POST', '/products', { name: prod.name, price: parseFloat(prod.price), stock: parseInt(prod.stock) }); }} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700">Crear Producto</button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-800 mb-4">📦 Productos Disponibles</h2>
            <button onClick={async () => { const d = await call('GET', '/products'); setProducts(d.data || []); }} className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 mb-3">Cargar Productos</button>
            {products.map((p: any) => (
              <div key={p.id} className="border-b py-2 text-sm text-gray-700 flex justify-between">
                <span>{p.name} - ${p.price}</span>
                <span className="text-gray-400">Stock: {p.stock}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAYMENTS */}
      {tab === 'payments' && (
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-indigo-800 mb-4">💳 Procesar Pago</h2>
          <input className="w-full border p-2 rounded-lg text-sm mb-2 text-black" placeholder="Monto" type="number" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} />
          <select className="w-full border p-2 rounded-lg text-sm mb-3 text-black" value={pay.paymentMethod} onChange={(e) => setPay({ ...pay, paymentMethod: e.target.value })}>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
            <option value="cash">Efectivo</option>
          </select>
          <button onClick={async () => { await call('POST', '/payments', { amount: parseFloat(pay.amount), currency: 'MXN', paymentMethod: pay.paymentMethod }); }} className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700">Pagar Ahora</button>
        </div>
      )}
    </main>
  );
}