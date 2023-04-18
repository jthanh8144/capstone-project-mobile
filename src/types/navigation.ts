import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type StackParamList = {
  OnBoarding: undefined
  Login: undefined
  SignUp: undefined
}

export type OnBoardingStackProp = NativeStackScreenProps<
  StackParamList,
  'OnBoarding'
>

export type LoginStackProp = NativeStackScreenProps<StackParamList, 'Login'>

export type SignUpStackProp = NativeStackScreenProps<StackParamList, 'SignUp'>

export type AuthenticatedStackParamList = {
  ChatList: undefined
}
