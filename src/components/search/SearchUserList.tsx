import React from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'

import { User } from '../../models/user'
import SearchUserItem from './SearchUserItem'

function renderItem(itemData: ListRenderItemInfo<User>) {
  const { item } = itemData
  return <SearchUserItem user={item} />
}

export default function SearchUserList({ users }: { users: User[] }) {
  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  )
}
