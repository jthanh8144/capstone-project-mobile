import { SignalStore } from './signal-store'
import { Message } from './message'
import { User } from './user'

export type ConservationSetting = {
  id: string
  isMuted: boolean
  isRemoved: boolean
  isArchived: boolean
  autoRemoveAfter: number
  conservationId: string
}

export type Conservation = {
  id: string
  user: User
  signal: SignalStore
  latestMessage: Message
  setting: ConservationSetting
}
