import React from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'

import { User } from '../../models/user'
import SearchUserItem from './SearchUserItem'
import { LIMIT_USER_SELECTED } from '../../constants/limit'
import { PromiseVoidFunction } from '../../types'

function renderItem(itemData: ListRenderItemInfo<User>) {
  const { item } = itemData
  return <SearchUserItem user={item} />
}

export default function SearchUserList({
  users,
  onLoadMore,
}: {
  users: User[]
  onLoadMore?: PromiseVoidFunction
}) {
  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      initialNumToRender={LIMIT_USER_SELECTED}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 12,
  },
})
