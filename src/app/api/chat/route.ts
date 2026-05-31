import { NextRequest, NextResponse } from "next/server";
import { Scenario } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Body = {
  scenario: Scenario;
  input: string;
};

type Evaluation = {
  semantic: number;
  grammar: number;
  politeness: number;
  message: string;
  suggestedPhrase?: string;
};

type GeminiResponse = {
  reply: string;
  evaluation: Evaluation;
};

async function generateGeminiResponse(input: string, scenario: Scenario): Promise<GeminiResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  if (!apiKey) return null;

  const systemInstruction = [
    "Kamu adalah AI tutor bahasa daerah Nusantara yang ahli dalam linguistik dan budaya.",
    "Kamu menguasai bahasa: Jawa (Krama/Ngoko), Sunda (Lemes/Kasar), Bali, Batak Toba, Minangkabau, Aceh, Betawi, Madura, dan bahasa daerah lainnya.",
    "Tugasmu ada DUA:",
    "1. Menjawab pesan user sebagai lawan bicara (berperan sesuai skenario). Jawab dalam bahasa daerah target yang diminta, maksimal 2 kalimat, senatural mungkin.",
    "   - Jika bahasa Batak: gunakan ekspresi Batak Toba yang otentik (misal: 'Horas', 'Alai', 'Molo').",
    "   - Jika bahasa Minang: gunakan baso Minang nan elok (misal: 'Iyolah', 'Baa kabanyo', 'Manga doh').",
    "   - Jika bahasa Aceh: gunakan bahasa Aceh yang beradab (misal: 'Saleum', 'Bek khawatir', 'Neuturi').",
    "2. Mengevaluasi pesan user dari skala 0-100 untuk tiga aspek: semantic (kesesuaian makna), grammar (tata bahasa daerah yang benar), dan politeness (kesopanan sesuai target).",
    "PENTING: Output harus STRICTLY berupa objek JSON tanpa markdown apapun, dengan format:",
    `{ "reply": "...", "evaluation": { "semantic": 0-100, "grammar": 0-100, "politeness": 0-100, "message": "Feedback budaya singkat dalam bahasa Indonesia", "suggestedPhrase": "Saran frasa yang lebih baik dalam bahasa daerah target (opsional)" } }`
  ].join(" ");

  const prompt = [
    `Skenario: ${scenario.title}`,
    `Konteks: ${scenario.context}`,
    `Bahasa Target: ${scenario.language}`,
    `Target kesopanan: ${scenario.politenessTarget}`,
    `Pesan user: "${input}"`,
    "Berikan JSON respons sekarang. Pastikan 'reply' menggunakan bahasa daerah target, bukan bahasa Indonesia."
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) return null;
  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  if (!textResponse) return null;

  try {
    return JSON.parse(textResponse) as GeminiResponse;
  } catch (e) {
    console.error("Gagal parse JSON dari Gemini:", e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  let user = null;

  if (supabase) {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  }

  const body = (await request.json()) as Body;
  
  const geminiData = await generateGeminiResponse(body.input, body.scenario);
  
  if (geminiData) {
    return NextResponse.json({
      reply: geminiData.reply,
      evaluation: {
        semantic: geminiData.evaluation.semantic,
        grammar: geminiData.evaluation.grammar,
        politeness: geminiData.evaluation.politeness,
        message: `💡 Cultural Feedback: ${geminiData.evaluation.message}`,
        suggestedPhrase: geminiData.evaluation.suggestedPhrase
      }
    });
  }

  // Fallback if AI fails
  return NextResponse.json({
    reply: "Maaf, sistem AI sedang sibuk. Silakan coba lagi sebentar.",
    evaluation: {
      semantic: 0,
      grammar: 0,
      politeness: 0,
      message: "💡 Gagal menghubungi AI evaluator. Coba kirim ulang pesanmu.",
    }
  });
}
