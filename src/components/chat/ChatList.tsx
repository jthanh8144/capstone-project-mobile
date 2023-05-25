import React, { ReactElement } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'
import ChatItem from './ChatItem'
import { Conservation } from '../../models/conservation'
import { PromiseVoidFunction } from '../../types'

function ChatList({
  conservations,
  userId,
  refreshControl,
  onLoadMore,
}: {
  conservations: Conservation[]
  userId: string | undefined
  refreshControl?: ReactElement
  onLoadMore?: PromiseVoidFunction
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
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      style={styles.container}
    />
  )
}

export default ChatList

const styles = StyleSheet.create({
  container: {
    marginBottom: 60,
  },
})
