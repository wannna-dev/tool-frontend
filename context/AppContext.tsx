"use client";
import { UserType } from "@/types/user";
import { createContext, useContext, useState, useEffect } from "react";

interface AppContextType {
    screen: "muro" | "perfil" | "chat";
    setScreen: (screen: "muro" | "perfil" | "chat") => void;
    isSidebarRightOpen: boolean;
    setIsSidebarRightOpen: (isSidebarRightOpen: boolean) => void;
    isSidebarLeftOpen: boolean;
    setIsSidebarLeftOpen: (isSidebarLeftOpen: boolean) => void;
    usernameProfile: string;
    setUsernameProfile: (usernameProfile: string) => void;
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    // state
    const [screen, setScreen] = useState<"muro" | "perfil" | "chat">("muro");
    
    // sidebars states
    const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);
    const [isSidebarLeftOpen, setIsSidebarLeftOpen] = useState(true);
    const [usernameProfile, setUsernameProfile] = useState<string>("");
    const [user, setUser] = useState<UserType | null>(null);
    return (
        <AppContext.Provider value={{
            screen,
            setScreen,
            isSidebarRightOpen,
            setIsSidebarRightOpen,
            isSidebarLeftOpen,
            setIsSidebarLeftOpen,
            usernameProfile,
            setUsernameProfile,
            user,
            setUser
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
  };
  