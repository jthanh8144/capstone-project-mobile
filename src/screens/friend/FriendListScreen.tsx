import React, { useLayoutEffect, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import Spinner from 'react-native-loading-spinner-overlay'

import ErrorOverlay from '../../components/ui/ErrorOverlay'
import FriendList from '../../components/friend/FriendList'
import { User } from '../../models/user'
import { FriendListStackPropHook } from '../../types'
import { getFriendsList } from '../../services/http'
import { Colors } from '../../constants/colors'
import { useRefreshByUser } from '../../hooks'

function FriendListScreen() {
  const { setOptions } = useNavigation<FriendListStackPropHook>()
  useLayoutEffect(() => {
    setOptions({ title: 'Friends list' })
  }, [setOptions])

  const [friendsList, setFriendsList] = useState<User[]>([])
  const { isLoading, isError, refetch } = useQuery<User[], Error>(
    ['friendsList'],
    async () => {
      try {
        const res = await getFriendsList()
        if (res.friends.length) {
          setFriendsList(res.friends)
        }
        return res.friends
      } catch (err: any) {
        throw new Error(err?.message)
      }
    },
  )
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
        <FriendList
          friends={friendsList}
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

export default FriendListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    backgroundColor: Colors.background,
  },
})
