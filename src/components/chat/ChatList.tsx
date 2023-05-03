import React, { ReactElement } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import ChatItem from './ChatItem'
import { Conservation } from '../../models/conservation'

function ChatList({
  conservations,
  userId,
  refreshControl,
}: {
  conservations: Conservation[]
  userId: string | undefined
  refreshControl?: ReactElement
}) {
  function renderItem(itemData: ListRenderItemInfo<Conservation>) {
    const { item } = itemData
    return <ChatItem conservation={item} userId={userId} />
  }

  return (
    <FlatList
      data={conservations}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshControl={refreshControl}
    />
  )
}

export default ChatList
