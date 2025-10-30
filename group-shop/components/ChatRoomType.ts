import { UUID } from "crypto";

export interface ChatRoomType {
  id: UUID,
  created_at: string,
  owner: string,
  name: string,
  members: string,
}