import { ReactionType } from "@/types/reactions";

export interface QuestionType {
  id: string;
  text: string;
  created_at: Date | string;
  user_id: string;
  totalReactions: number;
  reactionCounts: {
    me_identifico: number;
    me_emociona: number;
    me_enseno: number;
    me_alegra: number;
  };
  userReactionType: ReactionType | null;
}