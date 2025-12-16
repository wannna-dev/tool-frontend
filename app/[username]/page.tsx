import Dashboard from "@/components/Dashboard/Dashboard";
import styles from "./PerfilPage.module.scss";
import { getUserData } from "@/utils/auth/getUserData";

const PerfilPage = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;
    const { userLogged } = await getUserData();

    return (
        <div className={styles.page}>
            <Dashboard
                userLogged={userLogged}
                usernameProfile={username}
                pageType="perfil"
            />
        </div>
    );
};

export default PerfilPage;