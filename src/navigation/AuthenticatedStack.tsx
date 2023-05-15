import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { AuthenticatedStackParamList } from '../types'
import BottomTabNavigation from './BottomTabNavigation'
import EditProfileScreen from '../screens/user/EditProfileScreen'
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen'
import ChatRoomScreen from '../screens/chat/ChatRoomScreen'
import NewChatScreen from '../screens/chat/NewChatScreen'
import SearchUserScreen from '../screens/search/SearchUserScreen'
import SearchConservationScreen from '../screens/search/SearchConservationScreen'
import { Colors } from '../constants/colors'

const Stack = createNativeStackNavigator<AuthenticatedStackParamList>()

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={BottomTabNavigation} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Edit Profile',
          headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Update Password',
          headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatRoomScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="NewChat"
        component={NewChatScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="SearchConservation"
        component={SearchConservationScreen}
      />
      <Stack.Screen name="SearchUser" component={SearchUserScreen} />
    </Stack.Navigator>
  )
}

export default AuthenticatedStack
