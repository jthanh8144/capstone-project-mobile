import React, { PropsWithChildren } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import { PressFunction } from '../../types'
import { Colors } from '../../constants/colors'

type ButtonProps = PropsWithChildren<{
  onPress: PressFunction
}>

function Button({ children, onPress }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    margin: 4,
    backgroundColor: Colors.primary,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 4,
    borderRadius: 8,
    minWidth: 100,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
})
