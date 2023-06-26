import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { RIGHT_ARROW } from '../../constants/icons'
import { Colors } from '../../constants/colors'
import { PressFunction } from '../../types'
import Icon from '../ui/Icon'

function ProfileAction({
  icon,
  label,
  onPress,
  isShowArrow = true,
}: {
  icon: string
  label: string
  onPress?: PressFunction
  isShowArrow?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionWrapper,
        pressed && styles.pressed,
      ]}>
      <View style={styles.actionIcon}>
        <Icon svgText={icon} size={24} color={Colors.primary} />
      </View>
      <Text style={styles.actionText}>{label}</Text>
      {isShowArrow && (
        <View style={styles.actionArrow}>
          <Icon svgText={RIGHT_ARROW} size={20} color={Colors.gray} />
        </View>
      )}
    </Pressable>
  )
}

export default ProfileAction

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  actionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  actionIcon: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 100,
    padding: 10,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
  },
  actionArrow: {
    padding: 8,
  },
})
