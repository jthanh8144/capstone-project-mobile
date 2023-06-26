import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { FieldErrors, useForm } from 'react-hook-form'
import { ALERT_TYPE, Dialog as Alert } from 'react-native-alert-notification'
import Spinner from 'react-native-loading-spinner-overlay'
import Dialog from 'react-native-dialog'

import { LOCK, MAIL, PERSON } from '../../constants/icons'
import { Colors } from '../../constants/colors'
import { AuthFormData } from '../../types'
import TextButton from '../ui/TextButton'
import Button from '../ui/Button'
import Input from './Input'
import { requestResetPassword, resetPassword } from '../../services/http'

function AuthForm({
  isLogin,
  onSubmit,
  onError,
}: {
  isLogin: boolean
  onSubmit: (data: AuthFormData) => void
  onError?: (errors: FieldErrors<AuthFormData>) => void
}) {
  const [isShownForget, setIsShownForget] = useState(false)
  const [email, setEmail] = useState('')
  const [isEditable, setIsEditable] = useState(true)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    getValues,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm<AuthFormData>()

  const sendRequestResetPassword = async () => {
    try {
      if (email) {
        setIsLoading(true)
        await requestResetPassword(email)
        setIsLoading(false)
        setIsEditable(false)
      }
    } catch (err) {
      Alert.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: err?.message || 'Something is error!',
        button: 'close',
      })
    }
  }

  const handleResetPassword = async () => {
    try {
      if (code) {
        setIsLoading(true)
        const res = await resetPassword(email, code)
        setIsLoading(false)
        setIsShownForget(false)
        setIsEditable(true)
        setEmail('')
        setCode('')
        Alert.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: res.message,
          button: 'close',
        })
      }
    } catch (err) {
      Alert.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: err?.message || 'Something is error!',
        button: 'close',
      })
    }
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <ScrollView>
        {!isLogin && (
          <Input
            label="Full name"
            icon={PERSON}
            placeholder="Enter full name"
            control={control}
            name="fullName"
            rules={{
              required: 'Full name is required.',
            }}
          />
        )}
        <Input
          label="Email"
          icon={MAIL}
          placeholder="Enter email"
          keyboardType="email-address"
          control={control}
          name="email"
          rules={{
            required: 'Email is required.',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Email is invalid',
            },
          }}
        />
        <Input
          label="Password"
          icon={LOCK}
          placeholder="Enter password"
          secure={true}
          control={control}
          name="password"
          rules={{
            required: 'Password is required.',
            pattern: {
              value: /((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
              message:
                'Password must contain uppercase, lowercase letters, numbers and special characters',
            },
          }}
        />
        {!isLogin && (
          <Input
            label="Confirm password"
            icon={LOCK}
            placeholder="Enter confirm password"
            secure={true}
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirm password is required.',
              validate: (value: string) =>
                value === getValues('password') ||
                `Confirm password doesn't matched`,
            }}
          />
        )}
        {isLogin && (
          <View style={styles.forgetPasswordContainer}>
            <TextButton
              onPress={() => {
                setIsShownForget(true)
              }}
              color={Colors.textDark}>
              Forget password?
            </TextButton>
          </View>
        )}
        <Button onPress={handleSubmit(onSubmit, onError)}>
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </ScrollView>
      <Dialog.Container visible={isShownForget}>
        <Dialog.Title>Account delete</Dialog.Title>
        <Dialog.Description>
          {isEditable
            ? 'Please enter the email associated with your account to request a password reset.'
            : 'Please enter verify code to complete the request.'}
        </Dialog.Description>
        <Dialog.Input
          editable={isEditable}
          onChangeText={s => {
            setEmail(s)
          }}
          value={email}
        />
        {!isEditable && (
          <Dialog.Input
            onChangeText={s => {
              setCode(s)
            }}
            value={code}
            placeholder="Enter verify code..."
          />
        )}
        <Dialog.Button
          color={Colors.gray}
          label="Cancel"
          onPress={() => {
            setIsShownForget(false)
          }}
        />
        {isEditable ? (
          <Dialog.Button
            color={Colors.primary}
            label="Request"
            onPress={sendRequestResetPassword}
          />
        ) : (
          <Dialog.Button
            color={Colors.primary}
            label="Send"
            onPress={handleResetPassword}
          />
        )}
      </Dialog.Container>
    </>
  )
}

export default AuthForm

const styles = StyleSheet.create({
  forgetPasswordContainer: {
    marginBottom: 6,
    alignSelf: 'flex-end',
  },
})
