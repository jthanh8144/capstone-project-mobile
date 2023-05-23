import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FieldErrors } from 'react-hook-form'

import OtherAction from '../../components/auth/OtherAction'
import AuthForm from '../../components/auth/AuthForm'
import { Colors } from '../../constants/colors'
import { AuthFormData, PressFunction } from '../../types'

function AuthContent({
  title,
  isLogin,
  onSubmit,
  onError,
  question,
  otherActionLabel,
  onPressOtherAction,
}: {
  title: string
  isLogin: boolean
  onSubmit: (data: AuthFormData) => void
  onError?: (errors: FieldErrors<AuthFormData>) => void
  question: string
  otherActionLabel: string
  onPressOtherAction: PressFunction
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <View style={styles.footer}>
        <AuthForm isLogin={isLogin} onSubmit={onSubmit} onError={onError} />
        <View style={styles.wrapper}>
          <OtherAction
            question={question}
            label={otherActionLabel}
            onPress={onPressOtherAction}
          />
        </View>
      </View>
    </View>
  )
}

export default AuthContent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 30,
  },
  footer: {
    flex: 4,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  wrapper: {
    alignItems: 'center',
  },
})
