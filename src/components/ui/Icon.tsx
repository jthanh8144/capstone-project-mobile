import React from 'react'
import { SvgCss } from 'react-native-svg'
import { StyleProp, ViewStyle } from 'react-native'

function Icon({
  svgText,
  color,
  size,
  style,
}: {
  svgText: string
  color?: string
  size: number
  style?: StyleProp<ViewStyle>
}) {
  return (
    <SvgCss
      width={size}
      height={size}
      xml={svgText}
      fill={color}
      style={style}
    />
  )
}

export default Icon
