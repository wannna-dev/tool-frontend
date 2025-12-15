import Dashboard from "@/components/Dashboard/Dashboard";
import styles from "./PerfilPage.module.scss";
import { createClient } from "@/utils/supabase/server";

async function getUserLogged(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data;
  }

const PerfilPage = async ({ params }: { params: Promise<{ username: string }> }) => {
    // ✅ Await params since it's a Promise
    const { username } = await params;

    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    const isLoggedIn = !!user && !error;

    let userLogged = null;
    if (isLoggedIn && user) {
      userLogged = await getUserLogged(user.id);
    }
    return (
        <div className={styles.page}>
            <Dashboard
                userLogged={userLogged}
                usernameProfile={username}
                pageType="perfil"
            />
        </div>
    );
};

export default PerfilPage;