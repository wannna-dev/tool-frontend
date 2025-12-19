"use client";
import styles from "./PostCard.module.scss";
import { useState, useCallback, useMemo, memo } from "react";
import { getDaysAgo } from "@/lib/utils/date";
import Link from "next/link";
import Image from "next/image";
import { PostType } from "@/types/post";
import { ProfileType } from "@/types/profile";
import ReactionPicker from "@/components/ReactionPicker/ReactionPicker";
import { ReactionType } from "@/types/reactions";

const PostCard = ({ post, longText = false }: { post: PostType & { profiles: ProfileType, totalReactions: number, reactionCounts: { me_identifico: number, me_emociona: number, me_enseno: number, me_alegra: number }, userReactionType: ReactionType | null }, longText?: boolean }) => {
  const [isModalActionsOpen, setIsModalActionsOpen] = useState(false);

  // Memoize computed values
  const daysAgo = useMemo(() => getDaysAgo(post.created_at as Date), [post.created_at]);
  /* const avatarStyle = useMemo(
    () => ({ backgroundImage: `url("${post.private ? "/svg/anonymous-avatar.svg" : post.profiles.picture}")` }),
    [post.private, post.profiles.picture]
  ); */
  const avatarStyle = useMemo(
    () => {
      const imageUrl = post.community?.image 
        || (post.private ? "/svg/anonymous-avatar.svg" : post.profiles.picture);
      
      return { backgroundImage: `url("${imageUrl}")` };
    },
    [post.community?.image, post.private, post.profiles.picture]
  );

  const handleReportPost = useCallback(async () => {
    setIsModalActionsOpen(false);
    try {
      // TODO: Implement API call
      console.log("report post");
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  }, []);

  const toggleModalActions = useCallback(() => {
    setIsModalActionsOpen((prev) => !prev);
  }, []);

  return (
    <Link href={`/p/${post.id}`} className={styles.postCard}>
      <div className={styles.postCard__container}>  
        <div className={styles.postCard__header}>
          {post.private ? (
            <div className={styles.postCard__header__username}>
              <div
                className={styles.postCard__header__avatar}
                style={avatarStyle}
                role="img"
                aria-label={`Anónimo avatar`}
              />
              <div className={styles.postCard__header__username__content}>
                <p className={styles.postCard__header__username__content__name}>
                  {post.community?.name && (
                    <>
                    <span className={styles.postCard__header__username__content__name__community}>
                      {post.community?.name}{" "}
                    </span>
                    <br />
                    </>
                  )}
                  <span>
                    by Anónimo{" "}
                  </span>
                </p>
                <span className={styles.postCard__header__createdAt}>
                  · {daysAgo}
                </span>
              </div>
            </div>
          ) : (
            <Link
              className={styles.postCard__header__username}
              href={`/${post.profiles.username}`}
              prefetch={false}
            >
              <div
                className={styles.postCard__header__avatar}
                style={avatarStyle}
                role="img"
                aria-label={`${post.profiles.username} avatar`}
              />
              <div className={styles.postCard__header__username__content}>
                <p className={styles.postCard__header__username__content__name}>
                  {post.community?.name && (
                    <>
                    <span className={styles.postCard__header__username__content__name__community}>
                      {post.community?.name}{" "}
                    </span>
                    <br />
                    </>
                  )}
                  <span>
                  by {post.profiles.username}{" "}
                  </span>
                </p>
                <span className={styles.noteCard__header__createdAt}>
                  · {daysAgo}
                </span>
              </div>
            </Link>
          )}

          <div className={styles.postCard__header__actions}>
            <button
              className={styles.postCard__header__actions__icon}
              onClick={toggleModalActions}
              aria-label="Post options"
              data-variant="icon"
            >
              <Image
                src="/svg/dots.svg"
                alt=""
                width={22}
                height={5}
                loading="lazy"
              />
            </button>
            {isModalActionsOpen && (
              <div
                className={styles.postCard__header__actions__modal}
                onClick={handleReportPost}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleReportPost()}
              >
                <Image
                  src="/svg/megaphone.svg"
                  alt=""
                  width={24}
                  height={24}
                  loading="lazy"
                />
                <p>Denunciar</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.postCard__content}>
          {post.title && (
            <p className={styles.postCard__content__title}>{post.title}</p>
          )}
          {post.description && (
            <p className={styles.postCard__content__description}>
              <div dangerouslySetInnerHTML={{ 
                __html: longText ? post.description : post.description.length > 100 
                  ? post.description.slice(0, 100) + '... <span class="' + styles.postCard__content__description__more + '">Más</span>'
                  : post.description 
              }} />

            </p>
          )}
          {post.image && (
            <div className={styles.postCard__content__image}>
              <Image
                className={styles.postCard__content__image__img}
                src={post.image}
                alt={post.title || "Post image"}
                width={300}
                height={300}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                quality={85}
              />
            </div>
          )}
        </div>

        <div className={styles.postCard__footer}>
          <div className={styles.postCard__footer__likes}>
              <ReactionPicker
                postId={post.id}
                postType="post"
                initialTotalReactions={post.totalReactions}
                initialReactionCounts={post.reactionCounts}
                initialUserReactionType={post.userReactionType}
              />
          </div>

          <div className={styles.postCard__footer__comments}>

            {/* <button data-variant="icon">Comentar</button>
            <button data-variant="icon">223 comentarios</button> */}

          </div>
        </div>
      </div>
    </Link>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(PostCard, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.likesCount === nextProps.post.likesCount &&
    prevProps.post.likedByCurrentUser === nextProps.post.likedByCurrentUser
  );
});

/* POST - posts/id/like */