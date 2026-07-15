import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler as any);

    // Also show after some time if user is engaged (nice UX)
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        // Optional: show a soft prompt in settings instead
      }
    }, 45000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as any);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted install');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const dismiss = () => {
    setIsVisible(false);
    // Don't show again this session
    sessionStorage.setItem('kronos-pwa-dismissed', 'true');
  };

  if (isInstalled || !isVisible || sessionStorage.getItem('kronos-pwa-dismissed')) {
    return null;
  }

  return (
    <div className="pwa-install-banner">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="font-semibold text-sm">Install Kronos Tracker</div>
          <div className="text-xs text-[var(--text-muted)]">Get the full premium experience on your desktop or phone</div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={dismiss} className="!px-3 !py-1.5 text-xs">
            <X size={14} />
          </Button>
          <Button variant="primary" onClick={handleInstall} className="!px-4 !py-1.5 text-xs flex items-center gap-1.5">
            <Download size={14} /> Install
          </Button>
        </div>
      </div>
    </div>
  );
};