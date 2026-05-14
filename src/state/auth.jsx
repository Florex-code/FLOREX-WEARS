import React from "react";
import { supabase } from "../lib/supabase";

const AuthCtx = React.createContext(null);

const ADMIN_EMAILS = ["florexstudio.ng@gmail.com", "atelier@avenoir.ng"];

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const isAdmin = ADMIN_EMAILS.includes(user?.email);

  return (
    <AuthCtx.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
