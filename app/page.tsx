import styles from "./page.module.scss";
import { cookies } from "next/headers";
import Login from "@/components/Login/Login";
import Dashboard from "@/components/Dashboard/Dashboard";
import Presentation from "@/components/Presentation/Presentation";
import { apiFetch } from "@/lib/api";

export default async function Home() {

  // Leer cookies HTTP-only
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const username = cookieStore.get("username")?.value;
  const isLoggedIn = Boolean(token);

  let user = null;
  if (username && isLoggedIn) {
    user = await apiFetch(`/users/${username}`, {
      token, // se añade al header Authorization
    });
  }

  return (
    <div className={styles.page}>
      {/* {isLoggedIn ? <Presentation /> : <Login />} */}
      {isLoggedIn ? <Dashboard user={user} /> : <Login />}
    </div>
  );
}
