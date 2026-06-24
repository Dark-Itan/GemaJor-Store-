'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { getRole } from '../../lib/auth';
import Toast from '../../components/Toast';

function ProductItem({ p, role, onEdit, onDelete }: { p: any; role: string | null; onEdit: (p: any) => void; onDelete: (id: string) => void }) {
  const [qty, setQty] = useState(1);
  const total = (p.price * qty).toFixed(2);

  return (
    <div className="border-b py-3 flex justify-between items-center text-sm text-gray-700">
      <div>
        <span className="font-medium">{p.name}</span>
        <span className="text-gray-400 ml-2">${p.price} c/u</span>
        <span className="text-gray-300 ml-2">| Stock: {p.stock}</span>
      </div>
      {role === 'admin' ? (
        <div className="flex items-center gap-3">
          <button onClick={() => onEdit(p)} className="text-blue-500 hover:text-blue-700 text-xs font-bold">Editar</button>
          <button onClick={() => onDelete(p.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Eliminar</button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={p.stock}
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
            className="w-16 border rounded-lg text-center text-sm text-black py-1"
          />
          <span className="text-xs text-gray-500 font-medium">Total: ${total}</span>
          <a
            href={`/dashboard/payments?product=${encodeURIComponent(p.name)}&price=${total}&qty=${qty}`}
            className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            🛒 Comprar
          </a>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const role = getRole();
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [editing, setEditing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const { ok, data } = await api('GET', '/products');
    if (ok) setProducts(data.data || []);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: form.name, price: parseFloat(form.price), stock: parseInt(form.stock) };
    const { ok, data } = editing
      ? await api('PATCH', `/products/${editing}`, payload)
      : await api('POST', '/products', payload);
    setToast({ msg: ok ? (editing ? 'Producto actualizado' : 'Producto creado') : data?.message || 'Error', type: ok ? 'success' : 'error' });
    if (ok) { setForm({ name: '', price: '', stock: '' }); setEditing(null); loadProducts(); }
  };

  const editProduct = (p: any) => {
    setForm({ name: p.name, price: p.price.toString(), stock: p.stock.toString() });
    setEditing(p.id);
  };

  const deleteProduct = async (id: string) => {
    await api('DELETE', `/products/${id}`);
    loadProducts();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {role === 'admin' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-indigo-800 mb-4">{editing ? '✏️ Editar Producto' : '➕ Agregar Producto'}</h2>
          <form onSubmit={saveProduct} className="grid grid-cols-3 gap-3">
            <input className="border p-2 rounded-lg text-sm text-black" placeholder="Nombre" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="border p-2 rounded-lg text-sm text-black" placeholder="Precio" type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="border p-2 rounded-lg text-sm text-black" placeholder="Stock" type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <button type="submit" className="col-span-3 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700">{editing ? 'Actualizar' : 'Crear Producto'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', price: '', stock: '' }); }} className="col-span-3 text-sm text-gray-500">Cancelar edición</button>}
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-indigo-800 mb-4">📦 Productos</h2>
        {products.map((p) => (
          <ProductItem key={p.id} p={p} role={role} onEdit={editProduct} onDelete={deleteProduct} />
        ))}
        {products.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay productos.</p>}
      </div>
    </div>
  );
}