import { ReactionType } from "./reactions";
import { ProfileType } from "./profile";

// Base type with all shared fields
export interface BaseFeedItem {
  id: string;
  image: string;
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
}

// Extend base for each specific type
export interface PostType extends BaseFeedItem {
  type: 'post';
  title: string;
  description: string;
}

export interface NoteType extends BaseFeedItem {
  type: 'note';
  content: string;
}

export interface QuestionType extends BaseFeedItem {
  type: 'question';
  title: string;
  content: string;
}

// Union type for discriminated union (type narrowing)
export type FeedItemType = PostType | NoteType | QuestionType;