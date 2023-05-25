import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import { OnBoardingStackProp } from '../../types'
import Button from '../../components/ui/Button'
import { Colors } from '../../constants/colors'
import { images } from '../../assets/images'
import OtherAction from '../../components/auth/OtherAction'

function OnBoardingScreen({ navigation }: OnBoardingStackProp) {
  const goToLogin = () => {
    navigation.navigate('Login')
  }
  const goToSignUp = () => {
    navigation.navigate('SignUp')
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <FastImage source={images.icon} style={styles.logo} />
        <Text style={styles.appName}>Safe Talk</Text>
        <Text style={styles.description}>Simple Secure Reliable Messaging</Text>
        <View style={styles.button}>
          <Button onPress={goToLogin}>Login</Button>
        </View>
        <OtherAction
          question="Don't have an account?"
          label="Sign Up"
          onPress={goToSignUp}
        />
      </View>
    </View>
  )
}

export default OnBoardingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  wrapper: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '500',
    marginTop: 40,
  },
  description: {
    textAlign: 'center',
    color: Colors.textDark,
    fontSize: 20,
    fontWeight: '400',
    marginTop: 55,
    marginBottom: 140,
    width: '60%',
  },
  button: {
    width: '80%',
  },
})
