// components/onboarding/professional-form.tsx
import { useState } from 'react';

export function ProfessionalOnboardingForm() {
  const [form, setForm] = useState({
    businessName: '',
    category: '',
    city: '',
    bio: '',
    phone: '',
    website: '',
    instagramHandle: '',
  });

  return (
    <form className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-semibold text-navy-900 mb-4">Profile Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Instagram Handle</label>
          <input
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.instagramHandle}
            onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
          />
        </div>
      </div>
    </form>
  );
}