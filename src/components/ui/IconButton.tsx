import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { PressFunction } from '../../types'
import Icon from './Icon'

function IconButton({
  svgText,
  size = 24,
  color,
  backgroundColor,
  onPress,
}: {
  svgText: string
  size?: number
  color: string
  backgroundColor?: string
  onPress: PressFunction
}) {
  const styles = StyleSheet.create({
    pressed: {
      opacity: 0.7,
    },
    btn: {
      padding: 8,
      borderRadius: 100,
      backgroundColor,
    },
  })

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed && styles.pressed,
        !!backgroundColor && styles.btn,
      ]}>
      <Icon size={size} svgText={svgText} color={color} />
    </Pressable>
  )
}

export default IconButton
