// components/onboarding/portfolio-form.tsx
import { useState } from 'react';

export function PortfolioForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    price: '',
    durationMinutes: '',
    categoryId: '',
  });

  return (
    <form className="bg-white p-6 rounded-lg shadow border border-gray-200 mt-6">
      <h2 className="text-xl font-semibold text-navy-900 mb-4">Portfolio Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.durationMinutes}
            onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>
    </form>
  );
}