"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase";

interface AdminContextType {
  token: string;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within admin layout");
  return ctx;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // One-time cleanup of the legacy raw-token key (pre auto-refresh era).
    if (localStorage.getItem("ak_admin_token")) {
      localStorage.removeItem("ak_admin_token");
    }

    const supabase = getSupabaseBrowser();
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const t = session?.access_token ?? null;
      setToken(t);
      setLoading(false);
      if (!t && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    });

    // Keep the token in sync as Supabase auto-refreshes it.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const t = session?.access_token ?? null;
      setToken(t);
      if (!t && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [pathname, router]);

  const logout = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    setToken(null);
    router.replace("/admin/login");
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
        <div className="text-primary animate-pulse">Loading...</div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!token) return null;

  const navItems = [
    { href: "/admin", label: "Orders", icon: "receipt_long" },
    { href: "/admin/products", label: "Products", icon: "inventory_2" },
    { href: "/admin/categories", label: "Categories", icon: "category" },
    { href: "/admin/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <AdminContext.Provider value={{ token, logout }}>
      <div className="min-h-screen bg-surface-container-low">
        <header className="bg-white border-b border-outline-variant/20 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-headline text-primary text-lg italic">
              Auric Krystals
            </Link>
            <span className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold bg-primary-fixed/40 px-2 py-0.5 rounded">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex">
          <aside className="hidden md:block w-56 border-r border-outline-variant/15 bg-white min-h-[calc(100vh-3.5rem)] p-4 sticky top-14 self-start">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href))
                      ? "bg-primary-fixed/50 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 p-4 sm:p-8 max-w-6xl">{children}</main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
