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
  color?: string
  backgroundColor?: string
  onPress: PressFunction
}) {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    pressed: {
      opacity: 0.7,
    },
    btn: {
      padding: 8,
      borderRadius: 100,
      backgroundColor,
    },
    icon: {
      alignItems: 'center',
    },
  })

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        !!backgroundColor && styles.btn,
      ]}>
      <Icon size={size} svgText={svgText} color={color} style={styles.icon} />
    </Pressable>
  )
}

export default IconButton
