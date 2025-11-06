import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isOnline, setupNetworkListeners } from '@/utils/pwa';

const OfflineIndicator: React.FC = () => {
  const [online, setOnline] = useState(isOnline());
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);

  useEffect(() => {
    // Setup network listeners
    const cleanup = setupNetworkListeners(
      () => {
        setOnline(true);
        setShowOfflineAlert(false);
        setShowOnlineAlert(true);
        
        // Hide online alert after 3 seconds
        setTimeout(() => {
          setShowOnlineAlert(false);
        }, 3000);
      },
      () => {
        setOnline(false);
        setShowOnlineAlert(false);
        setShowOfflineAlert(true);
      }
    );

    return cleanup;
  }, []);

  // Persistent offline indicator
  if (!online && !showOfflineAlert) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white py-2 px-4 text-center text-sm font-medium shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>You're offline - Some features may be limited</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Offline Alert */}
      {showOfflineAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
          <Alert className="bg-yellow-500 text-white border-0 shadow-2xl max-w-md">
            <WifiOff className="w-5 h-5" />
            <AlertDescription className="ml-2">
              <strong>You're offline</strong>
              <p className="text-sm mt-1">Don't worry! You can still browse previously loaded content.</p>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Back Online Alert */}
      {showOnlineAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
          <Alert className="bg-green-500 text-white border-0 shadow-2xl max-w-md">
            <Wifi className="w-5 h-5" />
            <AlertDescription className="ml-2">
              <strong>You're back online!</strong>
              <p className="text-sm mt-1">All features are now available.</p>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default OfflineIndicator;
