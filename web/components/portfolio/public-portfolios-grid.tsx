// components/portfolio/public-portfolios-grid.tsx
import { useState, useEffect } from 'react';

interface PortfolioItem {
  id: string;
  businessName: string;
  category: string;
  city: string;
  rating: number;
  totalReviews: number;
  imageUrl?: string;
}

export function PublicPortfoliosGrid({
  category,
  city,
}: {
  category: string;
  city: string;
}) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `/api/search/professionals?category=${category}&city=${city}&page=1&limit=20`,
    )
      .then((res) => res.json())
      .then((data) => {
        setItems(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, city]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="animate-pulse bg-gray-200 rounded h-48 w-full mb-4" />
        <div className="animate-pulse bg-gray-200 rounded h-48 w-1/2 mb-4" />
        <div className="animate-pulse bg-gray-200 rounded h-48 w-1/2 mb-4" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition"
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
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-700 ml-1">
                  {item.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  ({item.totalReviews} reviews)
                </span>
              </div>
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