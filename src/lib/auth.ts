import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Profile, UserRole } from "@/lib/types";

export async function getCurrentUserAndProfile() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { user: null, profile: null as Profile | null };
  }
  
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { user: null, profile: null as Profile | null };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, auth_user_id, full_name, role, xp, streak, badges")
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();

  if (profileError || !profileData) {
    return { user: authData.user, profile: null as Profile | null };
  }

  return { user: authData.user, profile: profileData as Profile };
}

export async function requireAuth() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) {
    redirect("/login");
  }
  return { user, profile };
}

export async function requireRole(roles: UserRole[]) {
  const { user, profile } = await requireAuth();
  if (!roles.includes(profile.role)) {
    redirect("/dashboard");
  }
  return { user, profile };
}
const defaultRole: UserRole = "guest";

export function getRoleFromSearchParam(value?: string): UserRole {
  if (!value) return defaultRole;
  const role = value.toLowerCase();
  if (role === "learner" || role === "contributor" || role === "admin") {
    return role;
  }
  return defaultRole;
}

export function canAccessDashboard(role: UserRole): boolean {
  return role === "learner" || role === "admin";
}

export function canReviewRLHF(role: UserRole): boolean {
  return role === "contributor" || role === "admin";
}
