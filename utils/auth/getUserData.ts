import { createClient } from "@/utils/supabase/server";

async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .select("*, community(*)")
    .single();

  return data;
}

export async function getUserData() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user && !error;

  let userLogged = null;
  if (isLoggedIn && user) {
    userLogged = await getUserProfile(user.id);
  }

  return {
    isLoggedIn,
    user,
    userLogged,
    error,
  };
}