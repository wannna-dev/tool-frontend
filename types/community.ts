import { UserType } from "./user";
export interface CommunityType {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  image: string;
  user: UserType;
}