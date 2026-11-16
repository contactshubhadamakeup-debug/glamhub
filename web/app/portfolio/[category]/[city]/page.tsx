// app/portfolio/[category]/[city]/page.tsx
import { PublicPortfoliosGrid } from '@/components/portfolio/public-portfolios-grid';

export default function PublicPortfoliosPage({
  params,
}: {
  params: { category: string; city: string };
}) {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">
        {params.category} Professionals in {params.city}
      </h1>
      <PublicPortfoliosGrid category={params.category} city={params.city} />
    </div>
  );
}