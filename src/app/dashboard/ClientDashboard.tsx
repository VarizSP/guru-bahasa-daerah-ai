"use client";
import { useState, useEffect } from "react";
import { Profile } from "@/lib/types";
import Link from "next/link";

const glowStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');

  .gbd-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #050B14;
    min-height: 100vh;
    color: #E8F0FF;
    position: relative;
    overflow-x: hidden;
    margin-top: -32px; /* offset the layout.tsx padding */
    padding-top: 32px;
  }

  /* ── Animated mesh background ── */
  .bg-mesh {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: #050B14;
  }
  .orb {
    position: absolute; border-radius: 50%;
    filter: blur(90px); opacity: 0.35;
    animation: drift 18s ease-in-out infinite alternate;
  }
  .orb-1 {
    width: 560px; height: 560px;
    background: radial-gradient(circle, #00C65E 0%, transparent 70%);
    top: -120px; left: -100px;
    animation-duration: 20s;
  }
  .orb-2 {
    width: 480px; height: 480px;
    background: radial-gradient(circle, #F59E0B 0%, transparent 70%);
    top: 60px; right: -80px;
    animation-duration: 15s; animation-delay: -5s;
  }
  .orb-3 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, #0EA5E9 0%, transparent 70%);
    bottom: 200px; left: 30%;
    animation-duration: 24s; animation-delay: -10s; opacity: 0.2;
  }
  .orb-4 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, #A855F7 0%, transparent 70%);
    bottom: 100px; right: 20%;
    animation-duration: 18s; animation-delay: -7s; opacity: 0.2;
  }
  @keyframes drift {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, 20px) scale(1.05); }
    100% { transform: translate(-20px, 40px) scale(0.95); }
  }

  /* Subtle grid overlay */
  .bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ── Main content ── */
  .main {
    position: relative; z-index: 10;
    max-width: 1240px; margin: 0 auto;
    padding: 40px 32px 80px;
  }

  /* ── Header section ── */
  .header-section {
    margin-bottom: 36px;
    opacity: 0; transform: translateY(16px);
    animation: fadeUp 0.6s ease forwards;
  }
  .greeting-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
    color: #00C65E; margin-bottom: 12px;
    background: rgba(0,198,94,0.1); border: 1px solid rgba(0,198,94,0.2);
    padding: 4px 12px; border-radius: 20px;
  }
  .greeting-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #00C65E; animation: pulse-dot 2s ease infinite;
  }
  @keyframes pulse-dot {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,198,94,0.6); }
    50% { box-shadow: 0 0 0 5px rgba(0,198,94,0); }
  }
  .page-title {
    font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800;
    line-height: 1.1; letter-spacing: -1px;
    background: linear-gradient(135deg, #fff 0%, rgba(232,240,255,0.65) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .page-subtitle {
    margin-top: 8px; font-size: 14px; color: rgba(232,240,255,0.45); font-weight: 400;
  }

  /* ── Glass card ── */
  .glass {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(16px);
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .glass:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.14);
    transform: translateY(-4px);
  }
  .glass-glow-green:hover { box-shadow: 0 8px 40px rgba(0,198,94,0.15); }
  .glass-glow-amber:hover { box-shadow: 0 8px 40px rgba(245,158,11,0.15); }
  .glass-glow-blue:hover { box-shadow: 0 8px 40px rgba(14,165,233,0.15); }
  .glass-glow-purple:hover { box-shadow: 0 8px 40px rgba(168,85,247,0.15); }

  /* ── Bento grid ── */
  .bento {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto;
    gap: 16px;
  }

  /* ── Stat cards ── */
  .stat-grid {
    grid-column: span 12;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .stat-card {
    padding: 22px 24px; position: relative; overflow: hidden; cursor: default;
  }
  .stat-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    border-radius: 20px 20px 0 0;
  }
  .stat-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; font-size: 20px;
  }
  .stat-label {
    font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
    color: rgba(232,240,255,0.4); margin-bottom: 6px;
  }
  .stat-value {
    font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800;
    line-height: 1; letter-spacing: -1px;
  }
  .stat-sub {
    font-size: 12px; color: rgba(232,240,255,0.35); margin-top: 6px; font-weight: 400;
  }
  /* glow numbers */
  .glow-green { color: #00C65E; text-shadow: 0 0 30px rgba(0,198,94,0.6); }
  .glow-amber { color: #F59E0B; text-shadow: 0 0 30px rgba(245,158,11,0.6); }
  .glow-blue  { color: #38BDF8; text-shadow: 0 0 30px rgba(56,189,248,0.6); }
  .glow-purple { color: #C084FC; text-shadow: 0 0 30px rgba(192,132,252,0.6); }

  /* ── Mission card ── */
  .mission-card {
    grid-column: span 7;
    padding: 32px 36px;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, rgba(0,198,94,0.08) 0%, rgba(5,11,20,0.5) 60%),
                rgba(255,255,255,0.04);
  }
  .mission-shimmer {
    position: absolute; top: -60px; right: -60px;
    width: 280px; height: 280px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,198,94,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .mission-eyebrow {
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
    color: #00C65E; margin-bottom: 12px;
    display: flex; align-items: center; gap: 6px;
  }
  .mission-title {
    font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
    letter-spacing: -0.5px; margin-bottom: 12px; color: #fff;
  }
  .mission-desc {
    font-size: 14px; color: rgba(232,240,255,0.55); line-height: 1.7;
    max-width: 380px; margin-bottom: 28px;
  }
  .mission-meta {
    display: flex; gap: 20px; margin-bottom: 28px;
  }
  .mission-meta-item {
    display: flex; flex-direction: column; gap: 2px;
  }
  .mission-meta-label {
    font-size: 11px; color: rgba(232,240,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;
  }
  .mission-meta-val {
    font-size: 14px; font-weight: 600; color: rgba(232,240,255,0.8);
  }
  .btn-cta {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 28px; border-radius: 14px; font-size: 15px; font-weight: 700;
    background: linear-gradient(135deg, #00C65E, #00A04E);
    color: #fff; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 0 0 0 rgba(0,198,94,0.5), 0 8px 32px rgba(0,198,94,0.35);
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    letter-spacing: 0.2px;
    text-decoration: none;
  }
  .btn-cta:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 0 40px rgba(0,198,94,0.5), 0 12px 40px rgba(0,198,94,0.4);
  }
  .btn-cta:active { transform: scale(0.98); }
  .btn-cta-arrow {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 8px;
    background: rgba(255,255,255,0.2); font-size: 14px;
    transition: transform 0.2s;
  }
  .btn-cta:hover .btn-cta-arrow { transform: translateX(3px); }

  /* ── Streak mini-calendar (decorative) ── */
  .streak-dots {
    display: flex; gap: 5px; margin-top: 14px;
  }
  .streak-dot {
    width: 10px; height: 10px; border-radius: 3px;
    background: rgba(255,255,255,0.08);
    transition: background 0.3s;
  }
  .streak-dot.active { background: #00C65E; box-shadow: 0 0 8px rgba(0,198,94,0.6); }

  /* ── Leaderboard card ── */
  .leaderboard-card {
    grid-column: span 5;
    padding: 28px 28px;
  }
  .card-title {
    font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    color: rgba(232,240,255,0.4); margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .card-title-dot { width: 6px; height: 6px; border-radius: 50%; }
  .lb-item {
    display: flex; align-items: center; gap: 14px; padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: all 0.2s;
    border-radius: 10px;
  }
  .lb-item:last-child { border-bottom: none; }
  .lb-item:hover { padding-left: 8px; padding-right: 4px; background: rgba(255,255,255,0.03); }
  .lb-rank {
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
    min-width: 28px; text-align: center;
  }
  .rank-1 { color: #F59E0B; text-shadow: 0 0 16px rgba(245,158,11,0.7); }
  .rank-2 { color: #94A3B8; }
  .rank-3 { color: #CD7C50; }
  .lb-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
  }
  .lb-name { font-size: 14px; font-weight: 600; color: #E8F0FF; flex: 1; }
  .lb-xp {
    font-size: 13px; font-weight: 700;
    color: rgba(232,240,255,0.5);
    background: rgba(255,255,255,0.06);
    padding: 3px 10px; border-radius: 20px;
  }
  .lb-you .lb-xp { background: rgba(0,198,94,0.15); color: #00C65E; }

  /* ── Progress card ── */
  .progress-card {
    grid-column: span 5;
    padding: 28px 28px;
  }
  .progress-item { margin-bottom: 18px; }
  .progress-item:last-child { margin-bottom: 0; }
  .progress-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 8px;
  }
  .progress-label {
    font-size: 13px; font-weight: 600; color: rgba(232,240,255,0.7);
  }
  .progress-pct {
    font-size: 13px; font-weight: 700;
  }
  .progress-track {
    height: 6px; border-radius: 99px;
    background: rgba(255,255,255,0.08); overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 99px;
    transition: width 1.2s cubic-bezier(0.34,1.2,0.64,1);
  }

  /* ── Scenarios card ── */
  .scenarios-card {
    grid-column: span 12;
    padding: 28px 28px;
  }
  .scenario-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin-top: 4px;
  }
  .scenario-item {
    padding: 16px 18px; border-radius: 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    cursor: pointer; transition: all 0.25s;
    position: relative; overflow: hidden;
    text-decoration: none;
    display: block;
  }
  .scenario-item:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.14);
    transform: translateY(-2px);
  }
  .scenario-tag {
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    padding: 3px 8px; border-radius: 20px; margin-bottom: 8px; display: inline-block;
  }
  .tag-jawa { background: rgba(245,158,11,0.15); color: #F59E0B; }
  .tag-sunda { background: rgba(56,189,248,0.15); color: #38BDF8; }
  .tag-bali { background: rgba(168,85,247,0.15); color: #C084FC; }
  .tag-batak { background: rgba(239,68,68,0.15); color: #F87171; }
  .tag-minang { background: rgba(251,191,36,0.15); color: #FCD34D; }
  .tag-aceh { background: rgba(20,184,166,0.15); color: #2DD4BF; }
  .scenario-name {
    font-size: 13px; font-weight: 600; color: rgba(232,240,255,0.85); line-height: 1.4;
  }

  /* ── XP Activity sparkline ── */
  .activity-card {
    grid-column: span 12;
    padding: 28px 32px;
  }
  .sparkline-wrap {
    display: flex; align-items: flex-end; gap: 6px; height: 60px; margin-top: 16px;
  }
  .spark-bar {
    flex: 1; border-radius: 4px 4px 0 0;
    background: rgba(255,255,255,0.08);
    transition: all 0.3s;
    position: relative;
    cursor: pointer;
  }
  .spark-bar.filled {
    background: linear-gradient(to top, #00C65E, #00e076);
    box-shadow: 0 -4px 16px rgba(0,198,94,0.3);
  }
  .spark-bar:hover { filter: brightness(1.3); }
  .spark-days {
    display: flex; gap: 6px; margin-top: 8px;
  }
  .spark-day {
    flex: 1; text-align: center; font-size: 10px; font-weight: 600;
    color: rgba(232,240,255,0.25); letter-spacing: 0.5px;
  }

  /* ── Entrance animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim { opacity: 0; transform: translateY(20px); animation: fadeUp 0.55s ease forwards; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.12s; }
  .d3 { animation-delay: 0.20s; }
  .d4 { animation-delay: 0.28s; }
  .d5 { animation-delay: 0.36s; }
  .d6 { animation-delay: 0.44s; }
  .d7 { animation-delay: 0.52s; }

  /* ── Energy ring ── */
  .energy-ring {
    position: relative; width: 56px; height: 56px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
  }
  .energy-svg { transform: rotate(-90deg); }
  .energy-text {
    position: absolute; font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 800;
    color: #38BDF8; text-shadow: 0 0 12px rgba(56,189,248,0.6);
  }

  /* responsive */
  @media (max-width: 900px) {
    .stat-grid { grid-template-columns: repeat(2,1fr); }
    .mission-card, .leaderboard-card, .progress-card, .scenarios-card { grid-column: span 12; }
  }
  @media (max-width: 600px) {
    .main { padding: 24px 16px 60px; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
  }
`;

const LEADERS = [
  { rank: 1, name: "Aulia", xp: "310 XP", initials: "AU", bg: "rgba(245,158,11,0.15)", color: "#F59E0B" },
  { rank: 2, name: "Kamu", xp: "285 XP", initials: "KM", bg: "rgba(0,198,94,0.12)", color: "#00C65E", you: true },
  { rank: 3, name: "Dimas", xp: "270 XP", initials: "DI", bg: "rgba(56,189,248,0.12)", color: "#38BDF8" },
];

const DAYS = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];
const ACTIVITY = [3,5,2,7,4,6,3,5,8,4,6,7,2,4];

interface Scenario {
  id: string;
  title: string;
  language: string;
}

interface ClientDashboardProps {
  profile: Profile;
  scenarios: Scenario[];
}

export default function ClientDashboard({ profile, scenarios }: ClientDashboardProps) {
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setProgressLoaded(true), 400);
    return () => clearTimeout(t);
  }, []);

  const badgeCount = profile.badges?.length ?? 0;
  const energyPct = 3 / 5;
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * energyPct;

  // Find today's mission - just pick first for now
  const todaysMission = scenarios[0];

  return (
    <>
      <style>{glowStyles}</style>
      <div className="gbd-root">
        {/* Mesh background */}
        <div className="bg-mesh">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
        </div>
        <div className="bg-grid" />

        {/* Main */}
        <main className="main">
          {/* Header */}
          <div className="header-section">
            <div className="greeting-tag">
              <span className="greeting-dot" />
              Selamat datang kembali
            </div>
            <h1 className="page-title">Dashboard Belajarmu</h1>
            <p className="page-subtitle">Lanjutkan perjalananmu menguasai bahasa daerah Nusantara.</p>
          </div>

          <div className="bento">
            {/* ── Stat Cards ── */}
            <div className="stat-grid anim d1">
              {/* Streak */}
              <div className="glass glass-glow-amber stat-card">
                <div className="stat-accent" style={{background:"linear-gradient(90deg,#F59E0B,transparent)"}} />
                <div className="stat-icon-wrap" style={{background:"rgba(245,158,11,0.12)"}}>
                  <span style={{fontSize:22}}>🔥</span>
                </div>
                <div className="stat-label">Streak</div>
                <div className="stat-value glow-amber">{profile.streak}</div>
                <div className="stat-sub">hari berturut-turut</div>
                <div className="streak-dots">
                  {DAYS.map((d,i) => <div key={d} className={`streak-dot${i<profile.streak?" active":""}`} />)}
                </div>
              </div>

              {/* XP */}
              <div className="glass glass-glow-green stat-card">
                <div className="stat-accent" style={{background:"linear-gradient(90deg,#00C65E,transparent)"}} />
                <div className="stat-icon-wrap" style={{background:"rgba(0,198,94,0.12)"}}>
                  <span style={{fontSize:22}}>⚡</span>
                </div>
                <div className="stat-label">XP Total</div>
                <div className="stat-value glow-green">{profile.xp}</div>
                <div className="stat-sub">Terus tingkatkan belajarmu!</div>
              </div>

              {/* Energy */}
              <div className="glass glass-glow-blue stat-card">
                <div className="stat-accent" style={{background:"linear-gradient(90deg,#38BDF8,transparent)"}} />
                <div className="energy-ring">
                  <svg className="energy-svg" width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="4"/>
                    <circle cx="28" cy="28" r={r} fill="none"
                      stroke="#38BDF8" strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${dash} ${circ}`}
                      style={{filter:"drop-shadow(0 0 6px rgba(56,189,248,0.8))"}}
                    />
                  </svg>
                  <span className="energy-text">3/5</span>
                </div>
                <div className="stat-label">Energi</div>
                <div className="stat-value glow-blue" style={{fontSize:28}}>3<span style={{fontSize:16,opacity:0.5}}>/5</span></div>
                <div className="stat-sub">skenario tersedia</div>
              </div>

              {/* Badge */}
              <div className="glass glass-glow-purple stat-card">
                <div className="stat-accent" style={{background:"linear-gradient(90deg,#C084FC,transparent)"}} />
                <div className="stat-icon-wrap" style={{background:"rgba(168,85,247,0.12)"}}>
                  <span style={{fontSize:22}}>🏅</span>
                </div>
                <div className="stat-label">Badge</div>
                <div className="stat-value glow-purple">{badgeCount}</div>
                <div className="stat-sub">{badgeCount > 0 ? `unlocked` : `belum ada — ayo raih!`}</div>
              </div>
            </div>

            {/* ── Mission Card ── */}
            <div className="glass glass-glow-green mission-card anim d2">
              <div className="mission-shimmer" />
              <div className="mission-eyebrow">
                <span>⚔️</span> Misi Hari Ini
              </div>
              <h2 className="mission-title">Skenario Hari Ini</h2>
              <p className="mission-desc">
                {todaysMission ? `Misi: ${todaysMission.title}.` : "Menawar harga dengan Krama yang tepat di Pasar Beringharjo."} Buktikan penguasaan kosakata dan kesopananmu!
              </p>
              <div className="mission-meta">
                <div className="mission-meta-item">
                  <span className="mission-meta-label">Bahasa</span>
                  <span className="mission-meta-val">🌱 {todaysMission ? todaysMission.language : "Jawa"}</span>
                </div>
                <div className="mission-meta-item">
                  <span className="mission-meta-label">Durasi</span>
                  <span className="mission-meta-val">~10 menit</span>
                </div>
                <div className="mission-meta-item">
                  <span className="mission-meta-label">Reward</span>
                  <span className="mission-meta-val" style={{color:"#F59E0B"}}>+25 XP</span>
                </div>
              </div>
              <Link href={`/chat/${todaysMission?.id || "pasar-beringharjo"}`} className="btn-cta">
                Lanjutkan Misi
                <span className="btn-cta-arrow">→</span>
              </Link>
            </div>

            {/* ── Leaderboard ── */}
            <div className="glass glass-glow-amber leaderboard-card anim d3">
              <div className="card-title">
                <span className="card-title-dot" style={{background:"#F59E0B",boxShadow:"0 0 8px #F59E0B"}} />
                Leaderboard Mingguan
              </div>
              {LEADERS.map(l => (
                <div key={l.name} className={`lb-item${l.you?" lb-you":""}`}>
                  <span className={`lb-rank rank-${l.rank}`}>{l.rank}</span>
                  <div className="lb-avatar" style={{background:l.bg, color:l.color, fontFamily:"'Syne',sans-serif"}}>
                    {l.initials}
                  </div>
                  <span className="lb-name">
                    {l.name}{l.you && <span style={{fontSize:11,color:"#00C65E",marginLeft:6,fontWeight:700}}>• Kamu</span>}
                  </span>
                  <span className="lb-xp">{l.you ? `${profile.xp} XP` : l.xp}</span>
                </div>
              ))}
              <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                <div style={{fontSize:12,color:"rgba(232,240,255,0.3)",textAlign:"center"}}>
                  Minggu berakhir dalam <span style={{color:"#F59E0B",fontWeight:700}}>3 hari</span>
                </div>
              </div>
            </div>

            {/* ── Progress ── */}
            <div className="glass glass-glow-green progress-card anim d4">
              <div className="card-title">
                <span className="card-title-dot" style={{background:"#00C65E",boxShadow:"0 0 8px #00C65E"}} />
                Progress Kompetensi
              </div>
              {[
                {label:"Vocabulary", pct:78, color:"#00C65E", grad:"linear-gradient(90deg,#00C65E,#00e076)"},
                {label:"Politeness", pct:65, color:"#F59E0B", grad:"linear-gradient(90deg,#F59E0B,#FCD34D)"},
                {label:"Fluency",    pct:71, color:"#38BDF8", grad:"linear-gradient(90deg,#38BDF8,#7DD3FC)"},
                {label:"Grammar",   pct:52, color:"#C084FC", grad:"linear-gradient(90deg,#C084FC,#E879F9)"},
              ].map(p => (
                <div className="progress-item" key={p.label}>
                  <div className="progress-header">
                    <span className="progress-label">{p.label}</span>
                    <span className="progress-pct" style={{color:p.color}}>{p.pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill"
                      style={{
                        width: progressLoaded ? `${p.pct}%` : "0%",
                        background: p.grad,
                        boxShadow: `0 0 10px ${p.color}60`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Scenarios ── */}
            <div className="glass scenarios-card anim d5">
              <div className="card-title">
                <span className="card-title-dot" style={{background:"#38BDF8",boxShadow:"0 0 8px #38BDF8"}} />
                Semua Skenario
              </div>
              <div className="scenario-grid">
                {scenarios.map((s) => {
                  let tagClass = "tag-jawa";
                  if (s.language.toLowerCase() === "sunda") tagClass = "tag-sunda";
                  if (s.language.toLowerCase() === "bali") tagClass = "tag-bali";
                  if (s.language.toLowerCase() === "batak") tagClass = "tag-batak";
                  if (s.language.toLowerCase() === "minang") tagClass = "tag-minang";
                  if (s.language.toLowerCase() === "aceh") tagClass = "tag-aceh";
                  
                  return (
                    <Link key={s.id} href={`/chat/${s.id}`} className="scenario-item">
                      <span className={`scenario-tag ${tagClass}`}>{s.language}</span>
                      <div className="scenario-name">{s.title}</div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Activity ── */}
            <div className="glass activity-card anim d6">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div className="card-title" style={{marginBottom:0}}>
                  <span className="card-title-dot" style={{background:"#C084FC",boxShadow:"0 0 8px #C084FC"}} />
                  Aktivitas 2 Minggu Terakhir
                </div>
                <span style={{fontSize:12,color:"rgba(232,240,255,0.3)",fontWeight:500}}>Total: {profile.xp} XP</span>
              </div>
              <div className="sparkline-wrap">
                {ACTIVITY.map((v,i) => {
                  const maxV = Math.max(...ACTIVITY);
                  const h = `${Math.round((v/maxV)*100)}%`;
                  const isFilled = v > 4;
                  return (
                    <div key={i} className={`spark-bar${isFilled?" filled":""}`}
                      style={{height:h}}
                      title={`${v * 20} XP`}
                    />
                  );
                })}
              </div>
              <div className="spark-days">
                {["Sen","Sel","Rab","Kam","Jum","Sab","Min","Sen","Sel","Rab","Kam","Kam","Jum","Sab"].map((d,i) => (
                  <span key={i} className="spark-day">{d}</span>
                ))}
              </div>
            </div>

          </div>{/* end bento */}
        </main>
      </div>
    </>
  );
}
