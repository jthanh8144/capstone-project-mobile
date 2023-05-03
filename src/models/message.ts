export type Message = {
  id: string
  message: string
  messageType: string
  isRemoved: string
  sender: {
    id: string
    fullName?: string
    avatarUrl?: string | null
  }
  createdAt: Date
}
