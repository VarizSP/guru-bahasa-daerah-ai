"use client";
import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  .bs-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent;
    min-height: 100vh;
    color: #E8F0FF;
    position: relative;
    margin-top: -32px;
    padding-top: 32px;
  }

  /* ── Mesh background ── */
  .bs-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: #050B14; }
  .bs-orb {
    position: absolute; border-radius: 50%;
    filter: blur(100px); opacity: 0.38;
    animation: bsOrb 22s ease-in-out infinite alternate;
  }
  .bo1 { width:580px;height:580px; background:radial-gradient(circle,#A855F7 0%,transparent 70%); top:-160px;left:-140px; animation-duration:26s; }
  .bo2 { width:460px;height:460px; background:radial-gradient(circle,#0EA5E9 0%,transparent 70%); top:-60px;right:-80px; animation-duration:20s;animation-delay:-8s; }
  .bo3 { width:380px;height:380px; background:radial-gradient(circle,#00C65E 0%,transparent 70%); bottom:160px;left:30%; animation-duration:30s;animation-delay:-14s;opacity:.22; }
  .bo4 { width:320px;height:320px; background:radial-gradient(circle,#6366F1 0%,transparent 70%); bottom:80px;right:15%; animation-duration:22s;animation-delay:-5s;opacity:.25; }
  @keyframes bsOrb {
    0%   { transform:translate(0,0) scale(1); }
    50%  { transform:translate(22px,16px) scale(1.07); }
    100% { transform:translate(-16px,30px) scale(0.94); }
  }

  /* ── Grid overlay ── */
  .bs-grid {
    position:fixed;inset:0;z-index:0;pointer-events:none;
    background-image:
      linear-gradient(rgba(255,255,255,0.017) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,0.017) 1px,transparent 1px);
    background-size:60px 60px;
  }
  .bs-grain {
    position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.022;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px 200px;
  }

  /* ── Main ── */
  .bs-main {
    position:relative;z-index:10;
    max-width:1200px;margin:0 auto;
    padding:44px 0 100px;
  }

  /* ── Page header ── */
  .bs-header {
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.09);
    backdrop-filter:blur(20px);
    border-radius:24px;
    padding:36px 40px 32px;
    position:relative;overflow:hidden;
    margin-bottom:36px;
    opacity:0;animation:bsFadeUp .6s ease .05s forwards;
  }
  .bs-header-shimmer-l {
    position:absolute;top:-80px;left:-80px;width:300px;height:300px;
    border-radius:50%;pointer-events:none;
    background:radial-gradient(circle,rgba(168,85,247,.18) 0%,transparent 70%);
  }
  .bs-header-shimmer-r {
    position:absolute;bottom:-60px;right:-40px;width:240px;height:240px;
    border-radius:50%;pointer-events:none;
    background:radial-gradient(circle,rgba(14,165,233,.14) 0%,transparent 70%);
  }
  .bs-eyebrow {
    display:inline-flex;align-items:center;gap:7px;
    font-size:11px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;
    color:#A78BFA;margin-bottom:14px;
    background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.22);
    padding:4px 13px;border-radius:20px;position:relative;z-index:1;
  }
  .bs-eyebrow-dot {
    width:6px;height:6px;border-radius:50%;background:#A78BFA;
    animation:bsPulse 2s ease infinite;
  }
  @keyframes bsPulse {
    0%,100% { box-shadow:0 0 0 0 rgba(167,139,250,.7); }
    50%      { box-shadow:0 0 0 6px rgba(167,139,250,0); }
  }
  .bs-page-title {
    font-family:'Syne',sans-serif;font-size:clamp(34px,5vw,54px);
    font-weight:800;letter-spacing:-2px;line-height:1.05;
    background:linear-gradient(135deg,#C084FC 0%,#818CF8 35%,#38BDF8 70%,#67E8F9 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    background-size:200% 200%;
    animation:bsGrad 7s ease infinite;
    margin-bottom:12px;position:relative;z-index:1;
  }
  @keyframes bsGrad {
    0%   { background-position:0% 50%; }
    50%  { background-position:100% 50%; }
    100% { background-position:0% 50%; }
  }
  .bs-page-desc {
    font-size:15px;color:rgba(232,240,255,.48);line-height:1.7;
    max-width:520px;position:relative;z-index:1;
  }
  .bs-header-meta {
    display:flex;gap:20px;margin-top:22px;position:relative;z-index:1;flex-wrap:wrap;
  }
  .bs-meta-pill {
    display:flex;align-items:center;gap:7px;
    padding:6px 14px;border-radius:20px;font-size:12.5px;font-weight:600;
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
    color:rgba(232,240,255,.6);
  }
  .bs-meta-pill-dot { width:6px;height:6px;border-radius:50%; }

  /* ── Toolbar ── */
  .bs-toolbar {
    display:flex;align-items:center;justify-content:space-between;
    margin-bottom:24px;flex-wrap:wrap;gap:14px;
    opacity:0;animation:bsFadeUp .55s ease .15s forwards;
  }
  .bs-toolbar-left { display:flex;align-items:center;gap:10px; }
  .bs-search {
    display:flex;align-items:center;gap:10px;
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
    backdrop-filter:blur(12px);border-radius:12px;
    padding:10px 16px;transition:all .25s;
  }
  .bs-search:focus-within { border-color:rgba(167,139,250,.4);box-shadow:0 0 0 3px rgba(167,139,250,.08); }
  .bs-search-icon { font-size:15px;opacity:.45; }
  .bs-search input {
    background:none;border:none;outline:none;color:#E8F0FF;
    font-size:13.5px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;
    width:220px;
  }
  .bs-search input::placeholder { color:rgba(232,240,255,.3); }
  .bs-filter-group { display:flex;gap:8px; }
  .bs-filter-btn {
    padding:8px 16px;border-radius:10px;font-size:12.5px;font-weight:600;
    border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);
    color:rgba(232,240,255,.5);cursor:pointer;transition:all .2s;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .bs-filter-btn:hover { background:rgba(255,255,255,.08);color:#E8F0FF; }
  .bs-filter-btn.active {
    background:rgba(167,139,250,.15);border-color:rgba(167,139,250,.4);
    color:#C084FC;box-shadow:0 0 14px rgba(167,139,250,.12);
  }
  .bs-add-btn {
    display:inline-flex;align-items:center;gap:8px;
    padding:10px 20px;border-radius:12px;font-size:13.5px;font-weight:700;
    background:linear-gradient(135deg,#A855F7,#6366F1);
    color:#fff;border:none;cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    box-shadow:0 0 24px rgba(168,85,247,.35);
    transition:all .3s cubic-bezier(.34,1.56,.64,1);
  }
  .bs-add-btn:hover { transform:translateY(-2px) scale(1.03);box-shadow:0 0 40px rgba(168,85,247,.5); }

  /* ── Card grid ── */
  .bs-grid-cards {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(300px,1fr));
    gap:18px;
  }

  /* ── Flashcard ── */
  .fc {
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.08);
    backdrop-filter:blur(18px);
    border-radius:22px;padding:24px 24px 20px;
    position:relative;overflow:hidden;
    cursor:pointer;
    transition:all .35s cubic-bezier(.34,1.3,.64,1);
    opacity:0;
  }
  .fc.visible { animation:bsFadeUp .55s ease forwards; }
  .fc:hover {
    transform:translateY(-6px);
    background:rgba(255,255,255,.07);
  }
  .fc-top-glow {
    position:absolute;top:-50px;right:-50px;width:180px;height:180px;
    border-radius:50%;pointer-events:none;opacity:0;transition:opacity .35s;
  }
  .fc:hover .fc-top-glow { opacity:1; }

  /* Top row */
  .fc-toprow {
    display:flex;align-items:flex-start;justify-content:space-between;
    margin-bottom:18px;gap:10px;
  }
  .fc-lang-badge {
    display:inline-flex;align-items:center;gap:5px;
    font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;
    padding:4px 10px;border-radius:20px;
  }
  .fc-lang-dot { width:5px;height:5px;border-radius:50%; }
  .fc-action-btns { display:flex;gap:8px;align-items:center; }
  .fc-action-btn {
    width:32px;height:32px;border-radius:9px;border:none;cursor:pointer;
    display:flex;align-items:center;justify-content:center;font-size:14px;
    background:rgba(255,255,255,.07);transition:all .2s;
  }
  .fc-action-btn:hover { background:rgba(255,255,255,.14);transform:scale(1.1); }
  .fc-action-btn.playing { background:rgba(167,139,250,.2);box-shadow:0 0 12px rgba(167,139,250,.4); }
  .fc-fav-btn.active { background:rgba(245,158,11,.15);color:#F59E0B; }

  /* Phrase */
  .fc-phrase {
    font-family:'Syne',sans-serif;font-size:18px;font-weight:800;
    letter-spacing:-.4px;line-height:1.3;margin-bottom:10px;
  }
  .fc-translation {
    font-size:13.5px;color:rgba(232,240,255,.45);line-height:1.6;
    margin-bottom:18px;font-weight:400;
  }

  /* Divider */
  .fc-divider { height:1px;background:rgba(255,255,255,.06);margin-bottom:16px; }

  /* Bottom row */
  .fc-bottomrow {
    display:flex;align-items:center;justify-content:space-between;
  }
  .fc-context {
    font-size:11.5px;color:rgba(232,240,255,.3);font-weight:500;
    display:flex;align-items:center;gap:5px;
  }
  .fc-context-icon { font-size:12px; }
  .fc-mastery {
    display:flex;align-items:center;gap:6px;
  }
  .fc-mastery-label { font-size:11px;color:rgba(232,240,255,.3);font-weight:600; }
  .fc-mastery-dots { display:flex;gap:3px; }
  .fc-mastery-dot {
    width:7px;height:7px;border-radius:50%;
    background:rgba(255,255,255,.1);
    transition:background .3s;
  }

  /* ── Empty state ── */
  .bs-empty {
    grid-column:1/-1;text-align:center;
    padding:80px 20px;
    opacity:0;animation:bsFadeUp .5s ease .2s forwards;
  }
  .bs-empty-icon { font-size:52px;margin-bottom:16px; }
  .bs-empty-title { font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:rgba(232,240,255,.5);margin-bottom:8px; }
  .bs-empty-desc { font-size:14px;color:rgba(232,240,255,.25); }

  /* ── Study mode banner ── */
  .bs-study-banner {
    background:rgba(167,139,250,.07);
    border:1px solid rgba(167,139,250,.18);
    border-radius:16px;padding:16px 22px;
    display:flex;align-items:center;justify-content:space-between;
    margin-bottom:28px;flex-wrap:wrap;gap:12px;
    opacity:0;animation:bsFadeUp .55s ease .25s forwards;
  }
  .bs-study-left { display:flex;align-items:center;gap:12px; }
  .bs-study-icon { font-size:24px; }
  .bs-study-title { font-size:14px;font-weight:700;color:rgba(232,240,255,.85);margin-bottom:2px; }
  .bs-study-sub   { font-size:12px;color:rgba(232,240,255,.35); }
  .bs-study-btn {
    padding:9px 20px;border-radius:10px;font-size:13px;font-weight:700;
    background:linear-gradient(135deg,#A855F7,#6366F1);
    color:#fff;border:none;cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    box-shadow:0 0 18px rgba(168,85,247,.3);
    transition:all .25s;
  }
  .bs-study-btn:hover { transform:translateY(-1px);box-shadow:0 0 28px rgba(168,85,247,.45); }

  /* ── Animations ── */
  @keyframes bsFadeUp {
    from { opacity:0;transform:translateY(20px); }
    to   { opacity:1;transform:translateY(0); }
  }

  /* ── Responsive ── */
  @media(max-width:900px){
    .bs-header { padding:28px 24px; }
    .bs-grid-cards { grid-template-columns:1fr; }
    .bs-search input { width:160px; }
  }
  @media(max-width:600px){
    .bs-filter-group { flex-wrap:wrap; }
    .bs-toolbar { flex-direction:column;align-items:stretch; }
    .bs-toolbar-left { flex-wrap:wrap; }
  }
`;

const LANG_COLORS = {
  Jawa:   { bg:"rgba(0,198,94,.12)",   color:"#00C65E",  glow:"rgba(0,198,94,.15)"   },
  Sunda:  { bg:"rgba(56,189,248,.12)", color:"#38BDF8",  glow:"rgba(56,189,248,.15)" },
  Bali:   { bg:"rgba(192,132,252,.12)",color:"#C084FC",  glow:"rgba(192,132,252,.15)"},
  Madura: { bg:"rgba(245,158,11,.12)", color:"#F59E0B",  glow:"rgba(245,158,11,.15)" },
} as Record<string, { bg:string; color:string; glow:string }>;

const PHRASES_INIT = [
  { id:1, phrase:"Pinten reginipun menika?", translation:"Berapa harga ini? (sopan)", lang:"Jawa", context:"Pasar Beringharjo", mastery:3, fav:false },
  { id:2, phrase:"Hapunten, abdi lepat.", translation:"Maaf, saya salah.", lang:"Sunda", context:"Warung Sunda", mastery:4, fav:true },
  { id:3, phrase:"Nuwun sewu, saged takon?", translation:"Permisi, boleh bertanya?", lang:"Jawa", context:"Umum", mastery:2, fav:false },
  { id:4, phrase:"Punten, ka dieu heula.", translation:"Permisi, ke sini dulu.", lang:"Sunda", context:"Jalan", mastery:1, fav:false },
  { id:5, phrase:"Titiang nunas pangampura.", translation:"Saya memohon maaf.", lang:"Bali", context:"Upacara", mastery:5, fav:true },
  { id:6, phrase:"Saking pundi Panjenengan?", translation:"Anda dari mana? (sangat hormat)", lang:"Jawa", context:"Perkenalan", mastery:2, fav:false },
  { id:7, phrase:"Wilujeng sumping.", translation:"Selamat datang.", lang:"Sunda", context:"Tamu", mastery:5, fav:true },
  { id:8, phrase:"Matur nuwun sanget.", translation:"Terima kasih banyak.", lang:"Jawa", context:"Umum", mastery:4, fav:false },
  { id:9, phrase:"Om Swastiastu.", translation:"Salam pembuka (semoga selamat).", lang:"Bali", context:"Upacara", mastery:3, fav:false },
];

const FILTERS = ["Semua","Jawa","Sunda","Bali","Favorit"];

export default function ClientBukuSaku() {
  const [phrases, setPhrases]     = useState(PHRASES_INIT);
  const [filter, setFilter]       = useState("Semua");
  const [search, setSearch]       = useState("");
  const [playing, setPlaying]     = useState<number | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [studyCardIndex, setStudyCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studySessionPhrases, setStudySessionPhrases] = useState<typeof PHRASES_INIT>([]);
  const cardRefs                  = useRef<(HTMLDivElement | null)[]>([]);
  const activeAudioRef            = useRef<HTMLAudioElement | null>(null);

  // Intersection observer for staggered entrance
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    cardRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [phrases, filter, search]);

  const filtered = phrases.filter(p => {
    const matchFilter =
      filter === "Semua" ? true :
      filter === "Favorit" ? p.fav :
      p.lang === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || p.phrase.toLowerCase().includes(q) || p.translation.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const toggleFav = (id: number) =>
    setPhrases(ps => ps.map(p => p.id === id ? {...p, fav:!p.fav} : p));

  const handlePlay = (id: number) => {
    const phraseObj = phrases.find(p => p.id === id);
    if (!phraseObj) return;

    // 1. Matikan audio yang sedang berjalan sebelumnya (mencegah suara bertumpuk)
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 2. Set ikon menjadi aktif
    setPlaying(id);
    
    const fallbackTTS = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phraseObj.phrase);
        if (phraseObj.lang.toLowerCase() === "jawa") utterance.lang = "jv-ID";
        else if (phraseObj.lang.toLowerCase() === "sunda") utterance.lang = "su-ID";
        else utterance.lang = "id-ID";
        
        utterance.onend = () => setPlaying(p => p === id ? null : p);
        utterance.onerror = () => {
          setTimeout(() => setPlaying(p => p === id ? null : p), 1500);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setPlaying(p => p === id ? null : p), 1500);
      }
    };

    let langCode = "id";
    if (phraseObj.lang.toLowerCase() === "jawa") langCode = "jv";
    else if (phraseObj.lang.toLowerCase() === "sunda") langCode = "su";
    
    const text = encodeURIComponent(phraseObj.phrase);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${text}`;
    
    const audio = new Audio(url);
    activeAudioRef.current = audio; // Simpan referensi audio yang aktif

    audio.onended = () => setPlaying(p => p === id ? null : p);
    audio.onerror = fallbackTTS;
    
    audio.play().catch(err => {
      console.error("Audio play error:", err);
      fallbackTTS();
    });
  };

  const masteryLabel = (n: number) =>
    n >= 5 ? "Mahir" : n >= 3 ? "Sedang" : "Baru";

  const masteryColor = (n: number) =>
    n >= 5 ? "#00C65E" : n >= 3 ? "#F59E0B" : "#C084FC";

  const studyPhrases = phrases.filter(p => p.mastery < 3);

  return (
    <>
      <style>{css}</style>
      <div className="bs-root">
        {/* Background */}
        <div className="bs-bg">
          <div className="bs-orb bo1"/><div className="bs-orb bo2"/>
          <div className="bs-orb bo3"/><div className="bs-orb bo4"/>
        </div>
        <div className="bs-grid"/>
        <div className="bs-grain"/>

        <main className="bs-main">

          {/* ── Page header ── */}
          <div className="bs-header">
            <div className="bs-header-shimmer-l"/>
            <div className="bs-header-shimmer-r"/>
            <div className="bs-eyebrow">
              <span className="bs-eyebrow-dot"/>
              📖 Koleksi Kosakata
            </div>
            <h1 className="bs-page-title">Buku Saku</h1>
            <p className="bs-page-desc">
              Frasa favorit dan kartu belajar otomatis dari kesalahan percakapanmu. Simpan, ulang, dan kuasai!
            </p>
            <div className="bs-header-meta">
              {[
                { dot:"#00C65E", text:`${phrases.length} Frasa tersimpan` },
                { dot:"#F59E0B", text:`${phrases.filter(p=>p.fav).length} Favorit` },
                { dot:"#C084FC", text:`${phrases.filter(p=>p.mastery>=5).length} Sudah mahir` },
                { dot:"#38BDF8", text:"3 Bahasa daerah" },
              ].map(m => (
                <div className="bs-meta-pill" key={m.text}>
                  <span className="bs-meta-pill-dot" style={{background:m.dot, boxShadow:`0 0 6px ${m.dot}`}}/>
                  {m.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Study mode banner ── */}
          <div className="bs-study-banner">
            <div className="bs-study-left">
              <span className="bs-study-icon">🎴</span>
              <div>
                <div className="bs-study-title">Mode Belajar Kilat</div>
                <div className="bs-study-sub">Ulangi {phrases.filter(p=>p.mastery<3).length} frasa yang belum kamu kuasai</div>
              </div>
            </div>
            <button className="bs-study-btn" onClick={() => {
              if (studyPhrases.length > 0) {
                setStudySessionPhrases(studyPhrases);
                setStudyMode(true);
                setStudyCardIndex(0);
                setIsFlipped(false);
              } else {
                alert("Hebat! Kamu sudah menguasai semua frasa.");
              }
            }}>
              Mulai Sesi ✦
            </button>
          </div>

          {/* ── Toolbar ── */}
          <div className="bs-toolbar">
            <div className="bs-toolbar-left">
              <div className="bs-search">
                <span className="bs-search-icon">🔍</span>
                <input
                  placeholder="Cari frasa atau terjemahan..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="bs-filter-group">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`bs-filter-btn${filter===f?" active":""}`}
                    onClick={() => setFilter(f)}
                  >{f}</button>
                ))}
              </div>
            </div>
            <button className="bs-add-btn">
              <span style={{fontSize:16}}>＋</span> Tambah Frasa
            </button>
          </div>

          {/* ── Cards ── */}
          <div className="bs-grid-cards">
            {filtered.length === 0 ? (
              <div className="bs-empty">
                <div className="bs-empty-icon">📭</div>
                <div className="bs-empty-title">Tidak ada frasa ditemukan</div>
                <div className="bs-empty-desc">Coba ubah filter atau kata kunci pencarianmu.</div>
              </div>
            ) : filtered.map((p, i) => {
              const lc = LANG_COLORS[p.lang] || LANG_COLORS.Jawa;
              return (
                <div
                  key={p.id}
                  className="fc"
                  ref={el => { cardRefs.current[i] = el; }}
                  style={{ animationDelay:`${(i % 10) * 0.07}s` }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = lc.color + "55";
                    e.currentTarget.style.boxShadow = `0 16px 50px ${lc.glow}, 0 0 0 1px ${lc.color}33`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Top glow orb */}
                  <div className="fc-top-glow" style={{background:`radial-gradient(circle at top right,${lc.glow},transparent 70%)`}}/>

                  {/* Top row */}
                  <div className="fc-toprow">
                    <div className="fc-lang-badge" style={{background:lc.bg, color:lc.color, border:`1px solid ${lc.color}33`}}>
                      <span className="fc-lang-dot" style={{background:lc.color, boxShadow:`0 0 6px ${lc.color}`}}/>
                      {p.lang}
                    </div>
                    <div className="fc-action-btns">
                      <button
                        className={`fc-action-btn${p.fav?" fc-fav-btn active":""}`}
                        onClick={e => { e.stopPropagation(); toggleFav(p.id); }}
                        title="Favorit"
                        style={{color: p.fav ? "#F59E0B" : "rgba(232,240,255,.4)"}}
                      >
                        {p.fav ? "★" : "☆"}
                      </button>
                      <button
                        className={`fc-action-btn${playing===p.id?" playing":""}`}
                        onClick={e => { e.stopPropagation(); handlePlay(p.id); }}
                        title="Dengarkan"
                        style={{color: playing===p.id ? "#C084FC" : "rgba(232,240,255,.5)"}}
                      >
                        {playing === p.id ? "🔊" : "▶"}
                      </button>
                    </div>
                  </div>

                  {/* Phrase */}
                  <div className="fc-phrase" style={{color: lc.color, textShadow:`0 0 24px ${lc.color}40`}}>
                    {p.phrase}
                  </div>
                  <div className="fc-translation">{p.translation}</div>

                  <div className="fc-divider"/>

                  {/* Bottom row */}
                  <div className="fc-bottomrow">
                    <div className="fc-context">
                      <span className="fc-context-icon">📍</span>
                      {p.context}
                    </div>
                    <div className="fc-mastery">
                      <span className="fc-mastery-label" style={{color: masteryColor(p.mastery)}}>
                        {masteryLabel(p.mastery)}
                      </span>
                      <div className="fc-mastery-dots">
                        {[1,2,3,4,5].map(n => (
                          <div
                            key={n}
                            className={`fc-mastery-dot${n<=p.mastery?" filled":""}`}
                            style={n<=p.mastery ? {background: masteryColor(p.mastery), boxShadow:`0 0 6px ${masteryColor(p.mastery)}80`} : {}}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </main>
        
        {/* ── Study Modal Overlay ── */}
        {studyMode && (
          <div style={{
            position:"fixed", inset:0, zIndex:2000,
            background:"rgba(5,11,20,0.88)", backdropFilter:"blur(16px)",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            padding:20
          }}>
            <button 
              onClick={() => setStudyMode(false)}
              style={{ position:"absolute", top:30, right:40, background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:20, cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >✕</button>

            {studySessionPhrases.length > 0 && studyCardIndex < studySessionPhrases.length ? (
              <>
                <div style={{ color:"rgba(232,240,255,0.6)", marginBottom:24, fontSize: 14, fontWeight:600, letterSpacing: 1, textTransform: "uppercase" }}>
                  Kartu {studyCardIndex + 1} dari {studySessionPhrases.length}
                </div>
                
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{
                    width: "100%", maxWidth: 520, minHeight: 340,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(167,139,250,0.25)",
                    borderRadius: 32, padding: 40,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", textAlign: "center",
                    boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.15) inset",
                    transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                    transform: isFlipped ? "scale(1.02) translateY(-4px)" : "scale(1)"
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 40px 80px rgba(167,139,250,0.2), 0 0 0 1px rgba(167,139,250,0.3) inset"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.15) inset"}
                >
                  <div style={{ fontSize: 13, color: "#C084FC", fontWeight: 800, marginBottom: 24, letterSpacing: 3 }}>
                    {isFlipped ? "TERJEMAHAN" : `FRASA ${studySessionPhrases[studyCardIndex].lang.toUpperCase()}`}
                  </div>
                  <div style={{ 
                    fontFamily: "'Syne', sans-serif", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, color: "#fff",
                    textShadow: "0 0 20px rgba(255,255,255,0.2)", lineHeight: 1.3
                  }}>
                    {isFlipped ? studySessionPhrases[studyCardIndex].translation : studySessionPhrases[studyCardIndex].phrase}
                  </div>
                  
                  <div style={{ marginTop: 40, fontSize: 13, color: "rgba(232,240,255,0.35)", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>↻</span> Klik kartu untuk membalik
                  </div>
                </div>

                {isFlipped && (
                  <div style={{ display:"flex", gap:16, marginTop:40, animation: "bsFadeUp 0.4s ease forwards" }}>
                    <button 
                      onClick={() => {
                        setIsFlipped(false);
                        setStudyCardIndex(i => i + 1);
                      }}
                      style={{ padding:"14px 28px", borderRadius:16, background:"rgba(255,255,255,0.06)", color:"#fff", border:"1px solid rgba(255,255,255,0.1)", fontSize: 15, fontWeight:600, cursor:"pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    >Masih Belajar</button>
                    <button 
                      onClick={() => {
                        const currentId = studySessionPhrases[studyCardIndex].id;
                        setPhrases(prev => prev.map(p => p.id === currentId ? { ...p, mastery: 3 } : p));
                        setIsFlipped(false);
                        setStudyCardIndex(i => i + 1);
                      }}
                      style={{ padding:"14px 28px", borderRadius:16, background:"linear-gradient(135deg,#A855F7,#6366F1)", color:"#fff", border:"none", fontSize: 15, fontWeight:700, cursor:"pointer", boxShadow:"0 0 30px rgba(168,85,247,0.4)", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >Sudah Paham</button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign:"center", animation: "bsFadeUp 0.6s ease forwards" }}>
                <div style={{ fontSize:72, marginBottom:24, filter: "drop-shadow(0 0 20px rgba(0,198,94,0.4))" }}>🎉</div>
                <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:36, color:"#fff", marginBottom:12 }}>Sesi Selesai!</h2>
                <p style={{ color:"rgba(232,240,255,0.5)", marginBottom:36, fontSize: 16 }}>Kamu telah mengulas {studySessionPhrases.length} frasa hari ini.</p>
                <button 
                  onClick={() => setStudyMode(false)}
                  style={{ padding:"14px 32px", borderRadius:14, background:"linear-gradient(135deg,#00C65E,#00924A)", color:"#fff", border:"none", fontSize: 15, fontWeight:700, cursor:"pointer", boxShadow:"0 0 30px rgba(0,198,94,0.3)", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >Tutup Sesi</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
