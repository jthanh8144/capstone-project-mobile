import React, { useContext, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import SplashScreen from 'react-native-splash-screen'

import NonAuthenticatedStack from './NonAuthenticatedStack'
import AuthenticatedStack from './AuthenticatedStack'
import { AuthContext } from '../store/auth-context'
import { StackParamList } from '../types'

export const Stack = createNativeStackNavigator<StackParamList>()

function MainNavigation() {
  const { setIsAuthenticated, logout, isAuthenticated } =
    useContext(AuthContext)

  useEffect(() => {
    ;(async () => {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('refreshToken'),
      ])
      if (refreshToken && accessToken) {
        if (
          jwtDecode<{ exp: number; [key: string]: any }>(refreshToken).exp <
          Date.now() / 1000
        ) {
          await logout()
        } else {
          setIsAuthenticated(true)
        }
      }
      SplashScreen.hide()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedStack /> : <NonAuthenticatedStack />}
      {/* {isAuthenticated && <AuthenticatedStack />}
      {!isAuthenticated && <NonAuthenticatedStack />} */}
    </NavigationContainer>
  )
}

export default MainNavigation