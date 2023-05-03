import React, { useContext } from 'react'
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { Message as MessageModel } from '../../models/message'
import { Colors } from '../../constants/colors'
import { AppContext } from '../../store/app-context'
import { MessageTypeEnum } from '../../types'
import ImageAttachment from './ImageAttachment'

function Message({ message }: { message: MessageModel }) {
  const { user } = useContext(AppContext)

  const { width } = useWindowDimensions()
  const imageContainerWidth = width * 0.8 - 30

  const isMyMessage = () => {
    if (message.sender.id === user?.id) {
      return true
    } else {
      return false
    }
  }

  return (
    <View
      style={[
        styles.container,
        isMyMessage() ? styles.myMessage : styles.notMyMessage,
      ]}>
      {message.messageType === MessageTypeEnum.text && (
        <Text>{message.message}</Text>
      )}
      {message.messageType === MessageTypeEnum.image && (
        <View style={[styles.images, { width: imageContainerWidth }]}>
          <ImageAttachment url={message.message} />
        </View>
      )}
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
    </View>
  )
}

export default Message

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    elevation: 1,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  time: {
    color: 'gray',
    alignSelf: 'flex-end',
  },
  myMessage: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  notMyMessage: {
    backgroundColor: Colors.background,
    alignSelf: 'flex-start',
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
