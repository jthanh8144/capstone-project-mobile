import React, { ReactElement } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { User } from '../../models/user'
import FriendItem from './FriendItem'

function renderItem(itemData: ListRenderItemInfo<User>) {
  const { item } = itemData
  return <FriendItem friend={item} />
}

function FriendList({
  friends,
  refreshControl,
}: {
  friends: User[]
  refreshControl?: ReactElement
}) {
  return (
    <FlatList
      data={friends}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshControl={refreshControl}
    />
  )
}

export default FriendList
