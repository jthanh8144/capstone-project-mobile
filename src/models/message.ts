export type Message = {
  id: string
  message: string
  messageType: string
  encryptType: 1 | 3
  conservationId: string
  isRemoved: string
  sender: {
    id: string
    fullName?: string
    avatarUrl?: string | null
  }
  createdAt: Date
}
