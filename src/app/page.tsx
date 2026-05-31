import { getPublicScenarios } from "@/lib/scenarios";
import ClientHome from "./ClientHome";

export default async function LandingPage() {
  const scenarios = await getPublicScenarios();

  return <ClientHome scenarios={scenarios} />;
}
