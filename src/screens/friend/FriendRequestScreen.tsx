import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useQueries } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'

import FriendRequestList from '../../components/friend/FriendRequestList'
import ErrorOverlay from '../../components/ui/ErrorOverlay'
import { Colors } from '../../constants/colors'
import { FriendRequestStackPropHook } from '../../types'
import {
  getReceivedFriendRequests,
  getSendedFriendRequests,
} from '../../services/http'
import { FriendRequest } from '../../models/friend-request'
import Search from '../../components/ui/Search'

function FriendRequestScreen() {
  const [receivedList, setReceivedList] = useState<FriendRequest[]>([])
  const [sendedList, setSendedList] = useState<FriendRequest[]>([])

  const { setOptions, navigate } = useNavigation<FriendRequestStackPropHook>()

  useLayoutEffect(() => {
    setOptions({ title: 'Friend requests' })
  }, [setOptions])

  const [receivedQuery, sendedQuery] = useQueries({
    queries: [
      {
        queryKey: ['receivedFriendRequests'],
        queryFn: async () => {
          try {
            const res = await getReceivedFriendRequests()
            if (res && res.friendRequests) {
              setReceivedList(res.friendRequests)
            }
            return res
          } catch (err: any) {
            throw new Error(err.message)
          }
        },
      },
      {
        queryKey: ['sendedFriendRequests'],
        queryFn: async () => {
          try {
            const res = await getSendedFriendRequests()
            if (res && res.friendRequests) {
              setSendedList(res.friendRequests)
            }
            return res
          } catch (err: any) {
            throw new Error(err.message)
          }
        },
      },
    ],
  })

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
            <View>
              {receivedList.length ? (
                <FriendRequestList
                  friendRequests={receivedList}
                  isReceived={true}
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
                  />
                </>
              )}
            </View>
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
