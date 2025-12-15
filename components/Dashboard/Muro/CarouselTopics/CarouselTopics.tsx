import styles from "./CarouselTopics.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';

const TOPICS = [
  { id: 1, name: "Me ha tocado", likes: '1K', color: 'var(--color-main)' },
  { id: 2, name: "Sin postureo", likes: '932', color: 'var(--color-enseno)' },
  { id: 3, name: "Esto es útil", likes: '824', color: 'var(--color-emociona)' },
  { id: 4, name: "Freeeesh", likes: '234', color: 'var(--color-alegra)' },
]

const CarouselTopics = () => {
  return (
    <div className={styles.carousel}>
      <Swiper
        className={styles.carousel__swiper}
        spaceBetween={10}
        slidesPerView="auto"
        /* breakpoints={{ 768: { slidesPerView: 2 } }} */
      >
        {TOPICS.map((topic) => (
          <SwiperSlide key={topic.id} className={styles.carousel__swiper__slide}>
            <div className={styles.carousel__swiper__slide__content}>
              <p className={styles.carousel__swiper__slide__text} style={{ color: topic.color }}>{topic.name}</p>
              <p className={styles.carousel__swiper__slide__content__likes}>{topic.likes}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselTopics;