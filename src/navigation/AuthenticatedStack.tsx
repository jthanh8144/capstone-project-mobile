import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { AuthenticatedStackParamList } from '../types'
import ChatListScreen from '../screens/chat/ChatListScreen'

const Stack = createNativeStackNavigator<AuthenticatedStackParamList>()

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
    </Stack.Navigator>
  )
}

export default AuthenticatedStack
