import React, { useContext, useState } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import {
  SessionBuilder,
  SessionCipher,
  SignalProtocolAddress,
} from '@privacyresearch/libsignal-protocol-typescript'
import Spinner from 'react-native-loading-spinner-overlay'
import FastImage from 'react-native-fast-image'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'

import { images } from '../../assets/images'
import { Colors } from '../../constants/colors'
import { PHONE } from '../../constants/icons'
import { User } from '../../models/user'
import {
  createCall,
  createCallRoom,
  getConservationWith,
} from '../../services/http'
import { LocalMessageRepository } from '../../services/database'
import { AppContext } from '../../store/app-context'
import { base64ToArrayBuffer } from '../../utils'
import { ChatStackPropHook, VoidFunction } from '../../types'
import IconButton from '../ui/IconButton'
import { callService } from '../../services/call'

function FriendItem({
  friend,
  onPress,
  haveCall,
}: {
  friend: User
  onPress?: VoidFunction
  haveCall?: boolean
}) {
  const { signalStore, setLocalMessages, user, setCallingFullName } =
    useContext(AppContext)
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

  const handlePressCall = async () => {
    try {
      await callService.setupCallKeep()
      const { roomId } = await createCallRoom()
      await createCall(friend.id, roomId, user.fullName)
      setCallingFullName(user.fullName)
      navigate('Calling', { id: friend.id, name: friend.fullName })
    } catch (err) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: err?.message,
        button: 'close',
      })
    }
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <View style={[styles.container, styles.mb10]}>
        <Pressable
          style={({ pressed }) => [styles.container, pressed && styles.pressed]}
          onPress={handlePress}>
          <View style={styles.imageWrapper}>
            <FastImage
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
        {haveCall && Platform.OS === 'android' && (
          <IconButton
            svgText={PHONE}
            size={24}
            onPress={handlePressCall}
            backgroundColor={Colors.primary}
            color={Colors.white}
          />
        )}
      </View>
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
    flex: 1,
  },
  mb10: {
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
