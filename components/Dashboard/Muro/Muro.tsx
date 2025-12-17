"use client";
import styles from "./Muro.module.scss";
import { useState, useEffect } from "react";
import PostCard from "./PostCard/PostCard";
import NoteCard from "./NoteCard/NoteCard";
import CarouselTopics from "./CarouselTopics/CarouselTopics";

import { getFeed } from "@/lib/feed-actions";
import { FeedItemType } from "@/types/feed";

const Muro = () => {
    const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const data = await getFeed();
                console.log("Feed data:", data);
                setFeedItems(data);
            } catch (error) {
                console.error("Error fetching feed:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFeed();
    }, []);

    // TypeScript will narrow the type automatically based on item.type
    const renderFeedItem = (item: FeedItemType) => {
        switch (item.type) {
            case 'post':
                // TypeScript knows item is PostType here
                return <PostCard post={item} />;
            
            case 'note':
                // TypeScript knows item is NoteType here
                return <NoteCard note={item} />;

            default:
                // TypeScript will error if you forget a case
                return null;
        }
    };

    return (
        <div className={styles.muro}>
            <div className={styles.muro__container}>
                <div className={styles.muro__carouselTopics}>
                    <CarouselTopics />
                </div>

                <div className={styles.muro__content}>
                    <div className={styles.muro__content__posts}>
                        <p className={styles.muro__content__title}>Historias recientes</p>
                        
                        {isLoading && <p>Cargando...</p>}
                        
                        {!isLoading && feedItems.length === 0 && (
                            <p>No hay contenido disponible</p>
                        )}
                        
                        {feedItems.length > 0 && feedItems.map((item, index) => (
                            <div key={`${item.type}-${item.id}`}>
                                {index > 0 && (
                                    <div className={styles.muro__content__posts__divider}></div>
                                )}
                                {renderFeedItem(item)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Muro;