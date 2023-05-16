import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import IconButton from '../../ui/IconButton'
import { PressFunction } from '../../../types'

export default function HorizontalItem({
  svgText,
  onPress,
  color,
  backgroundColor,
  text,
}: {
  svgText: string
  onPress: PressFunction
  color: string
  backgroundColor: string
  text: string
}) {
  return (
    <View style={styles.buttonWrapper}>
      <View style={styles.iconWrapper}>
        <IconButton
          svgText={svgText}
          onPress={onPress}
          color={color}
          backgroundColor={backgroundColor}
          size={28}
        />
      </View>
      <Text style={styles.buttonText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignSelf: 'center',
  },
  buttonWrapper: {
    marginHorizontal: 4,
    minWidth: 80,
  },
  buttonText: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
})
