import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  MediaStream,
  RTCView,
  useParticipant,
} from '@videosdk.live/react-native-sdk'

import Avatar from '../Avatar'

export default function LocalViewContainer({
  participantId,
}: {
  participantId: string
}) {
  const { webcamOn, webcamStream, displayName, setQuality, isLocal } =
    useParticipant(participantId, {})

  useEffect(() => {
    setQuality('high')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View style={styles.container}>
      {webcamOn && webcamStream ? (
        <RTCView
          objectFit="cover"
          mirror={isLocal}
          style={styles.rtcView}
          streamURL={new MediaStream([webcamStream.track]).toURL()}
        />
      ) : (
        <Avatar
          containerBackgroundColor="#1A1C22"
          fullName={displayName}
          fontSize={26}
          style={styles.avatar}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1C22',
    borderRadius: 12,
    overflow: 'hidden',
  },
  rtcView: {
    flex: 1,
    backgroundColor: '#424242',
  },
  avatar: {
    backgroundColor: '#232830',
    height: 70,
    aspectRatio: 1,
    borderRadius: 40,
  },
})
