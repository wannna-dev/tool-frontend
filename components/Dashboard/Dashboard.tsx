"use client";
import styles from "./Dashboard.module.scss";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

// pages
import Muro from "./Muro/Muro";
import Perfil from "./Perfil/Perfil";
import Chat from "./Chat/Chat";

// components
import SidebarLeft from "@/components/SidebarLeft/SidebarLeft";
import SidebarRight from "@/components/SidebarRight/SidebarRight";
import { useEffect } from "react";

// types
import { UserType } from "@/types/user";

const Dashboard = ({user, usernameProfile, pageType, token}: {user?: UserType, usernameProfile?: string, pageType?: "muro" | "perfil" | "chat", token?: string}) => {

    const {
        screen,
        setScreen,
        setIsSidebarLeftOpen,
        setIsSidebarRightOpen,
        isSidebarRightOpen,
        setUsernameProfile,
        setUser,
        setToken
    } = useAppContext();

    useEffect(() => {
        setScreen("muro");
    }, []);

    useEffect(() => {
        if (token) {
            setToken(token as string);
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            setUser(user as UserType);
        }
    }, [user]);

    useEffect(() => {
        if (usernameProfile) {
            setUsernameProfile(usernameProfile as string);
        } else {
            setUsernameProfile(user?.username as string);
        }
    }, [usernameProfile, user]);

    useEffect(() => {
        if (pageType) {
            setScreen(pageType as "muro" | "perfil" | "chat");
        }
    }, [pageType]);

    return (
        <main className={styles.dashboard}>
            <SidebarLeft />
            {screen === "muro" && <Muro />}
            {screen === "perfil" && <Perfil username={usernameProfile} />}
            {screen === "chat" && <Chat />}
            <SidebarRight />

            {!isSidebarRightOpen && (
                <button
                    className={styles.dashboard__createPostButton}
                    data-variant="primary"
                    onClick={() => {
                        setIsSidebarRightOpen(true)
                        setIsSidebarLeftOpen(false)
                    }}
                >
                    Publicar
                    <Image src="/svg/plus-white.svg" alt="plus" width={12} height={12} />
                </button>
            )}
        </main>
    );
};

export default Dashboard;