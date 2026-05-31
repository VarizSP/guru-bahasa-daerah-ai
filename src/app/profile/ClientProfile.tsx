"use client";
import { useState } from "react";

interface Profile {
  name?: string;
  email?: string;
  native_language?: string;
  target_language?: string;
  badges?: string[];
  streak?: number;
  total_phrases?: number;
  total_sessions?: number;
}

interface ClientProfileProps {
  profile: Profile;
}

const NATIVE_LANGUAGES = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "English" },
  { value: "ms", label: "Melayu" },
  { value: "su", label: "Sunda" },
  { value: "jv", label: "Jawa (Ngoko)" },
];

const TARGET_LANGUAGES = [
  { value: "jv-krama", label: "Jawa (Krama)" },
  { value: "jv-ngoko", label: "Jawa (Ngoko)" },
  { value: "su", label: "Sunda" },
  { value: "ban", label: "Bali" },
  { value: "mad", label: "Madura" },
  { value: "min", label: "Minangkabau" },
  { value: "bug", label: "Bugis" },
];

function getBadgeEmoji(badge: string): string {
  const lower = badge.toLowerCase();
  if (lower.includes("streak") || lower.includes("konsisten")) return "🔥";
  if (lower.includes("first") || lower.includes("pertama")) return "🌱";
  if (lower.includes("100") || lower.includes("ratus")) return "💯";
  if (lower.includes("master") || lower.includes("ahli")) return "🏆";
  if (lower.includes("vocab") || lower.includes("kosa")) return "📚";
  if (lower.includes("speed") || lower.includes("cepat")) return "⚡";
  return "🎖️";
}

