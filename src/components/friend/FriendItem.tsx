import React, { useContext, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import {
  SessionBuilder,
  SessionCipher,
  SignalProtocolAddress,
} from '@privacyresearch/libsignal-protocol-typescript'
import Spinner from 'react-native-loading-spinner-overlay'

import { images } from '../../assets/images'
import { Colors } from '../../constants/colors'
import { User } from '../../models/user'
import { getConservationWith } from '../../services/http'
import { LocalMessageRepository } from '../../services/database'
import { AppContext } from '../../store/app-context'
import { base64ToArrayBuffer } from '../../utils'
import { ChatStackPropHook, VoidFunction } from '../../types'

function FriendItem({
  friend,
  onPress,
}: {
  friend: User
  onPress?: VoidFunction
}) {
  const { signalStore, setLocalMessages } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const { navigate } = useNavigation<ChatStackPropHook>()

  const handlePress = async () => {
    if (onPress) {
      onPress()
    }
    try {
      setIsLoading(true)
      const { existed, data } = await getConservationWith(friend.id)
      if (existed) {
        const deviceId = (await AsyncStorage.getItem('deviceId')) || '0'
        const address = new SignalProtocolAddress(data.user.id, +deviceId)
        const sessionBuilder = new SessionBuilder(signalStore, address)
        await Promise.all([
          (async () => {
            if (
              !signalStore.get(`identityKey${address.getName()}`, undefined)
            ) {
              await sessionBuilder.processPreKey({
                registrationId: data.signal.registrationId,
                identityKey: base64ToArrayBuffer(data.signal.ikPublicKey),
                preKey: {
                  keyId: data.signal.pkKeyId,
                  publicKey: base64ToArrayBuffer(data.signal.pkPublicKey),
                },
                signedPreKey: {
                  keyId: data.signal.spkKeyId,
                  publicKey: base64ToArrayBuffer(data.signal.spkPublicKey),
                  signature: base64ToArrayBuffer(data.signal.spkSignature),
                },
              })
            }
          })(),
          (async () => {
            const repository = new LocalMessageRepository()
            const res = await repository.getMessagesOfConservation(data.id)
            setLocalMessages(res)
          })(),
        ])
        const sessionCipher = new SessionCipher(signalStore, address)
        navigate('Chat', {
          id: data.id,
          user: data.user,
          setting: data.setting,
          sessionCipher,
        })
      } else {
        navigate('NewChat', { user: friend })
      }
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <Pressable
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        onPress={handlePress}>
        <View style={styles.imageWrapper}>
          <Image
            source={
              friend?.avatarUrl
                ? { uri: friend.avatarUrl }
                : images.avatarPlaceholder
            }
            style={styles.image}
          />
          {friend.isOnline && <View style={styles.online} />}
        </View>
        <Text style={styles.name}>{friend?.fullName}</Text>
      </Pressable>
    </>
  )
}

export default FriendItem

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  name: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.textDark,
  },
  online: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
})
