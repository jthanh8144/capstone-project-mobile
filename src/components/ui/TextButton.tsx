import React, { PropsWithChildren } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Colors } from '../../constants/colors'
import { PressFunction } from '../../types'

type ButtonProps = PropsWithChildren<{
  onPress: PressFunction
}>

function TextButton({ children, onPress }: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default TextButton

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  text: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
})
