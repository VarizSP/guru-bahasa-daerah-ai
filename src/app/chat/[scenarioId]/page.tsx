import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/chat-room";
import { getScenarioById } from "@/lib/scenarios";
import { getCurrentUserAndProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function ChatScenarioPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = await getScenarioById(scenarioId);
  if (!scenario) return notFound();

  const { user } = await getCurrentUserAndProfile();
  let initialMessages = undefined;
  let historyId = undefined;

  if (user) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("chat_history")
        .select("id, turns")
        .eq("user_id", user.id)
        .eq("scenario_id", scenario.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        initialMessages = data.turns;
        historyId = data.id;
      }
    }
  }

  return <ChatRoom scenario={scenario} initialMessages={initialMessages} historyId={historyId} />;
}
