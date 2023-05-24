import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { SessionCipher } from '@privacyresearch/libsignal-protocol-typescript'
import { TextDecoder } from 'text-encoding'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { Message as MessageModel } from '../../models/message'
import { Colors } from '../../constants/colors'
import { AppContext } from '../../store/app-context'
import { MessageTypeEnum } from '../../types'
import ImageAttachment from './ImageAttachment'
import Base64 from '../../utils/base64'
import { LocalMessage, LocalMessageRepository } from '../../services/database'

function Message({
  message,
  sessionCipher,
  localMessages,
  localMessageRepository,
}: {
  message: MessageModel
  sessionCipher: SessionCipher
  localMessages: LocalMessage[]
  localMessageRepository: LocalMessageRepository
}) {
  const { user, setLocalMessages } = useContext(AppContext)

  const [plainText, setPlainText] = useState('')

  const { width } = useWindowDimensions()
  const imageContainerWidth = width * 0.8 - 30

  const isMyMessage = () => {
    if (message.sender.id === user?.id) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const localMessage = localMessages.find(
          mess => mess.messageId === message.id,
        )
        if (localMessage) {
          setPlainText(localMessage.plainText)
        } else {
          let result: ArrayBuffer = new Uint8Array()
          const realMessage = Base64.atob(message.message)
          if (!isMyMessage()) {
            if (message.encryptType === 3) {
              result = await sessionCipher.decryptPreKeyWhisperMessage(
                realMessage,
              )
            } else if (message.encryptType === 1) {
              result = await sessionCipher.decryptWhisperMessage(realMessage)
            }
            const decodedText = new TextDecoder().decode(new Uint8Array(result))
            setPlainText(decodedText)
            await localMessageRepository.saveMessage(
              message.conservationId,
              message.id,
              decodedText,
            )
            setLocalMessages(
              await localMessageRepository.getMessagesOfConservation(
                message.conservationId,
              ),
            )
          }
        }
      } catch (error) {
        console.log(error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View
      style={[
        styles.container,
        isMyMessage() ? styles.myMessage : styles.notMyMessage,
      ]}>
      {message.messageType === MessageTypeEnum.text && (
        <Text style={isMyMessage() ? styles.myMessageText : styles.messageText}>
          {plainText}
        </Text>
      )}
      {message.messageType === MessageTypeEnum.image && (
        <View style={[styles.images, { width: imageContainerWidth }]}>
          <ImageAttachment url={plainText} />
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
  myMessageText: {
    color: Colors.black,
  },
  messageText: {
    color: Colors.textDark,
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
