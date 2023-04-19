import React, { useContext } from 'react'
import { FieldErrors } from 'react-hook-form'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import Spinner from 'react-native-loading-spinner-overlay'
import { useMutation } from '@tanstack/react-query'

import AuthContent from '../../components/auth/AuthContent'
import { AuthFormData, LoginStackProp } from '../../types'
import { AuthContext } from '../../store/auth-context'
import { login } from '../../services/http'

function LoginScreen({ navigation }: LoginStackProp) {
  const { authenticate } = useContext(AuthContext)

  const onSubmit = async ({ email, password }: AuthFormData) => {
    try {
      const { accessToken, refreshToken } = await login(email, password)
      await authenticate(accessToken, refreshToken)
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

  const { mutate, isLoading } = useMutation(onSubmit)

  return (
    <>
      <Spinner visible={isLoading} />
      <AuthContent
        title={'Login'}
        isLogin={true}
        onSubmit={data => {
          mutate(data)
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
