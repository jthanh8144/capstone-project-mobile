import React, { useContext, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import SplashScreen from 'react-native-splash-screen'
import { getUniqueIdSync } from 'react-native-device-info'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PortalProvider } from '@gorhom/portal'
import { StyleSheet } from 'react-native'

import NonAuthenticatedStack from './NonAuthenticatedStack'
import AuthenticatedStack from './AuthenticatedStack'
import { AuthContext } from '../store/auth-context'
import { AppContext } from '../store/app-context'
import { getDeviceId } from '../services/http'
import { StackParamList } from '../types'
import { getFromLocalStorage } from '../utils'
import { initializeDbConnection } from '../services/database'

export const Stack = createNativeStackNavigator<StackParamList>()

function MainNavigation() {
  const { setIsAuthenticated, logout, isAuthenticated } =
    useContext(AuthContext)
  const { signalStore } = useContext(AppContext)

  useEffect(() => {
    ;(async () => {
      const [accessToken, refreshToken, storedDeviceId, userId] =
        await Promise.all([
          AsyncStorage.getItem('accessToken'),
          AsyncStorage.getItem('refreshToken'),
          AsyncStorage.getItem('deviceId'),
          AsyncStorage.getItem('userId'),
          initializeDbConnection(),
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
      if (!storedDeviceId) {
        const { deviceId } = await getDeviceId(getUniqueIdSync())
        await AsyncStorage.setItem('deviceId', deviceId.toString())
      }
      if (userId) {
        await getFromLocalStorage(userId, signalStore)
      }
      SplashScreen.hide()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PortalProvider>
      <NavigationContainer>
        <GestureHandlerRootView
          style={StyleSheet.create({ container: { flex: 1 } }).container}>
          <BottomSheetModalProvider>
            {isAuthenticated ? (
              <AuthenticatedStack />
            ) : (
              <NonAuthenticatedStack />
            )}
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </NavigationContainer>
    </PortalProvider>
  )
}

export default MainNavigation
