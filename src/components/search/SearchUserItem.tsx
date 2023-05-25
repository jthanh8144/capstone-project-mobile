import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import { User } from '../../models/user'
import { images } from '../../assets/images'
import { Colors } from '../../constants/colors'
import RoundedButton from '../ui/RoundedButton'
import { FriendStatusEnum } from '../../types'
import IconButton from '../ui/IconButton'
import { CHECK, X_MARK } from '../../constants/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  removeSendedFriendRequest,
  sendFriendRequest,
  updateReceivedFriendRequest,
} from '../../services/http'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'

export default function SearchUserItem({ user }: { user: User }) {
  const queryClient = useQueryClient()

  const sendRequestMutation = useMutation(
    async () => {
      await sendFriendRequest(user.id)
    },
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(['sendedFriendRequests']),
          queryClient.invalidateQueries(['searchUser']),
        ])
      },
      onError: (err: any) => {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: err?.message || 'Something is error!',
          button: 'close',
        })
      },
    },
  )
  const updateRequestMutation = useMutation(
    async (status: string) => {
      await updateReceivedFriendRequest(user.friendRequestId, status)
    },
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(['receivedFriendRequests']),
          queryClient.invalidateQueries(['searchUser']),
        ])
      },
      onError: (err: any) => {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: err?.message || 'Something is error!',
          button: 'close',
        })
      },
    },
  )
  const removeRequestMutation = useMutation(
    async () => {
      await removeSendedFriendRequest(user.friendRequestId)
    },
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(['sendedFriendRequests']),
          queryClient.invalidateQueries(['searchUser']),
        ])
      },
      onError: (err: any) => {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: err?.message || 'Something is error!',
          button: 'close',
        })
      },
    },
  )

  const handleSend = async () => {
    await sendRequestMutation.mutateAsync()
  }
  const handleCancel = async () => {
    await removeRequestMutation.mutateAsync()
  }
  const handleAccept = async () => {
    await updateRequestMutation.mutateAsync('accepted')
  }
  const handleDeclined = async () => {
    await updateRequestMutation.mutateAsync('declined')
  }

  return (
    <View style={styles.container}>
      <FastImage
        source={
          user?.avatarUrl ? { uri: user.avatarUrl } : images.avatarPlaceholder
        }
        style={styles.image}
      />
      <View style={styles.wrapper}>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      {user.friendStatus === FriendStatusEnum.ADDED && (
        <Text style={styles.addedText}>ADDED</Text>
      )}
      {user.friendStatus === FriendStatusEnum.DECLINED && (
        <RoundedButton
          color={Colors.cancelText}
          backgroundColor={Colors.cancelBgr}
          onPress={handleSend}>
          RESEND
        </RoundedButton>
      )}
      {user.friendStatus === FriendStatusEnum.NONE && (
        <RoundedButton
          color={Colors.white}
          backgroundColor={Colors.primary}
          onPress={handleSend}>
          ADD
        </RoundedButton>
      )}
      {user.friendStatus === FriendStatusEnum.RECEIVER_PENDING && (
        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <IconButton
              svgText={CHECK}
              size={20}
              color={Colors.background}
              backgroundColor={Colors.primary}
              onPress={handleAccept}
            />
          </View>
          <IconButton
            svgText={X_MARK}
            size={20}
            color={Colors.background}
            backgroundColor={Colors.red}
            onPress={handleDeclined}
          />
        </View>
      )}
      {user.friendStatus === FriendStatusEnum.REQUESTER_PENDING && (
        <RoundedButton
          color={Colors.cancelText}
          backgroundColor={Colors.cancelBgr}
          onPress={handleCancel}>
          CANCEL
        </RoundedButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingVertical: 6,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.textDark,
    alignItems: 'center',
    marginRight: 10,
  },
  wrapper: {
    flex: 1,
  },
  name: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: '300',
  },
  addedText: {
    width: 100,
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: '600',
  },
  button: {
    marginRight: 4,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: 100,
  },
})
