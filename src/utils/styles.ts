import { RFValue } from 'react-native-responsive-fontsize'

const STANDARD_DESIGN_HEIGHT_WIDTH = { HEIGHT: 640, WIDTH: 360 }

export const convertRFValue = (fontSize: number) =>
  RFValue(fontSize, STANDARD_DESIGN_HEIGHT_WIDTH.HEIGHT)
