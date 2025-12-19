import { ReactionType } from "./reactions";
import { ProfileType } from "./profile";
import { CommunityType } from "./community";

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
  community: CommunityType;
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
  community: CommunityType;
}

export interface QuestionType extends BaseFeedItem {
  type: 'question';
  question: string;
  context: string;
  community: CommunityType;
}

// Union type for discriminated union (type narrowing)
export type FeedItemType = PostType | NoteType | QuestionType;