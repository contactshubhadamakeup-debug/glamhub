// app/professional/leads/page.tsx
import { LeadsTable } from '@/components/leads/leads-table';

export default function LeadsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Leads Pipeline</h1>
      <LeadsTable />
    </div>
  );
}