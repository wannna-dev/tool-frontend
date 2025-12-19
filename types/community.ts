import { UserType } from "./user";
import { NoteType } from "./note";
import { QuestionType } from "./question";
import { PostType } from "./post";
export interface CommunityType {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  image: string;
  user: UserType;
  notes: NoteType[];
  questions: QuestionType[];
  posts: PostType[];
}