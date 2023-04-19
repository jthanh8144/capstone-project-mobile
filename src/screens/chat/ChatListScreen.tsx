import React, { useContext } from 'react'
import { Text } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { useQueries } from '@tanstack/react-query'

import { getUserProfile } from '../../services/http'
import { AppContext } from '../../store/app-context'
import ErrorOverlay from '../../components/ui/ErrorOverlay'

function ChatListScreen() {
  const { setUser } = useContext(AppContext)
  const [profileQuery] = useQueries({
    queries: [
      {
        queryKey: ['profile'],
        queryFn: async () => {
          try {
            const res = await getUserProfile()
            if (res && res.user) {
              setUser(res.user)
            }
            return res
          } catch (err: any) {
            throw new Error(err.message)
          }
        },
        // onError: (error: any) => {
        //   console.log(error)
        // },
      },
    ],
  })

  if (profileQuery.isError && profileQuery.error) {
    return (
      <ErrorOverlay
        message="Something is error! Please try again later."
        retryFunc={profileQuery.refetch}
      />
    )
  }

  return (
    <>
      <Spinner visible={profileQuery.isLoading} />
      <Text>Chat list</Text>
    </>
  )
}

export default ChatListScreen
