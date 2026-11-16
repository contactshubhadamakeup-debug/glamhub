// components/analytics/analytics-dashboard.tsx
import { useState, useEffect } from 'react';

interface BookingTrend {
  date: string;
  count: number;
}

interface RevenueByService {
  service: string;
  revenue: number;
}

export function AnalyticsDashboard() {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ai/analytics/insights')
      .then((res) => res.json())
      .then((data) => {
        setInsights(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded h-24" />
          ))}
        </div>
        <div className="mt-6 animate-pulse bg-gray-200 rounded h-64" />
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <p className="text-red-600">Unable to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold text-navy-900">{insights.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-navy-900">₹{insights.totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Client Retention</p>
          <p className="text-2xl font-bold text-navy-900">{insights.clientRetentionRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Lead Conversion</p>
          <p className="text-2xl font-bold text-navy-900">{insights.leadConversionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Booking Trends (Last 7 Days)</h3>
          <div className="h-64 flex items-end gap-2">
            {insights.bookingTrends.map((t: BookingTrend) => (
              <div
                key={t.date}
                className="flex-1 flex flex-col items-center"
                style={{ height: `${(t.count / 10) * 100}%` }}
              >
                <span className="w-full bg-emerald-600 rounded-t mt-2" />
                <span className="text-xs text-gray-500 mt-1">{t.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Revenue by Service</h3>
          <ul className="space-y-3">
            {insights.revenueByService.map((r: RevenueByService) => (
              <li key={r.service} className="flex justify-between">
                <span className="text-gray-700">{r.service}</span>
                <span className="font-medium text-emerald-600">₹{r.revenue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}