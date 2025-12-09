"use client";

import styles from "./LoginMailForm.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Image from "next/image";

const LoginMailForm = () => {
  const router = useRouter();

  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;

    try {
      const res = await apiFetch("/auth/magic-link/send", {
        method: "SEND",
        body: JSON.stringify({
          email,
          firstName: "",
          lastName: "",
        }),
      });
      console.log(res);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  function handleLabelClick() {
    console.log("handleLabelClick");
    setIsEmailFormOpen(true);
  }
  
  return (
    <div className={styles.login}>
      
      
      {isEmailFormOpen ? (
        <form className={styles.login__form} onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" />
          <button type="submit">Continuar</button>
        </form>
      ) : (
        <button
            className={styles.login__label}
            data-variant="secondary"
            onClick={handleLabelClick}
          >
            <Image src="/svg/message.svg" alt="Email" width={20} height={20} />
            Continuar con correo electrónico
        </button>
      )}
    </div>
  );
};

export default LoginMailForm;
