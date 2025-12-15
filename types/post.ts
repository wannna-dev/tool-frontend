import { ReactionType } from "./reactions";
import { ProfileType } from "./profile";
export interface PostType {
  id: string;
  image: string;
  title: string;
  description: string;
  created_at: Date;
  likesCount: number;
  likedByCurrentUser: boolean;
  profiles: ProfileType;
  totalReactions: number;
  reactionCounts: {
    me_identifico: number;
    me_emociona: number;
    me_enseno: number;
    me_alegra: number;
  };
  userReactionType: ReactionType | null;
}