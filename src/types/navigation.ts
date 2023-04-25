import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

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
