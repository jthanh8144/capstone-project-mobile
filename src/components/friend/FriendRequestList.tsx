import React, { ReactElement } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'
import { FriendRequest } from '../../models/friend-request'
import FriendRequestItem from './FriendRequestItem'
import { PromiseVoidFunction } from '../../types'

function renderReceived(itemData: ListRenderItemInfo<FriendRequest>) {
  const { item } = itemData
  return <FriendRequestItem friendRequest={item} isReceived={true} />
}

function renderSended(itemData: ListRenderItemInfo<FriendRequest>) {
  const { item } = itemData
  return <FriendRequestItem friendRequest={item} isReceived={false} />
}

function FriendRequestList({
  friendRequests,
  isReceived,
  refreshControl,
  onLoadMore,
}: {
  friendRequests: FriendRequest[]
  isReceived: boolean
  refreshControl?: ReactElement
  onLoadMore?: PromiseVoidFunction
}) {
  return (
    <FlatList
      data={friendRequests}
      renderItem={isReceived ? renderReceived : renderSended}
      keyExtractor={item => item.id}
      refreshControl={refreshControl}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      style={styles.container}
    />
  )
}

export default FriendRequestList

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
