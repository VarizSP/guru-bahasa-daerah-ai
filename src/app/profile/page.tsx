import { requireAuth } from "@/lib/auth";
import ClientProfile from "./ClientProfile";

export default async function ProfilePage() {
  const { profile } = await requireAuth();

  // Mem-passing data profil dari server ke client component
  return <ClientProfile profile={profile as any} />;
}
