import styles from "./page.module.scss";
import Login from "@/components/Login/Login";
import Dashboard from "@/components/Dashboard/Dashboard";
import Presentation from "@/components/Presentation/Presentation";
import { getUserData } from "@/utils/auth/getUserData";

export default async function Home() {
  const { isLoggedIn, userLogged } = await getUserData();

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