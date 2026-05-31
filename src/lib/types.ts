export type UserRole = "guest" | "learner" | "contributor" | "admin";

export type Scenario = {
  id: string;
  title: string;
  region: string;
  language: string;
  politenessTarget: string;
  context: string;
  difficulty: "beginner" | "intermediate" | "advanced";
};

export type DbScenarioRow = {
  id: string;
  title: string;
  region: string;
  language: string;
  politeness_target: string;
  context: string;
  difficulty: "beginner" | "intermediate" | "advanced";
};

export type Profile = {
  id: string;
  auth_user_id: string;
  full_name: string;
  role: UserRole;
  xp: number;
  streak: number;
  badges: string[];
};

export type ChatEvaluation = {
  semantic: number;
  grammar: number;
  politeness: number;
  message: string;
  suggestedPhrase?: string;
};

export type ChatTurn = {
  role: "user" | "ai";
  content: string;
  evaluation?: ChatEvaluation;
};
