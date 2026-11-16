// components/pwa/install-prompt.tsx
import { useEffect, useState } from 'react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-navy-900">Install GlamHub</h3>
          <p className="text-sm text-gray-600">Install GlamHub as an app for faster access and offline use.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-700"
          >
            Install
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}