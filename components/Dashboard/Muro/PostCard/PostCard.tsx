import styles from "./PostCard.module.scss";
import { getDaysAgo } from "@/lib/utils/date";
import Link from "next/link";

const PostCard = ({ post }: { post: any }) => {
    return (
        <div className={styles.postCard}>
            <div className={styles.postCard__header}>
                <Link className={styles.postCard__header__username} href={`/${post.username}`}>
                    <div className={styles.postCard__header__avatar} />
                    <p>{post.username} <span className={styles.postCard__header__createdAt}>· {getDaysAgo(post.createdAt)}</span></p>
                </Link>
            </div>
            <p className={styles.postCard__content}>{post.content}</p>
        </div>
    );
};

export default PostCard;