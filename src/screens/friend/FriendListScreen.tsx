import React, { useLayoutEffect, useState } from 'react'
import { RefreshControl, StyleSheet, Text, View } from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import Spinner from 'react-native-loading-spinner-overlay'

import ErrorOverlay from '../../components/ui/ErrorOverlay'
import FriendList from '../../components/friend/FriendList'
import { FriendListStackPropHook } from '../../types'
import { getFriendsList } from '../../services/http'
import { Colors } from '../../constants/colors'
import { useRefreshByUser } from '../../hooks'
import { FriendsListResponse } from '../../models/response'

function FriendListScreen() {
  const { setOptions } = useNavigation<FriendListStackPropHook>()
  useLayoutEffect(() => {
    setOptions({ title: 'Friends list' })
  }, [setOptions])

  const [page, setPage] = useState(1)

  const {
    isError,
    isLoading,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    fetchNextPage,
    data,
  } = useInfiniteQuery<FriendsListResponse, Error>(
    ['friendsList'],
    async ({ pageParam = 1 }: { pageParam?: number }) => {
      try {
        return await getFriendsList(pageParam)
      } catch (err) {
        throw new Error(err?.message)
      }
    },
    {
      getNextPageParam: ({ nextPage }) => nextPage,
    },
  )
  const handleLoadMore = async () => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage({ pageParam: page + 1 })
      setPage(prevPage => prevPage + 1)
    }
  }
  const friends = data?.pages.flatMap(pageData => pageData.friends) || []

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch)

  if (isError) {
    return (
      <ErrorOverlay
        message="Something is error! Please try again later."
        retryFunc={refetch}
      />
    )
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        {friends.length ? (
          <FriendList
            friends={friends}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingByUser}
                onRefresh={refetchByUser}
              />
            }
            onLoadMore={handleLoadMore}
          />
        ) : (
          <View style={styles.emptyTextWrapper}>
            <Text style={styles.emptyText}>
              You don&apos;t have any friends
            </Text>
          </View>
        )}
      </View>
    </>
  )
}

export default FriendListScreen

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
