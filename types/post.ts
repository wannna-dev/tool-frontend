export interface PostType {
  id: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  username: string;
  userId: string;
  likedByCurrentUser: boolean;
}