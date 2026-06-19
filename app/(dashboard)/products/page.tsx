'use client';

import { useState } from 'react';
import { api } from '../../../lib/api';
import Toast from '../../../components/Toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const loadProducts = async () => {
    const { ok, data } = await api('GET', '/products');
    if (ok) setProducts(data.data || []);
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ok, data } = await api('POST', '/products', {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    });
    setToast({ msg: ok ? 'Producto creado exitosamente' : data?.message || 'Error', type: ok ? 'success' : 'error' });
    if (ok) { setForm({ name: '', price: '', stock: '' }); loadProducts(); }
  };

  const deleteProduct = async (id: string) => {
    const { ok } = await api('DELETE', `/products/${id}`);
    if (ok) loadProducts();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-indigo-800 mb-4">➕ Agregar Producto</h2>
        <form onSubmit={createProduct} className="grid grid-cols-3 gap-3">
          <input className="border p-2 rounded-lg text-sm text-black" placeholder="Nombre" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border p-2 rounded-lg text-sm text-black" placeholder="Precio" type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="border p-2 rounded-lg text-sm text-black" placeholder="Stock" type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <button type="submit" className="col-span-3 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700">Crear Producto</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-indigo-800">📦 Productos</h2>
          <button onClick={loadProducts} className="text-sm bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">Cargar</button>
        </div>
        {products.map((p: any) => (
          <div key={p.id} className="border-b py-3 flex justify-between items-center text-sm text-gray-700">
            <div>
              <span className="font-medium">{p.name}</span>
              <span className="text-gray-400 ml-2">${p.price}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Stock: {p.stock}</span>
              <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Eliminar</button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay productos. Carga la lista.</p>}
      </div>
    </div>
  );
}