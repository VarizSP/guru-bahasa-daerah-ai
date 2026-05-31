import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

// Self-hosted via Next.js — no Google CDN dependency
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guru Bahasa Daerah AI",
  description: "Platform pembelajaran bahasa daerah berbasis AI dengan konteks budaya."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Preconnect for any remaining Google Fonts requests */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Explicit stylesheet load so 'Plus Jakarta Sans' and 'Syne' names resolve */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Syne:wght@600;700;800&display=swap"
        />
      </head>
      <body suppressHydrationWarning className={`${jakartaSans.className}`}>
        <Navbar />
        <main className="app-container py-8">{children}</main>
      </body>
    </html>
  );
}