function StatCard({ value, label, icon }: { value: number | string; label: string; icon: string; }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function BadgeChip({ badge }: { badge: string }) {
  return (
    <span className="badge-chip">
      <span className="badge-emoji">{getBadgeEmoji(badge)}</span>
      {badge}
    </span>
  );
}

export default function ClientProfile({ profile }: ClientProfileProps) {
  const badges = profile.badges ?? [];

  const [nativeLang, setNativeLang] = useState(
    profile.native_language ?? "id"
  );
  const [targetLang, setTargetLang] = useState(
    profile.target_language ?? "jv-krama"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const nativeLabel =
    NATIVE_LANGUAGES.find((l) => l.value === nativeLang)?.label ?? nativeLang;
  const targetLabel =
    TARGET_LANGUAGES.find((l) => l.value === targetLang)?.label ?? targetLang;

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          native_language: nativeLang,
          target_language: targetLang,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  const hasChanges =
    nativeLang !== (profile.native_language ?? "id") ||
    targetLang !== (profile.target_language ?? "jv-krama");

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    
    .pr-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: transparent;
      min-height: 100vh;
      color: #E8F0FF;
      position: relative;
      margin-top: -32px;
      padding-top: 32px;
    }
    
    /* ── Mesh background ── */
    .pr-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: #050B14; }
    .pr-orb {
      position: absolute; border-radius: 50%;
      filter: blur(100px); opacity: 0.38;
      animation: prOrb 22s ease-in-out infinite alternate;
    }
    .po1 { width:580px;height:580px; background:radial-gradient(circle,#A855F7 0%,transparent 70%); top:-160px;left:-140px; animation-duration:26s; }
    .po2 { width:460px;height:460px; background:radial-gradient(circle,#00C65E 0%,transparent 70%); top:-60px;right:-80px; animation-duration:20s;animation-delay:-8s; }
    .po3 { width:380px;height:380px; background:radial-gradient(circle,#0EA5E9 0%,transparent 70%); bottom:160px;left:30%; animation-duration:30s;animation-delay:-14s;opacity:.22; }
    
    @keyframes prOrb {
      0%   { transform:translate(0,0) scale(1); }
      50%  { transform:translate(22px,16px) scale(1.07); }
      100% { transform:translate(-16px,30px) scale(0.94); }
    }
    
    .pr-grid {
      position:fixed;inset:0;z-index:0;pointer-events:none;
      background-image:
        linear-gradient(rgba(255,255,255,0.017) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,0.017) 1px,transparent 1px);
      background-size:60px 60px;
    }
    
    .pr-main {
      position:relative;z-index:10;
      max-width:1000px;margin:0 auto;
      padding:44px 20px 100px;
    }
    
    .pr-header {
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.09);
      backdrop-filter:blur(20px);
      border-radius:24px;
      padding:36px 40px 32px;
      position:relative;overflow:hidden;
      margin-bottom:36px;
      animation: prFadeUp .6s ease forwards;
    }
    .pr-header-title {
      font-family:'Syne',sans-serif;font-size:clamp(30px,4vw,44px);
      font-weight:800;letter-spacing:-1px;line-height:1.05;
      background:linear-gradient(135deg,#00C65E 0%,#00924A 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      background-clip:text;
      margin-bottom:12px;
    }
    .pr-header-desc {
      font-size:15px;color:rgba(232,240,255,.48);line-height:1.7;
    }

    .pr-section {
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.08);
      backdrop-filter:blur(18px);
      border-radius:22px;padding:32px;
      margin-bottom:24px;
      animation: prFadeUp .6s ease forwards;
    }
    .pr-section:nth-child(2) { animation-delay: 0.1s; }
    .pr-section:nth-child(3) { animation-delay: 0.2s; }
    .pr-section:nth-child(4) { animation-delay: 0.3s; }
    
    .pr-section-title {
      font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#fff;
      margin-bottom:6px;
    }
    .pr-section-desc { font-size:14px;color:rgba(232,240,255,.4);margin-bottom:24px; }
    
    /* Stats */
    .stats-row { display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
    @media(max-width:640px) { .stats-row { grid-template-columns:1fr 1fr; } }
    .stat-card {
      background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.05);
      border-radius:16px;padding:20px;text-align:center;
      transition:all .3s;
    }
    .stat-card:hover { transform:translateY(-4px);background:rgba(255,255,255,.08);border-color:rgba(0,198,94,.3);box-shadow:0 12px 30px rgba(0,198,94,.1); }
    .stat-icon { font-size:28px;margin-bottom:10px;display:block; }
    .stat-value { font-size:32px;font-family:'Syne',sans-serif;font-weight:800;color:#00C65E;line-height:1;margin-bottom:6px; }
    .stat-label { font-size:13px;color:rgba(232,240,255,.5);font-weight:600; }
    
    /* Lang Select */
    .lang-grid { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
    @media(max-width:600px) { .lang-grid { grid-template-columns:1fr; } }
    .lang-field label { display:block;font-size:12px;font-weight:700;color:rgba(232,240,255,.4);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px; }
    .lang-select {
      width:100%;padding:14px 18px;border-radius:14px;
      background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.1);
      color:#fff;font-size:15px;font-family:'Plus Jakarta Sans',sans-serif;
      font-weight:600;cursor:pointer;outline:none;
      appearance:none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 18px center;
      transition:all .2s;
    }
    .lang-select:focus { border-color:#00C65E;box-shadow:0 0 0 4px rgba(0,198,94,.15); }
    .lang-select option { background:#050B14;color:#fff; }
    
    .save-btn {
      margin-top:30px;
      padding:12px 28px;border-radius:14px;font-size:14px;font-weight:700;
      background:linear-gradient(135deg,#00C65E,#00924A);
      color:#fff;border:none;cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif;
      box-shadow:0 0 20px rgba(0,198,94,.3);
      transition:all .25s;
    }
    .save-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 0 30px rgba(0,198,94,.5); }
    .save-btn:disabled { opacity:.5;cursor:not-allowed;background:#333;box-shadow:none; }
    .save-btn--saved { background:#A855F7;box-shadow:0 0 20px rgba(168,85,247,.4); }

    /* Badges */
    .badges-wrap { display:flex;flex-wrap:wrap;gap:12px; }
    .badge-chip {
      display:inline-flex;align-items:center;gap:8px;
      padding:8px 16px;border-radius:20px;
      background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.25);
      color:#F59E0B;font-size:14px;font-weight:700;
      transition:all .3s;
    }
    .badge-chip:hover { transform:translateY(-3px);background:rgba(245,158,11,.2);box-shadow:0 10px 20px rgba(245,158,11,.15); }
    .badge-emoji { font-size:18px; }

    @keyframes prFadeUp {
      from { opacity:0;transform:translateY(20px); }
      to   { opacity:1;transform:translateY(0); }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="pr-root">
        <div className="pr-bg">
          <div className="pr-orb po1" />
          <div className="pr-orb po2" />
          <div className="pr-orb po3" />
        </div>
        <div className="pr-grid" />
        
        <main className="pr-main">
          
          <div className="pr-header">
            <h1 className="pr-header-title">Profile Belajar</h1>
            <p className="pr-header-desc">Atur bahasa ibu, target belajar, dan lihat badge pencapaian.</p>
          </div>

          <section className="pr-section">
            <h2 className="pr-section-title">Statistik Belajar</h2>
            <p className="pr-section-desc">Ringkasan progres kamu sejauh ini.</p>
            <div className="stats-row">
              <StatCard icon="🔥" value={profile.streak ?? 0} label="Hari Streak" />
              <StatCard icon="📝" value={profile.total_phrases ?? 0} label="Frasa Disimpan" />
              <StatCard icon="💬" value={profile.total_sessions ?? 0} label="Sesi Belajar" />
            </div>
          </section>

          <section className="pr-section">
            <h2 className="pr-section-title">Preferensi Bahasa</h2>
            <p className="pr-section-desc">Ubah bahasa ibu dan bahasa yang ingin kamu pelajari.</p>

            <div className="lang-grid">
              <div className="lang-field">
                <label htmlFor="native-lang">Bahasa Ibu</label>
                <select
                  id="native-lang"
                  className="lang-select"
                  value={nativeLang}
                  onChange={(e) => setNativeLang(e.target.value)}
                >
                  {NATIVE_LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div className="lang-field">
                <label htmlFor="target-lang">Target Bahasa</label>
                <select
                  id="target-lang"
                  className="lang-select"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  {TARGET_LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className={`save-btn ${saved ? "save-btn--saved" : ""}`}
              onClick={handleSave}
              disabled={saving || (!hasChanges && !saved)}
            >
              {saving ? "Menyimpan..." : saved ? "✓ Tersimpan" : "Simpan Perubahan"}
            </button>
          </section>

          <section className="pr-section">
            <h2 className="pr-section-title">Badges Pencapaian</h2>
            <p className="pr-section-desc">
              {badges.length > 0
                ? `Kamu sudah meraih ${badges.length} badge. Terus semangat!`
                : "Selesaikan tantangan untuk mendapatkan badge pertamamu."}
            </p>
            <div className="badges-wrap">
              {badges.length > 0 ? (
                badges.map((badge) => <BadgeChip key={badge} badge={badge} />)
              ) : (
                <p style={{fontSize:14, color:"rgba(232,240,255,0.4)", fontStyle:"italic"}}>Belum ada badge — mulai belajar sekarang! 🌱</p>
              )}
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
