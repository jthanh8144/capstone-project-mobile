import React, { useLayoutEffect } from 'react'
import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'

import { images } from '../../assets/images'
import NewChatBox from '../../components/chat/ChatBox/NewChatBox'
import { NewChatStackProp } from '../../types'
import { isDarkMode } from '../../utils'

export default function NewChatScreen({ route, navigation }: NewChatStackProp) {
  const { user } = route.params

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'New conservation' })
  }, [navigation])

  return (
    <>
      <KeyboardAvoidingView style={styles.flexOne}>
        <ImageBackground
          source={
            isDarkMode ? images.chatBackgroundDark : images.chatBackground
          }
          style={styles.flexOne}>
          <View style={[styles.flexOne, styles.container]}>
            <FastImage
              source={
                user.avatarUrl
                  ? { uri: user.avatarUrl }
                  : images.avatarPlaceholder
              }
              style={styles.avatar}
            />
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <NewChatBox user={user} />
        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '500',
  },
  email: {},
})
