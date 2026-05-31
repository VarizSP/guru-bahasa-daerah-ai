import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');

  .lg-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    color: #E8F0FF;
    position: relative;
    overflow: hidden;
    margin-top: -32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 16px 80px;
  }

  /* ── Animated mesh background ── */
  .lg-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: #050B14;
  }
  .lg-orb {
    position: absolute; border-radius: 50%;
    filter: blur(90px); opacity: 0.35;
    animation: lg-drift 18s ease-in-out infinite alternate;
  }
  .lg-orb-1 {
    width: 560px; height: 560px;
    background: radial-gradient(circle, #00C65E 0%, transparent 70%);
    top: -160px; left: -120px;
    animation-duration: 20s;
  }
  .lg-orb-2 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, #F59E0B 0%, transparent 70%);
    top: 80px; right: -100px;
    animation-duration: 15s; animation-delay: -5s;
  }
  .lg-orb-3 {
    width: 340px; height: 340px;
    background: radial-gradient(circle, #0EA5E9 0%, transparent 70%);
    bottom: 60px; left: 25%;
    animation-duration: 24s; animation-delay: -10s; opacity: 0.18;
  }
  .lg-orb-4 {
    width: 260px; height: 260px;
    background: radial-gradient(circle, #A855F7 0%, transparent 70%);
    bottom: 80px; right: 15%;
    animation-duration: 18s; animation-delay: -7s; opacity: 0.18;
  }
  @keyframes lg-drift {
    0%   { transform: translate(0, 0) scale(1); }
    50%  { transform: translate(30px, 20px) scale(1.05); }
    100% { transform: translate(-20px, 40px) scale(0.95); }
  }

  /* Subtle grid overlay */
  .lg-grid-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ── Content wrapper ── */
  .lg-content {
    position: relative; z-index: 10;
    width: 100%; max-width: 440px;
    display: flex; flex-direction: column; gap: 20px;
  }

  /* ── Header ── */
  .lg-header {
    text-align: center; margin-bottom: 8px;
    opacity: 0; transform: translateY(16px);
    animation: lg-fadeUp 0.55s ease forwards;
  }
  .lg-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
    color: #00C65E; margin-bottom: 14px;
    background: rgba(0,198,94,0.1); border: 1px solid rgba(0,198,94,0.25);
    padding: 5px 14px; border-radius: 20px;
  }
  .lg-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #00C65E; animation: lg-pulse 2s ease infinite;
  }
  @keyframes lg-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,198,94,0.6); }
    50%      { box-shadow: 0 0 0 5px rgba(0,198,94,0); }
  }
  .lg-title {
    font-family: 'Syne', sans-serif; font-size: 34px; font-weight: 800;
    line-height: 1.1; letter-spacing: -1px;
    background: linear-gradient(135deg, #fff 0%, rgba(232,240,255,0.6) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .lg-subtitle {
    margin-top: 8px; font-size: 14px;
    color: rgba(232,240,255,0.42); font-weight: 400;
  }

  /* ── Glass card ── */
  .lg-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-radius: 20px;
    padding: 28px 28px;
    opacity: 0; transform: translateY(20px);
    animation: lg-fadeUp 0.55s ease forwards;
  }
  .lg-card-d1 { animation-delay: 0.10s; }
  .lg-card-d2 { animation-delay: 0.20s; }

  .lg-card-title {
    font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px;
    color: rgba(232,240,255,0.38); margin-bottom: 18px;
    display: flex; align-items: center; gap: 8px;
  }
  .lg-card-dot {
    width: 6px; height: 6px; border-radius: 50%;
  }

  /* ── Form elements ── */
  .lg-form { display: flex; flex-direction: column; gap: 12px; }

  .lg-input {
    width: 100%; padding: 11px 16px; border-radius: 12px;
    font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
    color: #E8F0FF;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.10);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .lg-input::placeholder { color: rgba(232,240,255,0.28); }
  .lg-input:focus {
    border-color: rgba(0,198,94,0.45);
    box-shadow: 0 0 0 3px rgba(0,198,94,0.10);
  }

  /* ── Buttons ── */
  .lg-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 700;
    background: linear-gradient(135deg, #00C65E, #00A04E);
    color: #fff; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 24px rgba(0,198,94,0.30);
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    letter-spacing: 0.2px; width: 100%;
  }
  .lg-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 36px rgba(0,198,94,0.45);
  }
  .lg-btn-primary:active { transform: scale(0.98); }

  .lg-btn-secondary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 700;
    background: rgba(245,158,11,0.12);
    color: #F59E0B; border: 1px solid rgba(245,158,11,0.30); cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    letter-spacing: 0.2px; width: 100%;
  }
  .lg-btn-secondary:hover {
    transform: translateY(-2px);
    background: rgba(245,158,11,0.18);
    box-shadow: 0 8px 32px rgba(245,158,11,0.20);
  }
  .lg-btn-secondary:active { transform: scale(0.98); }

  /* ── Error box ── */
  .lg-error {
    background: rgba(239,68,68,0.10);
    border: 1px solid rgba(239,68,68,0.28);
    border-radius: 12px; padding: 12px 16px;
    font-size: 13px; color: #FCA5A5; margin-bottom: 4px;
    display: flex; align-items: center; gap: 8px;
  }

  /* ── Divider ── */
  .lg-divider {
    display: flex; align-items: center; gap: 12px; margin: 4px 0;
  }
  .lg-divider-line {
    flex: 1; height: 1px; background: rgba(255,255,255,0.07);
  }
  .lg-divider-text {
    font-size: 11px; font-weight: 600; color: rgba(232,240,255,0.25);
    text-transform: uppercase; letter-spacing: 1px;
  }

  /* ── Animations ── */
  @keyframes lg-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      redirect("/login?error=Supabase tidak terkonfigurasi. Cek environment variables.");
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
    redirect("/dashboard");
  }

  async function signupAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("full_name") ?? "Learner");
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      redirect("/login?error=Supabase tidak terkonfigurasi. Cek environment variables.");
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      redirect(`/login?error=${encodeURIComponent(error?.message ?? "Gagal daftar")}`);
    }
    await supabase.from("profiles").upsert({
      auth_user_id: data.user.id,
      full_name: fullName,
      role: "learner"
    });
    redirect("/dashboard");
  }

  return (
    <>
      <style>{loginStyles}</style>

      {/* Mesh background */}
      <div className="lg-bg">
        <div className="lg-orb lg-orb-1" />
        <div className="lg-orb lg-orb-2" />
        <div className="lg-orb lg-orb-3" />
        <div className="lg-orb lg-orb-4" />
      </div>
      <div className="lg-grid-overlay" />

      <div className="lg-root">
        <div className="lg-content">

          {/* ── Header ── */}
          <div className="lg-header">
            <div className="lg-badge">
              <span className="lg-badge-dot" />
              Nusantara AI Platform
            </div>
            <h1 className="lg-title">Masuk ke Platform</h1>
            <p className="lg-subtitle">
              Lanjutkan perjalananmu menguasai bahasa daerah Nusantara.
            </p>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="lg-error">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* ── Login Card ── */}
          <div className="lg-card lg-card-d1">
            <div className="lg-card-title">
              <span className="lg-card-dot" style={{ background: "#00C65E", boxShadow: "0 0 8px #00C65E" }} />
              Login
            </div>
            <form action={loginAction} className="lg-form">
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="lg-input"
                suppressHydrationWarning
              />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="lg-input"
                suppressHydrationWarning
              />
              <button type="submit" className="lg-btn-primary" suppressHydrationWarning>
                Masuk →
              </button>
            </form>
          </div>

          {/* ── Divider ── */}
          <div className="lg-divider">
            <div className="lg-divider-line" />
            <span className="lg-divider-text">atau</span>
            <div className="lg-divider-line" />
          </div>

          {/* ── Sign Up Card ── */}
          <div className="lg-card lg-card-d2">
            <div className="lg-card-title">
              <span className="lg-card-dot" style={{ background: "#F59E0B", boxShadow: "0 0 8px #F59E0B" }} />
              Buat Akun Baru
            </div>
            <form action={signupAction} className="lg-form">
              <input
                name="full_name"
                type="text"
                required
                placeholder="Nama Lengkap"
                className="lg-input"
                suppressHydrationWarning
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="lg-input"
                suppressHydrationWarning
              />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="lg-input"
                suppressHydrationWarning
              />
              <button type="submit" className="lg-btn-secondary" suppressHydrationWarning>
                Daftar Sekarang ✦
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
