import React, { Dispatch, SetStateAction, createContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'

import { ChildProps } from '../types'
import { logoutUser } from '../services/http'

type AuthContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  authenticate: (
    accessToken: string,
    refreshToken: string,
    userId: string,
  ) => Promise<void>
  logout: (isShowNotification?: boolean) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  authenticate: async () => {},
  logout: async () => {},
})

function AuthProvider({ children }: ChildProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  async function authenticate(access: string, refresh: string, userId: string) {
    await Promise.all([
      AsyncStorage.setItem('accessToken', access),
      AsyncStorage.setItem('refreshToken', refresh),
      AsyncStorage.setItem('userId', userId),
    ])
    setIsAuthenticated(true)
  }

  async function logout(isShowNotification?: boolean) {
    const refreshToken = await AsyncStorage.getItem('refreshToken')
    if (refreshToken) {
      const res = await logoutUser(refreshToken)
      if (!isShowNotification) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: res.message,
          button: 'close',
        })
      }
    }
    await Promise.all([
      AsyncStorage.removeItem('accessToken'),
      AsyncStorage.removeItem('refreshToken'),
      AsyncStorage.removeItem('userId'),
    ])
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        authenticate,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
