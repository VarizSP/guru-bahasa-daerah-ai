import { requireRole } from "@/lib/auth";
import ClientContributor from "./ClientContributor";

export default async function ContributorPage() {
  // await requireRole(["contributor", "admin"]); // <-- DIKOMENTARI SEMENTARA agar Anda bisa melihat halamannya untuk mendesain

  return <ClientContributor />;
}
