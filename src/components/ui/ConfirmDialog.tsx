import React, { Dispatch, SetStateAction } from 'react'
import { StyleSheet } from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts'

import { Colors } from '../../constants/colors'
import { VoidFunction } from '../../types'

function ConfirmDialog({
  isShown,
  setIsShown,
  title,
  message,
  onCancel,
  onConfirm,
}: {
  isShown: boolean
  setIsShown: Dispatch<SetStateAction<boolean>>
  title: string
  message?: string
  onCancel: VoidFunction
  onConfirm: VoidFunction
}) {
  return (
    <AwesomeAlert
      show={isShown}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText="Cancel"
      confirmText="Yes"
      confirmButtonColor={Colors.primary}
      onCancelPressed={() => {
        onCancel()
        setIsShown(false)
      }}
      onConfirmPressed={() => {
        onConfirm()
        setIsShown(false)
      }}
      contentContainerStyle={styles.container}
      messageStyle={styles.message}
      cancelButtonStyle={styles.button}
      confirmButtonStyle={styles.button}
    />
  )
}

export default ConfirmDialog

const styles = StyleSheet.create({
  container: {
    width: '80%',
  },
  message: {
    textAlign: 'center',
  },
  button: {
    minWidth: 75,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
})
