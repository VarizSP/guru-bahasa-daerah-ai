import { Scenario } from "@/lib/types";

export const scenarios: Scenario[] = [
  {
    id: "pasar-beringharjo",
    title: "Nawar Harga di Pasar Beringharjo",
    region: "Yogyakarta",
    language: "Jawa",
    politenessTarget: "Krama",
    context: "Berbicara dengan pedagang yang lebih tua.",
    difficulty: "beginner"
  },
  {
    id: "sungkeman-keluarga",
    title: "Sungkeman Lebaran",
    region: "Jawa Tengah",
    language: "Jawa",
    politenessTarget: "Krama Inggil",
    context: "Menyapa dan meminta maaf pada keluarga senior.",
    difficulty: "intermediate"
  },
  {
    id: "warung-sunda",
    title: "Pesan Makan di Warung Sunda",
    region: "Bandung",
    language: "Sunda",
    politenessTarget: "Lemes",
    context: "Memesan makanan dengan sopan ke pemilik warung.",
    difficulty: "beginner"
  },
  {
    id: "pasar-semua-medan",
    title: "Tawar-Menawar di Pasar Semua Ada",
    region: "Medan",
    language: "Batak",
    politenessTarget: "Hormat",
    context: "Menawar harga dengan pedagang Batak yang ramah di pasar tradisional Medan.",
    difficulty: "beginner"
  },
  {
    id: "warung-nasi-padang",
    title: "Makan di Rumah Makan Padang",
    region: "Padang",
    language: "Minang",
    politenessTarget: "Sopan",
    context: "Memesan nasi Padang dan berinteraksi sopan dengan pemilik rumah makan.",
    difficulty: "beginner"
  },
  {
    id: "tamu-aceh",
    title: "Menyambut Tamu di Aceh",
    region: "Aceh",
    language: "Aceh",
    politenessTarget: "Beradab",
    context: "Menyambut tamu kehormatan dengan adat dan bahasa Aceh yang santun.",
    difficulty: "intermediate"
  }
];

export const badges = [
  "Sunda Wawuh",
  "Diplomat Nusantara",
  "Krama Guardian",
  "Kontributor Budaya"
];
