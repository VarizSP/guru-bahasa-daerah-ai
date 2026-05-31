"use client";

import { FormEvent, useMemo, useState } from "react";
import { ChatTurn, Scenario } from "@/lib/types";
import { supabase } from "@/lib/supabase";

function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function getGreeting(scenario: { title: string; language: string }): string {
  const lang = scenario.language.toLowerCase();
  if (lang === "sunda" || lang === "sundanese") {
    return `Wilujeng sumping. Urang keur aya di skenario "${scenario.title}". Hayu urang ngobrol ku basa Sunda nu alus.`;
  }
  if (lang === "bali" || lang === "balinese") {
    return `Om Swastiastu. Iraga mangkin wenten ring skenario "${scenario.title}". Nah, jani milu mabaos Bali sane melah.`;
  }
  if (lang === "betawi") {
    return `Halo! Kite lagi ada di skenario "${scenario.title}". Ayo kite ngobrol pake bahasa Betawi yang sopan ya.`;
  }
  if (lang === "madura" || lang === "madurese") {
    return `Salam. Kaule bik sampean odik e skenario "${scenario.title}". Areh ngobhal bik basa Madura se apik.`;
  }
  if (lang === "batak") {
    return `Horas! Sian hita di skenario "${scenario.title}". Ayo marsiajar marhusip dohot bahasa Batak nauli.`;
  }
  if (lang === "minang" || lang === "minangkabau") {
    return `Assalamualaikum. Awak lah tibo di skenario "${scenario.title}". Ayo bakato-kato jo baso Minang nan elok.`;
  }
  if (lang === "aceh" || lang === "acehnese") {
    return `Saleum! Kamoe meunoe nyang na di skenario "${scenario.title}". Ayo ta peugah haba ngon bahasa Aceh nyang beradab.`;
  }
  // default: Javanese
  return `Sugeng rawuh. Kowe lagi ana ing skenario "${scenario.title}". Ayo coba ngobrol sopan.`;
}

type Props = {
  scenario: Scenario;
  initialMessages?: ChatTurn[];
  historyId?: string;
};

