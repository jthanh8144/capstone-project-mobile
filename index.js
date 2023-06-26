import { AppRegistry } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import { register } from '@videosdk.live/react-native-sdk'

import App from './src/App'
import { name as appName } from './app.json'
import { backgroundHandler } from './src/services/call'

register()
messaging().setBackgroundMessageHandler(backgroundHandler)

AppRegistry.registerComponent(appName, () => App)
