import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useMeeting } from '@videosdk.live/react-native-sdk'

import { Colors } from '../../../constants/colors'
import { convertRFValue } from '../../../utils'
import Button from '../../ui/Button'

export default function ParticipantLimitView() {
  const { leave } = useMeeting({})
  return (
    <View style={styles.container}>
      <Text style={styles.oopText}>OOPS !!</Text>
      <Text style={styles.maximumText}>
        Maximum 2 participants can join this meeting.
      </Text>
      <Text style={styles.tryAgainText}>Please try again later</Text>

      <Button
        onPress={() => {
          leave()
        }}>
        Ok
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  oopText: {
    fontSize: convertRFValue(24),
    color: Colors.white,
  },
  maximumText: {
    fontSize: convertRFValue(12),
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
  },
  tryAgainText: {
    fontSize: convertRFValue(12),
    color: '#818181',
    marginTop: 10,
  },
})
