import { Appearance } from 'react-native'

export const isDarkMode = Appearance.getColorScheme() === 'dark'

export const joinURL = (host: string, path: string) => {
  return host[host.length - 1] === '/' ? `${host}${path}` : `${host}/${path}`
}
