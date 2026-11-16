// app/professional/clients/page.tsx
import { ClientsTable } from '@/components/clients/clients-table';

export default function ClientsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">My Clients</h1>
      <ClientsTable />
    </div>
  );
}