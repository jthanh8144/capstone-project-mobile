import { Platform } from 'react-native'
import Config from 'react-native-config'

export const environments = {
  apiUrl:
    Config.ENV === 'local'
      ? Platform.OS === 'android'
        ? 'http://10.0.2.2:3000/'
        : 'http://localhost:3000/'
      : Config.API_URL,
}
