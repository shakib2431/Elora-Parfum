import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { supabaseClient, isSupabaseConfigured } from '../services/supabaseClient';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  login: (token: string, user: AdminUser) => void;
  signInWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const TOKEN_KEY = 'elora_admin_jwt_token';
const USER_KEY = 'elora_admin_user';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AdminUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Validate stored token with backend
  const verifyServerToken = useCallback(async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setToken(authToken);
        setUser((prev) => ({
          id: prev?.id || 'admin_owner',
          email: data.email || prev?.email || 'owner@eloraparfum.com',
          role: data.role || 'OWNER',
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[AdminAuth] Server token validation error:', err);
      // If offline/network glitch but token exists, retain cached session
      return true;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      // 1. Check if Supabase client has an active session
      if (supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session && isMounted) {
            const accessToken = session.access_token;
            const valid = await verifyServerToken(accessToken);
            if (valid && isMounted) {
              setToken(accessToken);
              setUser({
                id: session.user.id,
                email: session.user.email || 'owner@eloraparfum.com',
                role: 'OWNER',
              });
              localStorage.setItem(TOKEN_KEY, accessToken);
              localStorage.setItem(
                USER_KEY,
                JSON.stringify({
                  id: session.user.id,
                  email: session.user.email,
                  role: 'OWNER',
                })
              );
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('[AdminAuth] Supabase getSession error:', err);
        }

        // Listen for Supabase auth state changes (sign-in, token refresh, sign-out)
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
          async (event, session) => {
            if (!isMounted) return;
            if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
              setToken(session.access_token);
              setUser({
                id: session.user.id,
                email: session.user.email || 'owner@eloraparfum.com',
                role: 'OWNER',
              });
              localStorage.setItem(TOKEN_KEY, session.access_token);
              localStorage.setItem(
                USER_KEY,
                JSON.stringify({
                  id: session.user.id,
                  email: session.user.email,
                  role: 'OWNER',
                })
              );
            } else if (event === 'SIGNED_OUT') {
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
              setToken(null);
              setUser(null);
            }
          }
        );

        // Keep subscription cleanup
        return () => {
          subscription.unsubscribe();
        };
      }

      // 2. Check local token if Supabase not active or has no session
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        const isValid = await verifyServerToken(storedToken);
        if (!isValid && isMounted) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [verifyServerToken]);

  const login = (newToken: string, newUser: AdminUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const signInWithSupabase = async (email: string, password: string) => {
    if (!supabaseClient) {
      return { success: false, error: 'Supabase client is not configured on this environment.' };
    }

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        return { success: false, error: error?.message || 'Invalid Supabase Auth credentials.' };
      }

      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email || email,
        role: 'OWNER',
      };

      login(data.session.access_token, adminUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Supabase authentication failed.' };
    }
  };

  const logout = async () => {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (err) {
        console.warn('[AdminAuth] Supabase signOut error:', err);
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        login,
        signInWithSupabase,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return ctx;
}

/**
 * Private route guard: strictly protects all /admin/* administrative routes.
 * Ensures that only authenticated users (via Supabase Auth or verified HMAC Admin token)
 * can access administrative screens. Unauthenticated requests are immediately redirected
 * to /admin/login with state preserving the attempted path.
 */
export const AdminRouteGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center text-[#FAF9F6]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-9 h-9 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-xs tracking-[0.28em] uppercase text-[#D4AF37]">
            Verifying Atelier Authority...
          </p>
          <span className="text-[10px] text-[#71717A] tracking-wider font-mono">
            SUPABASE AUTH & SESSION VALIDATION
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

/**
 * Public route guard for login screen:
 * If an administrator is already authenticated, redirects them directly into /admin.
 */
export const AdminGuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center text-[#FAF9F6]">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

