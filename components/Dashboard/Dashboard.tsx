"use client";
import styles from "./Dashboard.module.scss";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";

// pages
import Muro from "./Muro/Muro";
import Perfil from "./Perfil/Perfil";
import Chat from "./Chat/Chat";
import Comunidades from "./Comunidades/Comunidades";
import NewPost from "./NewPost/NewPost";

// components
import SidebarLeft from "@/components/SidebarLeft/SidebarLeft";
import SidebarRight from "@/components/SidebarRight/SidebarRight";
import PublishContent from "./PublishContent/PublishContent";
import Toast from "./Toast/Toast";
import BgGradient from "./BgGradient/BgGradient";

// types
import { UserType } from "@/types/user";

interface DashboardProps {
  userLogged?: UserType; // Your custom user profile from database
  usernameProfile?: string;
  pageType?: "muro" | "perfil" | "chat" | "post";
}

const Dashboard = ({ userLogged, usernameProfile, pageType }: DashboardProps) => {
  const {
    screen,
    setScreen,
    setUser,
    toast,
    setToast,
  } = useAppContext();

  // set user logged in context
  useEffect(() => {
    // Set user data in context
    if (userLogged) {
      setUser(userLogged);
    }
  }, [userLogged, setUser]);

  // set screen in context
  useEffect(() => {
    if (pageType) {
      setScreen(pageType);
    }
  }, [pageType, setScreen]);

  return (
    <main className={styles.dashboard}>
      <BgGradient />
      <SidebarLeft />
      {screen === "muro" && <Muro />}
      {screen === "perfil" && <Perfil usernameProfile={usernameProfile} />}
      {screen === "chat" && <Chat />}
      {screen === "post" && <NewPost />}
      {screen === "comunidades" && <Comunidades />}
      <SidebarRight />

      <PublishContent />

      <Toast success={toast.type === "success"} visible={toast.show} onClose={() => setToast({...toast, show: false})}>
        {toast.message}
      </Toast>
    </main>
  );
};

export default Dashboard;