"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = "learner" | "contributor" | "admin";
type UserStatus = "active" | "suspended";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  sessions: number;
}

interface ContributorRequest {
  id: string;
  name: string;
  email: string;
  reason: string;
  submitted: string;
}

interface CostEntry {
  date: string;
  tokens: number;
  cost: number;
  model: string;
}

type Tab = "overview" | "users" | "contributors" | "costs";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_USERS: User[] = [
  { id: "u1", name: "Aditya Prasetyo",  email: "aditya@mail.com",   role: "learner",     status: "active",    joined: "2026-01-12", sessions: 47  },
  { id: "u2", name: "Siti Rahayu",      email: "siti@mail.com",     role: "contributor", status: "active",    joined: "2026-02-03", sessions: 122 },
  { id: "u3", name: "Budi Santoso",     email: "budi@mail.com",     role: "learner",     status: "suspended", joined: "2026-03-18", sessions: 8   },
  { id: "u4", name: "Dewi Kusuma",      email: "dewi@mail.com",     role: "learner",     status: "active",    joined: "2026-04-01", sessions: 31  },
  { id: "u5", name: "Hendra Wijaya",    email: "hendra@mail.com",   role: "admin",       status: "active",    joined: "2025-11-05", sessions: 204 },
  { id: "u6", name: "Rina Fitriani",    email: "rina@mail.com",     role: "contributor", status: "active",    joined: "2026-01-29", sessions: 95  },
  { id: "u7", name: "Agus Setiawan",    email: "agus@mail.com",     role: "learner",     status: "active",    joined: "2026-05-10", sessions: 3   },
];

const MOCK_CONTRIBUTORS: ContributorRequest[] = [
  { id: "cr1", name: "Nanda Permata",    email: "nanda@mail.com",  reason: "Saya guru bahasa Jawa di SMA Negeri 2 Yogyakarta dan ingin membantu kualitas konten.",       submitted: "2026-05-28" },
  { id: "cr2", name: "Fajar Nugroho",    email: "fajar@mail.com",  reason: "Peneliti linguistik Jawa di UGM, spesialisasi undak-usuk dan dialek Banyumasan.",           submitted: "2026-05-27" },
  { id: "cr3", name: "Lestari Wulandari",email: "lestari@mail.com",reason: "Native speaker Jawa Krama, ingin memperbaiki respons AI yang kurang tepat penggunaan.",     submitted: "2026-05-26" },
];

