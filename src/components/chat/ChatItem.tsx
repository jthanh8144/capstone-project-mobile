import React, { memo, useContext, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import {
  SessionBuilder,
  SessionCipher,
  SignalProtocolAddress,
} from '@privacyresearch/libsignal-protocol-typescript'
import Spinner from 'react-native-loading-spinner-overlay'
import FastImage from 'react-native-fast-image'

import { images } from '../../assets/images'
import { Conservation } from '../../models/conservation'
import { ChatStackPropHook, MessageTypeEnum } from '../../types'
import { base64ToArrayBuffer, showDate } from '../../utils'
import { AppContext } from '../../store/app-context'
import { LocalMessageRepository } from '../../services/database'
import { Colors } from '../../constants/colors'

function ChatItem({
  conservation,
  userId,
}: {
  conservation: Conservation
  userId: string | undefined
}) {
  const { signalStore, setLocalMessages } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)

  const { navigate } = useNavigation<ChatStackPropHook>()

  const handlePress = async () => {
    setIsLoading(true)
    const deviceId = (await AsyncStorage.getItem('deviceId')) || '0'
    try {
      const address = new SignalProtocolAddress(conservation.user.id, +deviceId)
      const sessionBuilder = new SessionBuilder(signalStore, address)
      await Promise.all([
        (async () => {
          if (!signalStore.get(`identityKey${address.getName()}`, undefined)) {
            await sessionBuilder.processPreKey({
              registrationId: conservation.signal.registrationId,
              identityKey: base64ToArrayBuffer(conservation.signal.ikPublicKey),
              preKey: {
                keyId: conservation.signal.pkKeyId,
                publicKey: base64ToArrayBuffer(conservation.signal.pkPublicKey),
              },
              signedPreKey: {
                keyId: conservation.signal.spkKeyId,
                publicKey: base64ToArrayBuffer(
                  conservation.signal.spkPublicKey,
                ),
                signature: base64ToArrayBuffer(
                  conservation.signal.spkSignature,
                ),
              },
            })
          }
        })(),
        (async () => {
          const repository = new LocalMessageRepository()
          const data = await repository.getMessagesOfConservation(
            conservation.id,
          )
          setLocalMessages(data)
        })(),
      ])
      const sessionCipher = new SessionCipher(signalStore, address)
      navigate('Chat', {
        id: conservation.id,
        user: conservation.user,
        setting: conservation.setting,
        sessionCipher,
      })
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <Pressable style={styles.container} onPress={handlePress}>
        <FastImage
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
              {showDate(conservation.latestMessage.createdAt)}
            </Text>
          </View>
          <Text style={styles.subTitle} numberOfLines={2}>
            {userId === conservation.latestMessage.sender.id
              ? 'Me'
              : conservation.user.fullName}
            :{' '}
            {conservation.latestMessage.messageType === MessageTypeEnum.text
              ? 'Send a message'
              : 'Attached a file'}
          </Text>
        </View>
      </Pressable>
    </>
  )
}

export default memo(ChatItem)

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
    marginTop: 8,
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
    color: Colors.gray,
  },
  subTitle: {
    color: Colors.gray,
  },
})
