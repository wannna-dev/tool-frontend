"use client";
import styles from "./Muro.module.scss";
import { useState, useEffect } from "react";
import PostCard from "./PostCard/PostCard";
const Muro = () => {

    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/posts");
            const data = await res.json();
            setPosts(data);
        }
        fetchPosts();
    }, []);


    return (
        <div className={styles.muro}>
            <div className={styles.muro__container}>
                <div className={styles.muro__posts}>
                    {posts.length > 0 && posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Muro;