import { User } from '../models/user'
import { MessageTypeEnum } from './enum'

export type OnMessageData = {
  conservationId: string
  user: User
  messageId: string
  message: string
  messageType: MessageTypeEnum
  encryptType: 1 | 3
}