export function ChatRoom({ scenario, initialMessages, historyId }: Props) {
  const [input, setInput] = useState("");
  const [currentHistoryId, setCurrentHistoryId] = useState<string | undefined>(historyId);
  const [messages, setMessages] = useState<ChatTurn[]>(
    initialMessages && initialMessages.length > 0
      ? initialMessages
      : [
          {
            role: "ai",
            content: getGreeting(scenario),
            evaluation: {
              semantic: 100,
              grammar: 100,
              politeness: 100,
              message: "Mulai dengan salam sopan."
            }
          }
        ]
  );
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<{ hintText: string; explanation: string } | null>(null);
  const [hintLoading, setHintLoading] = useState(false);

  const latestFeedback = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].evaluation) return messages[i].evaluation;
    }
    return undefined;
  }, [messages]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setLoading(true);
    setHint(null); // Clear hint on new message
    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, input: userText }),
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Chat request failed");
      }
      const data = await response.json();
      const updatedMessages = [
        ...messages,
        { role: "user" as const, content: userText },
        {
          role: "ai" as const,
          content: data.reply,
          evaluation: data.evaluation
        }
      ];

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.reply,
          evaluation: data.evaluation
        }
      ]);

      if (supabase) {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (user) {
          if (currentHistoryId) {
            const { error } = await supabase
              .from("chat_history")
              .update({ turns: updatedMessages })
              .eq("id", currentHistoryId);
            if (error) console.error("Gagal mengupdate riwayat chat:", error);
          } else {
            const { data, error } = await supabase
              .from("chat_history")
              .insert({
                user_id: user.id,
                scenario_id: scenario.id,
                turns: updatedMessages
              })
              .select("id")
              .maybeSingle();
            
            if (error) {
              console.error("Gagal menyimpan riwayat chat:", error);
            } else if (data) {
              setCurrentHistoryId(data.id);
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Maaf, server AI sedang sibuk. Coba lagi sebentar.",
          evaluation: {
            semantic: 0,
            grammar: 0,
            politeness: 0,
            message: "Gagal memproses respons."
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function onGetHint() {
    if (hintLoading || loading) return;
    setHintLoading(true);
    setHint(null);

    try {
      const response = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, messages }),
      });
      if (!response.ok) throw new Error("Hint fetch failed");
      const data = await response.json();
      setHint(data);
    } catch (error) {
      console.error(error);
      setHint({
        hintText: "Maaf, fitur hint sedang tidak tersedia.",
        explanation: "Silakan coba lagi nanti."
      });
    } finally {
      setHintLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .cr-bg {
          position: fixed; inset: 0;
          background: #050B14;
          z-index: 0; pointer-events: none;
        }
        .cr-root {
          color: #E8F0FF;
          margin-top: -32px;
          padding: 32px 16px 60px;
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }
        .cr-grid {
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .cr-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="cr-bg" />
      <div className="cr-root">
      <div className="cr-grid">
        {/* ── PANEL CHAT UTAMA ── */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold text-emerald-400 leading-tight">
              {scenario.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target kesopanan:{" "}
              <span className="text-slate-200 font-medium">{scenario.politenessTarget}</span>
            </p>
          </div>

          {/* Area pesan */}
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto" style={{ minHeight: "55vh" }}>
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  style={msg.role === "user" ? {
                    background: "rgba(0,198,94,0.12)",
                    border: "1px solid rgba(0,198,94,0.25)",
                  } : {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  className={[
                    "max-w-[85%] px-4 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "text-emerald-100 rounded-2xl rounded-br-sm"
                      : "text-slate-200 rounded-2xl rounded-bl-sm",
                  ].join(" ")}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Form input */}
          <form onSubmit={onSubmit} className="flex gap-2 items-center mt-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tulis respons kamu..."
              className="flex-1 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500/50"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
              suppressHydrationWarning
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-50"
              suppressHydrationWarning
            >
              Kirim
            </button>
          </form>
        </div>

        {/* ── CONTEXT DRAWER ── */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-4 flex flex-col gap-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <h3 className="text-sm font-semibold text-emerald-400">
              ⚡ Context Drawer
            </h3>

            {/* Cultural Feedback */}
            <div
              className="rounded-xl p-3"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.25)",
              }}
            >
              <p className="text-xs font-semibold text-amber-400 mb-1">
                💡 Cultural Feedback
              </p>
              <p className="text-xs text-amber-200 leading-relaxed">
                {latestFeedback?.message || "Belum ada feedback."}
              </p>
            </div>

            {/* Saran frasa */}
            {latestFeedback?.suggestedPhrase && (
              <div
                className="rounded-lg px-3 py-2"
                style={{
                  background: "rgba(0,198,94,0.07)",
                  border: "1px solid rgba(0,198,94,0.20)",
                }}
              >
                <p className="text-xs text-emerald-300 italic leading-relaxed">
                  Saran frasa:{" "}
                  <span className="not-italic font-medium text-emerald-200">
                    {latestFeedback.suggestedPhrase}
                  </span>
                </p>
              </div>
            )}

            {/* Skor evaluasi */}
            <div className="flex flex-col gap-0">
              {(
                [
                  { label: "Semantic", val: latestFeedback?.semantic ?? 0 },
                  { label: "Grammar", val: latestFeedback?.grammar ?? 0 },
                  { label: "Politeness", val: latestFeedback?.politeness ?? 0 },
                ] as const
              ).map(({ label, val }) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className={`text-xs font-semibold ${scoreColor(val)}`}>
                    {val} / 100
                  </span>
                </div>
              ))}
            </div>

            {/* Tombol Minta Hint */}
            <button
              onClick={onGetHint}
              disabled={hintLoading || loading}
              className="w-full rounded-xl py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-400/10 active:scale-[0.98] transition-all disabled:opacity-50"
              style={{ border: "1px solid rgba(0,198,94,0.30)" }}
              suppressHydrationWarning
            >
              {hintLoading ? "Mencari inspirasi..." : "💡 Minta Hint"}
            </button>
          </div>

          {/* Hint Result Box (from existing code) */}
          {hint && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl p-4 flex flex-col gap-3"
              style={{
                background: "rgba(0,198,94,0.05)",
                border: "1px solid rgba(0,198,94,0.20)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="font-medium text-emerald-400">Saran balasan:</p>
              <p className="text-sm font-semibold text-slate-200">"{hint.hintText}"</p>
              <p className="text-xs italic text-emerald-300/80">{hint.explanation}</p>
              
              <button 
                onClick={() => setInput(hint.hintText)}
                className="mt-1 w-full rounded-md py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                style={{ border: "1px solid rgba(0,198,94,0.3)" }}
              >
                Gunakan Kalimat Ini
              </button>
            </div>
          )}
        </div>

      </div>{/* end cr-grid */}
      </div>{/* end cr-root */}
    </>
  );
}
