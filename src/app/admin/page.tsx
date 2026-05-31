import { requireRole } from "@/lib/auth";
import ClientAdmin from "./ClientAdmin";

export default async function AdminPage() {
  // await requireRole(["admin"]); // <-- DIKOMENTARI SEMENTARA agar Anda bisa mendesain halamannya

  return <ClientAdmin />;
}
