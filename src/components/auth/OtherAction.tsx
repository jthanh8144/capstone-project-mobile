import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Colors } from '../../constants/colors'
import { PressFunction } from '../../types'
import TextButton from '../ui/TextButton'

function OtherAction({
  question,
  label,
  onPress,
}: {
  question: string
  label: string
  onPress: PressFunction
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.signUpText}>{question}</Text>
      <TextButton onPress={onPress}>{label}</TextButton>
    </View>
  )
}

export default OtherAction

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    color: Colors.gray,
    fontSize: 14,
    marginRight: 2,
  },
})
