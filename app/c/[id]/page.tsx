import Dashboard from "@/components/Dashboard/Dashboard";
import styles from "./ComunidadPage.module.scss";
import { getUserData } from "@/utils/auth/getUserData";

const ComunidadPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { userLogged } = await getUserData();
    return (
        <div className={styles.page}>
            <Dashboard
                userLogged={userLogged}
                pageType="comunidad"
                communityId={id}
            />
        </div>
    );
};

export default ComunidadPage;