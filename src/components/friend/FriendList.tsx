import React, { ReactElement } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'

import { User } from '../../models/user'
import FriendItem from './FriendItem'
import { PromiseVoidFunction, VoidFunction } from '../../types'

function FriendList({
  friends,
  refreshControl,
  onPressItem,
  onLoadMore,
}: {
  friends: User[]
  refreshControl?: ReactElement
  onPressItem?: VoidFunction
  onLoadMore?: PromiseVoidFunction
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
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      style={styles.container}
    />
  )
}

export default FriendList

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 12,
  },
})
