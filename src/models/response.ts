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
  status: boolean
  message: string
}

export type ProfileResponse = {
  status: boolean
  user: {
    id: string
    email: string
    fullName: string | null
    avatarUrl: string | null
    isVerified: boolean
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
  }
}
