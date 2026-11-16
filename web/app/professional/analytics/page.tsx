// app/professional/analytics/page.tsx
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Business Insights</h1>
      <AnalyticsDashboard />
    </div>
  );
}