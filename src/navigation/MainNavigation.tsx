import React, { useContext, useEffect } from 'react'
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import SplashScreen from 'react-native-splash-screen'
import { getUniqueIdSync } from 'react-native-device-info'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PortalProvider } from '@gorhom/portal'
import { Platform, StyleSheet } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

import NonAuthenticatedStack from './NonAuthenticatedStack'
import AuthenticatedStack from './AuthenticatedStack'
import { AuthContext } from '../store/auth-context'
import { AppContext } from '../store/app-context'
import { getDeviceId, updateUserFcm } from '../services/http'
import { JwtDecodeData } from '../types'
import { getFromLocalStorage } from '../utils'
import {
  LocalMessageRepository,
  initializeDbConnection,
} from '../services/database'
import { initializeCallHandle, initializeCallKeep } from '../services/call'

const navigationRef = createNavigationContainerRef()

function MainNavigation() {
  const { setIsAuthenticated, logout, isAuthenticated } =
    useContext(AuthContext)
  const { signalStore } = useContext(AppContext)

  useEffect(() => {
    ;(async () => {
      await initializeCallKeep()
      const [accessToken, refreshToken, storedDeviceId, userId, fcmToken] =
        await Promise.all([
          AsyncStorage.getItem('accessToken'),
          AsyncStorage.getItem('refreshToken'),
          AsyncStorage.getItem('deviceId'),
          AsyncStorage.getItem('userId'),
          AsyncStorage.getItem('fcmToken'),
          initializeDbConnection(),
        ])
      if (refreshToken && accessToken) {
        if (jwtDecode<JwtDecodeData>(refreshToken).exp < Date.now() / 1000) {
          await logout(true)
        } else {
          setIsAuthenticated(true)
          if (!fcmToken && Platform.OS === 'android') {
            const fcm = await messaging().getToken()
            await Promise.all([
              updateUserFcm(fcm),
              AsyncStorage.setItem('fcmToken', fcm),
            ])
          }
          initializeCallHandle()
        }
      }
      await Promise.all([
        (async () => {
          if (!storedDeviceId) {
            const { deviceId } = await getDeviceId(getUniqueIdSync())
            await AsyncStorage.setItem('deviceId', deviceId.toString())
          }
        })(),
        (async () => {
          if (userId) {
            await getFromLocalStorage(userId, signalStore)
          }
        })(),
        (async () => {
          try {
            const localMessageRepository = new LocalMessageRepository()
            await localMessageRepository.removeMessagesAfter30Days()
          } catch (err) {
            console.log(err)
          }
        })(),
      ])
      PushNotification.configure({
        onRegister: () => {},
        onNotification: notification => {
          if (Platform.OS === 'ios') {
            notification.finish(PushNotificationIOS.FetchResult.NoData)
          }
        },
        onAction: notification => {
          console.log('ACTION:', notification.action)
          console.log('NOTIFICATION:', notification)
        },
        onRegistrationError: err => {
          console.error(err.message, err)
        },
        popInitialNotification: true,
        requestPermissions: true,
      })
      PushNotification.createChannel(
        {
          channelId: 'chat-notification',
          channelName: 'Chat notification channel',
        },
        () => {},
      )
      SplashScreen.hide()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PortalProvider>
      <NavigationContainer ref={navigationRef}>
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

export { navigationRef }
