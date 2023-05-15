import { FriendStatusEnum } from '../types'
import { SignalStore } from './signal-store'

export type User = {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  isVerified: boolean
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
  signalStore?: SignalStore
  friendStatus?: FriendStatusEnum
  friendRequestId?: string
}
