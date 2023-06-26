import React from 'react'
import { FieldErrors } from 'react-hook-form'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import Spinner from 'react-native-loading-spinner-overlay'
import { useMutation } from '@tanstack/react-query'

import AuthContent from '../../components/auth/AuthContent'
import { AuthFormData, SignUpStackProp } from '../../types'
import { registerUser } from '../../services/http'

function SignUpScreen({ navigation }: SignUpStackProp) {
  const onSubmit = async ({ email, password, fullName }: AuthFormData) => {
    try {
      const { message } = await registerUser(email, password, fullName)
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: message,
        button: 'close',
        onHide: () => {
          navigation.replace('Login')
        },
      })
    } catch (err: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody:
          err?.response?.data?.message ||
          'Something is error! Please try against later.',
        button: 'close',
      })
      console.log(err)
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
        title={'Sign Up'}
        isLogin={false}
        onSubmit={async data => {
          mutateAsync(data)
        }}
        onError={onError}
        question="Already have an account."
        otherActionLabel={'Login'}
        onPressOtherAction={() => {
          navigation.replace('Login')
        }}
      />
    </>
  )
}

export default SignUpScreen
