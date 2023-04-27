import React, { useContext, useLayoutEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useQueries } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'

import FriendRequestList from '../../components/friend/FriendRequestList'
import ErrorOverlay from '../../components/ui/ErrorOverlay'
import { AppContext } from '../../store/app-context'
import { Colors } from '../../constants/colors'
import { FriendRequestStackPropHook } from '../../types'
import {
  getReceivedFriendRequests,
  getSendedFriendRequests,
} from '../../services/http'

function FriendRequestScreen() {
  const { receivedList, sendedList, setReceivedList, setSendedList } =
    useContext(AppContext)

  const { setOptions } = useNavigation<FriendRequestStackPropHook>()

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
    </>
  )
}

export default FriendRequestScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
