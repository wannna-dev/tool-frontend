"use client";
import styles from "./SidebarLeft.module.scss";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const SidebarItem = ({
    label,
    active,
    onClick,
    icon,
    iconSelected,
    isCollapsed
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
    icon: string;
    iconSelected: string;
    isCollapsed: boolean;
  }) => {
    const iconSrc = useMemo(() => `/svg/${icon}.svg`, [icon]);
    const iconSelectedSrc = useMemo(() => `/svg/${iconSelected}.svg`, [iconSelected]);
    return (
      <div
        className={`${styles.sidebarItem} ${
          active ? styles.sidebarItem__selected : ""
        } ${isCollapsed ? styles.sidebarItem__collapsed : ""}`}
        onClick={onClick}
      >
        <Image className={isCollapsed ? styles.sidebarItem__icon__collapsed : ""} src={active ? iconSelectedSrc : iconSrc} alt={label} width={19} height={19} />
        <p className={isCollapsed ? styles.sidebarItem__label__collapsed : ""}>{label}</p>
      </div>
    );
  };

const SidebarLeft = () => {
    const router = useRouter();
    const { screen, setScreen, setIsSidebarRightOpen, isSidebarLeftOpen, setIsSidebarLeftOpen, user } = useAppContext();

    const [isLogoHover, setIsLogoHover] = useState(false);
    const [isSettings, setIsSettings] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push("/");
    }

    const handleScreen = (screen: "muro" | "perfil" | "chat") => {
        setScreen(screen);
        setIsSidebarRightOpen(false);
        setIsSettings(false);
        router.push(`/`);
    }

    const handlePerfil = () => {
        setScreen("perfil");
        setIsSidebarRightOpen(false);
        setIsSettings(false);
        router.push(`/${user?.username}`);
        router.refresh(); // ← fuerza que Next.js recargue la ruta actual
    }

    return (
        <aside className={`${styles.sidebar} ${!isSidebarLeftOpen ? styles.sidebar__collapse : ""}`}>
            {/* Header */}
            <div className={styles.sidebar__container}>
                
                <div className={styles.sidebar__container__header}>
                    <div className={`${styles.sidebar__container__header__logo} ${!isSidebarLeftOpen ? styles.sidebar__container__header__logo__collapse : ""}`}>
                        <Image src="/svg/logo.svg" alt="logo" width={100} height={13} />
                    </div>
                    <div className={styles.sidebar__container__header__collapse} onClick={() => setIsSidebarLeftOpen(!isSidebarLeftOpen)} onMouseEnter={() => setIsLogoHover(true)} onMouseLeave={() => setIsLogoHover(false)}>
                        <Image src={isSidebarLeftOpen ?  "/svg/collapse.svg" : (isLogoHover ? "/svg/expand.svg" : "/svg/logo-wanna.svg")} alt="collapse" width={21} height={21} />
                    </div>
                </div>

                <SidebarItem label="Nuevo Chat" active={screen === "chat"} onClick={() => handleScreen("chat")} icon="chat" iconSelected="chat-selected" isCollapsed={!isSidebarLeftOpen} />
                <SidebarItem label="Muro" active={screen === "muro"} onClick={() => handleScreen("muro")} icon="feed" iconSelected="feed-selected" isCollapsed={!isSidebarLeftOpen} />
            </div>

            {/* Footer */}
            <div className={styles.sidebar__container__footer}>
              {/* Settings */}
              {isSettings && (
                <div className={styles.sidebar__container__footer__settings}>
                  <SidebarItem label="Ver perfil" active={screen === "perfil"} onClick={handlePerfil} icon="profile" iconSelected="profile-selected" isCollapsed={false} />
                  <SidebarItem label="Cerrar sesión" active={false} onClick={handleLogout} icon="logout" iconSelected="logout-selected" isCollapsed={false} />
                </div>
              )}
              {/* User */}
              <div className={`${styles.sidebar__container__footer__user} ${!isSidebarLeftOpen ? styles.sidebar__container__footer__user__collapse : ""}`} onClick={() => setIsSettings(!isSettings)}>
                <div className={`${styles.sidebar__container__footer__user__avatar} ${!isSidebarLeftOpen ? styles.sidebar__container__footer__user__avatar__collapse : ""}`} />
                <div className={`${styles.sidebar__container__footer__user__name} ${!isSidebarLeftOpen ? styles.sidebar__container__footer__user__name__collapse : ""}`}>
                  <p>{user?.username}</p>
                </div>
              </div>
            </div>
        </aside>
    );
};

export default SidebarLeft;