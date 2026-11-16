// app/notifications/page.tsx
import { NotificationSettings } from '@/components/notifications/notification-settings';

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Notification Settings</h1>
      <NotificationSettings />
    </div>
  );
}