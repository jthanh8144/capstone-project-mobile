import React, { useLayoutEffect, useRef, useState } from 'react'
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'

import ErrorOverlay from '../../components/ui/ErrorOverlay'
import Message from '../../components/chat/Message'
import ChatBox from '../../components/chat/ChatBox'
import { Message as MessageModel } from '../../models/message'
import { LIMIT_CHAT_SELECTED } from '../../constants/limit'
import { getConservation } from '../../services/http'
import { images } from '../../assets/images'
import { ChatStackProp } from '../../types'

function renderItem(itemData: ListRenderItemInfo<MessageModel>) {
  const { item } = itemData
  return <Message message={item} />
}

function ChatRoomScreen({ route, navigation }: ChatStackProp) {
  const conservationId = route.params.id
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [page, setPage] = useState(1)

  const flatListRef = useRef<FlatList<MessageModel>>(null)

  useLayoutEffect(() => {
    navigation.setOptions({ title: route.params.user.fullName || '' })
  }, [navigation, route.params.user.fullName])

  const {
    isLoading,
    isError,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    fetchNextPage,
    data,
  } = useInfiniteQuery<
    {
      success: boolean
      messages: MessageModel[]
      totalPage: number
      nextPage: number | undefined
    },
    Error
  >(
    [`conservation_${conservationId}`],
    async ({ pageParam = 1 }: { pageParam?: number }) => {
      try {
        const res = await getConservation(conservationId, pageParam)
        return res
      } catch (err: any) {
        throw new Error(err?.message)
      }
    },
    {
      getNextPageParam: ({ nextPage }) => nextPage,
    },
  )

  const handleLoadMore = async () => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage({ pageParam: page + 1 })
      setPage(prevPage => prevPage + 1)
    }
  }
  const messages = data?.pages.flatMap(pageData => pageData.messages) || []

  const handleScrollToBottom = () => {
    if (isFirstTime && messages?.length) {
      flatListRef.current?.scrollToIndex({ index: 0, animated: false })
      setIsFirstTime(false)
    }
  }

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
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={images.chatBackground}
          style={styles.background}>
          <FlatList
            ref={flatListRef}
            data={messages}
            initialNumToRender={LIMIT_CHAT_SELECTED}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onContentSizeChange={handleScrollToBottom}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            inverted={true}
          />
          <ChatBox conservationId={conservationId} />
        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  )
}

export default ChatRoomScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
})
