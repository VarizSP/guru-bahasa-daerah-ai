"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Verdict = "approve" | "correct" | "reject" | null;

type UndakUsukLevel = "ngoko" | "madya" | "krama" | "krama-inggil";

interface ConversationLog {
  id: string;
  user_prompt: string;
  ai_response: string;
  detected_level: UndakUsukLevel;
  context: string;
  submitted_at: string;
}

interface ReviewedLog extends ConversationLog {
  verdict: Verdict;
  correction?: string;
  note?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_LOGS: ConversationLog[] = [
  {
    id: "log-001",
    user_prompt: "Pira rega tempe iki, Pak?",
    ai_response: "Regane tempe iki seket ewu rupiah.",
    detected_level: "ngoko",
    context: "Tanya harga di pasar",
    submitted_at: "2026-05-30T03:10:00Z",
  },
  {
    id: "log-002",
    user_prompt: "Kulo badhe nyuwun pirsa, menapa panjenengan saged mbiyantu?",
    ai_response: "Inggih, kula saged mbiyantu panjenengan.",
    detected_level: "krama",
    context: "Meminta bantuan secara formal",
    submitted_at: "2026-05-30T03:24:00Z",
  },
  {
    id: "log-003",
    user_prompt: "Arep nyang ngendi, Mas?",
    ai_response: "Aku arep lunga menyang pasar.",
    detected_level: "ngoko",
    context: "Percakapan santai antar teman",
    submitted_at: "2026-05-30T03:41:00Z",
  },
  {
    id: "log-004",
    user_prompt: "Punapa panjenengan sampun dhahar?",
    ai_response: "Dereng, kula dereng nedha.",
    detected_level: "krama-inggil",
    context: "Tanya apakah sudah makan (hormat tinggi)",
    submitted_at: "2026-05-30T04:02:00Z",
  },
];

const LEVEL_META: Record<UndakUsukLevel, { label: string; color: string; bg: string }> = {
  ngoko:        { label: "Ngoko",         color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  madya:        { label: "Madya",         color: "#eab308", bg: "rgba(234,179,8,0.12)"  },
  krama:        { label: "Krama",         color: "#22c55e", bg: "rgba(34,197,94,0.12)"  },
  "krama-inggil":{ label: "Krama Inggil", color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: UndakUsukLevel }) {
  const m = LEVEL_META[level];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.625rem",
        borderRadius: "0.375rem",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: m.color,
        background: m.bg,
        border: `1px solid ${m.color}40`,
      }}
    >
      {m.label}
    </span>
  );
}

function VerdictButton({
  verdict,
  active,
  onClick,
}: {
  verdict: Verdict;
  active: boolean;
  onClick: () => void;
}) {
  const cfg = {
    approve: { label: "✓ Setujui",    color: "#00C65E", bg: "rgba(0,198,94,0.14)",   border: "#00C65E" },
    correct: { label: "✎ Koreksi",    color: "#F59E0B", bg: "rgba(245,158,11,0.14)",  border: "#F59E0B" },
    reject:  { label: "✕ Tolak",      color: "#EF4444", bg: "rgba(239,68,68,0.14)", border: "#EF4444" },
  }[verdict!]!;

  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.6rem 1rem",
        borderRadius: "0.6rem",
        fontSize: "13px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        border: `1.5px solid ${active ? cfg.border : "rgba(255,255,255,0.1)"}`,
        color: active ? cfg.color : "rgba(232,240,255,0.5)",
        background: active ? cfg.bg : "transparent",
        outline: "none",
        boxShadow: active ? `0 0 15px ${cfg.bg}` : "none",
        transform: active ? "scale(1.02)" : "scale(1)"
      }}
      onMouseEnter={e => {
        if (!active) {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        }
      }}
    >
      {cfg.label}
    </button>
  );
}

