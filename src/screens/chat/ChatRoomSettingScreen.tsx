import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay'

import HorizontalItem from '../../components/chat/ChatSetting/HorizontalItem'
import VerticalItem from '../../components/chat/ChatSetting/VerticalItem'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { ARCHIVE, MUTED, PERSON_MINUS, TRASH } from '../../constants/icons'
import { Colors } from '../../constants/colors'
import { AUDIO } from '../../constants/icons'
import { unfriend, updateConservationSetting } from '../../services/http'
import { ChatRoomSettingStackProp } from '../../types'
import { images } from '../../assets/images'
import { LocalMessageRepository } from '../../services/database'

export default function ChatRoomSettingScreen({
  route,
  navigation,
}: ChatRoomSettingStackProp) {
  const { user, setting } = route.params

  const [muteStatus, setMuteStatus] = useState(setting.isMuted)
  const [muteIcon, setMuteIcon] = useState(setting.isMuted ? AUDIO : MUTED)
  const [muteText, setMuteText] = useState(setting.isMuted ? 'Unmute' : 'Mute')

  const [isShownModal, setIsShownModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [modalAction, setModalAction] = useState('')

  const [isShownUnfriend, setIsShownUnfriend] = useState(true)

  const queryClient = useQueryClient()

  const updateMutation = useMutation(
    async (data: {
      isMuted?: boolean
      isRemoved?: boolean
      isArchived?: boolean
      onSuccess: () => Promise<void>
    }) => {
      try {
        const { onSuccess, ...realData } = data
        await updateConservationSetting(setting.id, realData)
        return onSuccess
      } catch (err) {
        console.log(err)
      }
    },
    {
      onSuccess: async onSuccess => {
        await onSuccess()
      },
    },
  )
  const unfriendMutation = useMutation(
    async () => {
      try {
        await unfriend(user.id)
      } catch (err) {
        console.log(err)
      }
    },
    {
      onSuccess: async () => {
        setIsShownUnfriend(false)
        await queryClient.invalidateQueries(['friendsList'])
      },
    },
  )

  const handleArchive = async () => {
    const onSuccess = async () => {
      await queryClient.invalidateQueries(['conservations'])
      navigation.popToTop()
    }
    await updateMutation.mutateAsync({ isArchived: true, onSuccess })
  }

  const handleDelete = async () => {
    const onSuccess = async () => {
      const localMessageRepository = new LocalMessageRepository()
      await Promise.all([
        queryClient.invalidateQueries(['conservations']),
        localMessageRepository.deleteConservation(setting.conservationId),
      ])
      navigation.popToTop()
    }
    await updateMutation.mutateAsync({ isRemoved: true, onSuccess })
  }

  const onConfirm = async () => {
    if (modalAction === 'ARCHIVE') {
      await handleArchive()
    }
    if (modalAction === 'DELETE') {
      await handleDelete()
    }
  }

  return (
    <>
      <ConfirmDialog
        isShown={isShownModal}
        setIsShown={setIsShownModal}
        title={modalTitle}
        message={modalMessage}
        onCancel={() => {
          setIsShownModal(false)
        }}
        onConfirm={onConfirm}
      />
      <Spinner
        visible={updateMutation.isLoading || unfriendMutation.isLoading}
      />
      <View style={styles.container}>
        <View style={styles.topWrapper}>
          <FastImage
            source={
              user.avatarUrl
                ? { uri: user.avatarUrl }
                : images.avatarPlaceholder
            }
            style={styles.image}
          />
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <View style={styles.buttonsWrapper}>
          {isShownUnfriend && (
            <HorizontalItem
              backgroundColor={Colors.red}
              color={Colors.white}
              onPress={async () => {
                await unfriendMutation.mutateAsync()
              }}
              svgText={PERSON_MINUS}
              text="Unfriend"
            />
          )}
          <HorizontalItem
            backgroundColor={Colors.primary}
            color={Colors.white}
            onPress={async () => {
              const onSuccess = async () => {
                setMuteStatus(prev => !prev)
                setMuteIcon(prev => (prev === AUDIO ? MUTED : AUDIO))
                setMuteText(prev => (prev === 'Unmute' ? 'Mute' : 'Unmute'))
              }
              await updateMutation.mutateAsync({
                isMuted: !muteStatus,
                onSuccess,
              })
            }}
            svgText={muteIcon}
            text={muteText}
          />
        </View>
        <View style={styles.actionWrapper}>
          <VerticalItem
            onPress={() => {
              setIsShownModal(true)
              setModalTitle('Are you sure?')
              setModalMessage('Do you want to archive this conservation?')
              setModalAction('ARCHIVE')
            }}
            svgText={ARCHIVE}
            text="Archive this conservation"
            color={Colors.red}
          />
          <VerticalItem
            onPress={() => {
              setIsShownModal(true)
              setModalTitle('Are you sure?')
              setModalMessage('Do you want to delete this conservation?')
              setModalAction('DELETE')
            }}
            svgText={TRASH}
            text="Delete this conservation"
            color={Colors.red}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
  },
  topWrapper: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: 8,
  },
  email: {
    fontSize: 14,
    fontWeight: '300',
    marginTop: 4,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 12,
  },
  actionWrapper: {
    marginTop: 12,
  },
})
