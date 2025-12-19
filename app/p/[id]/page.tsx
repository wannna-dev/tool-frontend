import Dashboard from "@/components/Dashboard/Dashboard";
import styles from "./PostPage.module.scss";
import { getUserData } from "@/utils/auth/getUserData";

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { userLogged } = await getUserData();
    return (
        <div className={styles.page}>
            <Dashboard
                userLogged={userLogged}
                pageType="postpage"
                postId={id}
            />
        </div>
    );
};

export default PostPage;