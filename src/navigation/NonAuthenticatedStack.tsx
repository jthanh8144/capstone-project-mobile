import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { StackParamList } from '../types'
import OnBoardingScreen from '../screens/common/OnBoardingScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import SignUpScreen from '../screens/auth/SignUpScreen'

const Stack = createNativeStackNavigator<StackParamList>()

function NonAuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  )
}

export default NonAuthenticatedStack
