import React, { ReactElement } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'

import { User } from '../../models/user'
import FriendItem from './FriendItem'
import { VoidFunction } from '../../types'

function FriendList({
  friends,
  refreshControl,
  onPressItem,
}: {
  friends: User[]
  refreshControl?: ReactElement
  onPressItem?: VoidFunction
}) {
  function renderItem(itemData: ListRenderItemInfo<User>) {
    const { item } = itemData
    return <FriendItem friend={item} onPress={onPressItem} />
  }

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
