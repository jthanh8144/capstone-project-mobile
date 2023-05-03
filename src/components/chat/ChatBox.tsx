import React, { useState } from 'react'
import { FlatList, Image, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Asset,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker'
import Modal from 'react-native-modal'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import { Buffer } from 'buffer'

import IconButton from '../ui/IconButton'
import TextButton from '../ui/TextButton'
import Button from '../ui/Button'
import { PLUS, SEND, X_MARK } from '../../constants/icons'
import { Colors } from '../../constants/colors'
import { MessageTypeEnum } from '../../types'
import { getPresignedUrl, sendMessage } from '../../services/http'
import { uploadFileToPresignedUrl } from '../../services/http'

function ChatBox({ conservationId }: { conservationId: string }) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState<Array<Asset>>([])
  const [type, setType] = useState(MessageTypeEnum.text)
  const [isShowModal, setIsShowModel] = useState(false)

  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(
    async ({
      message,
      messageType,
    }: {
      message: string
      messageType: MessageTypeEnum
    }) => {
      await sendMessage(conservationId, message.trim(), messageType)
      setText('')
    },
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries([`conservation_${conservationId}`]),
          queryClient.invalidateQueries(['conservations']),
        ])
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
    if (text.trim()) {
      mutate({ message: text, messageType: type })
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
      urls.forEach(url => {
        mutate({ message: url, messageType: MessageTypeEnum.image })
      })
      setFiles([])
    }
  }

  return (
    <>
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

export default ChatBox

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    padding: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: 'royalblue',
    padding: 7,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cancelWrapper: {
    alignItems: 'center',
    marginTop: 15,
  },
  attachmentsContainer: {
    alignItems: 'flex-end',
  },
  selectedImage: {
    height: 100,
    width: 200,
    margin: 5,
  },
  progressImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: '#8c8c8cAA',
    padding: 5,
    borderRadius: 50,
  },
  removeSelectedImage: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
})
