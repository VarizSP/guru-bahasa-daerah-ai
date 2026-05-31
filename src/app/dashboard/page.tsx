import { requireAuth } from "@/lib/auth";
import { getPublicScenarios } from "@/lib/scenarios";
import ClientDashboard from "./ClientDashboard";

export default async function DashboardPage() {
  const { profile } = await requireAuth();
  const scenarios = await getPublicScenarios();

  return (
    <ClientDashboard 
      profile={profile} 
      scenarios={scenarios} 
    />
  );
}
