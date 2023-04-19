import React, { PropsWithChildren } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Colors } from '../../constants/colors'
import { FontWeightValue, PressFunction } from '../../types'

type ButtonProps = PropsWithChildren<{
  onPress: PressFunction
  color?: string
  fontSize?: number
  fontWeight?: FontWeightValue
}>

function TextButton({
  children,
  onPress,
  color,
  fontSize,
  fontWeight,
}: ButtonProps) {
  const styles = StyleSheet.create({
    button: {
      padding: 4,
    },
    text: {
      color: color || Colors.primary,
      fontSize: fontSize || 14,
      fontWeight: fontWeight || '500',
    },
  })

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default TextButton
