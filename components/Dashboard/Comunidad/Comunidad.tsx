import styles from "./Comunidad.module.scss";
import { useState, useEffect } from "react";
import { getFeedCommunity } from "@/lib/feed-actions";
import { redirect } from "next/navigation";
import { FeedItemType } from "@/types/feed";
import PostCard from "../Muro/PostCard/PostCard";
import NoteCard from "../Muro/NoteCard/NoteCard";
import QuestionCard from "../Muro/QuestionCard/QuestionCard";
import Image from "next/image";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Mousewheel, Keyboard } from 'swiper/modules';


const Comunidad = ({ communityId }: { communityId?: string }) => {
    const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchCommunity = async () => {
          try {
            if (!communityId) return;
            const data = await getFeedCommunity(communityId);
              console.log("🚀 data:", data);
              if (!data) return redirect("/");
              setFeedItems(data);
          } catch (error) {
            console.error("Error fetching community:", error);
          } finally {
            setIsLoading(false);
          }
        }
        fetchCommunity();
    }, [communityId]);

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
        <div className={styles.comunidades}>
          {feedItems[0] && (
            <div className={styles.comunidades__header}>
                <Image className={styles.comunidades__header__image} src={feedItems[0].community?.image || ""} alt={feedItems[0].community?.name || ""} width={100} height={100} />
                <div className={styles.comunidades__header__content}>
                    <p className={styles.comunidades__header__content__name}>{feedItems[0].community?.name}</p>
                    <p className={styles.comunidades__header__content__description}>{feedItems[0].community?.description}</p>
                </div>
            </div>
          )}
          <div className={styles.comunidades__container}>
           {isLoading && (
                <div className={styles.comunidades__loading}>
                    <p>Cargando...</p>
                </div>
            )}
            
            {!isLoading && feedItems.length === 0 && (
                <div className={styles.comunidades__empty}>
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
                    className={styles.comunidades__swiper}
                >
                    {feedItems.map((item) => (
                        <SwiperSlide key={`${item.type}-${item.id}`}>
                            <div className={styles.comunidades__slide}>
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

export default Comunidad;