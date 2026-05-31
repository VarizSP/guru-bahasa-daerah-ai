"use client";

import { useState } from "react";

const levelOptions = ["Tidak pernah", "Kadang", "Sering tapi takut salah"];
const goalOptions = ["Ngobrol keluarga", "Keperluan kerja", "Nongkrong komunitas"];

export default function OnboardingPage() {
  const [language, setLanguage] = useState("Jawa");
  const [level, setLevel] = useState(levelOptions[0]);
  const [goal, setGoal] = useState(goalOptions[0]);
  const [result, setResult] = useState<string[]>([]);

  async function generatePath() {
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, level, goal })
    });
    const data = await response.json();
    setResult(data.curriculum);
  }

  return (
    <div className="space-y-4">
      <section className="glass-card p-6">
        <h1 className="font-heading text-3xl text-emerald">Onboarding 1 Menit</h1>
        <p className="mt-2 text-slate-600">Personalisasi kurikulum berdasarkan kebutuhanmu.</p>
      </section>
      <section className="glass-card space-y-4 p-6">
        <label className="block text-sm">
          Bahasa Target
          <input value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block text-sm">
          Level saat ini
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
            {levelOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Tujuan
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
            {goalOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button onClick={generatePath} className="rounded-lg bg-emerald px-4 py-2 font-semibold text-white">
          Generate Kurikulum
        </button>
      </section>
      {result.length > 0 ? (
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold text-emerald">Rekomendasi Jalur Belajar</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
            {result.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
