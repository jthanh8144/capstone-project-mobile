import { Appearance } from 'react-native'

const colorsSchema = {
  light: {
    primary: '#3abd8a',
    background: '#fff',
    backgroundDark: '#E8E8E8',
    textDark: '#221c30',
    textLight: '#fff',
    gray: '#808080',
    red: '#f71f0b',
    cancelBgr: '#ddd',
    cancelText: '#6b6b6b',
    white: '#fff',
    black: '#000',
    chatBoxContainer: '#f5f5f5',
    chatBoxBorder: '#d3d3d3',
    shadow: '#ddd',
    shadowDark: '#000',
  },
  dark: {
    primary: '#3abd8a',
    background: '#000',
    backgroundDark: '#1f1f1f',
    textDark: '#efefef',
    textLight: '#fff',
    gray: '#808080',
    red: '#ff6254',
    cancelBgr: '#ddd',
    cancelText: '#6b6b6b',
    white: '#fff',
    black: '#000',
    chatBoxContainer: '#292929',
    chatBoxBorder: 'transparent',
    shadow: '#ddd',
    shadowDark: '#e3e3e3',
  },
}

export const Colors = colorsSchema[Appearance.getColorScheme()]
