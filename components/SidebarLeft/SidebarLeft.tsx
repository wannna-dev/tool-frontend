"use client";
import styles from "./SidebarLeft.module.scss";
import { useState, useCallback, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { signout } from "@/lib/auth-actions";

// Move SidebarItem outside and memoize it
const SidebarItem = memo(({
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
  // Remove unnecessary useMemo - string concatenation is cheap
  const iconSrc = `/svg/${icon}.svg`;
  const iconSelectedSrc = `/svg/${iconSelected}.svg`;
  
  return (
    <div
      className={`${styles.sidebarItem} ${
        active ? styles.sidebarItem__selected : ""
      } ${isCollapsed ? styles.sidebarItem__collapsed : ""}`}
      onClick={onClick}
    >
      <Image 
        className={isCollapsed ? styles.sidebarItem__icon__collapsed : ""} 
        src={active ? iconSelectedSrc : iconSrc} 
        alt={label} 
        width={19} 
        height={19}
        loading="lazy"
      />
      <p className={isCollapsed ? styles.sidebarItem__label__collapsed : ""}>{label}</p>
    </div>
  );
});

SidebarItem.displayName = "SidebarItem";

const SidebarLeft = () => {
  const router = useRouter();
  const { 
    screen, 
    setScreen, 
    setIsSidebarRightOpen, 
    isSidebarLeftOpen, 
    setIsSidebarLeftOpen, 
    user 
  } = useAppContext();

  const [isLogoHover, setIsLogoHover] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [userPicture, setUserPicture] = useState(user?.picture);

  // Sync user picture without artificial delay
  useEffect(() => {
    if (user?.picture) {
      setTimeout(() => {
        setUserPicture(user.picture);
      }, 100);
    }
  }, [user?.picture]);

  // Memoize event handlers to prevent recreating on every render
  const handleScreen = useCallback((screen: "muro" | "perfil" | "chat") => {
    setScreen(screen);
    setIsSidebarRightOpen(false);
    setIsSettings(false);
    router.push(`/`);
  }, [setScreen, setIsSidebarRightOpen, router]);

  const handlePerfil = useCallback(() => {
    setScreen("perfil");
    setIsSidebarRightOpen(false);
    setIsSettings(false);
    router.push(`/${user?.username}`);
    router.refresh();
  }, [setScreen, setIsSidebarRightOpen, router, user?.username]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarLeftOpen(!isSidebarLeftOpen);
  }, [isSidebarLeftOpen, setIsSidebarLeftOpen]);

  const toggleSettings = useCallback(() => {
    setIsSettings(!isSettings);
  }, [isSettings]);

  const handleLogoMouseEnter = useCallback(() => setIsLogoHover(true), []);
  const handleLogoMouseLeave = useCallback(() => setIsLogoHover(false), []);

  // Memoize inline style object
  const avatarStyle = userPicture ? { backgroundImage: `url("${userPicture}")` } : undefined;

  // Determine collapse icon src
  const collapseIconSrc = isSidebarLeftOpen 
    ? "/svg/collapse.svg" 
    : (isLogoHover ? "/svg/expand.svg" : "/svg/logo-wanna.svg");

  return (
    <aside className={`${styles.sidebar} ${!isSidebarLeftOpen ? styles.sidebar__collapse : ""}`}>
      {/* Header */}
      <div className={styles.sidebar__container}>
        <div className={styles.sidebar__container__header}>
          <div className={`${styles.sidebar__container__header__logo} ${!isSidebarLeftOpen ? styles.sidebar__container__header__logo__collapse : ""}`}>
            <Image 
              src="/svg/logo.svg" 
              alt="logo" 
              width={100} 
              height={13}
              priority
            />
          </div>
          <div 
            className={styles.sidebar__container__header__collapse} 
            onClick={toggleSidebar}
            onMouseEnter={handleLogoMouseEnter}
            onMouseLeave={handleLogoMouseLeave}
          >
            <Image 
              src={collapseIconSrc}
              alt="collapse" 
              width={21} 
              height={21}
              priority
            />
          </div>
        </div>

        <SidebarItem 
          label="Nuevo Chat" 
          active={screen === "chat"} 
          onClick={() => handleScreen("chat")} 
          icon="chat" 
          iconSelected="chat-selected" 
          isCollapsed={!isSidebarLeftOpen} 
        />
        <SidebarItem 
          label="Muro" 
          active={screen === "muro"} 
          onClick={() => handleScreen("muro")} 
          icon="feed" 
          iconSelected="feed-selected" 
          isCollapsed={!isSidebarLeftOpen} 
        />
      </div>

      {/* Footer */}
      <div className={styles.sidebar__container__footer}>
        {/* Settings */}
        {isSettings && (
          <div className={styles.sidebar__container__footer__settings}>
            <SidebarItem 
              label="Ver perfil" 
              active={screen === "perfil"} 
              onClick={handlePerfil} 
              icon="profile" 
              iconSelected="profile-selected" 
              isCollapsed={false} 
            />
            <SidebarItem 
              label="Cerrar sesión" 
              active={false} 
              onClick={signout} 
              icon="logout" 
              iconSelected="logout-selected" 
              isCollapsed={false} 
            />
          </div>
        )}
        {/* User */}
        <div 
          className={`${styles.sidebar__container__footer__user} ${!isSidebarLeftOpen ? styles.sidebar__container__footer__user__collapse : ""}`} 
          onClick={toggleSettings}
        >
          <div 
            className={`${styles.sidebar__container__footer__user__avatar} ${!isSidebarLeftOpen ? styles.sidebar__container__footer__user__avatar__collapse : ""}`} 
            style={avatarStyle}
          />
          <div className={`${styles.sidebar__container__footer__user__name} ${!isSidebarLeftOpen ? styles.sidebar__container__footer__user__name__collapse : ""}`}>
            <p>{user?.username}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default memo(SidebarLeft);