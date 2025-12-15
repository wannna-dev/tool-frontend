import styles from "./page.module.scss";
import Login from "@/components/Login/Login";
import Dashboard from "@/components/Dashboard/Dashboard";
import Presentation from "@/components/Presentation/Presentation";
import { createClient } from "@/utils/supabase/server";

async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return data;
}

export default async function Home() {
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

  return (
    <div className={styles.page}>
      {!isLoggedIn && <Login />}

      {isLoggedIn && userLogged?.date_of_birth == null && (
        <Presentation user={userLogged}/>
      )}

      {isLoggedIn && userLogged?.date_of_birth != null && (
        <Dashboard userLogged={userLogged} />
      )}
    </div>
  );
}
