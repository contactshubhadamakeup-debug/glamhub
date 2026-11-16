// app/portfolio/[id]/page.tsx
import { PublicPortfolioDetail } from '@/components/portfolio/public-portfolio-detail';

export default function PublicPortfolioDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <PublicPortfolioDetail portfolioId={params.id} />;
}