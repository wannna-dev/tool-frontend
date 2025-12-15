"use client";
import styles from "./Muro.module.scss";
import { useState, useEffect } from "react";
import PostCard from "./PostCard/PostCard";
import CarouselTopics from "./CarouselTopics/CarouselTopics";
import QuestionCard from "./QuestionCard/QuestionCard";

import { PostType } from "@/types/post";
import { ProfileType } from "@/types/profile";
import { QuestionType } from "@/types/question";
import { getPosts } from "@/lib/post-actions";

const QUESTIONS = [
    { id: 1, text: "¿Qué me está intentando mostrar esta experiencia sobre quién soy? ¿Cómo puedo organizar mejor mi día para que me dé tiempo a todo?", created_at: new Date(), user_id: "1", totalReactions: 10, reactionCounts: { me_identifico: 5, me_emociona: 3, me_enseno: 1, me_alegra: 1 }, userReactionType: "me_identifico" },
    { id: 2, text: "Tips para la Psoriasis ¿Alguien tiene?", created_at: new Date(), user_id: "1", totalReactions: 10, reactionCounts: { me_identifico: 5, me_emociona: 3, me_enseno: 1, me_alegra: 1 }, userReactionType: "me_identifico" },
    { id: 3, text: "Me estoy divorciando y a mi hija de 11 años le está costando entenderlo", created_at: new Date(), user_id: "1", totalReactions: 10, reactionCounts: { me_identifico: 5, me_emociona: 3, me_enseno: 1, me_alegra: 1 }, userReactionType: "me_identifico" },
];

const Muro = () => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className={styles.muro}>
            <div className={styles.muro__container}>
                <div className={styles.muro__carouselTopics}>
                    <CarouselTopics />
                </div>

                <div className={styles.muro__content}>
                    <div className={styles.muro__content__posts}>
                        <p className={styles.muro__content__title}>Publicaciones recientes</p>
                        {posts.length > 0 && posts.map((post, index) => (
                            <div key={post.id}>
                                {index > 0 && (
                                    <div className={styles.muro__content__posts__divider}></div>
                                )}
                                <PostCard post={post as PostType & { profiles: ProfileType }} />
                            </div>

                        ))}
                    </div>

                    <div className={styles.muro__content__questions}>
                        <p className={styles.muro__content__title}>Preguntas hot</p>
                        {QUESTIONS.length > 0 && QUESTIONS.map((question) => (
                            <div key={question.id}>
                                <QuestionCard question={question as unknown as QuestionType} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Muro;