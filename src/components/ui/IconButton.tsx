import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { PressFunction } from '../../types'
import Icon from './Icon'

function IconButton({
  svgText,
  color,
  onPress,
}: {
  svgText: string
  color: string
  onPress: PressFunction
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Icon size={24} svgText={svgText} color={color} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
})

export default IconButton
