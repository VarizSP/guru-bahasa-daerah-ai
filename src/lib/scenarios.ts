import { DbScenarioRow, Scenario } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { scenarios as mockScenarios } from "@/lib/mock-data";

function mapScenario(row: DbScenarioRow): Scenario {
  return {
    id: row.id,
    title: row.title,
    region: row.region,
    language: row.language,
    politenessTarget: row.politeness_target,
    context: row.context,
    difficulty: row.difficulty
  };
}

export async function getPublicScenarios(): Promise<Scenario[]> {
  if (!supabase) return mockScenarios;
  
  const { data, error } = await supabase
    .from("scenarios")
    .select("id, title, region, language, politeness_target, context, difficulty")
    .order("title");
  if (error) return mockScenarios;
  return (data ?? []).map((row) => mapScenario(row as DbScenarioRow));
}

export async function getScenarioById(scenarioId: string): Promise<Scenario | null> {
  if (!supabase) return mockScenarios.find(s => s.id === scenarioId) ?? null;

  const { data, error } = await supabase
    .from("scenarios")
    .select("id, title, region, language, politeness_target, context, difficulty")
    .eq("id", scenarioId)
    .maybeSingle();
  if (error) return mockScenarios.find(s => s.id === scenarioId) ?? null;
  return data ? mapScenario(data as DbScenarioRow) : null;
}
