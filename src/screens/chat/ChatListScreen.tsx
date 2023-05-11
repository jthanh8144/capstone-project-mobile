import React, { useContext, useState } from 'react'
import { Platform, RefreshControl, StyleSheet, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
// import Config from 'react-native-config'

import ErrorOverlay from '../../components/ui/ErrorOverlay'
import ChatList from '../../components/chat/ChatList'
import { getConservations, getUserProfile } from '../../services/http'
import { AppContext } from '../../store/app-context'
import { Conservation } from '../../models/conservation'
import { useRefreshByUser } from '../../hooks'
import { Colors } from '../../constants/colors'
import { OnMessageData } from '../../types'

function ChatListScreen() {
  const { user, setUser } = useContext(AppContext)

  const [conservations, setConservations] = useState<Conservation[]>([])

  const queryClient = useQueryClient()

  const handleOnNewMessage = async (data: OnMessageData) => {
    try {
      const key = `conservation_${data.conservationId}`
      await Promise.all([
        queryClient.invalidateQueries([key]),
        queryClient.invalidateQueries(['conservations']),
      ])
    } catch (err) {
      console.log(err)
    }
  }

  const [profileQuery, conservationsQuery] = useQueries({
    queries: [
      {
        queryKey: ['profile'],
        queryFn: async () => {
          try {
            const res = await getUserProfile()
            if (res && res.user) {
              setUser(res.user)

              const socket = io(
                Platform.OS === 'android'
                  ? 'http://10.0.2.2:3000'
                  : 'http://localhost:3000' || '',
                {
                  query: { roomId: res.user.id },
                },
              )
              socket.on('message', handleOnNewMessage)
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
      {
        queryKey: ['conservations'],
        queryFn: async () => {
          try {
            const res = await getConservations()
            if (res && res.conservations) {
              setConservations(res.conservations)
            }
            return res
          } catch (err: any) {
            throw new Error(err.message)
          }
        },
      },
    ],
  })

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(
    conservationsQuery.refetch,
  )

  if (
    (profileQuery.isError && profileQuery.error) ||
    (conservationsQuery.isError && conservationsQuery.error)
  ) {
    return (
      <ErrorOverlay
        message="Something is error! Please try again later."
        retryFunc={() => {
          if (profileQuery.isError) {
            profileQuery.refetch()
          }
          if (conservationsQuery.isError) {
            conservationsQuery.refetch()
          }
        }}
      />
    )
  }

  return (
    <>
      <Spinner
        visible={profileQuery.isLoading && conservationsQuery.isLoading}
      />
      <View style={styles.container}>
        <ChatList
          conservations={conservations}
          userId={user?.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingByUser}
              onRefresh={refetchByUser}
            />
          }
        />
      </View>
    </>
  )
}

export default ChatListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
})
