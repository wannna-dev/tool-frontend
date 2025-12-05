import styles from "./Login.module.scss";
import Image from "next/image";
// components
import LoginForm from "@/components/Login/LoginForm/LoginForm";
import Header from "@/components/Header/Header";

const Login = () => {
  return (
    <div className={styles.login}>
        <Header />
        <div className={styles.login__container}>
            <Image className={styles.login__container__logo} src="/svg/logo-wanna.svg" alt="Wanna" width={25} height={11} />
            <h1 className={styles.login__container__title}>Cuenta tu historia o descubre experiencias que inspiran</h1>
            <LoginForm />
            <p className={styles.login__container__terms}>Al continuar, aceptas las <a href="#">Condiciones</a> y la <a href="#">Política de privacidad</a></p>
        </div>
    </div>
  );
};

export default Login;