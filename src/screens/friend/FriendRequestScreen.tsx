import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useInfiniteQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'

import FriendRequestList from '../../components/friend/FriendRequestList'
import ErrorOverlay from '../../components/ui/ErrorOverlay'
import { Colors } from '../../constants/colors'
import { FriendRequestStackPropHook } from '../../types'
import {
  getReceivedFriendRequests,
  getSendedFriendRequests,
} from '../../services/http'
import Search from '../../components/ui/Search'
import { FriendRequestResponse } from '../../models/response'

function FriendRequestScreen() {
  const [receivedPage, setReceivedPage] = useState(1)
  const [sendedPage, setSendedPage] = useState(1)

  const { setOptions, navigate } = useNavigation<FriendRequestStackPropHook>()

  useLayoutEffect(() => {
    setOptions({ title: 'Friend requests' })
  }, [setOptions])

  const receivedQuery = useInfiniteQuery<FriendRequestResponse, Error>(
    ['receivedFriendRequests'],
    async ({ pageParam = 1 }: { pageParam?: number }) => {
      try {
        return await getReceivedFriendRequests(pageParam)
      } catch (err) {
        throw new Error(err?.message)
      }
    },
    {
      getNextPageParam: ({ nextPage }) => nextPage,
    },
  )
  const handleLoadMoreReceived = async () => {
    if (
      !receivedQuery.isLoading &&
      !receivedQuery.isFetchingNextPage &&
      receivedQuery.hasNextPage
    ) {
      receivedQuery.fetchNextPage({ pageParam: receivedPage + 1 })
      setReceivedPage(prevPage => prevPage + 1)
    }
  }
  const receivedList =
    receivedQuery.data?.pages.flatMap(pageData => pageData.friendRequests) || []

  const sendedQuery = useInfiniteQuery<FriendRequestResponse, Error>(
    ['sendedFriendRequests'],
    async ({ pageParam = 1 }: { pageParam?: number }) => {
      try {
        return await getSendedFriendRequests(pageParam)
      } catch (err) {
        throw new Error(err?.message)
      }
    },
    {
      getNextPageParam: ({ nextPage }) => nextPage,
    },
  )
  const handleLoadMoreSended = async () => {
    if (
      !sendedQuery.isLoading &&
      !sendedQuery.isFetchingNextPage &&
      sendedQuery.hasNextPage
    ) {
      sendedQuery.fetchNextPage({ pageParam: sendedPage + 1 })
      setSendedPage(prevPage => prevPage + 1)
    }
  }
  const sendedList =
    sendedQuery.data?.pages.flatMap(pageData => pageData.friendRequests) || []

  if (
    (receivedQuery.isError && receivedQuery.error) ||
    (sendedQuery.isError && sendedQuery.error)
  ) {
    return (
      <ErrorOverlay
        message="Something is error! Please try again later."
        retryFunc={() => {
          if (receivedQuery.isError) {
            receivedQuery.refetch()
          }
          if (sendedQuery.isError) {
            sendedQuery.refetch()
          }
        }}
      />
    )
  }

  return (
    <>
      <Spinner visible={receivedQuery.isLoading && sendedQuery.isLoading} />

      <View style={styles.container}>
        <Search
          placeholder="Search user"
          onPress={() => {
            navigate('SearchUser')
          }}
        />
        <View style={styles.wrapper}>
          {!receivedList.length && !sendedList.length ? (
            <View style={styles.emptyTextWrapper}>
              <Text style={styles.emptyText}>
                You don&apos;t have any friend requests
              </Text>
            </View>
          ) : (
            <>
              {receivedList.length ? (
                <FriendRequestList
                  friendRequests={receivedList}
                  isReceived={true}
                  onLoadMore={handleLoadMoreReceived}
                />
              ) : (
                <Text style={styles.receivedEmptyText}>
                  You don&apos;t have any received friend requests
                </Text>
              )}
              {!!sendedList.length && (
                <>
                  <Text style={styles.title}>Your requesting</Text>
                  <FriendRequestList
                    friendRequests={sendedList}
                    isReceived={false}
                    onLoadMore={handleLoadMoreSended}
                  />
                </>
              )}
            </>
          )}
        </View>
      </View>
    </>
  )
}

export default FriendRequestScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  wrapper: {
    paddingHorizontal: 16,
    flex: 1,
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
  receivedEmptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textDark,
    marginTop: 4,
  },
})
