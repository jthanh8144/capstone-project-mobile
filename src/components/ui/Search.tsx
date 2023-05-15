import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import Icon from './Icon'
import { SEARCH } from '../../constants/icons'
import { Colors } from '../../constants/colors'
import { PressFunction } from '../../types'

export default function Search({
  placeholder,
  onPress,
}: {
  placeholder: string
  onPress: PressFunction
}) {
  return (
    <View>
      <Pressable
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        onPress={onPress}>
        <Icon svgText={SEARCH} size={28} />
        <Text style={styles.text}>{placeholder}</Text>
      </Pressable>
    </View>
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
    marginHorizontal: 10,
    marginBottom: 12,
    padding: 8,
    borderRadius: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
})
