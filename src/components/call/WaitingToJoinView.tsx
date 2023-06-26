import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Lottie from 'lottie-react-native'

import joinAnimation from '../../assets/animations/joining_lottie.json'
import { Colors } from '../../constants/colors'
import { convertRFValue } from '../../utils'

export default function WaitingToJoinView() {
  return (
    <View style={styles.container}>
      <Lottie source={joinAnimation} autoPlay loop style={styles.animation} />
      <Text style={styles.text}>Creating a room</Text>
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
  animation: {
    height: 50,
    width: 50,
  },
  text: {
    fontSize: convertRFValue(18),
    color: Colors.textDark,
    marginTop: 28,
  },
})
