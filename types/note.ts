import { ReactionType } from "./reactions";
import { ProfileType } from "./profile";
import { CommunityType } from "./community";

export interface NoteType {
  id: string;
  image: string;
  content: string;
  created_at: Date;
  likesCount: number;
  likedByCurrentUser: boolean;
  profiles: ProfileType;
  totalReactions: number;
  private: boolean;
  reactionCounts: {
    me_identifico: number;
    me_emociona: number;
    me_enseno: number;
    me_alegra: number;
  };
  userReactionType: ReactionType | null;
  community: CommunityType;
}