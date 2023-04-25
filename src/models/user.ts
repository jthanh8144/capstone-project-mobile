export type User = {
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
