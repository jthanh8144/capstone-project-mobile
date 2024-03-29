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
import { AuthFormData } from '../../types'

function Input({
  label,
  icon,
  placeholder,
  secure,
  keyboardType,
  control,
  name,
  rules,
}: {
  label: string
  icon: string
  placeholder?: string
  secure?: boolean
  keyboardType?: KeyboardTypeOptions
  control: Control<AuthFormData>
  name: 'email' | 'password' | 'confirmPassword' | 'fullName'
  rules?: RegisterOptions
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
            <Icon
              svgText={icon}
              size={20}
              style={styles.icon}
              color={Colors.textDark}
            />
            <TextInput
              autoCapitalize="none"
              placeholder={placeholder}
              placeholderTextColor={Colors.gray}
              value={value}
              onChangeText={onChange}
              style={styles.input}
              secureTextEntry={secure}
              keyboardType={keyboardType}
              clearTextOnFocus={Platform.OS === 'ios' && secure}
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
    color: Colors.textDark,
  },
})
