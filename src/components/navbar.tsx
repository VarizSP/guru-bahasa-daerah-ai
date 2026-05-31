import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const baseNavItems = [
  { href: "/", label: "Beranda" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/buku-saku", label: "Buku Saku" },
  { href: "/profile", label: "Profile" }
] as const;

export async function Navbar() {
  const supabase = await createSupabaseServerClient();
  
  let role = "guest";
  let user = null;

  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    user = authData.user;
    
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      role = profile?.role ?? "learner";
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050B14]/80 backdrop-blur-md">
      <div className="app-container flex items-center justify-between py-4">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-500 flex items-center gap-2">
          🌺 Guru Bahasa Daerah AI
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          {baseNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-slate-300 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
          <Link href="/contributor" className="text-slate-300 hover:text-white transition-colors">
            Contributor
          </Link>
          <Link href="/admin" className="text-slate-300 hover:text-white transition-colors">
            Admin
          </Link>
          {user ? (
            <form action="/auth/signout" method="post" suppressHydrationWarning>
              <button type="submit" className="rounded-lg border border-white/10 px-4 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-all" suppressHydrationWarning>
                Logout
              </button>
            </form>
          ) : (
            <Link href="/login" className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-all">
              Login
            </Link>
          )}
          <span className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            {role}
          </span>
        </nav>
      </div>
    </header>
  );
}
