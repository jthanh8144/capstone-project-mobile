import { CallType } from './enum'

export type CallKeepFunc = (data: { callUUID: string }) => void

export type RemoteMessageData = {
  callerId?: string
  callerName?: string
  meetingId?: string
  type?: CallType
}
