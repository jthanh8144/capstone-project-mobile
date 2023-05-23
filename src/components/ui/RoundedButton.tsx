import React, { PropsWithChildren } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import { Colors } from '../../constants/colors'
import { PressFunction } from '../../types'

type ButtonProps = PropsWithChildren<{
  onPress: PressFunction
  color?: string
  backgroundColor?: string
}>

function RoundedButton({
  children,
  onPress,
  color = Colors.textLight,
  backgroundColor = Colors.primary,
}: ButtonProps) {
  const styles = StyleSheet.create({
    button: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      marginHorizontal: 2,
      borderRadius: 100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor,
      minWidth: 90,
    },
    pressed: {
      opacity: 0.7,
    },
    icon: {
      marginRight: 6,
    },
    text: {
      color,
      fontSize: 14,
    },
  })

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default RoundedButton
