"use client";
import styles from "./PostCard.module.scss";
import { useState } from "react";
import { getDaysAgo } from "@/lib/utils/date";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { useAppContext } from "@/context/AppContext";

const PostCard = ({ post }: { post: any }) => {

    console.log(post);

    const { token } = useAppContext();

    const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
    const [likes, setLikes] = useState(post.likesCount)
    const [isModalActionsOpen, setIsModalActionsOpen] = useState(false);

    /*
     * Handle like post
     */
    const handleLikePost = async () => {
        const res = await apiFetch(`/posts/${post.id}/like`, {
            method: "POST",
            token: token as string,
        });
        console.log(res);
        if (res) {
            setIsLiked(!isLiked);
            setLikes(res.likesCount);
        } else {
            console.error(res.error);
        }
    };

    /*
     * Handle report post
     */
    const handleReportPost = async () => {
        /* const res = await apiFetch(`/posts/${post.id}/report`, {
            method: "POST",
            token: token as string,
        }); */
        console.log("report post");
    };


    return (
        <div className={styles.postCard}>
            <div className={styles.postCard__header}>
                <Link className={styles.postCard__header__username} href={`/${post.username}`}>
                    <div className={styles.postCard__header__avatar} />
                    <p>{post.username} <span className={styles.postCard__header__createdAt}>· {getDaysAgo(post.createdAt)}</span></p>
                </Link>

                <div className={styles.postCard__header__actions}>
                    <Image src="/svg/dots.svg" alt="dots" width={22} height={5} />
                    {isModalActionsOpen && (
                        <div className={styles.card__header__actions__modal} onClick={handleReportPost}>
                            <Image src="/svg/megaphone.svg" alt="report" width={24} height={24} />
                            <p>Denunciar</p>
                        </div>
                    )}
                </div>
            </div>
            <p className={styles.postCard__content}>{post.content}</p>
            <div className={styles.postCard__footer}>
                <div className={styles.postCard__footer__likes}>
                    <svg
                        onClick={handleLikePost}
                        className={`${styles.postCard__footer__likes__icon} ${isLiked ? styles.postCard__footer__likes__icon__liked : styles.postCard__footer__likes__icon__unliked}`}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.39147 11.5983C1.00006 7.5 3.5 4.13839 6.28413 3.28632C9.00001 2.45515 11 3.30167 12 4.5C13 3.30167 15 2.45842 17.7053 3.28632C20.6709 4.1939 23 7.5 21.6074 11.5983C19.8495 16.9083 13.0001 20.9983 12 20.9983C10.9999 20.9984 4.20833 16.9703 2.39147 11.5983Z" stroke="#FAFAFA" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <p>{likes}</p>
                </div>
            </div>
        </div>
    );
};

export default PostCard;

/* POST - posts/id/like */