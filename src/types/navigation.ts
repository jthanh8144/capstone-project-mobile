import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { SessionCipher } from '@privacyresearch/libsignal-protocol-typescript'

import { User } from '../models/user'
import { ConservationSetting } from '../models/conservation'

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
  Home: undefined
  ChatList: undefined
  FriendRequest: undefined
  FriendList: undefined
  Profile: undefined

  EditProfile: undefined
  ChangePassword: undefined
  Chat: {
    id: string
    user: User
    setting: ConservationSetting
    sessionCipher: SessionCipher
  }
}

export type ProfileStackPropHook = NativeStackNavigationProp<
  AuthenticatedStackParamList,
  'Profile'
>

export type EditProfileStackProp = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'EditProfile'
>

export type ChangePasswordStackProp = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'ChangePassword'
>

export type FriendRequestStackPropHook = NativeStackNavigationProp<
  AuthenticatedStackParamList,
  'FriendRequest'
>

export type FriendListStackPropHook = NativeStackNavigationProp<
  AuthenticatedStackParamList,
  'FriendList'
>

export type ChatStackProp = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'Chat'
>

export type ChatStackPropHook = NativeStackNavigationProp<
  AuthenticatedStackParamList,
  'Chat'
>
