import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import Spinner from 'react-native-loading-spinner-overlay'

import { FriendRequest } from '../../models/friend-request'
import { CHECK, X_MARK } from '../../constants/icons'
import { Colors } from '../../constants/colors'
import { images } from '../../assets/images'
import RoundedButton from '../ui/RoundedButton'
import IconButton from '../ui/IconButton'
import {
  removeSendedFriendRequest,
  sendFriendRequest,
  updateReceivedFriendRequest,
} from '../../services/http'

function FriendRequestItem({
  isReceived,
  friendRequest,
}: {
  isReceived: boolean
  friendRequest: FriendRequest
}) {
  const user = isReceived ? friendRequest.requester : friendRequest.receiver

  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    async (status: string) => {
      await updateReceivedFriendRequest(friendRequest.id, status)
      return status
    },
    {
      onSuccess: status => {
        queryClient.invalidateQueries([
          'receivedFriendRequests',
          status === 'accepted' && 'friendsList',
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
      await removeSendedFriendRequest(friendRequest.id)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sendedFriendRequests'])
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
  const resendRequestMutation = useMutation(
    async () => {
      await sendFriendRequest(user.id)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sendedFriendRequests'])
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

  const handleAccept = async () => {
    await mutateAsync('accepted')
  }
  const handleDeclined = async () => {
    await mutateAsync('declined')
  }
  const handleCancel = async () => {
    await removeRequestMutation.mutateAsync()
  }
  const handleResend = async () => {
    await resendRequestMutation.mutateAsync()
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        <Image
          source={
            user?.avatarUrl ? { uri: user.avatarUrl } : images.avatarPlaceholder
          }
          style={styles.image}
        />
        <View style={styles.wrapper}>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        {isReceived ? (
          <>
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
          </>
        ) : (
          <RoundedButton
            color={Colors.cancelText}
            backgroundColor={Colors.cancelBgr}
            onPress={
              friendRequest.status === 'pending' ? handleCancel : handleResend
            }>
            {friendRequest.status === 'pending' ? 'CANCEL' : 'RESEND'}
          </RoundedButton>
        )}
      </View>
    </>
  )
}

export default FriendRequestItem

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
  button: {
    marginRight: 4,
  },
})
