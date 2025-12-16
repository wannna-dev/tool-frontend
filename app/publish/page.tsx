import Dashboard from "@/components/Dashboard/Dashboard";
import styles from "./PublishPage.module.scss";
import { getUserData } from "@/utils/auth/getUserData";

const PublishPage = async () => {
  const { userLogged } = await getUserData();

  return (
      <div className={styles.page}>
          <Dashboard
              userLogged={userLogged}
              pageType="post"
          />
      </div>
  );
};

export default PublishPage;