import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { AuthenticatedStackParamList } from '../types'
import BottomTabNavigation from './BottomTabNavigation'
import EditProfileScreen from '../screens/user/EditProfileScreen'
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen'
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
    </Stack.Navigator>
  )
}

export default AuthenticatedStack
