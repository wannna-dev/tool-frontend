"use client";

import styles from "./LoginMailForm.module.scss";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmail } from "@/lib/auth-actions";

const LoginMailForm = ({ handleMailClick }: { handleMailClick: () => void }) => {
  const router = useRouter();

  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);

  function handleLabelClick() {
    console.log("handleLabelClick");
    setIsEmailFormOpen(true);
    handleMailClick();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await signInWithEmail(formData);
  }
  
  return (
    <div className={styles.login}>
      
      
      {isEmailFormOpen ? (
        <form className={styles.login__form} onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
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
