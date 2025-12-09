import styles from "./Login.module.scss";
import Image from "next/image";
// components
import LoginMailForm from "@/components/Login/LoginMailForm/LoginMailForm";
import LoginGoogleForm from "@/components/Login/LoginGoogleForm/LoginGoogleForm";
import Header from "@/components/Header/Header";
import WannaSphere from "@/components/WannaSphere/WannaSphere";

const Login = () => {
  return (
    <div className={styles.login}>
        <Header />

        <div className={styles.login__container}>
            <Image className={styles.login__container__logo} src="/svg/logo-wanna.svg" alt="Wanna" width={25} height={11} />
            <h1 className={styles.login__container__title}>Cuenta tu historia o descubre experiencias que inspiran</h1>
            <div className={styles.login__container__forms}>
              <LoginGoogleForm />
              <LoginMailForm />
            </div>
            <p className={styles.login__container__terms}>Al continuar, aceptas las <a href="#">Condiciones</a> y la <a href="#">Política de privacidad</a></p>
        </div>

        <div className={styles.login__wannaSphere}>
          {/* <WannaSphere /> */}
        </div>
        
    </div>
  );
};

export default Login;