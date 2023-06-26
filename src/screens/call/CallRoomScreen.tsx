import React, { useContext } from 'react'
import { BackHandler } from 'react-native'
import {
  MeetingConsumer,
  MeetingProvider,
} from '@videosdk.live/react-native-sdk'

import { CallRoomStackProp } from '../../types'
import { callService } from '../../services/call'
import { AppContext } from '../../store/app-context'
import { environments } from '../../configs/environment'
import MeetingView from '../../components/call/MeetingView'

export default function CallRoomScreen({
  navigation,
  route,
}: CallRoomStackProp) {
  const { meetingId } = route.params
  const { user } = useContext(AppContext)

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: false,
        webcamEnabled: true,
        name: user?.fullName || 'P',
      }}
      token={environments.videoSDKToken}>
      <MeetingConsumer
        onMeetingLeft={() => {
          callService.endAllCall()
          if (navigation.canGoBack()) {
            navigation.goBack()
          } else {
            BackHandler.exitApp()
          }
        }}>
        {() => {
          return <MeetingView webcamEnabled={true} />
        }}
      </MeetingConsumer>
    </MeetingProvider>
  )
}
