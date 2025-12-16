"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { toggleReaction } from "@/lib/post-actions";
import { ReactionType } from "@/types/reactions";
import styles from "./ReactionPicker.module.scss";
import Image from "next/image";

interface ReactionPickerProps {
  postId: string;
  initialTotalReactions: number;
  initialReactionCounts: {
    me_identifico: number;
    me_emociona: number;
    me_enseno: number;
    me_alegra: number;
  };
  initialUserReactionType: ReactionType | null;
}

const REACTIONS = [
  { type: 'me_identifico' as ReactionType, icon: '/svg/reactions/me-identifico.svg', label: 'Me representa' },
  { type: 'me_emociona' as ReactionType, icon: '/svg/reactions/me-emociono.svg', label: 'Me emociona' },
  { type: 'me_enseno' as ReactionType, icon: '/svg/reactions/me-enseno.svg', label: 'Me aporta' },
  { type: 'me_alegra' as ReactionType, icon: '/svg/reactions/me-alegra.svg', label: 'Me hace reír' },
];

// Color mapping for each reaction type
const REACTION_COLORS: Record<ReactionType, string> = {
  me_identifico: 'var(--color-resuena)',
  me_emociona: 'var(--color-emociona)',
  me_enseno: 'var(--color-enseno)',
  me_alegra: 'var(--color-alegra)',
};

