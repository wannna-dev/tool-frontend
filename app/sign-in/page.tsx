import styles from "./SignInPage.module.scss";
import SignInForm from "@/components/SignInForm/SignInForm";
const SignInPage = () => {
    return (
        <div className={styles.signin}>
            <SignInForm />
        </div>
    );
};

export default SignInPage;