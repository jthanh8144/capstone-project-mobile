import '../ignoreWarnings'

import React from 'react'
import { StatusBar } from 'react-native'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AuthProvider from './store/auth-context'
import MainNavigation from './navigation/MainNavigation'

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
      <StatusBar barStyle="dark-content" />
      <AlertNotificationRoot>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <MainNavigation />
          </QueryClientProvider>
        </AuthProvider>
      </AlertNotificationRoot>
    </>
  )
}

export default App
