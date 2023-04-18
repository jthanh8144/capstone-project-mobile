import React from 'react'
import { ScrollView } from 'react-native'
import { FieldErrors, useForm } from 'react-hook-form'

import { LOCK, MAIL } from '../../constants/icons'
import { AuthFormData } from '../../types'
import Button from '../ui/Button'
import Input from './Input'

function AuthForm({
  isLogin,
  onSubmit,
  onError,
}: {
  isLogin: boolean
  onSubmit: (data: AuthFormData) => void
  onError?: (errors: FieldErrors<AuthFormData>) => void
}) {
  const {
    control,
    handleSubmit,
    getValues,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm<AuthFormData>()
  return (
    <ScrollView>
      {!isLogin && (
        <Input
          label="Full name"
          icon={MAIL}
          placeholder="Enter full name"
          control={control}
          name="fullName"
          rules={{
            required: true,
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
          required: true,
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
          required: true,
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
            required: true,
            validate: (value: string) =>
              value === getValues('password') ||
              `Confirm password doesn't matched`,
          }}
        />
      )}
      <Button onPress={handleSubmit(onSubmit, onError)}>
        {isLogin ? 'Login' : 'Sign Up'}
      </Button>
    </ScrollView>
  )
}

export default AuthForm
