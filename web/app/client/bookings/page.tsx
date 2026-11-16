// app/client/bookings/page.tsx
import { ClientBookings } from '@/components/bookings/client-bookings';

export default function ClientBookingsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">My Bookings</h1>
      <ClientBookings />
    </div>
  );
}