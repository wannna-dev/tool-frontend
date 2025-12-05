"use client";
import styles from "./SidebarRight.module.scss";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

// components
import UploadPost from "./UploadPost/UploadPost";


const SidebarRight = () => {
    const { isSidebarRightOpen, setIsSidebarRightOpen } = useAppContext();

    return (
        <aside className={`${styles.sidebar} ${!isSidebarRightOpen ? styles.sidebar__collapse : ""}`}>
            <div className={styles.sidebar__header}>
                <div className={styles.sidebar__header__logo}>
                    <button data-variant="icon" className={styles.sidebar__header__logo__button} onClick={() => setIsSidebarRightOpen(false)}>
                        <Image src="/svg/close-black.svg" alt="logo" width={16} height={16} />
                    </button>
                </div>
            </div>
            <UploadPost />
        </aside>
    );
};

export default SidebarRight;