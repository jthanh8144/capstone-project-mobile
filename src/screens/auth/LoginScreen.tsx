import React, { useContext } from 'react'
import { FieldErrors } from 'react-hook-form'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Spinner from 'react-native-loading-spinner-overlay'
import { useMutation } from '@tanstack/react-query'

import AuthContent from '../../components/auth/AuthContent'
import { AuthFormData, LoginStackProp } from '../../types'
import { AuthContext } from '../../store/auth-context'
import { AppContext } from '../../store/app-context'
import { login } from '../../services/http'
import { generateSignalKey, getFromLocalStorage } from '../../utils'

function LoginScreen({ navigation }: LoginStackProp) {
  const { authenticate } = useContext(AuthContext)
  const { signalStore } = useContext(AppContext)

  const onSubmit = async ({ email, password }: AuthFormData) => {
    try {
      const { accessToken, refreshToken, userId } = await login(email, password)
      await authenticate(accessToken, refreshToken, userId)
      const signalKey = await AsyncStorage.getItem(userId)
      if (!signalKey) {
        await generateSignalKey(userId, signalStore)
      } else {
        await getFromLocalStorage(userId, signalStore)
      }
    } catch (err: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody:
          err?.response?.data?.message ||
          'Something is error! Please try again later.',
        button: 'close',
      })
    }
  }

  const onError = (errors: FieldErrors<AuthFormData>) => {
    const body = Object.keys(errors)
      .map((_, index) => '- ' + Object.values(errors)[index].message)
      .join('\n')
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Error',
      textBody: body,
      button: 'close',
    })
  }

  const { mutateAsync, isLoading } = useMutation(onSubmit)

  return (
    <>
      <Spinner visible={isLoading} />
      <AuthContent
        title={'Login'}
        isLogin={true}
        onSubmit={async data => {
          await mutateAsync(data)
        }}
        onError={onError}
        question="Don't have an account?"
        otherActionLabel={'Sign up'}
        onPressOtherAction={() => {
          navigation.replace('SignUp')
        }}
      />
    </>
  )
}

export default LoginScreen
