import { ReactNode } from 'react'
import { GestureResponderEvent } from 'react-native'

export type PressFunction = (event: GestureResponderEvent) => void

export interface ChildProps {
  children: ReactNode
}

export interface Error {
  message: string
  name: string
  code: number
  config: any
  request: any
  response: {
    data?: { [key: string]: any }
    [key: string]: any
  }
}

export * from './navigation'
export * from './form'
