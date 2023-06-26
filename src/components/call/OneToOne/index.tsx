import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import { useMeeting } from '@videosdk.live/react-native-sdk'

import LocalView from './LocalView'
import LargeView from './LargeView'
import MiniView from './MiniView'

import {
  END_CALL,
  MIC_OFF,
  MIC_ON,
  SWITCH_CAMERA,
  VIDEO_OFF,
  VIDEO_ON,
} from '../../../constants/icons'
import Icon from '../../ui/Icon'
import { Colors } from '../../../constants/colors'
import ToggleIconButton from '../../ui/ToggleIconButton'

export default function OneToOneView() {
  const {
    participants,
    localWebcamOn,
    localMicOn,
    leave,
    changeWebcam,
    toggleWebcam,
    toggleMic,
  } = useMeeting({
    onError: data => {
      const { code, message } = data
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: `Error: ${code}: ${message}`,
      })
    },
  })

  const participantIds = [...participants.keys()]

  const participantCount = participantIds ? participantIds.length : null

  return (
    <>
      {/* Center */}
      <View style={styles.centerContainer}>
        {participantCount > 1 ? (
          <>
            <LargeView participantId={participantIds[1]} />
            <MiniView participantId={participantIds[0]} />
          </>
        ) : participantCount === 1 ? (
          <LocalView participantId={participantIds[0]} />
        ) : (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
      {/* Bottom */}
      <View style={styles.bottomContainer}>
        <ToggleIconButton
          isToggle={false}
          onPress={() => {
            leave()
          }}
          backgroundColor={Colors.red}
          icon={<Icon svgText={END_CALL} size={26} color={Colors.white} />}
        />
        <ToggleIconButton
          isToggle={true}
          onPress={() => {
            toggleMic()
          }}
          toggleValue={localMicOn}
          trueIcon={<Icon svgText={MIC_ON} size={28} color={Colors.white} />}
          falseIcon={<Icon svgText={MIC_OFF} size={28} color={'#1D2939'} />}
        />
        <ToggleIconButton
          isToggle={true}
          onPress={() => {
            toggleWebcam()
          }}
          toggleValue={localWebcamOn}
          trueIcon={<Icon svgText={VIDEO_ON} size={28} color={'#1D2939'} />}
          falseIcon={
            <Icon svgText={VIDEO_OFF} size={28} color={Colors.white} />
          }
        />
        <ToggleIconButton
          isToggle={false}
          onPress={() => {
            changeWebcam()
          }}
          backgroundColor={Colors.black}
          icon={<Icon svgText={SWITCH_CAMERA} size={26} color={Colors.white} />}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  meetingIdWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  meetingId: {
    fontSize: 16,
    color: Colors.white,
  },
  centerContainer: {
    flex: 1,
    marginTop: 8,
    marginBottom: 12,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 10,
  },
})
