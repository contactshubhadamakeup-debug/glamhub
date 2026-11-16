// app/professional/bookings/page.tsx
import { BookingsCalendar } from '@/components/bookings/bookings-calendar';

export default function BookingsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Bookings</h1>
      <BookingsCalendar />
    </div>
  );
}