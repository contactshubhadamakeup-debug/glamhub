// components/search/search-page.tsx
import { useState } from 'react';

export function SearchPage() {
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/search/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    fetch('/api/search/cities')
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = `/api/search/professionals?category=${category}&city=${city}&page=1&limit=20`;
    const res = await fetch(url);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Search Professionals</h1>

      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <div className="animate-pulse bg-gray-200 rounded h-48 w-full mb-4" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.businessName}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-navy-900">
                {item.businessName}
              </h3>
              <p className="text-sm text-emerald-600 font-medium">
                {item.category}
              </p>
              <p className="text-sm text-gray-500">{item.city}</p>
              <a
                href={`/portfolio/${item.id}`}
                className="mt-3 block bg-emerald-600 text-white text-center px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
              >
                View Portfolio
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}