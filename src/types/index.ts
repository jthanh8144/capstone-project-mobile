import { ReactNode } from 'react'
import { GestureResponderEvent } from 'react-native'

export type PressFunction = (event: GestureResponderEvent) => void
export type VoidFunction = () => void
export type PromiseVoidFunction = () => Promise<void>

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

export type FontWeightValue =
  | '500'
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '600'
  | '700'
  | '800'
  | '900'
  | undefined

export * from './navigation'
export * from './form'
export * from './enum'
export * from './socket'
