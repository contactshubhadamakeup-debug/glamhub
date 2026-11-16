// app/professional/quotes/page.tsx
import { QuotesTable } from '@/components/quotes/quotes-table';

export default function QuotesPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Quotes &amp; Invoices</h1>
      <QuotesTable />
    </div>
  );
}