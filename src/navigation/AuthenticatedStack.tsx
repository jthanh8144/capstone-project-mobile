import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Colors } from '../constants/colors'
import { AuthenticatedStackParamList } from '../types'
import BottomTabNavigation from './BottomTabNavigation'
import EditProfileScreen from '../screens/user/EditProfileScreen'
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen'
import ChatRoomScreen from '../screens/chat/ChatRoomScreen'
import NewChatScreen from '../screens/chat/NewChatScreen'
import SearchUserScreen from '../screens/search/SearchUserScreen'
import ChatRoomSettingScreen from '../screens/chat/ChatRoomSettingScreen'
import SearchConservationScreen from '../screens/search/SearchConservationScreen'

const Stack = createNativeStackNavigator<AuthenticatedStackParamList>()

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleStyle: { color: Colors.textDark },
        headerTintColor: Colors.textDark,
        headerStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="Home" component={BottomTabNavigation} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Edit Profile',
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
      <Stack.Screen
        name="ChatRoomSetting"
        component={ChatRoomSettingScreen}
        options={{
          headerShown: true,
          title: 'Conservation setting',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default AuthenticatedStack
