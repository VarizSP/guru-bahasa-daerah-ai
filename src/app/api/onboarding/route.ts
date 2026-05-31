import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { language, level, goal } = await request.json();
  const curriculum = [
    `Dasar salam & etika ${language}`,
    `Skenario praktis sesuai tujuan: ${goal}`,
    `Latihan kesopanan kontekstual untuk level "${level}"`,
    "Review kesalahan otomatis ke Buku Saku",
    "Misi percakapan harian + evaluasi progres mingguan"
  ];
  return NextResponse.json({ curriculum });
}
