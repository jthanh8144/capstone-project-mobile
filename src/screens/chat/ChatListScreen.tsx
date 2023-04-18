import React, { useContext, useEffect } from 'react'
import { Pressable, Text } from 'react-native'
import { AuthContext } from '../../store/auth-context'
import { getUserProfile } from '../../services/http'

function ChatListScreen() {
  const { logout } = useContext(AuthContext)
  useEffect(() => {
    ;(async () => {
      const res = await getUserProfile()
      console.log(res)
    })()
  }, [])
  return (
    <Pressable
      onPress={() => {
        logout()
      }}>
      <Text>Logout</Text>
    </Pressable>
  )
}

export default ChatListScreen
