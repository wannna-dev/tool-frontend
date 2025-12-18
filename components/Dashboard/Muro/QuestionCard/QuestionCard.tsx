import styles from "./QuestionCard.module.scss";
import { useState, useCallback, useMemo, memo } from "react";
import { getDaysAgo } from "@/lib/utils/date";

import { QuestionType } from "@/types/question";
import Link from "next/link";
import Image from "next/image";

const QuestionCard = ({ question }: { question: QuestionType }) => {

    const [isModalActionsOpen, setIsModalActionsOpen] = useState(false);

    // Memoize computed values
    const daysAgo = useMemo(() => getDaysAgo(question.created_at as Date), [question.created_at]);
    const avatarStyle = useMemo(
        () => ({ backgroundImage: `url("${question.private ? "/svg/anonymous-avatar.svg" : question.profiles.picture}")` }),
        [question.private, question.profiles.picture]
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
        <div className={styles.questionCard}>
            <div className={styles.questionCard__container}>
                <div className={styles.questionCard__header}>
                    {question.private ? (
                    <div className={styles.questionCard__header__username}>
                        <div
                        className={styles.questionCard__header__avatar}
                        style={avatarStyle}
                        role="img"
                        aria-label={`Anónimo avatar`}
                        />
                        <p>
                        Anónimo{" "}
                        <span className={styles.questionCard__header__createdAt}>
                            · {daysAgo}
                        </span>
                        </p>
                    </div>
                    ) : (
                    <Link
                        className={styles.questionCard__header__username}
                        href={`/${question.profiles.username}`}
                        prefetch={false}
                    >
                        <div
                        className={styles.questionCard__header__avatar}
                        style={avatarStyle}
                        role="img"
                        aria-label={`${question.profiles.username} avatar`}
                        />
                        <p>
                        {question.profiles.username}{" "}
                        <span className={styles.questionCard__header__createdAt}>
                            · {daysAgo}
                        </span>
                        </p>
                    </Link>
                    )}

                    <div className={styles.questionCard__header__actions}>
                        <button
                            className={styles.questionCard__header__actions__icon}
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
                            className={styles.questionCard__header__actions__modal}
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

                <div className={styles.questionCard__content}>
                    {question.question && (
                        <p className={styles.questionCard__content__text}>
                            {question.question}
                        </p>
                    )}
                    {question.context && (
                        <p className={styles.postCard__content__description}>
                            {question.context.split(' ').length > 35 ? (
                                <>
                                    {question.context.split(' ').slice(0, 35).join(' ')}... 
                                    <span className={styles.postCard__content__description__more}> Más</span>
                                </>
                            ) : (
                                question.context
                            )}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;