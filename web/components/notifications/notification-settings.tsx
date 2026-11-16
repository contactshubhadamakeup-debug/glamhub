// components/notifications/notification-settings.tsx
import { useState } from 'react';

export function NotificationSettings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsAppEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailNotifications: emailEnabled, whatsappNotifications: whatsappEnabled }),
      });
      if (res.ok) {
        alert('Notification preferences saved');
      }
    } catch {
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-navy-900 mb-6">Notification Preferences</h3>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive booking confirmations, enquiry alerts, and payment reminders by email.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">WhatsApp Notifications</h4>
            <p className="text-sm text-gray-500">Receive instant updates via WhatsApp. You can opt out anytime.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={whatsappEnabled}
              onChange={(e) => setWhatsAppEnabled(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Test mode:</strong> Notifications are currently in test mode (logged, not actually sent). Real notifications require owner approval and live API keys.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}