import { ReactNode } from 'react'
import { GestureResponderEvent } from 'react-native'

export type PressFunction = (event: GestureResponderEvent) => void

export interface ChildProps {
  children: ReactNode
}

export * from './navigation'

// import type {PropsWithChildren} from 'react';
// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): JSX.Element {
