// components/portfolio/public-portfolio-detail.tsx
import { useState, useEffect } from 'react';

export function PublicPortfolioDetail({
  portfolioId,
}: {
  portfolioId: string;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/portfolios/${portfolioId}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse bg-gray-200 rounded h-64 w-full mb-4" />
        <div className="animate-pulse bg-gray-200 rounded h-4 w-1/3 mb-4" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <p className="text-red-600">Portfolio not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.professional.businessName}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">
            {data.professional.businessName}
          </h1>
          <p className="text-emerald-600 font-semibold">
            {data.professional.category} · {data.professional.city}
          </p>
          <div className="flex items-center mt-4">
            <span className="text-yellow-500 text-2xl">★</span>
            <span className="text-xl text-gray-700 ml-2">
              {data.professional.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              ({data.professional.totalReviews} reviews)
            </span>
          </div>
          <p className="mt-4 text-gray-700">{data.professional.bio || ''}</p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-3">
              Services
            </h3>
            <ul className="space-y-2">
              {data.professional.services.map(
                (s: any) => (
                  <li key={s.id} className="flex justify-between">
                    <span className="text-gray-700">{s.name}</span>
                    <span className="text-emerald-600 font-medium">
                      ₹{s.price}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="mt-6">
            <a
              href={`/enquiry/${data.professional.id}`}
              className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 text-lg font-medium"
            >
              Send Enquiry
            </a>
          </div>
        </div>
      </div>

      {data.reviews && data.reviews.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">
            Reviews
          </h2>
          <div className="space-y-4">
            {data.reviews.map((r: any) => (
              <div
                key={r.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-700">
                    {r.client.name}
                  </span>
                  <div className="text-yellow-500 text-lg">
                    {'★'.repeat(r.review.rating)}
                  </div>
                </div>
                <p className="text-gray-700">{r.review.comment}</p>
                {r.review.replies && r.review.replies.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-sm text-emerald-700 font-medium">
                      {r.review.businessName}:
                    </p>
                    <p className="text-sm text-gray-600">
                      {r.review.replies[0].reply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}