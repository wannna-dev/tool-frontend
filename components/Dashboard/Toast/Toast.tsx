"use client";
import { useEffect } from "react";
import styles from "./Toast.module.scss";
import Image from "next/image";
const Toast = ({ children, success, visible, onClose }: { children: React.ReactNode, success: boolean, visible: boolean, onClose: () => void }) => {


  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }, [ onClose, visible ]);

  return (
    <div className={`${styles.toast} ${success ? styles.success : styles.error} ${visible ? styles.visible : styles.hidden}`}>
      <p>{children}</p>
      <button data-type="primary" onClick={onClose}>
        <Image src="/svg/close-white.svg" alt="Close" width={16} height={16} />
      </button>
    </div>
  );
};

export default Toast;