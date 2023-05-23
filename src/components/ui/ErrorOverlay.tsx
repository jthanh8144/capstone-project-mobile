import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Colors } from '../../constants/colors'
import { VoidFunction } from '../../types'
import Button from './Button'

function ErrorOverlay({
  message,
  retryFunc,
}: {
  message: string
  retryFunc?: VoidFunction
}) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>An error occurred!</Text>
      <Text style={styles.text}>{message}</Text>
      {retryFunc && <Button onPress={retryFunc}>Retry</Button>}
    </View>
  )
}

export default ErrorOverlay

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100,
    backgroundColor: Colors.background,
  },
  text: {
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    color: Colors.textDark,
    fontSize: 20,
    fontWeight: 'bold',
  },
})
