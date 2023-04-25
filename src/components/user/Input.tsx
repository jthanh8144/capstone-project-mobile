import React from 'react'
import {
  KeyboardTypeOptions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Control, Controller, RegisterOptions } from 'react-hook-form'

import Icon from '../ui/Icon'
import { Colors } from '../../constants/colors'
import { EditProfileFormData } from '../../types'

function Input({
  label,
  icon,
  placeholder,
  secure,
  keyboardType,
  control,
  name,
  rules,
  isEditable,
}: {
  label: string
  icon?: string
  placeholder?: string
  secure?: boolean
  keyboardType?: KeyboardTypeOptions
  control: Control<EditProfileFormData>
  name: 'email' | 'fullName'
  rules?: RegisterOptions
  isEditable?: boolean
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputContainer}>
            {icon && <Icon svgText={icon} size={20} style={styles.icon} />}
            <TextInput
              autoCapitalize="none"
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              style={styles.input}
              secureTextEntry={secure}
              keyboardType={keyboardType}
              clearTextOnFocus={Platform.OS === 'ios' && secure}
              editable={isEditable}
            />
          </View>
        </View>
      )}
    />
  )
}

export default Input

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  icon: {
    margin: 4,
  },
  inputContainer: {
    backgroundColor: Colors.backgroundDark,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 16,
  },
})
