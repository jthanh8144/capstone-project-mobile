import React, { PropsWithChildren } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import { Colors } from '../../constants/colors'
import { PressFunction } from '../../types'
import Icon from './Icon'

type ButtonProps = PropsWithChildren<{
  onPress: PressFunction
  svgText: string
}>

function OutlineButton({ svgText, children, onPress }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Icon
        style={styles.icon}
        svgText={svgText}
        color={Colors.primary}
        size={24}
      />
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default OutlineButton

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: Colors.primary,
  },
})
