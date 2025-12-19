"use client";
import { UserType } from "@/types/user";
import { createContext, useContext, useState, useEffect } from "react";
import { MoodType } from "@/types/mood";

type ToastState = {
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  };

interface AppContextType {
    screen: "muro" | "perfil" | "chat" | "post" | "comunidad" | "postpage";
    setScreen: (screen: "muro" | "perfil" | "chat" | "post" | "comunidad" | "postpage") => void;
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
    mood: MoodType;
    setMood: (mood: MoodType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    // state
    const [screen, setScreen] = useState<"muro" | "perfil" | "chat" | "post" | "comunidad" | "postpage">("chat");
    
    // sidebars states
    const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);
    const [isSidebarLeftOpen, setIsSidebarLeftOpen] = useState(false);
    const [usernameProfile, setUsernameProfile] = useState<string>("");
    const [user, setUser] = useState<UserType | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: '',
        type: "success",
    });
    const [mood, setMood] = useState<MoodType>("resueno");

    // Set initial sidebar state based on screen size
    useEffect(() => {
        const checkScreenSize = () => {
            const isDesktop = window.innerWidth >= 1024; // Adjust breakpoint as needed
            setIsSidebarLeftOpen(isDesktop);
        };

        // Check on mount
        checkScreenSize();

        // Optional: Update on window resize
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

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
            mood,
            setMood,
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
  