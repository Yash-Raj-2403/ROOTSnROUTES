import React, { useState, useEffect } from 'react';
import { X, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { showInstallPrompt, canInstall } from '@/utils/pwa';

const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if can show install prompt
    const checkInstallable = () => {
      const installable = canInstall();
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const installedBefore = localStorage.getItem('pwa-installed');

      if (installable && !dismissed && !installedBefore) {
        // Show prompt after 30 seconds
        setTimeout(() => {
          setShowPrompt(true);
        }, 30000);
      }
    };

    checkInstallable();

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = () => {
      checkInstallable();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
      
      // Show success message briefly
      setTimeout(() => {
        setIsInstalled(false);
      }, 5000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const accepted = await showInstallPrompt();

      if (accepted) {
        console.log('✅ User accepted the install prompt');
        localStorage.setItem('pwa-installed', 'true');
        setIsInstalled(true);
        setTimeout(() => {
          setShowPrompt(false);
        }, 2000);
      } else {
        console.log('❌ User dismissed the install prompt');
        setIsInstalling(false);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isInstalled) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">App Installed!</p>
              <p className="text-sm text-white/90">Find ROOTSnROUTES on your home screen</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="bg-gradient-to-br from-primary to-accent text-white shadow-2xl border-0">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌄</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Install ROOTSnROUTES</h3>
                <p className="text-sm text-white/90">Get quick access anytime</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 -mt-2 -mr-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-4 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span>Works offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span>Instant loading</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span>Home screen shortcut</span>
            </div>
          </div>

          <Button
            onClick={handleInstall}
            disabled={isInstalling}
            className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
          >
            {isInstalling ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2"></div>
                Installing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Install App
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
