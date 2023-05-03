import { User } from '../models/user'
import { MessageTypeEnum } from './enum'

export type OnMessageData = {
  conservationId: string
  user: User
  message: string
  messageType: MessageTypeEnum
}
