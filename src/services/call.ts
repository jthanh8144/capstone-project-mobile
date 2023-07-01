import uuid from 'react-native-uuid'
import { AppState, BackHandler, Platform } from 'react-native'
import RNCallKeep, { IOptions } from 'react-native-callkeep'
import { StackActions } from '@react-navigation/native'
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import AndroidOverlayPermission from 'videosdk-rn-android-overlay-permission'

import { CallKeepFunc, CallType, RemoteMessageData } from '../types'
import { navigationRef } from '../navigation/MainNavigation'
import { updateCall } from './http'

class CallService {
  private callId: string
  constructor() {
    this.callId = null
  }

  private options: IOptions = {
    ios: {
      appName: 'Safe Talk',
      supportsVideo: false,
      maximumCallGroups: '1',
      maximumCallsPerCallGroup: '1',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'Ok',
      imageName: 'phone_account_icon',
      additionalPermissions: [],
    },
  }

  setupCallKeep = async () => {
    try {
      await RNCallKeep.setup(this.options)
    } catch (error) {
      console.error('setup call keep error:', error?.message)
    }
  }

  setupCallKeepInBackground = () => {
    RNCallKeep.registerPhoneAccount(this.options)
    RNCallKeep.registerAndroidEvents()
    RNCallKeep.setAvailable(true)
  }

  configure = async (
    incomingCallAnswer: CallKeepFunc,
    endIncomingCall: CallKeepFunc,
  ) => {
    try {
      if (AppState.currentState === 'active') {
        await this.setupCallKeep()
      } else {
        this.setupCallKeepInBackground()
      }
      Platform.OS === 'android' && RNCallKeep.setAvailable(true)
      RNCallKeep.addEventListener('answerCall', incomingCallAnswer)
      RNCallKeep.addEventListener('endCall', endIncomingCall)
    } catch (error) {
      console.error('initializeCallKeep error:', error?.message)
    }
  }

  private removeEvents = () => {
    RNCallKeep.removeEventListener('answerCall')
    RNCallKeep.removeEventListener('endCall')
  }

  displayIncomingCall = (callerName: string) => {
    Platform.OS === 'android' && RNCallKeep.setAvailable(false)
    RNCallKeep.displayIncomingCall(
      uuid.v4().toString(),
      callerName,
      callerName,
      'number',
      true,
      null,
    )
  }

  endIncomingCallAnswer = (callId: string) => {
    RNCallKeep.endCall(callId)
    this.removeEvents()
  }

  endAllCall = () => {
    RNCallKeep.endAllCalls()
    this.removeEvents()
  }
}

export const callService = new CallService()

export const initializeCallKeep = async () => {
  await callService.setupCallKeep()
  RNCallKeep.setAvailable(true)

  if (Platform.OS === 'android') {
    AndroidOverlayPermission.requestOverlayPermission()
  }
}

export const initializeCallHandle = () => {
  const navigate: (screenName: string, options: any) => void =
    navigationRef.navigate

  messaging().onMessage(remoteMessage => {
    const { callerId, callerName, meetingId, type }: RemoteMessageData =
      remoteMessage.data
    if (type) {
      switch (type) {
        case CallType.CALL_INITIATED:
          const incomingCallAnswer: CallKeepFunc = ({ callUUID }) => {
            ;(async () => {
              try {
                await updateCall(callerId, CallType.ACCEPTED, meetingId)
                callService.endIncomingCallAnswer(callUUID)
                // await Linking.openURL(`safe-talk://call-screen/${meetingId}`)
                navigate('CallRoom', { meetingId })
              } catch (err) {
                Dialog.show({
                  type: ALERT_TYPE.DANGER,
                  title: 'Error',
                  textBody: err?.message,
                  button: 'close',
                })
              }
            })()
          }
          const endIncomingCall: CallKeepFunc = ({ callUUID }) => {
            ;(async () => {
              callService.endIncomingCallAnswer(callUUID)
              await updateCall(callerId, CallType.REJECTED)
            })()
          }
          callService.configure(incomingCallAnswer, endIncomingCall)
          callService.displayIncomingCall(callerName)
          break
        case CallType.ACCEPTED:
          navigationRef.dispatch(
            StackActions.replace('CallRoom', { meetingId }),
          )
          break
        case CallType.REJECTED:
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Call rejected',
            autoClose: 800,
            onHide: () => {
              if (navigationRef.canGoBack()) {
                navigationRef.goBack()
              } else {
                BackHandler.exitApp()
              }
            },
          })
          break
        case CallType.DISCONNECT:
          callService.endAllCall()
          break
        default:
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: 'Call Could not placed',
            button: 'close',
          })
          break
      }
    }
  })
}

export const backgroundHandler = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  try {
    const navigate: (screenName: string, options: any) => void =
      navigationRef.navigate
    const { callerId, callerName, meetingId, type }: RemoteMessageData =
      remoteMessage.data
    if (type && type === CallType.CALL_INITIATED) {
      const incomingCallAnswer: CallKeepFunc = ({ callUUID }) => {
        ;(async () => {
          try {
            // RNCallKeep.backToForeground()
            await updateCall(callerId, CallType.ACCEPTED, meetingId)
            callService.endIncomingCallAnswer(callUUID)
            navigate('CallRoom', { meetingId })
          } catch (err) {
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'Error',
              textBody: err?.message,
              button: 'close',
            })
          }
        })()
      }
      const endIncomingCall: CallKeepFunc = ({ callUUID }) => {
        ;(async () => {
          try {
            callService.endIncomingCallAnswer(callUUID)
            await updateCall(callerId, CallType.REJECTED)
          } catch (err) {
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'Error',
              textBody: err?.message,
              button: 'close',
            })
          }
        })()
      }
      callService.configure(incomingCallAnswer, endIncomingCall)
      callService.displayIncomingCall(callerName)
      RNCallKeep.backToForeground()
      return Promise.resolve('' as any)
    }
  } catch (err) {
    console.log(err)
  }
}
