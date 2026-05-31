# Guru Bahasa Daerah AI

Platform pembelajaran bahasa daerah berbasis AI dengan evaluasi semantic, grammar, dan cultural politeness.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth)
- API route untuk logika evaluasi chat

## Fitur yang sudah tersedia

- 4 role utama: Guest, Learner, Contributor, Admin
- Landing page + interactive scenario cards
- Dashboard learner real-time (streak, XP, badges dari tabel `profiles`)
- Chat room per skenario dengan Context Drawer (feedback budaya dinamis)
- Buku Saku (frasa tersimpan)
- Profile (badge dan preferensi bahasa)
- Contributor console (RLHF review)
- Admin console (user/cost/contributor approval snapshot)
- Database schema + RLS + trigger profile otomatis (`supabase/schema.sql`)
- Supabase Auth (email/password), login page, middleware proteksi role
- Persistensi chat ke tabel `chat_history`

## Menjalankan project

1. Install dependencies:
  ```bash
  npm install 
  ```
2. Salin env:
  ```bash
   cp .env.example .env.local
  ```
3. Isi nilai environment untuk Supabase/Gemini.
4. Buat tabel di Supabase SQL Editor menggunakan `supabase/schema.sql`.
5. Jalankan:
  ```bash
   npm run dev
  ```
6. Buka [http://localhost:3000](http://localhost:3000)

## Akses role

- Login sebagai user biasa: akses learner flow.
- Ubah role user di tabel `profiles.role` untuk menguji route khusus:
  - `contributor` -> `/contributor`
  - `admin` -> `/admin`

## Catatan produksi

- Endpoint `src/app/api/chat/route.ts` saat ini berisi evaluator rule-based cepat.
- Untuk produksi, ganti ke Gemini API + RAG (vector database) agar feedback budaya lebih kaya.
- Bisa ditambah streaming SSE/WebSocket agar respons AI tampil token-by-token.

