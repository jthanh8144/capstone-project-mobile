import React from 'react'
import { BackHandler, StyleSheet, Text, View } from 'react-native'

import { CallType, CallingStackProp } from '../../types'
import IconButton from '../../components/ui/IconButton'
import { END_CALL } from '../../constants/icons'
import { Colors } from '../../constants/colors'
import { updateCall } from '../../services/http'

export default function CallingScreen({ navigation, route }: CallingStackProp) {
  const { id, name } = route.params

  const handleEndCall = async () => {
    await updateCall(id, CallType.DISCONNECT)
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      BackHandler.exitApp()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.textCall}>Calling to...</Text>

        <Text style={styles.textName}>{name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          svgText={END_CALL}
          onPress={handleEndCall}
          color={Colors.textDark}
          backgroundColor={Colors.red}
          size={40}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: Colors.background,
  },
  textContainer: {
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  textCall: {
    fontSize: 16,
    color: Colors.textDark,
  },
  textName: {
    fontSize: 36,
    marginTop: 12,
    color: Colors.textDark,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
