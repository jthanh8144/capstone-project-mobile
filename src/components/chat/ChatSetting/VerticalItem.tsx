import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { StyleSheet } from 'react-native'
import Icon from '../../ui/Icon'
import { PressFunction } from '../../../types'
import { Colors } from '../../../constants/colors'

export default function VerticalItem({
  svgText,
  text,
  onPress,
  color,
}: {
  svgText: string
  text: string
  onPress: PressFunction
  color?: string
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}>
      <View style={styles.icon}>
        <Icon svgText={svgText} size={24} color={color} />
      </View>
      <Text style={[styles.text, { color }]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
})