function ReviewCard({
  log,
  index,
  onSubmit,
}: {
  log: ConversationLog;
  index: number;
  onSubmit: (reviewed: ReviewedLog) => void;
}) {
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [correction, setCorrection] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = verdict !== null && (verdict !== "correct" || correction.trim().length > 0);

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate API
    setSubmitted(true);
    setSubmitting(false);
    onSubmit({ ...log, verdict, correction, note });
  }

  if (submitted) {
    return (
      <div className="review-card review-card--done" style={{ animationDelay: `${index * 60}ms` }}>
        <div className="done-inner">
          <span className="done-check">✓</span>
          <div>
            <p className="done-title">Review dikirim</p>
            <p className="done-sub">{log.user_prompt.slice(0, 48)}{log.user_prompt.length > 48 ? "…" : ""}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-card" style={{ animationDelay: `${index * 80}ms` }}>
      {/* Header */}
      <div className="rc-header">
        <div className="rc-meta">
          <span className="rc-id">#{log.id.split("-")[1]}</span>
          <LevelBadge level={log.detected_level} />
          <span className="rc-time">{fmtTime(log.submitted_at)}</span>
        </div>
        <span className="rc-context">{log.context}</span>
      </div>

      {/* Conversation */}
      <div className="rc-convo">
        <div className="rc-turn rc-turn--user">
          <span className="rc-speaker">Pengguna</span>
          <p className="rc-text rc-text--jv">{log.user_prompt}</p>
        </div>
        <div className="rc-divider" />
        <div className="rc-turn rc-turn--ai">
          <span className="rc-speaker">AI</span>
          <p className="rc-text rc-text--jv">{log.ai_response}</p>
        </div>
      </div>

      {/* Verdict buttons */}
      <div className="rc-actions">
        {(["approve", "correct", "reject"] as Verdict[]).map((v) => (
          <VerdictButton
            key={v!}
            verdict={v}
            active={verdict === v}
            onClick={() => setVerdict(verdict === v ? null : v)}
          />
        ))}
      </div>

      {/* Correction textarea (only for "correct") */}
      {verdict === "correct" && (
        <div className="rc-correction-wrap">
          <label className="rc-label">Koreksi respons AI</label>
          <textarea
            className="rc-textarea"
            placeholder="Tulis respons yang lebih tepat dalam bahasa daerah..."
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            rows={2}
          />
        </div>
      )}

      {/* Optional note */}
      {verdict !== null && (
        <div className="rc-correction-wrap">
          <label className="rc-label">Catatan (opsional)</label>
          <textarea
            className="rc-textarea rc-textarea--sm"
            placeholder="Penjelasan singkat untuk tim..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={1}
          />
        </div>
      )}

      {/* Submit */}
      {verdict !== null && (
        <button
          className={`rc-submit ${!canSubmit ? "rc-submit--disabled" : ""} ${submitting ? "rc-submit--loading" : ""}`}
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? (
            <span className="rc-spinner" />
          ) : (
            "Kirim Review →"
          )}
        </button>
      )}
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ reviewed, total }: { reviewed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((reviewed / total) * 100);
  return (
    <div className="stats-bar">
      <div className="stats-numbers">
        <span className="stats-done">{reviewed}</span>
        <span className="stats-sep">/</span>
        <span className="stats-total">{total}</span>
        <span className="stats-label">ditinjau hari ini</span>
      </div>
      <div className="stats-track">
        <div className="stats-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="stats-pct">{pct}%</span>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ClientContributor() {
  const [logs] = useState<ConversationLog[]>(MOCK_LOGS);
  const [reviewed, setReviewed] = useState<ReviewedLog[]>([]);

  const handleSubmit = useCallback((r: ReviewedLog) => {
    setReviewed((prev) => [...prev, r]);
  }, []);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    
    .cc-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: transparent;
      min-height: 100vh;
      color: #E8F0FF;
      position: relative;
      margin-top: -32px;
      padding-top: 32px;
    }
    
    /* ── Mesh background ── */
    .cc-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: #050B14; }
    .cc-orb {
      position: absolute; border-radius: 50%;
      filter: blur(100px); opacity: 0.38;
      animation: ccOrb 22s ease-in-out infinite alternate;
    }
    .co1 { width:580px;height:580px; background:radial-gradient(circle,#0EA5E9 0%,transparent 70%); top:-160px;left:-140px; animation-duration:26s; }
    .co2 { width:460px;height:460px; background:radial-gradient(circle,#A855F7 0%,transparent 70%); top:-60px;right:-80px; animation-duration:20s;animation-delay:-8s; }
    .co3 { width:380px;height:380px; background:radial-gradient(circle,#00C65E 0%,transparent 70%); bottom:160px;left:30%; animation-duration:30s;animation-delay:-14s;opacity:.22; }
    
    @keyframes ccOrb {
      0%   { transform:translate(0,0) scale(1); }
      50%  { transform:translate(22px,16px) scale(1.07); }
      100% { transform:translate(-16px,30px) scale(0.94); }
    }
    
    .cc-grid {
      position:fixed;inset:0;z-index:0;pointer-events:none;
      background-image:
        linear-gradient(rgba(255,255,255,0.017) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,0.017) 1px,transparent 1px);
      background-size:60px 60px;
    }
    
    .cc-main {
      position:relative;z-index:10;
      max-width:1000px;margin:0 auto;
      padding:44px 20px 100px;
    }

    .cc-header {
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.09);
      backdrop-filter:blur(20px);
      border-radius:24px;
      padding:36px 40px 32px;
      position:relative;overflow:hidden;
      margin-bottom:36px;
      animation: ccFadeUp .6s ease forwards;
    }
    .cc-header-title {
      font-family:'Syne',sans-serif;font-size:clamp(30px,4vw,44px);
      font-weight:800;letter-spacing:-1px;line-height:1.05;
      background:linear-gradient(135deg,#0EA5E9 0%,#38BDF8 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      margin-bottom:12px;
    }
    .cc-header-desc { font-size:15px;color:rgba(232,240,255,.48);line-height:1.7; }

    .cc-section {
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.08);
      backdrop-filter:blur(18px);
      border-radius:22px;padding:32px;
      margin-bottom:24px;
      animation: ccFadeUp .6s ease forwards;
    }
    .cc-section:nth-child(2) { animation-delay: 0.1s; }
    .cc-section:nth-child(3) { animation-delay: 0.2s; }
    
    .cc-section-title { font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#fff;margin-bottom:6px; }
    .cc-section-sub { font-size:14px;color:rgba(232,240,255,.4);margin-bottom:24px; }

    /* ── Stats bar ── */
    .stats-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      margin-top: 1rem;
    }
    .stats-numbers { display: flex; align-items: baseline; gap: 0.3rem; }
    .stats-done  { font-size: 1.6rem; font-family: 'Syne', sans-serif; font-weight: 800; color: #0EA5E9; }
    .stats-sep   { font-size: 1rem; color: rgba(255,255,255,0.25); }
    .stats-total { font-size: 1.6rem; font-family: 'Syne', sans-serif; font-weight: 800; color: rgba(255,255,255,0.4); }
    .stats-label { font-size: 13px; font-weight:600; color: rgba(232,240,255,0.4); margin-left: 10px; }
    .stats-track {
      flex: 1; height: 8px; border-radius: 999px;
      background: rgba(255,255,255,0.08); overflow: hidden;
    }
    .stats-fill {
      height: 100%; border-radius: 999px;
      background: linear-gradient(90deg, #0EA5E9, #38BDF8);
      box-shadow: 0 0 10px rgba(14,165,233,0.5);
      transition: width 0.5s cubic-bezier(.4,0,.2,1);
    }
    .stats-pct { font-size: 13px; font-weight: 700; color: #0EA5E9; min-width: 3rem; text-align: right; }

    /* ── Review card ── */
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .review-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 20px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      animation: fadeSlideUp 0.4s ease both;
      transition: all 0.3s;
    }
    .review-card:hover { 
        border-color: rgba(255,255,255,0.16);
        background: rgba(255,255,255,0.05);
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    }
    .review-card--done {
      padding: 20px 24px;
      background: rgba(34,197,94,0.08);
      border-color: rgba(34,197,94,0.3);
      box-shadow: 0 0 20px rgba(34,197,94,0.1) inset;
    }
    .done-inner { display: flex; align-items: center; gap: 16px; }
    .done-check {
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(34,197,94,0.2); color: #4ade80;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 800; flex-shrink: 0;
    }
    .done-title { font-size: 15px; font-weight: 700; color: #4ade80; }
    .done-sub   { font-size: 13px; color: rgba(232,240,255,0.4); margin-top: 4px; font-family: 'JetBrains Mono', monospace; }

    /* header */
    .rc-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .rc-meta   { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .rc-id     { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(232,240,255,0.3); }
    .rc-time   { font-size: 12px; font-weight: 600; color: rgba(232,240,255,0.3); }
    .rc-context { font-size: 13px; color: rgba(232,240,255,0.5); font-style: italic; text-align: right; }

    /* conversation */
    .rc-convo {
      background: rgba(0,0,0,0.3);
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .rc-turn { padding: 16px 20px; }
    .rc-turn--user { background: rgba(255,255,255,0.03); }
    .rc-turn--ai   { background: transparent; }
    .rc-divider { height: 1px; background: rgba(255,255,255,0.06); }
    .rc-speaker {
      display: block; font-size: 11px; font-weight: 700;
      letter-spacing: 1px; text-transform: uppercase;
      color: rgba(232,240,255,0.3); margin-bottom: 6px;
    }
    .rc-text { margin: 0; font-size: 16px; font-weight: 500; color: #fff; line-height: 1.6; }
    .rc-text--jv { font-family: 'Syne', sans-serif; letter-spacing: 0.5px; }

    /* actions */
    .rc-actions { display: flex; gap: 10px; flex-wrap: wrap; }

    /* correction */
    .rc-correction-wrap { display: flex; flex-direction: column; gap: 8px; margin-top:10px; }
    .rc-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(232,240,255,0.4); }
    .rc-textarea {
      background: rgba(0,0,0,0.3);
      border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      color: #fff;
      font-size: 14px;
      font-family: 'JetBrains Mono', monospace;
      padding: 14px;
      resize: vertical;
      outline: none;
      transition: all 0.2s;
      width: 100%;
    }
    .rc-textarea:focus { border-color: rgba(245,158,11,0.5); box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
    .rc-textarea--sm { min-height: unset; }

    /* submit */
    .rc-submit {
      align-self: flex-end;
      padding: 12px 24px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0EA5E9, #38BDF8);
      color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 0 15px rgba(14,165,233,0.3);
    }
    .rc-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 25px rgba(14,165,233,0.5); }
    .rc-submit--disabled { opacity: 0.4; cursor: not-allowed; background: rgba(255,255,255,0.1); box-shadow: none; color:rgba(255,255,255,0.5); }
    .rc-submit--loading { opacity: 0.8; cursor: wait; }
    
    .rc-spinner {
      display: inline-block; width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.8s linear infinite; vertical-align: middle;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* queue list */
    .queue-list { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }

    /* empty state */
    .queue-empty {
      padding: 60px 20px; text-align: center; color: rgba(232,240,255,0.4);
      font-size: 15px; border: 1px dashed rgba(255,255,255,0.15);
      border-radius: 20px; margin-top: 16px;
      background: rgba(255,255,255,0.02);
    }
    .queue-empty-icon { font-size: 40px; margin-bottom: 12px; display: block; filter: grayscale(1); opacity:0.5; }
    
    @keyframes ccFadeUp {
      from { opacity:0;transform:translateY(20px); }
      to   { opacity:1;transform:translateY(0); }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="cc-root">
        <div className="cc-bg">
          <div className="cc-orb co1" />
          <div className="cc-orb co2" />
          <div className="cc-orb co3" />
        </div>
        <div className="cc-grid" />
        
        <main className="cc-main">
          <div className="cc-header">
            <h1 className="cc-header-title">RLHF Review Console</h1>
            <p className="cc-header-desc">
              Pusat kendali ahli bahasa. Nilai respons AI, beri koreksi bahasa, dan tambahkan konteks budaya.
            </p>
          </div>

          <section className="cc-section">
            <h2 className="cc-section-title">Antrian Review</h2>
            <p className="cc-section-sub">
              {logs.length - reviewed.length} log tersisa dari {logs.length} total
            </p>
            <StatsBar reviewed={reviewed.length} total={logs.length} />
          </section>

          <section className="cc-section">
            <h2 className="cc-section-title">Log Percakapan</h2>
            <p className="cc-section-sub">
              Nilai setiap respons AI — setujui, koreksi, atau tolak.
            </p>

            {logs.length === 0 ? (
              <div className="queue-empty">
                <span className="queue-empty-icon">📭</span>
                Tidak ada log yang perlu ditinjau saat ini.
              </div>
            ) : (
              <div className="queue-list">
                {logs.map((log, i) => (
                  <ReviewCard
                    key={log.id}
                    log={log}
                    index={i}
                    onSubmit={handleSubmit}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
