import { Platform } from 'react-native'
import Config from 'react-native-config'

export const environments = {
  apiUrl:
    Config.ENV === 'local'
      ? Platform.OS === 'android'
        ? 'http://10.0.2.2:3000/'
        : 'http://localhost:3000/'
      : Config.API_URL,
  socketUrl:
    Config.ENV === 'local'
      ? Platform.OS === 'android'
        ? 'http://10.0.2.2:4000/'
        : 'http://localhost:4000/'
      : Config.SOCKET_URL,
  videoSDKApi: 'https://api.videosdk.live/v2',
  videoSDKToken: Config.VIDEO_SDK_TOKEN,
}
