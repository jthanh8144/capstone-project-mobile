import { Conservation } from './conservation'
import { FriendRequest } from './friend-request'
import { ConservationSetting } from './conservation'
import { Message } from './message'
import { User } from './user'

export type RefreshTokenSuccess = {
  status: boolean
  accessToken: string
}

export type LoginSuccess = {
  userId: string
  email: string
  accessToken: string
  refreshToken: string
}

export type ApiResponse = {
  success: boolean
  message: string
}

export type ProfileResponse = {
  success: boolean
  user: User
}

export type PresignedUrlResponse = {
  presignedUrl: string
  url: string
}

export type FriendRequestResponse = {
  success: boolean
  friendRequests: FriendRequest[]
  nextPage: number | undefined
  totalPage: number
}

export type FriendsListResponse = {
  success: boolean
  friends: User[]
  nextPage: number | undefined
  totalPage: number
}

export type ConservationsResponse = {
  success: boolean
  conservations: Conservation[]
  nextPage: number | undefined
  totalPage: number
}

export type DetailConservationResponse = {
  success: boolean
  messages: Message[]
  nextPage: number | undefined
  totalPage: number
}

export type GetDeviceId = {
  success: boolean
  deviceId: number
}

export type SendMessageResponse = {
  success: boolean
  messageId: string
}

export type ConservationWithUser = {
  existed: boolean
  data: Conservation | null
}

export type NewConservationResponse = {
  success: boolean
  conservationId: string
  messageId: string
}

export type ConservationSettingResponse = {
  success: boolean
  setting: ConservationSetting
}

export type SearchUserResponse = {
  success: boolean
  users: User[]
  nextPage: number | undefined
  totalPage: number
}

export type CreateCallResponse = {
  roomId: string
  [key: string]: any
}
