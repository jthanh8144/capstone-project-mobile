import React from 'react'
import { View, Text, StyleSheet, ColorValue, ViewStyle } from 'react-native'

import { Colors } from '../../constants/colors'
import { convertRFValue } from '../../utils'

export default function Avatar({
  fullName,
  style,
  fontSize,
  containerBackgroundColor,
}: {
  fullName: string
  style: ViewStyle
  fontSize: number
  containerBackgroundColor: ColorValue
}) {
  return (
    <View
      style={[styles.container, { backgroundColor: containerBackgroundColor }]}>
      <View style={[style, styles.wrapper]}>
        <Text
          style={{
            fontSize: convertRFValue(fontSize),
            color: Colors.white,
          }}>
          {fullName && fullName.charAt(0).toUpperCase()}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
})
