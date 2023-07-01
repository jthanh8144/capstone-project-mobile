import { AppRegistry } from 'react-native'
import { register } from '@videosdk.live/react-native-sdk'

import App from './src/App'
import { name as appName } from './app.json'

register()

AppRegistry.registerComponent(appName, () => App)
