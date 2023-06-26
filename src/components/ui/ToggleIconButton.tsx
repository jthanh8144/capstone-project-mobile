import React from 'react'
import { ColorValue, Pressable, StyleSheet } from 'react-native'

import { PressFunction } from '../../types'
import { Colors } from '../../constants/colors'

export default function ToggleIconButton({
  isToggle,
  onPress,
  toggleValue,
  backgroundColor,
  trueIcon,
  falseIcon,
  icon,
}: {
  isToggle: boolean
  onPress: PressFunction
  toggleValue?: boolean
  backgroundColor?: ColorValue
  trueIcon?: JSX.Element
  falseIcon?: JSX.Element
  icon?: JSX.Element
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed && styles.pressed,
        isToggle && styles.toggle,
        styles.container,
        {
          backgroundColor: isToggle
            ? toggleValue
              ? 'transparent'
              : Colors.white
            : backgroundColor || 'transparent',
        },
      ]}>
      {isToggle ? (toggleValue ? trueIcon : falseIcon) : icon}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  container: {
    borderRadius: 30,
    height: 60,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle: {
    borderWidth: 1.5,
    borderColor: '#2B3034',
  },
})
