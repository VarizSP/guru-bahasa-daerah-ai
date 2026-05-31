"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  .lp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent;
    min-height: 100vh;
    color: #E8F0FF;
    position: relative;
    margin-top: -32px;
    padding-top: 32px;
  }

  /* ─── Mesh background ─── */
  .lp-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: #050B14;
  }
  .lp-orb {
    position: absolute; border-radius: 50%;
    filter: blur(100px);
    animation: orbFloat 22s ease-in-out infinite alternate;
  }
  .o1 {
    width: 650px; height: 650px;
    background: radial-gradient(circle, rgba(0,198,94,0.22) 0%, transparent 70%);
    top: -180px; left: -160px; animation-duration: 24s;
  }
  .o2 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%);
    top: -80px; right: -100px; animation-duration: 18s; animation-delay: -6s;
  }
  .o3 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%);
    bottom: 120px; left: 25%; animation-duration: 28s; animation-delay: -12s;
  }
  .o4 {
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%);
    bottom: 60px; right: 10%; animation-duration: 20s; animation-delay: -4s;
  }
  @keyframes orbFloat {
    0%   { transform: translate(0,0) scale(1); }
    50%  { transform: translate(24px,18px) scale(1.06); }
    100% { transform: translate(-18px,32px) scale(0.94); }
  }

  /* ─── Grid overlay ─── */
  .lp-grid {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px);
    background-size: 64px 64px;
  }

  /* ─── Noise grain ─── */
  .lp-grain {
    position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* ─── Main content ─── */
  .lp-main {
    position: relative; z-index: 10;
  }

  /* ─── Hero ─── */
  .lp-hero {
    max-width: 1200px; margin: 0 auto;
    padding: 70px 0 90px;
    display: grid; grid-template-columns: 1fr 420px;
    gap: 60px; align-items: center;
  }

  .lp-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: #00C65E; margin-bottom: 22px;
    background: rgba(0,198,94,0.1); border: 1px solid rgba(0,198,94,0.22);
    padding: 5px 14px; border-radius: 20px;
    opacity: 0; animation: fadeUp 0.6s ease 0.1s forwards;
  }
  .lp-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #00C65E;
    animation: pulseDot 2s ease infinite;
  }
  @keyframes pulseDot {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,198,94,0.7); }
    50%      { box-shadow: 0 0 0 6px rgba(0,198,94,0); }
  }

  .lp-headline {
    font-family: 'Syne', sans-serif; font-size: clamp(38px, 5vw, 60px);
    font-weight: 800; line-height: 1.07; letter-spacing: -2px;
    margin-bottom: 22px;
    background: linear-gradient(135deg,
      #ffffff 0%,
      #ccfde8 30%,
      #00C65E 55%,
      #F59E0B 80%,
      #fff7e0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    background-size: 200% 200%;
    animation: gradShift 6s ease infinite, fadeUp 0.7s ease 0.2s both;
  }
  @keyframes gradShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .lp-desc {
    font-size: 16px; line-height: 1.75; color: rgba(232,240,255,0.55);
    max-width: 500px; margin-bottom: 36px;
    opacity: 0; animation: fadeUp 0.65s ease 0.35s forwards;
  }

  .lp-cta-row {
    display: flex; gap: 14px; flex-wrap: wrap;
    opacity: 0; animation: fadeUp 0.65s ease 0.5s forwards;
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 15px 30px; border-radius: 14px; font-size: 15px; font-weight: 700;
    background: linear-gradient(135deg, #00C65E, #00924A);
    color: #fff; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 0 30px rgba(0,198,94,0.4), 0 8px 32px rgba(0,198,94,0.25);
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    letter-spacing: 0.1px; text-decoration: none;
  }
  .btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 0 50px rgba(0,198,94,0.55), 0 14px 40px rgba(0,198,94,0.35);
  }
  .btn-primary:active { transform: scale(0.97); }
  .btn-primary-arrow {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 8px; background: rgba(255,255,255,0.2);
    font-size: 14px; transition: transform 0.2s;
  }
  .btn-primary:hover .btn-primary-arrow { transform: translateX(3px); }

  .btn-glass {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 15px 28px; border-radius: 14px; font-size: 15px; font-weight: 600;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(12px); color: rgba(232,240,255,0.8);
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.3s; text-decoration: none;
  }
  .btn-glass:hover {
    background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2);
    color: #E8F0FF; transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(255,255,255,0.05);
  }

  /* ─── Hero visual panel ─── */
  .lp-hero-visual {
    opacity: 0; animation: fadeLeft 0.8s ease 0.3s forwards;
    position: relative;
  }
  @keyframes fadeLeft {
    from { opacity:0; transform: translateX(30px); }
    to   { opacity:1; transform: translateX(0); }
  }
  .hero-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    backdrop-filter: blur(20px);
    border-radius: 24px; padding: 28px;
    position: relative; overflow: hidden;
  }
  .hero-card-glow {
    position: absolute; top: -40px; right: -40px; width: 220px; height: 220px;
    border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, rgba(0,198,94,0.2) 0%, transparent 70%);
  }
  .hero-card-title {
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
    color: rgba(232,240,255,0.35); margin-bottom: 18px;
    display: flex; align-items: center; gap: 8px;
  }
  .hero-card-title-dot { width: 5px; height: 5px; border-radius: 50%; }
  .hc-stat-row {
    display: flex; flex-direction: column; gap: 14px;
  }
  .hc-stat {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
    transition: all 0.2s;
  }
  .hc-stat:hover { background: rgba(255,255,255,0.07); transform: translateX(4px); }
  .hc-stat-left { display: flex; align-items: center; gap: 10px; }
  .hc-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .hc-stat-label { font-size: 13px; font-weight: 600; color: rgba(232,240,255,0.7); }
  .hc-stat-sub   { font-size: 11px; color: rgba(232,240,255,0.3); font-weight: 400; }
  .hc-stat-val   { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; }
  .hc-bar-row { margin-top: 20px; }
  .hc-bar-label {
    display: flex; justify-content: space-between;
    font-size: 12px; color: rgba(232,240,255,0.4); margin-bottom: 6px; font-weight: 500;
  }
  .hc-bar-track { height: 4px; border-radius: 99px; background: rgba(255,255,255,0.08); overflow: hidden; }
  .hc-bar-fill { height: 100%; border-radius: 99px; }

  /* ─── Section header ─── */
  .lp-section-head {
    text-align: center; max-width: 640px; margin: 0 auto 52px;
    opacity: 0; animation: fadeUp 0.6s ease 0.1s forwards;
  }
  .section-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: #F59E0B; margin-bottom: 14px;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
    padding: 4px 12px; border-radius: 20px;
  }
  .section-title {
    font-family: 'Syne', sans-serif; font-size: clamp(26px,3.5vw,38px); font-weight: 800;
    letter-spacing: -1px;
    background: linear-gradient(135deg, #fff 30%, rgba(232,240,255,0.6));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    margin-bottom: 14px;
  }
  .section-desc { font-size: 15px; color: rgba(232,240,255,0.45); line-height: 1.7; }

  /* ─── Scenario cards ─── */
  .lp-scenarios {
    max-width: 1200px; margin: 0 auto;
    padding: 0 0 110px;
  }
  .scenario-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;
  }
  .sc-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(16px);
    border-radius: 22px; padding: 28px 28px 24px;
    position: relative; overflow: hidden;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.34,1.3,0.64,1);
    opacity: 0;
    display: block;
    text-decoration: none;
  }
  .sc-card.visible { animation: fadeUp 0.55s ease forwards; }
  .sc-card:hover {
    transform: translateY(-6px);
    background: rgba(255,255,255,0.07);
  }
  .sc-card-glow {
    position: absolute; inset: 0; border-radius: 22px;
    opacity: 0; transition: opacity 0.35s;
    pointer-events: none;
  }
  .sc-card:hover .sc-card-glow { opacity: 1; }
  .sc-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 4px 10px; border-radius: 20px; margin-bottom: 16px;
  }
  .sc-badge-dot { width: 5px; height: 5px; border-radius: 50%; }
  .sc-card-title {
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
    color: #fff; margin-bottom: 10px; letter-spacing: -0.4px; line-height: 1.3;
  }
  .sc-card-desc {
    font-size: 13.5px; color: rgba(232,240,255,0.45); line-height: 1.65; margin-bottom: 18px;
  }
  .sc-target {
    font-size: 12px; font-weight: 600; color: rgba(232,240,255,0.3);
    margin-bottom: 20px; display: flex; align-items: center; gap: 6px;
  }
  .sc-target-tag {
    padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 700;
    background: rgba(255,255,255,0.08); color: rgba(232,240,255,0.55);
  }
  .sc-link {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 700;
    background: none; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: gap 0.2s;
  }
  .sc-card:hover .sc-link { gap: 10px; }

  /* ─── Features strip ─── */
  .lp-features {
    max-width: 1200px; margin: 0 auto;
    padding: 0 0 100px;
  }
  .feat-grid {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 16px;
  }
  .feat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 26px 22px;
    transition: all 0.3s;
    opacity: 0;
  }
  .feat-card.visible { animation: fadeUp 0.55s ease forwards; }
  .feat-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-3px); }
  .feat-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 16px;
  }
  .feat-title {
    font-size: 15px; font-weight: 700; color: #E8F0FF; margin-bottom: 8px;
  }
  .feat-desc { font-size: 13px; color: rgba(232,240,255,0.4); line-height: 1.65; }

  /* ─── CTA Banner ─── */
  .lp-cta-banner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 0 120px;
  }
  .cta-inner {
    border-radius: 28px; padding: 64px 60px;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, rgba(0,198,94,0.12) 0%, rgba(5,11,20,0.7) 50%, rgba(245,158,11,0.08) 100%),
                rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    text-align: center;
    opacity: 0; animation: fadeUp 0.65s ease 0.1s both;
  }
  .cta-orb-l {
    position: absolute; top: -80px; left: -80px; width: 300px; height: 300px;
    border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, rgba(0,198,94,0.2) 0%, transparent 70%);
  }
  .cta-orb-r {
    position: absolute; bottom: -60px; right: -60px; width: 260px; height: 260px;
    border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%);
  }
  .cta-title {
    font-family: 'Syne', sans-serif; font-size: clamp(26px,3.8vw,44px);
    font-weight: 800; letter-spacing: -1.5px; margin-bottom: 14px;
    background: linear-gradient(135deg, #fff 0%, #ccfde8 50%, #F59E0B 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    position: relative; z-index: 1;
  }
  .cta-sub {
    font-size: 15px; color: rgba(232,240,255,0.5); margin-bottom: 36px;
    max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.7;
    position: relative; z-index: 1;
  }
  .cta-buttons { display: flex; gap: 14px; justify-content: center; position: relative; z-index: 1; }

  /* ─── Footer ─── */
  .lp-footer {
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(5,11,20,0.9);
    padding: 32px 40px;
    display: flex; justify-content: space-between; align-items: center;
    position: relative; z-index: 10;
    flex-wrap: wrap; gap: 16px;
    margin-left: -50vw;
    margin-right: -50vw;
    left: 50%;
    right: 50%;
    width: 100vw;
    box-sizing: border-box;
  }
  .footer-brand {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800;
    background: linear-gradient(135deg, #00C65E, #F59E0B);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .footer-copy { font-size: 12.5px; color: rgba(232,240,255,0.25); }

  /* ─── Animations ─── */
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(22px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .anim { opacity:0; }

  /* ─── Responsive ─── */
  @media (max-width: 960px) {
    .lp-hero { grid-template-columns: 1fr; padding: 70px 0 60px; gap: 40px; }
    .lp-hero-visual { order: -1; max-width: 480px; }
    .scenario-grid { grid-template-columns: 1fr; }
    .feat-grid { grid-template-columns: repeat(2,1fr); }
    .lp-scenarios, .lp-features, .lp-cta-banner { padding-left: 0; padding-right: 0; }
    .cta-inner { padding: 44px 32px; }
    .cta-buttons { flex-direction: column; align-items: center; }
  }
  @media (max-width: 600px) {
    .feat-grid { grid-template-columns: 1fr; }
    .lp-hero { padding: 50px 0 44px; }
    .lp-footer { padding: 24px 18px; }
  }
`;

const FEATURES = [
  { icon: "🧠", label: "AI Evaluasi Semantik", desc: "Setiap dialog dinilai secara makna, konteks, dan ketepatan budaya.", color: "#00C65E", bg: "rgba(0,198,94,0.12)", delay:"0.05s" },
  { icon: "🎭", label: "Konteks Budaya Asli", desc: "Skenario didesain berdasarkan situasi nyata dalam kehidupan sehari-hari.", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", delay:"0.15s" },
  { icon: "🏆", label: "Gamifikasi Penuh", desc: "XP, streak, badge, dan leaderboard membuatmu terus termotivasi.", color: "#C084FC", bg: "rgba(168,85,247,0.1)", delay:"0.25s" },
  { icon: "🌏", label: "Multi-Bahasa Daerah", desc: "Jawa, Sunda, Bali, dan bahasa daerah lainnya dalam satu platform.", color: "#38BDF8", bg: "rgba(56,189,248,0.1)", delay:"0.35s" },
];

export default function ClientHome({ scenarios }: { scenarios: any[] }) {
  const [progressLoaded, setProgressLoaded] = useState(false);
  const scenarioRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const featRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setProgressLoaded(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    [...scenarioRefs.current, ...featRefs.current].forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="lp-root">
        {/* Background */}
        <div className="lp-bg">
          <div className="lp-orb o1" /><div className="lp-orb o2" />
          <div className="lp-orb o3" /><div className="lp-orb o4" />
        </div>
        <div className="lp-grid" />
        <div className="lp-grain" />

        <main className="lp-main">
          {/* ── Hero ── */}
          <section className="lp-hero">
            <div>
              <div className="lp-eyebrow">
                <span className="lp-eyebrow-dot" />
                Neo-Nusantara Learning Platform
              </div>
              <h1 className="lp-headline">
                Belajar Bahasa Daerah dengan AI dan Konteks Budaya Asli
              </h1>
              <p className="lp-desc">
                Fokus pada keberanian berbicara dan ketepatan etika. Setiap dialog dievaluasi secara semantic, grammar, dan politeness agar kamu makin percaya diri.
              </p>
              <div className="lp-cta-row">
                <Link href="/dashboard" className="btn-primary">
                  Mulai Belajar
                  <span className="btn-primary-arrow">→</span>
                </Link>
                <Link href="/chat/pasar-beringharjo" className="btn-glass">
                  <span>💬</span> Coba Demo Chat
                </Link>
              </div>
            </div>

            {/* Hero visual card */}
            <div className="lp-hero-visual">
              <div className="hero-card">
                <div className="hero-card-glow" />
                <div className="hero-card-title">
                  <span className="hero-card-title-dot" style={{background:"#00C65E",boxShadow:"0 0 8px #00C65E"}} />
                  Progress Belajarmu
                </div>
                <div className="hc-stat-row">
                  {[
                    {icon:"🔥",label:"Streak",sub:"hari berturut-turut",val:"0",color:"#F59E0B",bg:"rgba(245,158,11,0.1)"},
                    {icon:"⚡",label:"Total XP",sub:"poin pengalaman",val:"285",color:"#00C65E",bg:"rgba(0,198,94,0.1)"},
                    {icon:"🏅",label:"Badge",sub:"belum ada — ayo raih!",val:"0",color:"#C084FC",bg:"rgba(168,85,247,0.1)"},
                  ].map(s => (
                    <div className="hc-stat" key={s.label}>
                      <div className="hc-stat-left">
                        <div className="hc-stat-icon" style={{background:s.bg}}>{s.icon}</div>
                        <div>
                          <div className="hc-stat-label">{s.label}</div>
                          <div className="hc-stat-sub">{s.sub}</div>
                        </div>
                      </div>
                      <div className="hc-stat-val" style={{color:s.color,textShadow:`0 0 20px ${s.color}80`}}>{s.val}</div>
                    </div>
                  ))}
                </div>
                {[
                  {label:"Vocabulary",pct:78,color:"#00C65E",grad:"linear-gradient(90deg,#00C65E,#00e076)"},
                  {label:"Politeness",pct:65,color:"#F59E0B",grad:"linear-gradient(90deg,#F59E0B,#FCD34D)"},
                  {label:"Fluency",pct:71,color:"#38BDF8",grad:"linear-gradient(90deg,#38BDF8,#7DD3FC)"},
                ].map(p => (
                  <div className="hc-bar-row" key={p.label}>
                    <div className="hc-bar-label">
                      <span>{p.label}</span><span style={{color:p.color}}>{p.pct}%</span>
                    </div>
                    <div className="hc-bar-track">
                      <div className="hc-bar-fill" style={{
                        width: progressLoaded ? `${p.pct}%` : "0%",
                        background: p.grad,
                        boxShadow: `0 0 10px ${p.color}60`,
                        transition: "width 1.2s cubic-bezier(0.34,1.2,0.64,1)",
                      }}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating accent tags */}
              <div style={{
                position:"absolute", top:-18, right:-18,
                background:"rgba(0,198,94,0.15)", border:"1px solid rgba(0,198,94,0.3)",
                backdropFilter:"blur(12px)", borderRadius:12,
                padding:"8px 14px", fontSize:12, fontWeight:700, color:"#00C65E",
                display:"flex", alignItems:"center", gap:6,
                animation:"orbFloat 4s ease-in-out infinite alternate",
              }}>
                <span>⚡</span> +25 XP didapat!
              </div>
              <div style={{
                position:"absolute", bottom:-14, left:-14,
                background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.25)",
                backdropFilter:"blur(12px)", borderRadius:12,
                padding:"8px 14px", fontSize:12, fontWeight:700, color:"#F59E0B",
                display:"flex", alignItems:"center", gap:6,
                animation:"orbFloat 5s ease-in-out infinite alternate-reverse",
              }}>
                <span>🏆</span> Rank #2 Minggu Ini
              </div>
            </div>
          </section>

          {/* ── Features ── */}
          <section className="lp-features">
            <div className="lp-section-head">
              <div className="section-eyebrow">✦ Kenapa Guru Bahasa Daerah AI?</div>
              <h2 className="section-title">Teknologi Terdepan untuk Bahasa Nusantara</h2>
              <p className="section-desc">Platform pertama yang menggabungkan AI conversational dengan konteks budaya lokal yang autentik.</p>
            </div>
            <div className="feat-grid">
              {FEATURES.map((f,i) => (
                <div
                  key={f.label}
                  className="feat-card"
                  ref={el => { featRefs.current[i] = el; }}
                  style={{animationDelay: f.delay}}
                >
                  <div className="feat-icon" style={{background:f.bg}}>{f.icon}</div>
                  <div className="feat-title">{f.label}</div>
                  <div className="feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Scenarios ── */}
          <section className="lp-scenarios">
            <div className="lp-section-head">
              <div className="section-eyebrow">🗺️ Jelajahi Skenario</div>
              <h2 className="section-title">Situasi Nyata, Bahasa Autentik</h2>
              <p className="section-desc">Setiap skenario dirancang bersama penutur asli untuk memastikan ketepatan budaya dan bahasa.</p>
            </div>
            <div className="scenario-grid">
              {scenarios.map((s,i) => {
                const isJawa = s.language.toLowerCase() === "jawa";
                const isSunda = s.language.toLowerCase() === "sunda";
                
                const color = isJawa ? "#00C65E" : isSunda ? "#38BDF8" : "#F59E0B";
                const glow = isJawa ? "rgba(0,198,94,0.12)" : isSunda ? "rgba(56,189,248,0.12)" : "rgba(245,158,11,0.12)";
                const border = isJawa ? "rgba(0,198,94,0.35)" : isSunda ? "rgba(56,189,248,0.35)" : "rgba(245,158,11,0.35)";
                const badgeBg = isJawa ? "rgba(0,198,94,0.12)" : isSunda ? "rgba(56,189,248,0.12)" : "rgba(245,158,11,0.1)";

                return (
                  <Link
                    href={`/chat/${s.id}`}
                    key={s.id}
                    className="sc-card"
                    ref={el => { scenarioRefs.current[i] = el; }}
                    style={{animationDelay: `${(i % 3) * 0.1}s`}}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = border;
                      e.currentTarget.style.boxShadow = `0 12px 50px ${glow}, 0 0 0 1px ${border}`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="sc-card-glow" style={{background:`radial-gradient(circle at top right, ${glow}, transparent 60%)`}} />
                    <div className="sc-badge" style={{background:badgeBg, color, border:`1px solid ${color}30`}}>
                      <span className="sc-badge-dot" style={{background:color, boxShadow:`0 0 6px ${color}`}} />
                      {s.region || s.language}
                    </div>
                    <div className="sc-card-title">{s.title}</div>
                    <div className="sc-card-desc">{s.context}</div>
                    <div className="sc-target">
                      <span>Target:</span>
                      <span className="sc-target-tag">{s.language} · {s.politenessTarget}</span>
                    </div>
                    <div className="sc-link" style={{color}}>
                      Buka Skenario <span>→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── CTA Banner ── */}
          <section className="lp-cta-banner">
            <div className="cta-inner">
              <div className="cta-orb-l" /><div className="cta-orb-r" />
              <h2 className="cta-title">Siap Kuasai Bahasa Daerahmu?</h2>
              <p className="cta-sub">Bergabung dengan ratusan pelajar yang sudah merasakan perbedaannya. Gratis untuk memulai.</p>
              <div className="cta-buttons">
                <Link href="/dashboard" className="btn-primary" style={{fontSize:16, padding:"16px 36px"}}>
                  Mulai Belajar Sekarang
                  <span className="btn-primary-arrow">→</span>
                </Link>
                <Link href="/chat/pasar-beringharjo" className="btn-glass" style={{fontSize:15}}>
                  <span>💬</span> Coba Demo Dulu
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="lp-footer">
          <span className="lp-brand">🌺 Guru Bahasa Daerah AI</span>
          <span className="footer-copy">© 2026 · Lestarikan bahasa, jaga budaya.</span>
          <span style={{fontSize:12,color:"rgba(232,240,255,0.2)"}}>Built with ♥ in Nusantara</span>
        </footer>
      </div>
    </>
  );
}
