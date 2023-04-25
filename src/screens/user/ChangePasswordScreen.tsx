import React from 'react'
import { useForm } from 'react-hook-form'
import { Platform, StyleSheet, View } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import Spinner from 'react-native-loading-spinner-overlay'

import PasswordInput from '../../components/user/PasswordInput'
import Button from '../../components/ui/Button'
import { ChangePasswordStackProp, UpdatePasswordFormData } from '../../types'
import { Colors } from '../../constants/colors'
import { updatePassword } from '../../services/http'

function ChangePasswordScreen({ navigation }: ChangePasswordStackProp) {
  const { control, handleSubmit, getValues } = useForm<UpdatePasswordFormData>()

  const onSubmit = async ({
    oldPassword,
    newPassword,
  }: UpdatePasswordFormData) => {
    try {
      const { success, message } = await updatePassword(
        oldPassword,
        newPassword,
      )
      if (Platform.OS !== 'ios') {
        Dialog.show({
          type: success ? ALERT_TYPE.SUCCESS : ALERT_TYPE.DANGER,
          title: success ? 'Success' : 'Error',
          textBody: message,
          button: 'close',
        })
      }
      navigation.goBack()
    } catch (err: any) {
      if (Platform.OS !== 'ios') {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody:
            err?.response?.data?.message ||
            'Something is error! Please try again later.',
          button: 'close',
        })
      }
      navigation.goBack()
    }
  }
  const { mutateAsync, isLoading } = useMutation(onSubmit)

  const submit = async (data: UpdatePasswordFormData) => {
    await mutateAsync(data)
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        <PasswordInput
          control={control}
          label="Old password"
          name="oldPassword"
          rules={{
            required: true,
            pattern: {
              value: /((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
              message:
                'Password must contain uppercase, lowercase letters, numbers and special characters',
            },
          }}
        />
        <PasswordInput
          control={control}
          label="New password"
          name="newPassword"
          rules={{
            required: true,
            pattern: {
              value: /((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
              message:
                'Password must contain uppercase, lowercase letters, numbers and special characters',
            },
          }}
        />
        <PasswordInput
          control={control}
          label="Confirm password"
          name="confirmPassword"
          rules={{
            required: true,
            validate: (value: string) =>
              value === getValues('newPassword') ||
              `Confirm password doesn't matched`,
          }}
        />
        <Button onPress={handleSubmit(submit)}>Save</Button>
      </View>
    </>
  )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: Colors.background,
  },
})
