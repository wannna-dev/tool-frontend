"use client";
import { UserType } from "@/types/user";
import { createContext, useContext, useState, useEffect } from "react";

type ToastState = {
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  };

interface AppContextType {
    screen: "muro" | "perfil" | "chat" | "post";
    setScreen: (screen: "muro" | "perfil" | "chat" | "post") => void;
    isSidebarRightOpen: boolean;
    setIsSidebarRightOpen: (isSidebarRightOpen: boolean) => void;
    isSidebarLeftOpen: boolean;
    setIsSidebarLeftOpen: (isSidebarLeftOpen: boolean) => void;
    usernameProfile: string;
    setUsernameProfile: (usernameProfile: string) => void;
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    toast: ToastState;
    setToast: (toast: ToastState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    // state
    const [screen, setScreen] = useState<"muro" | "perfil" | "chat" | "post">("muro");
    
    // sidebars states
    const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);
    const [isSidebarLeftOpen, setIsSidebarLeftOpen] = useState(true);
    const [usernameProfile, setUsernameProfile] = useState<string>("");
    const [user, setUser] = useState<UserType | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: '',
        type: "success",
    });
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
            setUser,
            token,
            setToken,
            toast,
            setToast,
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
  