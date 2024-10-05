'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { createClient } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from '@/components/providers/toaster-provider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// import 'lobals.css'; // Make sure you have global styles to handle the blur effect

const supabase = createClient();

// Dynamic client-only import for the theme provider
const DynamicThemeProvider = dynamic(() => import("next-themes").then(mod => mod.ThemeProvider), { ssr: false });

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("Dialog open:", open); // Add this to check the open state
  }, [open]);
  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
      }

      if (!data.session) {
        setLoading(false);
        router.replace('/login');
      } else {
        setLoading(false);
      }
    }

    checkSession();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

function InstallPrompt() {
  const [isInstallPromptAvailable, setIsInstallPromptAvailable] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showIosInstallPrompt, setShowIosInstallPrompt] = useState(false);

  // Detect if device is on iOS
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  // Detect if device is in standalone mode
  const isInStandaloneMode = () => {
    return 'standalone' in window.navigator && (window.navigator as any).standalone;
  };

  useEffect(() => {
    // Check if the user has been prompted before
    const promptedBefore = localStorage.getItem('pwa-install-prompted');
    setHasPrompted(!!promptedBefore);

    // Handle Android's 'beforeinstallprompt' event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setIsInstallPromptAvailable(true);
      setOpen(true); // Open the modal when the prompt is available
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect if the device is iOS and not in standalone mode (to show the install prompt)
    if (isIos() && !isInStandaloneMode()) {
      setShowIosInstallPrompt(true);
      setOpen(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPromptEvent(null);
        localStorage.setItem('pwa-install-prompted', 'true');
        setIsInstallPromptAvailable(false);
        setOpen(false); // Close the modal after the user interacts with the prompt
      });
    }
  };

  return (
    <>
      {/* Blur and darken the background */}
      {open && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>}

      {/* Modal Content */}
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
        Install App
      </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
            Install the app to enjoy it on your device.
            </DialogDescription>
          </DialogHeader>

          {/* Android install button */}
          {isInstallPromptAvailable && (
            <Button onClick={handleInstallClick}>Install on your device</Button>
          )}

          {/* iOS install instructions */}
          {showIosInstallPrompt && (
            <p>
              To install this app on your iOS device, tap the share button
              <span role="img" aria-label="share icon"> ⎋ </span>
              and then "Add to Home Screen"
              <span role="img" aria-label="plus icon"> ➕ </span>.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ProtectedRoute>
        <DynamicThemeProvider attribute="class" defaultTheme="dark">
          <NextTopLoader />
          <ToastProvider />
          {/* Add InstallPrompt to show PWA installation instructions */}
          <InstallPrompt />
          {children}
        </DynamicThemeProvider>
      </ProtectedRoute>
    </SessionContextProvider>
  );
}
