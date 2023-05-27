import React, { useContext, useLayoutEffect, useState } from 'react'
import { Platform, RefreshControl, StyleSheet, Text, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import {
  useInfiniteQuery,
  useQueries,
  useQueryClient,
} from '@tanstack/react-query'
import { io } from 'socket.io-client'
import { useNavigation } from '@react-navigation/native'
import PushNotification from 'react-native-push-notification'

import ErrorOverlay from '../../components/ui/ErrorOverlay'
import ChatList from '../../components/chat/ChatList'
import Search from '../../components/ui/Search'
import { getConservations, getUserProfile } from '../../services/http'
import { navigationRef } from '../../navigation/MainNavigation'
import { AppContext } from '../../store/app-context'
import { useRefreshByUser } from '../../hooks'
import { Colors } from '../../constants/colors'
import { ChatListStackPropHook, OnMessageData } from '../../types'
import { ConservationsResponse } from '../../models/response'
import { environments } from '../../configs/environment'

function ChatListScreen() {
  const { setOptions, navigate } = useNavigation<ChatListStackPropHook>()

  const { user, setUser } = useContext(AppContext)

  const [page, setPage] = useState(1)

  useLayoutEffect(() => {
    setOptions({ title: 'Safe talk' })
  }, [setOptions])

  const queryClient = useQueryClient()

  const handleOnNewMessage = async (data: OnMessageData) => {
    try {
      const key = `conservation_${data.conservationId}`
      await Promise.all([
        queryClient.invalidateQueries([key]),
        queryClient.invalidateQueries(['conservations']),
      ])
      if (navigationRef && Platform.OS === 'android') {
        const route = navigationRef.current.getCurrentRoute()
        if (
          route.name !== 'Chat' ||
          (route.name === 'Chat' && route.params['id'] !== data.conservationId)
        ) {
          PushNotification.localNotification({
            channelId: 'chat-notification',
            title: 'Safe Talk',
            message: `${data.user.fullName} send a message to you`,
            playSound: true,
            soundName: 'default',
          })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [profileQuery] = useQueries({
    queries: [
      {
        queryKey: ['profile'],
        queryFn: async () => {
          try {
            const res = await getUserProfile()
            if (res && res.user) {
              setUser(res.user)

              const socket = io(environments.apiUrl, {
                query: { roomId: res.user.id },
              })
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
    ],
  })

  const conservationsQuery = useInfiniteQuery<ConservationsResponse>(
    ['conservations'],
    async ({ pageParam = 1 }: { pageParam?: number }) => {
      try {
        return await getConservations(pageParam)
      } catch (err: any) {
        throw new Error(err?.message)
      }
    },
    {
      getNextPageParam: ({ nextPage }) => nextPage,
    },
  )
  const handleLoadMore = async () => {
    if (
      !conservationsQuery.isLoading &&
      !conservationsQuery.isFetchingNextPage &&
      conservationsQuery.hasNextPage
    ) {
      conservationsQuery.fetchNextPage({ pageParam: page + 1 })
      setPage(prevPage => prevPage + 1)
    }
  }
  const conservations =
    conservationsQuery.data?.pages.flatMap(
      pageData => pageData.conservations,
    ) || []

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
        visible={profileQuery.isLoading || conservationsQuery.isLoading}
      />
      <View style={styles.container}>
        {conservations.length ? (
          <>
            <Search
              placeholder="Search conservation"
              onPress={() => {
                navigate('SearchConservation')
              }}
            />
            <ChatList
              conservations={conservations}
              userId={user?.id}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetchingByUser}
                  onRefresh={refetchByUser}
                />
              }
              onLoadMore={handleLoadMore}
            />
          </>
        ) : (
          <View style={styles.emptyTextWrapper}>
            <Text style={styles.emptyText}>
              You don&apos;t have any messages
            </Text>
          </View>
        )}
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
  emptyTextWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    paddingBottom: 100,
  },
})
