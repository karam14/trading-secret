'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { createClient } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from '@/components/providers/toaster-provider';

const supabase = createClient();

// Dynamic client-only import for the theme provider
const DynamicThemeProvider = dynamic(() => import("next-themes").then(mod => mod.ThemeProvider), { ssr: false });

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ProtectedRoute>
        <DynamicThemeProvider attribute="class" defaultTheme="dark">
          <NextTopLoader />
          <ToastProvider />
          {children}
        </DynamicThemeProvider>
      </ProtectedRoute>
    </SessionContextProvider>
  );
}
