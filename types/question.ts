import { BaseFeedItem } from "@/types/feed";
import { CommunityType } from "./community";

export interface QuestionType extends BaseFeedItem {
  type: 'question';
  question: string;
  context: string;
  community: CommunityType;
}