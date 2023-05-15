import React, { useCallback, useContext, useState } from 'react'
import { FlatList, Image, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Asset,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker'
import Modal from 'react-native-modal'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import {
  SessionBuilder,
  SessionCipher,
  SignalProtocolAddress,
} from '@privacyresearch/libsignal-protocol-typescript'
import { TextEncoder } from 'text-encoding'
import { Buffer } from 'buffer'
import Spinner from 'react-native-loading-spinner-overlay'

import IconButton from '../../ui/IconButton'
import TextButton from '../../ui/TextButton'
import Button from '../../ui/Button'
import { PLUS, SEND, X_MARK } from '../../../constants/icons'
import { Colors } from '../../../constants/colors'
import { MessageTypeEnum, NewChatStackPropHook } from '../../../types'
import {
  getConservationSetting,
  getPresignedUrl,
  newConservation,
} from '../../../services/http'
import { LocalMessageRepository } from '../../../services/database'
import { uploadFileToPresignedUrl } from '../../../services/http'
import { AppContext } from '../../../store/app-context'
import Base64 from '../../../utils/base64'
import { styles } from './styles'
import { User } from '../../../models/user'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { base64ToArrayBuffer } from '../../../utils'
import { useNavigation } from '@react-navigation/native'

function NewChatBox({ user }: { user: User }) {
  const { replace } = useNavigation<NewChatStackPropHook>()

  const { signalStore, setLocalMessages } = useContext(AppContext)

  const [text, setText] = useState('')
  const [files, setFiles] = useState<Array<Asset>>([])
  const [type] = useState(MessageTypeEnum.text)
  const [isShowModal, setIsShowModel] = useState(false)

  const getSessionCipher = useCallback(async () => {
    const deviceId = (await AsyncStorage.getItem('deviceId')) || '0'
    const address = new SignalProtocolAddress(user.id, +deviceId)
    const sessionBuilder = new SessionBuilder(signalStore, address)
    if (!signalStore.get(`identityKey${address.getName()}`, undefined)) {
      await sessionBuilder.processPreKey({
        registrationId: user.signalStore.registrationId,
        identityKey: base64ToArrayBuffer(user.signalStore.ikPublicKey),
        preKey: {
          keyId: user.signalStore.pkKeyId,
          publicKey: base64ToArrayBuffer(user.signalStore.pkPublicKey),
        },
        signedPreKey: {
          keyId: user.signalStore.spkKeyId,
          publicKey: base64ToArrayBuffer(user.signalStore.spkPublicKey),
          signature: base64ToArrayBuffer(user.signalStore.spkSignature),
        },
      })
    }
    return new SessionCipher(signalStore, address)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { invalidateQueries } = useQueryClient()

  const { mutate, isLoading } = useMutation(
    async ({
      message,
      messageType,
      encryptType,
      url,
    }: {
      message: string
      messageType: MessageTypeEnum
      encryptType: number
      url?: string
    }) => {
      const { conservationId, messageId } = await newConservation({
        receiverId: user.id,
        message,
        messageType,
        encryptType,
      })
      const data = url || text.trim()
      setText('')
      return { conservationId, messageId, data }
    },
    {
      onSuccess: async ({ conservationId, messageId, data }) => {
        const localMessageRepository = new LocalMessageRepository()
        await localMessageRepository.saveMessage(
          conservationId,
          messageId,
          data,
        )
        const [sessionCipher, setting] = await Promise.all([
          getSessionCipher(),
          (async () => {
            const res = await getConservationSetting(conservationId)
            return res.setting
          })(),
          (async () => {
            const res = await localMessageRepository.getMessagesOfConservation(
              conservationId,
            )
            setLocalMessages(res)
          })(),
        ])
        replace('Chat', {
          id: conservationId,
          sessionCipher,
          user,
          setting,
        })
        await invalidateQueries(['conservations'])
      },
    },
  )

  const handleResponse = (response: ImagePickerResponse) => {
    setIsShowModel(false)
    if (response.errorCode) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Something is error!',
        button: 'close',
      })
    } else if (response.assets && response.assets.length) {
      setFiles(response.assets)
    }
  }

  const chooseInPhotoHandler = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      presentationStyle: 'fullScreen',
      includeBase64: true,
      selectionLimit: 1,
    })
    handleResponse(response)
  }

  const handleSendMessage = async () => {
    const sessionCipher = await getSessionCipher()
    if (text.trim()) {
      const buffer = new TextEncoder().encode(text.trim()).buffer
      const cipherText = await sessionCipher.encrypt(buffer)
      mutate({
        message: Base64.btoa(cipherText.body),
        messageType: type,
        encryptType: cipherText.type,
      })
    }
    if (files.length) {
      const urls = await Promise.all(
        files.map(async file => {
          console.log(file.type)
          const { url, presignedUrl } = await getPresignedUrl(
            file.type?.split('/')[1] || 'png',
            'message_file',
          )
          await uploadFileToPresignedUrl(
            presignedUrl,
            Buffer.from(file.base64 || '', 'base64'),
          )
          return url
        }),
      )
      for (const url of urls) {
        const buffer = new TextEncoder().encode(url).buffer
        const cipherText = await sessionCipher.encrypt(buffer)
        mutate({
          message: Base64.btoa(cipherText.body),
          messageType: MessageTypeEnum.image,
          encryptType: cipherText.type,
          url,
        })
      }
      setFiles([])
    }
  }

  return (
    <>
      <Spinner visible={isLoading} />
      {files.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <FlatList
            data={files}
            horizontal
            renderItem={({ item }) => (
              <>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.selectedImage}
                  resizeMode="contain"
                />
                <View style={styles.removeSelectedImage}>
                  <IconButton
                    svgText={X_MARK}
                    onPress={() =>
                      setFiles(existingFiles =>
                        existingFiles.filter(file => file !== item),
                      )
                    }
                    size={20}
                    color={Colors.gray}
                    backgroundColor={Colors.white}
                  />
                </View>
              </>
            )}
          />
        </View>
      )}
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <IconButton
          svgText={PLUS}
          size={20}
          onPress={() => {
            setIsShowModel(true)
          }}
        />
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Type your message..."
        />
        <IconButton
          svgText={SEND}
          onPress={() => {
            if (!isLoading) {
              handleSendMessage()
            }
          }}
          color={Colors.white}
          backgroundColor={!isLoading ? Colors.primary : Colors.gray}
          size={16}
        />
      </SafeAreaView>
      <Modal isVisible={isShowModal}>
        <View>
          <Button onPress={chooseInPhotoHandler}>Send any images</Button>
          <View style={styles.cancelWrapper}>
            <TextButton
              color={Colors.primary}
              onPress={() => {
                setIsShowModel(false)
              }}>
              Cancel
            </TextButton>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default NewChatBox
