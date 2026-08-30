import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseAuth(options?: {
  onAuthStateChange?: (event: string, session: any) => void;
}) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      options?.onAuthStateChange?.(event, session);
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    signInWithGoogle,
    signOut,
  };
}
