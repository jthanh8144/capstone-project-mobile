import { User } from './user'

export type FriendRequest = {
  id: string
  status: string
  requesterId: string
  receiverId: string
  requester: User
  receiver: User

  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
