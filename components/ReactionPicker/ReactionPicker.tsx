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
  { type: 'me_identifico' as ReactionType, icon: '/svg/reactions/me-identifico.svg', label: 'Me identifico' },
  { type: 'me_emociona' as ReactionType, icon: '/svg/reactions/me-emociono.svg', label: 'Me emociona' },
  { type: 'me_enseno' as ReactionType, icon: '/svg/reactions/me-enseno.svg', label: 'Me enseñó' },
  { type: 'me_alegra' as ReactionType, icon: '/svg/reactions/me-alegra.svg', label: 'Me alegra' },
];

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

  const currentReaction = REACTIONS.find((r) => r.type === userReactionType);

  return (
    <div className={styles.reactionPicker} ref={pickerRef}>
      <button
        className={styles.reactionPicker__button}
        onClick={() => setShowPicker(!showPicker)}
        disabled={isPending}
        data-reacted={!!userReactionType}
      >
        <Image
          src={currentReaction ? currentReaction.icon : '/svg/reactions/default.svg'}
          alt="reaction"
          width={20}
          height={20}
          className={styles.reactionPicker__icon}
        />
        <span className={styles.reactionPicker__count}>
          {totalReactions > 0 && totalReactions}
        </span>
      </button>

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
              {reactionCounts[reaction.type] > 0 && (
                <span className={styles.reactionPicker__optionCount}>
                  {reactionCounts[reaction.type]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}