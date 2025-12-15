import React from "react";
import { SignUpForm } from "@/app/(auth)/signup/components/SignUpForm";
import styles from "./SignUpPage.module.scss";

const SignUpPage = () => {
  return (
    <div className={styles.container}>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;