import { Post } from "./post";
export interface UserType {
  id: string;
  username: string;
  description: string;
  posts: Post[];
}