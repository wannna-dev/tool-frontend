"use client";

import Link from "next/link";
import styles from "./SignUpForm.module.scss";
import { signup } from "@/lib/auth-actions";

export function SignUpForm() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Sign Up</h2>
        <p className={styles.cardDescription}>
          Enter your information to create an account
        </p>
      </div>

      <div className={styles.cardContent}>
        <form action="">
          <div className={styles.formGrid}>
            <div className={styles.doubleGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="first-name">First name</label>
                <input
                  name="first-name"
                  id="first-name"
                  placeholder="Max"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="last-name">Last name</label>
                <input
                  name="last-name"
                  id="last-name"
                  placeholder="Robinson"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input name="password" id="password" type="password" />
            </div>

            <button formAction={signup} type="submit" className={styles.submit}>
              Create an account
            </button>
          </div>
        </form>

        <div className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
