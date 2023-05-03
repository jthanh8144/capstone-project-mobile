import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('vi')

import { images } from '../../assets/images'
import { Conservation } from '../../models/conservation'
import { useNavigation } from '@react-navigation/native'
import { ChatStackPropHook, MessageTypeEnum } from '../../types'

function ChatItem({
  conservation,
  userId,
}: {
  conservation: Conservation
  userId: string | undefined
}) {
  const { navigate } = useNavigation<ChatStackPropHook>()
  const handlePress = () => {
    navigate('Chat', {
      id: conservation.id,
      user: conservation.user,
      setting: conservation.setting,
    })
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image
        source={
          conservation.user.avatarUrl
            ? { uri: conservation.user.avatarUrl }
            : images.avatarPlaceholder
        }
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {conservation.user.fullName}
          </Text>
          <Text style={styles.subTitle}>
            {dayjs(conservation.latestMessage.createdAt).fromNow(true)}
          </Text>
        </View>
        <Text style={styles.subTitle} numberOfLines={2}>
          {userId === conservation.latestMessage.sender.id
            ? 'Me'
            : conservation.user.fullName}
          :{' '}
          {conservation.latestMessage.messageType === MessageTypeEnum.text
            ? conservation.latestMessage.message
            : 'Attached a file'}
        </Text>
      </View>
    </Pressable>
  )
}

export default ChatItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
  },
  subTitle: {
    color: 'gray',
  },
})
