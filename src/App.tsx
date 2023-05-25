import '../ignoreWarnings'

import React from 'react'
import { StatusBar } from 'react-native'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AppProvider from './store/app-context'
import AuthProvider from './store/auth-context'
import MainNavigation from './navigation/MainNavigation'
import { isDarkMode } from './utils'

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
    <>
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
    </>
  )
}

export default App