const MOCK_COSTS: CostEntry[] = [
  { date: "30 Mei",  tokens: 182400, cost: 18.24, model: "claude-sonnet-4" },
  { date: "29 Mei",  tokens: 204100, cost: 20.41, model: "claude-sonnet-4" },
  { date: "28 Mei",  tokens: 97300,  cost: 9.73,  model: "claude-sonnet-4" },
  { date: "27 Mei",  tokens: 156700, cost: 15.67, model: "claude-sonnet-4" },
  { date: "26 Mei",  tokens: 211500, cost: 21.15, model: "claude-sonnet-4" },
  { date: "25 Mei",  tokens: 88900,  cost: 8.89,  model: "claude-haiku-4"  },
  { date: "24 Mei",  tokens: 130200, cost: 13.02, model: "claude-sonnet-4" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_META: Record<UserRole, { label: string; color: string; bg: string }> = {
  learner:     { label: "Learner",     color: "#94a3b8", bg: "rgba(148,163,184,0.1)"  },
  contributor: { label: "Contributor", color: "#fb923c", bg: "rgba(251,146,60,0.15)"  },
  admin:       { label: "Admin",       color: "#F43F5E", bg: "rgba(244,63,94,0.15)"  },
};

function fmt(n: number) {
  return n.toLocaleString("id-ID");
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent, delay,
}: {
  label: string; value: string; sub?: string; accent: string; delay: number;
}) {
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}ms`, borderColor: `${accent}30` }}>
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={{ color: accent }}>{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview",     label: "Overview"      },
    { id: "users",        label: "Pengguna"      },
    { id: "contributors", label: "Contributor"   },
    { id: "costs",        label: "Biaya API"     },
  ];
  return (
    <div className="tab-bar">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`tab-btn ${active === t.id ? "tab-btn--active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const totalCost = MOCK_COSTS.reduce((s, c) => s + c.cost, 0);
  const maxCost   = Math.max(...MOCK_COSTS.map((c) => c.cost));

  return (
    <div className="overview-root">
      <div className="stat-grid">
        <StatCard label="Pengguna Aktif"         value="1.203"    sub="+34 minggu ini"     accent="#34d399" delay={0}   />
        <StatCard label="API Cost Bulan Ini"     value="$124.23"  sub="batas $200"         accent="#f43f5e" delay={60}  />
        <StatCard label="Contributor Pending"    value="12"       sub="menunggu review"    accent="#fbbf24" delay={120} />
        <StatCard label="Sesi Hari Ini"          value="847"      sub="↑ 12% dari kemarin" accent="#60a5fa" delay={180} />
        <StatCard label="Total Frasa Disimpan"   value="18.491"   sub="semua pengguna"     accent="#c084fc" delay={240} />
        <StatCard label="Review RLHF Selesai"    value="3.204"    sub="akurasi 94%"        accent="#4ade80" delay={300} />
      </div>

      {/* Cost sparkline */}
      <div className="cost-chart-card">
        <div className="cost-chart-header">
          <span className="cost-chart-title">Penggunaan API — 7 Hari Terakhir</span>
          <span className="cost-chart-total">${totalCost.toFixed(2)}</span>
        </div>
        <div className="cost-bars">
          {MOCK_COSTS.slice().reverse().map((c) => (
            <div key={c.date} className="cost-bar-wrap">
              <div
                className="cost-bar-fill"
                style={{ height: `${(c.cost / maxCost) * 100}%` }}
                title={`${c.date}: $${c.cost}`}
              />
              <span className="cost-bar-label">{c.date.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Users tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const [search, setSearch]         = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [users, setUsers]           = useState<User[]>(MOCK_USERS);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (filterRole === "all" || u.role === filterRole) &&
          (u.name.toLowerCase().includes(search.toLowerCase()) ||
           u.email.toLowerCase().includes(search.toLowerCase()))
      ),
    [users, search, filterRole]
  );

  function toggleSuspend(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    );
  }

  function changeRole(id: string, role: UserRole) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  return (
    <div className="users-root">
      <div className="users-toolbar">
        <input
          className="search-input"
          placeholder="Cari nama atau email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as UserRole | "all")}
        >
          <option value="all">Semua Role</option>
          <option value="learner">Learner</option>
          <option value="contributor">Contributor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Role</th>
              <th>Status</th>
              <th className="hide-sm">Bergabung</th>
              <th className="hide-sm">Sesi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const rm = ROLE_META[u.role];
              return (
                <tr key={u.id} style={{ animationDelay: `${i * 40}ms` }}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: rm.bg, color: rm.color, border: `1px solid ${rm.color}40` }}>
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="user-name">{u.name}</p>
                        <p className="user-email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className="role-select"
                      style={{ color: rm.color, borderColor: `${rm.color}40` }}
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value as UserRole)}
                    >
                      <option value="learner">Learner</option>
                      <option value="contributor">Contributor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-dot ${u.status === "active" ? "status-dot--on" : "status-dot--off"}`}>
                      {u.status === "active" ? "Aktif" : "Suspended"}
                    </span>
                  </td>
                  <td className="hide-sm td-muted">{u.joined}</td>
                  <td className="hide-sm td-muted">{fmt(u.sessions)}</td>
                  <td>
                    <button
                      className={`action-btn ${u.status === "active" ? "action-btn--danger" : "action-btn--restore"}`}
                      onClick={() => toggleSuspend(u.id)}
                    >
                      {u.status === "active" ? "Suspend" : "Aktifkan"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="table-empty">Tidak ada pengguna ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Contributors tab ─────────────────────────────────────────────────────────

function ContributorsTab() {
  const [requests, setRequests] = useState<ContributorRequest[]>(MOCK_CONTRIBUTORS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  async function handle(id: string, action: "approve" | "reject") {
    setProcessing(id);
    await new Promise((r) => setTimeout(r, 700));
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setProcessing(null);
    if (expanded === id) setExpanded(null);
  }

  if (requests.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">✓</span>
        <p className="empty-title">Semua permintaan sudah diproses</p>
        <p className="empty-sub">Tidak ada contributor pending saat ini.</p>
      </div>
    );
  }

  return (
    <div className="contrib-list">
      {requests.map((r, i) => (
        <div key={r.id} className="contrib-card" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="contrib-header" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
            <div className="contrib-info">
              <div className="contrib-avatar">{r.name[0]}</div>
              <div>
                <p className="contrib-name">{r.name}</p>
                <p className="contrib-email">{r.email}</p>
              </div>
            </div>
            <div className="contrib-right">
              <span className="contrib-date">{r.submitted}</span>
              <span className={`expand-icon ${expanded === r.id ? "expand-icon--open" : ""}`}>›</span>
            </div>
          </div>

          {expanded === r.id && (
            <div className="contrib-body">
              <p className="contrib-label">Alasan pendaftaran</p>
              <p className="contrib-reason">{r.reason}</p>
              <div className="contrib-actions">
                <button
                  className="ca-btn ca-btn--approve"
                  onClick={() => handle(r.id, "approve")}
                  disabled={processing === r.id}
                >
                  {processing === r.id ? <span className="mini-spin" /> : "✓ Terima"}
                </button>
                <button
                  className="ca-btn ca-btn--reject"
                  onClick={() => handle(r.id, "reject")}
                  disabled={processing === r.id}
                >
                  {processing === r.id ? <span className="mini-spin" /> : "✕ Tolak"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Costs tab ────────────────────────────────────────────────────────────────

function CostsTab() {
  const total  = MOCK_COSTS.reduce((s, c) => s + c.cost, 0);
  const tokens = MOCK_COSTS.reduce((s, c) => s + c.tokens, 0);

  return (
    <div className="costs-root">
      <div className="costs-summary">
        <div className="cost-kpi">
          <span className="cost-kpi-label">Total 7 hari</span>
          <span className="cost-kpi-value">${total.toFixed(2)}</span>
        </div>
        <div className="cost-kpi">
          <span className="cost-kpi-label">Total Token</span>
          <span className="cost-kpi-value">{(tokens / 1_000_000).toFixed(2)}M</span>
        </div>
        <div className="cost-kpi">
          <span className="cost-kpi-label">Rata-rata / hari</span>
          <span className="cost-kpi-value">${(total / MOCK_COSTS.length).toFixed(2)}</span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Model</th>
              <th>Token</th>
              <th>Biaya</th>
              <th>Proporsi</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COSTS.map((c, i) => {
              const pct = (c.cost / total) * 100;
              return (
                <tr key={c.date} style={{ animationDelay: `${i * 40}ms` }}>
                  <td className="td-muted">{c.date}</td>
                  <td>
                    <span className="model-chip">{c.model}</span>
                  </td>
                  <td className="td-num">{fmt(c.tokens)}</td>
                  <td className="td-num td-cost">${c.cost.toFixed(2)}</td>
                  <td>
                    <div className="pct-bar-wrap">
                      <div className="pct-bar-fill" style={{ width: `${pct}%` }} />
                      <span className="pct-num">{pct.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ClientAdmin() {
  const [tab, setTab] = useState<Tab>("overview");

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    .ca-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: transparent;
      min-height: 100vh;
      color: #E8F0FF;
      position: relative;
      margin-top: -32px;
      padding-top: 32px;
    }
    
    /* ── Mesh background ── */
    .ca-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: #050B14; }
    .ca-orb {
      position: absolute; border-radius: 50%;
      filter: blur(100px); opacity: 0.38;
      animation: caOrb 22s ease-in-out infinite alternate;
    }
    .co1 { width:580px;height:580px; background:radial-gradient(circle,#E11D48 0%,transparent 70%); top:-160px;left:-140px; animation-duration:26s; } /* Crimson Red */
    .co2 { width:460px;height:460px; background:radial-gradient(circle,#9333EA 0%,transparent 70%); top:-60px;right:-80px; animation-duration:20s;animation-delay:-8s; } /* Deep Purple */
    .co3 { width:380px;height:380px; background:radial-gradient(circle,#F43F5E 0%,transparent 70%); bottom:160px;left:30%; animation-duration:30s;animation-delay:-14s;opacity:.22; }
    
    @keyframes caOrb {
      0%   { transform:translate(0,0) scale(1); }
      50%  { transform:translate(22px,16px) scale(1.07); }
      100% { transform:translate(-16px,30px) scale(0.94); }
    }
    
    .ca-grid {
      position:fixed;inset:0;z-index:0;pointer-events:none;
      background-image:
        linear-gradient(rgba(255,255,255,0.017) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,0.017) 1px,transparent 1px);
      background-size:60px 60px;
    }
    
    .ca-main {
      position:relative;z-index:10;
      max-width:1100px;margin:0 auto;
      padding:44px 20px 100px;
    }

    .ca-header {
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.09);
      backdrop-filter:blur(20px);
      border-radius:24px;
      padding:36px 40px 32px;
      position:relative;overflow:hidden;
      margin-bottom:24px;
      animation: fadeUp .6s ease forwards;
    }
    .ca-header-title {
      font-family:'Syne',sans-serif;font-size:clamp(30px,4vw,44px);
      font-weight:800;letter-spacing:-1px;line-height:1.05;
      background:linear-gradient(135deg,#F43F5E 0%,#9333EA 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      margin-bottom:12px;
    }
    .ca-header-desc { font-size:15px;color:rgba(232,240,255,.48);line-height:1.7; }

    .admin-section {
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.08);
      backdrop-filter:blur(18px);
      border-radius:22px;padding:32px;
      margin-bottom:24px;
      animation: fadeUp .6s ease forwards;
    }

    /* ── Keyframes ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Stat grid ── */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    @media (max-width: 768px) { .stat-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 480px) { .stat-grid { grid-template-columns: 1fr; } }

    .stat-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 24px;
      animation: fadeUp 0.35s ease both;
      transition: all 0.3s;
    }
    .stat-card:hover { 
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      transform: translateY(-4px);
      background: rgba(255,255,255,0.06);
    }
    .stat-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(232,240,255,0.4); margin-bottom: 8px; }
    .stat-value { font-size: 32px; font-family: 'Syne', sans-serif; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1; }
    .stat-sub   { font-size: 13px; color: rgba(232,240,255,0.4); margin-top: 8px; }

    /* ── Cost chart ── */
    .cost-chart-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 20px;
      padding: 32px;
      margin-top: 24px;
      animation: fadeUp 0.4s ease 0.2s both;
    }
    .cost-chart-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; }
    .cost-chart-title { font-size: 13px; font-weight: 700; color: rgba(232,240,255,0.5); letter-spacing: 1px; text-transform: uppercase; }
    .cost-chart-total { font-size: 28px; font-family: 'Syne', sans-serif; font-weight: 800; color: #f43f5e; }
    
    .cost-bars { display: flex; align-items: flex-end; gap: 12px; height: 120px; }
    .cost-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end; }
    .cost-bar-fill {
      width: 100%; max-width: 40px;
      border-radius: 6px 6px 0 0;
      background: linear-gradient(180deg, #f43f5e, #be123c);
      box-shadow: 0 0 15px rgba(244,63,94,0.3);
      min-height: 4px; transition: height 0.6s cubic-bezier(.4,0,.2,1);
    }
    .cost-bar-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(232,240,255,0.4); }

    /* ── Tab bar ── */
    .tab-bar {
      display: flex; gap: 8px;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 6px;
      margin-bottom: 24px; flex-wrap: wrap;
    }
    .tab-btn {
      flex: 1; padding: 10px 16px; border-radius: 8px;
      font-size: 14px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
      color: rgba(232,240,255,0.5); background: transparent;
      border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .tab-btn:hover { color: #fff; background: rgba(255,255,255,0.03); }
    .tab-btn--active {
      background: rgba(255,255,255,0.1); color: #fff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }

    /* ── Table ── */
    .table-wrap { overflow-x: auto; margin-top: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.2); }
    .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .data-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); }
    .data-table th {
      padding: 16px 20px; text-align: left; font-size: 11px; font-weight: 700;
      letter-spacing: 1px; text-transform: uppercase; color: rgba(232,240,255,0.4);
    }
    .data-table tbody tr {
      border-bottom: 1px solid rgba(255,255,255,0.04);
      animation: fadeUp 0.3s ease both; transition: background 0.2s;
    }
    .data-table tbody tr:last-child { border-bottom: none; }
    .data-table tbody tr:hover { background: rgba(255,255,255,0.04); }
    .data-table td { padding: 16px 20px; color: rgba(232,240,255,0.85); vertical-align: middle; }
    
    .td-muted { color: rgba(232,240,255,0.4) !important; font-size: 13px; font-family: 'JetBrains Mono', monospace; }
    .td-num   { font-variant-numeric: tabular-nums; font-family: 'JetBrains Mono', monospace; }
    .td-cost  { color: #f43f5e !important; font-weight: 700; }
    .table-empty { text-align: center; color: rgba(232,240,255,0.3); padding: 40px !important; font-style: italic; }
    @media (max-width: 580px) { .hide-sm { display: none; } }

    /* ── User cell ── */
    .user-cell  { display: flex; align-items: center; gap: 12px; }
    .user-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; flex-shrink: 0; }
    .user-name  { font-weight: 600; font-size: 14px; color: #fff; }
    .user-email { font-size: 12px; color: rgba(232,240,255,0.4); margin-top: 2px; }

    /* ── Role select ── */
    .role-select {
      appearance: none; background: rgba(0,0,0,0.3); border: 1px solid;
      border-radius: 8px; font-size: 12px; font-weight: 700;
      padding: 6px 10px; cursor: pointer; outline: none;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .role-select option { background: #050B14; }

    /* ── Status dot ── */
    .status-dot { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
    .status-dot::before { content: ''; width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
    .status-dot--on  { color: #4ade80; }
    .status-dot--on::before  { background: #4ade80; box-shadow: 0 0 10px rgba(74,222,128,0.5); }
    .status-dot--off { color: #f87171; }
    .status-dot--off::before { background: #f87171; box-shadow: 0 0 10px rgba(248,113,113,0.5); }

    /* ── Action button ── */
    .action-btn {
      font-size: 12px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 8px 14px; border-radius: 8px; border: 1.5px solid;
      cursor: pointer; transition: all 0.2s; background: transparent;
    }
    .action-btn--danger  { color: #f87171; border-color: rgba(248,113,113,0.4); }
    .action-btn--danger:hover  { background: rgba(248,113,113,0.15); box-shadow: 0 0 15px rgba(248,113,113,0.2); }
    .action-btn--restore { color: #4ade80; border-color: rgba(74,222,128,0.4); }
    .action-btn--restore:hover { background: rgba(74,222,128,0.15); box-shadow: 0 0 15px rgba(74,222,128,0.2); }

    /* ── Search / filter ── */
    .users-toolbar  { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
    .search-input {
      flex: 1; min-width: 200px; background: rgba(0,0,0,0.3);
      border: 1.5px solid rgba(255,255,255,0.1); border-radius: 12px;
      color: #fff; font-size: 14px; padding: 12px 16px; outline: none; transition: all 0.2s;
    }
    .search-input:focus  { border-color: #F43F5E; box-shadow: 0 0 0 3px rgba(244,63,94,0.15); }
    .search-input::placeholder { color: rgba(232,240,255,0.3); }
    .filter-select {
      background: rgba(0,0,0,0.3); border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 12px; color: #fff; font-size: 14px; padding: 12px 16px;
      cursor: pointer; outline: none; font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .filter-select option { background: #050B14; }

    /* ── Contributor cards ── */
    .contrib-list { display: flex; flex-direction: column; gap: 16px; }
    .contrib-card {
      border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;
      overflow: hidden; animation: fadeUp 0.3s ease both; transition: all 0.2s;
      background: rgba(0,0,0,0.2);
    }
    .contrib-card:hover { border-color: rgba(251,191,36,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.2); transform: translateY(-2px); }
    .contrib-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; cursor: pointer; background: rgba(255,255,255,0.02); transition: background 0.2s;
    }
    .contrib-header:hover { background: rgba(255,255,255,0.05); }
    .contrib-info   { display: flex; align-items: center; gap: 16px; }
    .contrib-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(251,191,36,0.15); color: #fbbf24;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 800; flex-shrink: 0;
      border: 1px solid rgba(251,191,36,0.3);
    }
    .contrib-name  { font-weight: 700; font-size: 15px; color: #fff; }
    .contrib-email { font-size: 13px; color: rgba(232,240,255,0.4); margin-top: 2px; }
    .contrib-right { display: flex; align-items: center; gap: 16px; }
    .contrib-date  { font-size: 13px; color: rgba(232,240,255,0.3); font-family: 'JetBrains Mono', monospace; }
    .expand-icon   { color: rgba(232,240,255,0.5); font-size: 20px; transition: transform 0.3s; line-height: 1; }
    .expand-icon--open { transform: rotate(90deg); color: #fff; }
    
    .contrib-body  { padding: 20px 24px 24px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.4); }
    .contrib-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(232,240,255,0.4); margin-bottom: 8px; }
    .contrib-reason { font-size: 15px; color: rgba(232,240,255,0.8); line-height: 1.6; }
    .contrib-actions { display: flex; gap: 12px; margin-top: 20px; }
    .ca-btn {
      padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
      border: 1.5px solid; cursor: pointer; background: transparent; transition: all 0.2s;
      min-width: 120px; display: flex; align-items: center; justify-content: center;
    }
    .ca-btn--approve { color: #4ade80; border-color: rgba(74,222,128,0.5); }
    .ca-btn--approve:hover:not(:disabled) { background: rgba(74,222,128,0.15); box-shadow: 0 0 20px rgba(74,222,128,0.2); transform: translateY(-2px); }
    .ca-btn--reject  { color: #f87171; border-color: rgba(248,113,113,0.5); }
    .ca-btn--reject:hover:not(:disabled)  { background: rgba(248,113,113,0.15); box-shadow: 0 0 20px rgba(248,113,113,0.2); transform: translateY(-2px); }
    .ca-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Empty state ── */
    .empty-state {
      padding: 60px 20px; text-align: center; border: 1px dashed rgba(255,255,255,0.15);
      border-radius: 20px; background: rgba(255,255,255,0.02);
    }
    .empty-icon  { display: block; font-size: 40px; margin-bottom: 16px; color: #4ade80; }
    .empty-title { font-size: 18px; font-weight: 700; color: #fff; }
    .empty-sub   { font-size: 14px; color: rgba(232,240,255,0.4); margin-top: 8px; }

    /* ── Costs tab ── */
    .costs-summary { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
    .cost-kpi {
      flex: 1; min-width: 200px; background: rgba(255,255,255,0.03);
      border: 1px solid rgba(244,63,94,0.3); border-radius: 16px;
      padding: 24px; display: flex; flex-direction: column; gap: 8px;
    }
    .cost-kpi-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(232,240,255,0.4); }
    .cost-kpi-value { font-size: 32px; font-family: 'Syne', sans-serif; font-weight: 800; color: #f43f5e; font-variant-numeric: tabular-nums; line-height: 1;}
    .model-chip {
      font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 6px;
      background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.3); white-space: nowrap;
    }
    .pct-bar-wrap { display: flex; align-items: center; gap: 12px; min-width: 120px; }
    .pct-bar-fill {
      height: 8px; border-radius: 999px;
      background: linear-gradient(90deg, #f43f5e, #be123c);
      box-shadow: 0 0 10px rgba(244,63,94,0.4);
      transition: width 0.5s cubic-bezier(.4,0,.2,1); flex-shrink: 0; min-width: 4px;
    }
    .pct-num { font-size: 13px; color: rgba(232,240,255,0.4); font-variant-numeric: tabular-nums; font-family: 'JetBrains Mono', monospace;}
  `;

  return (
    <>
      <style>{css}</style>
      <div className="ca-root">
        <div className="ca-bg">
          <div className="ca-orb co1" />
          <div className="ca-orb co2" />
          <div className="ca-orb co3" />
        </div>
        <div className="ca-grid" />
        
        <main className="ca-main">
          <div className="ca-header">
            <h1 className="ca-header-title">Admin Command Center</h1>
            <p className="ca-header-desc">
              Pusat komando utama. Kelola akses pengguna, pantau biaya API AI, dan tinjau status kontributor.
            </p>
          </div>

          <div className="admin-section">
            <TabBar active={tab} onChange={setTab} />

            {tab === "overview"     && <OverviewTab />}
            {tab === "users"        && <UsersTab />}
            {tab === "contributors" && <ContributorsTab />}
            {tab === "costs"        && <CostsTab />}
          </div>
        </main>
      </div>
    </>
  );
}
