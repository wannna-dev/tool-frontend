"use client";
import styles from "./NoteCard.module.scss";
import { useState, useCallback, useMemo, memo } from "react";
import { getDaysAgo } from "@/lib/utils/date";
import Link from "next/link";
import Image from "next/image";
import { NoteType } from "@/types/feed";
import ReactionPicker from "@/components/ReactionPicker/ReactionPicker";
import { ReactionType } from "@/types/reactions";

const NoteCard = ({ note }: { note: NoteType }) => {
  const [isModalActionsOpen, setIsModalActionsOpen] = useState(false);

  // Memoize computed values
  const daysAgo = useMemo(() => getDaysAgo(note.created_at as Date), [note.created_at]);
  const avatarStyle = useMemo(
    () => ({ backgroundImage: `url("${note.private ? "/svg/anonymous-avatar.svg" : note.profiles.picture}")` }),
    [note.private, note.profiles.picture]
  );

  const handleReportNote = useCallback(async () => {
    setIsModalActionsOpen(false);
    try {
      // TODO: Implement API call
      console.log("report note");
    } catch (error) {
      console.error("Error reporting note:", error);
    }
  }, []);

  const toggleModalActions = useCallback(() => {
    setIsModalActionsOpen((prev) => !prev);
  }, []);

  return (
    <div className={styles.noteCard}>
      <div className={styles.noteCard__container}>
        <div className={styles.noteCard__header}>
          {note.private ? (
            <div className={styles.noteCard__header__username}>
              <div
                className={styles.noteCard__header__avatar}
                style={avatarStyle}
                role="img"
                aria-label={`Anónimo avatar`}
              />
              <p>
                Anónimo{" "}
                <span className={styles.noteCard__header__createdAt}>
                  · {daysAgo}
                </span>
              </p>
            </div>
          ) : (
            <Link
              className={styles.noteCard__header__username}
              href={`/${note.profiles.username}`}
              prefetch={false}
            >
              <div
                className={styles.noteCard__header__avatar}
                style={avatarStyle}
                role="img"
                aria-label={`${note.profiles.username} avatar`}
              />
              <p>
                {note.profiles.username}{" "}
                <span className={styles.noteCard__header__createdAt}>
                  · {daysAgo}
                </span>
              </p>
            </Link>
          )}

          <div className={styles.noteCard__header__actions}>
            <button
              className={styles.noteCard__header__actions__icon}
              onClick={toggleModalActions}
              aria-label="Note options"
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
                className={styles.noteCard__header__actions__modal}
                onClick={handleReportNote}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleReportNote()}
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

        <div className={styles.noteCard__content}>
          {note.content && (
            <p className={styles.noteCard__content__text}>
              {note.content}
            </p>
          )}
        </div>

        <div className={styles.noteCard__footer}>
          <div className={styles.noteCard__footer__likes}>
            <ReactionPicker
              postId={note.id}
              postType="note"
              initialTotalReactions={note.totalReactions}
              initialReactionCounts={note.reactionCounts}
              initialUserReactionType={note.userReactionType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(NoteCard, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.note.id === nextProps.note.id &&
    prevProps.note.likesCount === nextProps.note.likesCount &&
    prevProps.note.likedByCurrentUser === nextProps.note.likedByCurrentUser
  );
});