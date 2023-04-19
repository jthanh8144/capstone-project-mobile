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
