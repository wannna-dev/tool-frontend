"use client";
import styles from "./SignInForm.module.scss";
import { useRouter } from "next/navigation";

const SignInForm = () => {

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Esto está bien
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Login successful:", data);
        router.push("/");
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
    }

    return (
        <div className={styles.form}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Registrate</button>
            </form>
        </div>
    );
};

export default SignInForm;