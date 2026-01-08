import React, { useEffect, useState } from 'react'
import { useMeeting } from '@videosdk.live/react-native-sdk'

import ParticipantLimitView from './OneToOne/ParticipantLimitView'
import WaitingToJoinView from './WaitingToJoinView'
import OneToOne from './OneToOne'

export default function MeetingView({
  webcamEnabled,
}: {
  webcamEnabled: boolean
}) {
  const [isJoined, setJoined] = useState(false)
  const [participantLimit, setParticipantLimit] = useState(false)

  const { join, changeWebcam, participants, leave } = useMeeting({
    onMeetingJoined: () => {
      setTimeout(() => {
        setJoined(true)
      }, 500)
    },
    onParticipantLeft: () => {
      if (participants.size < 2) {
        setParticipantLimit(false)
      }
    },
  })

  useEffect(() => {
    if (isJoined) {
      if (participants.size > 2) {
        setParticipantLimit(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJoined])

  useEffect(() => {
    setTimeout(() => {
      if (!isJoined) {
        join()
        if (webcamEnabled) changeWebcam()
      }
    }, 1000)

    return () => leave()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isJoined ? (
    participantLimit ? (
      <ParticipantLimitView />
    ) : (
      <OneToOne />
    )
  ) : (
    <WaitingToJoinView />
  )
}
