import { BaseFeedItem } from "@/types/feed";

export interface QuestionType extends BaseFeedItem {
  type: 'question';
  question: string;
  context: string;
}