import styles from "./CarouselTopics.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';

const TOPICS = [
  { id: 1, name: "Ansiedad silenciosa", likes: '1K', color: 'var(--color-black)' },
  { id: 2, name: "Maternidad", likes: '932', color: 'var(--color-black)' },
  { id: 3, name: "Amor no correspondido", likes: '824', color: 'var(--color-black)' },
  { id: 4, name: "Trauma", likes: '234', color: 'var(--color-black)' },
  { id: 5, name: "Perder a un ser querido", likes: '234', color: 'var(--color-black)' },
  { id: 6, name: "Viajes", likes: '234', color: 'var(--color-black)' },
  { id: 7, name: "No llegar a fin de mes", likes: '234', color: 'var(--color-black)' },
]

const CarouselTopics = () => {
  return (
    <div className={styles.carousel}>
      <p className={styles.carousel__title}>Filtros:</p>
      <Swiper
        className={styles.carousel__swiper}
        spaceBetween={30}
        slidesPerView="auto"
        /* breakpoints={{ 768: { slidesPerView: 2 } }} */
      >
        {TOPICS.map((topic) => (
          <SwiperSlide key={topic.id} className={styles.carousel__swiper__slide}>
            <div className={styles.carousel__swiper__slide__content}>
              <p className={styles.carousel__swiper__slide__text} style={{ color: topic.color }}>{topic.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselTopics;