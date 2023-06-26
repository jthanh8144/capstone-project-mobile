import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  MediaStream,
  RTCView,
  useParticipant,
} from '@videosdk.live/react-native-sdk'

import Avatar from '../Avatar'

export default function MiniView({ participantId }: { participantId: string }) {
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
          zOrder={1}
          mirror={isLocal ? true : false}
          style={styles.rtcView}
          streamURL={new MediaStream([webcamStream.track]).toURL()}
        />
      ) : (
        <Avatar
          fullName={displayName}
          containerBackgroundColor="#404B53"
          fontSize={24}
          style={styles.avatar}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 160,
    aspectRatio: 0.7,
    borderRadius: 8,
    borderColor: '#ff0000',
    overflow: 'hidden',
  },
  rtcView: {
    flex: 1,
    backgroundColor: '#424242',
  },
  avatar: {
    backgroundColor: '#6F767E',
    height: 60,
    aspectRatio: 1,
    borderRadius: 40,
  },
})
