import Dashboard from "@/components/Dashboard/Dashboard";
import styles from "./PerfilPage.module.scss";

const PerfilPage = async ({ params }: { params: Promise<{ username: string }> }) => {
    // ✅ Await params since it's a Promise
    const { username } = await params;
    return (
        <div className={styles.page}>
            <Dashboard usernameProfile={username} pageType="perfil" />
        </div>
    );
};

export default PerfilPage;