import '../ignoreWarnings'

import React from 'react'
import { Platform, StatusBar } from 'react-native'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from 'react-native-error-boundary'
import messaging from '@react-native-firebase/messaging'

import AppProvider from './store/app-context'
import AuthProvider from './store/auth-context'
import { backgroundHandler } from './services/call'
import MainNavigation from './navigation/MainNavigation'
import { isDarkMode } from './utils'

Platform.OS !== 'ios' &&
  messaging().setBackgroundMessageHandler(backgroundHandler)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
    },
  },
})

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AlertNotificationRoot>
        <AuthProvider>
          <AppProvider>
            <QueryClientProvider client={queryClient}>
              <MainNavigation />
            </QueryClientProvider>
          </AppProvider>
        </AuthProvider>
      </AlertNotificationRoot>
    </ErrorBoundary>
  )
}

export default App
