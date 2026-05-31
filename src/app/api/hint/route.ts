import { NextRequest, NextResponse } from "next/server";
import { ChatTurn, Scenario } from "@/lib/types";

type Body = {
  scenario: Scenario;
  messages: ChatTurn[];
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Body;
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  // Format history for the prompt
  const historyText = body.messages
    .map((m) => `${m.role === "ai" ? "AI (Lawan Bicara)" : "User"}: ${m.content}`)
    .join("\n");

  const systemInstruction = [
    "Kamu adalah asisten/tutor cerdas untuk aplikasi pembelajaran bahasa daerah Nusantara.",
    "Kamu menguasai: Jawa (Krama/Ngoko), Sunda (Lemes/Kasar), Bali, Batak Toba, Minangkabau, Aceh, Betawi, Madura, dan bahasa daerah lainnya.",
    "User sedang buntu dan meminta 'Hint' (saran kalimat).",
    "Tugasmu: Berikan SATU kalimat saran dalam bahasa daerah TARGET yang diminta — bukan bahasa Indonesia.",
    "   - Jika Batak: gunakan ekspresi Batak Toba otentik.",
    "   - Jika Minang: gunakan baso Minang nan elok.",
    "   - Jika Aceh: gunakan bahasa Aceh yang beradab.",
    "Sertakan terjemahan/penjelasan singkat dalam bahasa Indonesia.",
    "PENTING: Output harus STRICTLY JSON dengan format:",
    `{ "hintText": "Saran kalimat dalam bahasa daerah target", "explanation": "Terjemahan dan penjelasan dalam bahasa Indonesia" }`
  ].join(" ");

  const prompt = [
    `Skenario: ${body.scenario.title}`,
    `Konteks: ${body.scenario.context}`,
    `Bahasa Target: ${body.scenario.language}`,
    `Target kesopanan: ${body.scenario.politenessTarget}`,
    `--- Riwayat Percakapan ---`,
    historyText,
    `---------------------------`,
    "User sekarang giliran membalas. Berikan JSON berisi saran balasan (Hint) yang terbaik."
  ].join("\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Gemini");
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!textResponse) {
      throw new Error("Empty response from Gemini");
    }

    const result = JSON.parse(textResponse);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Hint Generation Error:", error);
    return NextResponse.json(
      { hintText: "Maaf, belum bisa memberikan saran saat ini.", explanation: "Sistem AI sedang sibuk, silakan coba lagi sebentar." },
      { status: 500 }
    );
  }
}
