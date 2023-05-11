import { SignalStore } from './signal-store'
import { Message } from './message'
import { User } from './user'

export type ConservationSetting = {
  isMuted: boolean
  isRemoved: boolean
  isArchived: boolean
  autoRemoveAfter: number
}

export type Conservation = {
  id: string
  user: User
  signal: SignalStore
  latestMessage: Message
  setting: ConservationSetting
}
