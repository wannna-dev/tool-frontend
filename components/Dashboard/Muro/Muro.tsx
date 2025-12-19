"use client";
import styles from "./Muro.module.scss";
import { useState, useEffect } from "react";
import PostCard from "./PostCard/PostCard";
import NoteCard from "./NoteCard/NoteCard";
import QuestionCard from "./QuestionCard/QuestionCard";
import CarouselTopics from "./CarouselTopics/CarouselTopics";

import { getFeed } from "@/lib/feed-actions";
import { FeedItemType } from "@/types/feed";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Mousewheel, Keyboard } from 'swiper/modules';

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

    const renderFeedItem = (item: FeedItemType) => {
        switch (item.type) {
            case 'post':
                return <PostCard post={item} />;
            
            case 'note':
                return <NoteCard note={item} />;

            case 'question':
                return <QuestionCard question={item} />;

            default:
                return null;
        }
    };

    return (
        <div className={styles.muro}>
            <div className={styles.muro__header}>
                <CarouselTopics />
            </div>

            <div className={styles.muro__container}>
                {isLoading && (
                    <div className={styles.muro__loading}>
                        <p>Cargando...</p>
                    </div>
                )}
                
                {!isLoading && feedItems.length === 0 && (
                    <div className={styles.muro__empty}>
                        <p>No hay contenido disponible</p>
                    </div>
                )}
                
                {!isLoading && feedItems.length > 0 && (
                    <Swiper
                        direction="vertical"
                        slidesPerView={1}
                        mousewheel={true}
                        keyboard={{
                            enabled: true,
                        }}
                        modules={[Mousewheel, Keyboard]}
                        className={styles.muro__swiper}
                    >
                        {feedItems.map((item) => (
                            <SwiperSlide key={`${item.type}-${item.id}`}>
                                <div className={styles.muro__slide}>
                                    {renderFeedItem(item)}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default Muro;