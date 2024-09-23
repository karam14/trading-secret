'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

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
    return <div>Loading...</div>; // Show a loading state while waiting for session to load
  }

  return <>{children}</>;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </SessionContextProvider>
  );
}