export default function ReactionPicker({
  postId,
  initialTotalReactions,
  initialReactionCounts,
  initialUserReactionType,
}: ReactionPickerProps) {
  const [totalReactions, setTotalReactions] = useState(initialTotalReactions);
  const [reactionCounts, setReactionCounts] = useState(initialReactionCounts);
  const [userReactionType, setUserReactionType] = useState<ReactionType | null>(
    initialUserReactionType
  );
  const [showPicker, setShowPicker] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const handleReactionClick = async (reactionType: ReactionType) => {
    setShowPicker(false);

    // Optimistic update
    const wasReacted = userReactionType !== null;
    const isSameReaction = userReactionType === reactionType;

    if (isSameReaction) {
      // Remove reaction
      setUserReactionType(null);
      setTotalReactions(totalReactions - 1);
      setReactionCounts({
        ...reactionCounts,
        [reactionType]: reactionCounts[reactionType] - 1,
      });
    } else if (wasReacted && userReactionType) {
      // Change reaction
      setUserReactionType(reactionType);
      setReactionCounts({
        ...reactionCounts,
        [userReactionType]: reactionCounts[userReactionType] - 1,
        [reactionType]: reactionCounts[reactionType] + 1,
      });
    } else {
      // Add new reaction
      setUserReactionType(reactionType);
      setTotalReactions(totalReactions + 1);
      setReactionCounts({
        ...reactionCounts,
        [reactionType]: reactionCounts[reactionType] + 1,
      });
    }

    startTransition(async () => {
      const result = await toggleReaction(postId, reactionType);
      console.log("🚀 result:", result);

      if (result.error) {
        // Revert on error
        setUserReactionType(initialUserReactionType);
        setTotalReactions(initialTotalReactions);
        setReactionCounts(initialReactionCounts);
        alert(result.error);
      }
    });
  };

  // Calculate percentages
  const calculatePercentage = (count: number) => {
    if (totalReactions === 0) return 0;
    return (count / totalReactions) * 100;
  };

  return (
    <div className={styles.reactionPicker} ref={pickerRef}>

      <div className={styles.reactionPicker__container}>
        <div className={styles.reactionPicker__container__graph}>

        {Object.entries(reactionCounts).map(([key, value]) => {
          const percentage = calculatePercentage(value);
          const reactionType = key as ReactionType;
          return (
            <div key={`${key}-${value}`} className={styles.reactionPicker__container__graph__item}>
              <span 
                className={styles.reactionPicker__container__graph__item__bar}
                style={{ 
                  height: `${percentage}%`, 
                  backgroundColor: REACTION_COLORS[reactionType],
                }} 
              />
            </div>
          );
        })}

        </div>

        <button
          className={styles.reactionPicker__button}
          onClick={() => setShowPicker(!showPicker)}
          disabled={isPending}
          data-reacted={!!userReactionType}
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.08863 13.073C3.48289 13.1996 3.90482 12.9832 4.03157 12.5891C4.77904 10.2605 6.17935 8.11134 8.20603 6.4369C10.2327 4.76245 12.6075 3.79266 15.0352 3.49785C15.4462 3.44771 15.7382 3.07416 15.6883 2.6631C15.6383 2.25196 15.2649 1.95871 14.8537 2.00864C12.1498 2.33703 9.50483 3.41808 7.25063 5.28052C4.99642 7.14295 3.43585 9.53657 2.60334 12.1299C2.47675 12.5243 2.69428 12.9464 3.08863 13.073Z" fill="#0DEBF5"/>
            <path fill={userReactionType ? REACTION_COLORS[userReactionType] : 'transparent'} stroke={userReactionType ? 'transparent' : '#CFD7E3'} strokeWidth="1.5" strokeLinecap="round" clipRule="evenodd" d="M8.63539 17.3169C7.47588 13.9016 9.55917 11.1002 11.8793 10.3902C14.1425 9.69755 15.8092 11.0587 16.6425 12.0573C17.4758 11.0587 19.1425 9.70027 21.3969 10.3902C23.8682 11.1465 25.8092 13.9016 24.6487 17.3169C23.1837 21.7419 17.4759 25.1501 16.6425 25.1502C15.8091 25.1502 10.1494 21.7935 8.63539 17.3169Z"/>
            <path d="M6.43581 25.0909C8.11026 27.1176 10.2595 28.5179 12.588 29.2654C12.9822 29.3921 13.1985 29.8141 13.0719 30.2083C12.9453 30.6027 12.5232 30.8202 12.1289 30.6936C9.53549 29.8611 7.14187 28.3005 5.27944 26.0463C3.417 23.7921 2.33595 21.1471 2.00756 18.4433C1.95762 18.0321 2.25087 17.6586 2.66202 17.6086C3.07308 17.5587 3.44663 17.8508 3.49676 18.2617C3.79158 20.6895 4.76137 23.0642 6.43581 25.0909Z" fill="#E8E80A"/>
            <path d="M18.4431 31.2944C21.147 30.966 23.792 29.885 26.0462 28.0226C28.3004 26.1601 29.861 23.7665 30.6935 21.1731C30.8201 20.7788 30.6025 20.3567 30.2082 20.2301C29.8139 20.1035 29.392 20.3198 29.2652 20.714C28.5178 23.0425 27.1175 25.1917 25.0908 26.8662C23.0641 28.5406 20.6894 29.5104 18.2616 29.8052C17.8506 29.8554 17.5586 30.2289 17.6085 30.64C17.6585 31.0511 18.032 31.3444 18.4431 31.2944Z" fill="#3C66F5"/>
            <path d="M31.2882 14.8598C30.9598 12.156 29.8788 9.51094 28.0164 7.25674C26.1539 5.00253 23.7603 3.44196 21.1669 2.60945C20.7726 2.48286 20.3505 2.7004 20.2239 3.09474C20.0973 3.489 20.3136 3.91093 20.7078 4.03768C23.0363 4.78515 25.1855 6.18547 26.86 8.21214C28.5344 10.2388 29.5042 12.6136 29.799 15.0413C29.8492 15.4523 30.2227 15.7443 30.6338 15.6944C31.0449 15.6444 31.3382 15.271 31.2882 14.8598Z" fill="#FF00BB"/>
            <path d="M3.08863 13.073C3.48289 13.1996 3.90482 12.9832 4.03157 12.5891C4.77904 10.2605 6.17935 8.11134 8.20603 6.4369C10.2327 4.76245 12.6075 3.79266 15.0352 3.49785C15.4462 3.44771 15.7382 3.07416 15.6883 2.6631C15.6383 2.25196 15.2649 1.95871 14.8537 2.00864C12.1498 2.33703 9.50483 3.41808 7.25063 5.28052C4.99642 7.14295 3.43585 9.53657 2.60334 12.1299C2.47675 12.5243 2.69428 12.9464 3.08863 13.073Z" fill="#0DEBF5"/>
            <path d="M3.08863 13.073C3.48289 13.1996 3.90482 12.9832 4.03157 12.5891C4.77904 10.2605 6.17935 8.11134 8.20603 6.4369C10.2327 4.76245 12.6075 3.79266 15.0352 3.49785C15.4462 3.44771 15.7382 3.07416 15.6883 2.6631C15.6383 2.25196 15.2649 1.95871 14.8537 2.00864C12.1498 2.33703 9.50483 3.41808 7.25063 5.28052C4.99642 7.14295 3.43585 9.53657 2.60334 12.1299C2.47675 12.5243 2.69428 12.9464 3.08863 13.073Z" fill="#0DEBF5"/>
            <path d="M31.2882 14.8598C30.9598 12.156 29.8788 9.51094 28.0164 7.25674C26.1539 5.00253 23.7603 3.44196 21.1669 2.60945C20.7726 2.48286 20.3505 2.7004 20.2239 3.09474C20.0973 3.489 20.3136 3.91093 20.7078 4.03768C23.0363 4.78515 25.1855 6.18547 26.86 8.21214C28.5344 10.2388 29.5042 12.6136 29.799 15.0413C29.8492 15.4523 30.2227 15.7443 30.6338 15.6944C31.0449 15.6444 31.3382 15.271 31.2882 14.8598Z" fill="#FF00BB"/>
            <path d="M6.43581 25.0909C8.11026 27.1176 10.2595 28.5179 12.588 29.2654C12.9822 29.3921 13.1985 29.8141 13.0719 30.2083C12.9453 30.6027 12.5232 30.8202 12.1289 30.6936C9.53549 29.8611 7.14187 28.3005 5.27944 26.0463C3.417 23.7921 2.33595 21.1471 2.00756 18.4433C1.95762 18.0321 2.25087 17.6586 2.66202 17.6086C3.07308 17.5587 3.44663 17.8508 3.49676 18.2617C3.79158 20.6895 4.76137 23.0642 6.43581 25.0909Z" fill="#E8E80A"/>
            <path d="M18.4431 31.2944C21.147 30.966 23.792 29.885 26.0462 28.0226C28.3004 26.1601 29.861 23.7665 30.6935 21.1731C30.8201 20.7788 30.6025 20.3567 30.2082 20.2301C29.8139 20.1035 29.392 20.3198 29.2652 20.714C28.5178 23.0425 27.1175 25.1917 25.0908 26.8662C23.0641 28.5406 20.6894 29.5104 18.2616 29.8052C17.8506 29.8554 17.5586 30.2289 17.6085 30.64C17.6585 31.0511 18.032 31.3444 18.4431 31.2944Z" fill="#3C66F5"/>
          </svg>
        </button>
      </div>

      {showPicker && (
        <div className={styles.reactionPicker__menu}>
          {REACTIONS.map((reaction) => (
            <button
              key={reaction.type}
              className={styles.reactionPicker__option}
              onClick={() => handleReactionClick(reaction.type)}
              data-selected={userReactionType === reaction.type}
            >
              <Image
                src={reaction.icon}
                alt="reaction"
                width={20}
                height={20}
                className={styles.reactionPicker__icon}
              />
              <span className={styles.reactionPicker__optionLabel}>
                {reaction.label}
              </span>
              {/* {reactionCounts[reaction.type] > 0 && (
                <span className={styles.reactionPicker__optionCount}>
                  {reactionCounts[reaction.type]}
                </span>
              )} */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}