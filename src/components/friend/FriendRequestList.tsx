import React, { ReactElement } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { FriendRequest } from '../../models/friend-request'
import FriendRequestItem from './FriendRequestItem'

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
}: {
  friendRequests: FriendRequest[]
  isReceived: boolean
  refreshControl?: ReactElement
}) {
  return (
    <FlatList
      data={friendRequests}
      renderItem={isReceived ? renderReceived : renderSended}
      keyExtractor={item => item.id}
      refreshControl={refreshControl}
    />
  )
}

export default FriendRequestList
