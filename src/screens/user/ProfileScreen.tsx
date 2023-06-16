import React, { useContext, useState } from 'react'
import { Pressable, StyleSheet, Text, View, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Dialog from 'react-native-dialog'
import {
  ALERT_TYPE,
  Dialog as DialogNotification,
} from 'react-native-alert-notification'
import FastImage from 'react-native-fast-image'

import {
  KEY,
  LOCK,
  LOGOUT,
  PAPER,
  PENCIL,
  QUESTION,
  WORLD,
} from '../../constants/icons'
import ProfileAction from '../../components/user/ProfileAction'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import TextButton from '../../components/ui/TextButton'
import Icon from '../../components/ui/Icon'
import { images } from '../../assets/images'
import { Colors } from '../../constants/colors'
import { AuthContext } from '../../store/auth-context'
import { AppContext } from '../../store/app-context'
import ErrorOverlay from '../../components/ui/ErrorOverlay'
import { ProfileStackPropHook } from '../../types'
import { removeUser } from '../../services/http'
import { environments } from '../../configs/environment'
import { joinURL } from '../../utils'

function ProfileScreen() {
  const { logout } = useContext(AuthContext)
  const { user } = useContext(AppContext)

  const { navigate } = useNavigation<ProfileStackPropHook>()

  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [removeConfirm, setRemoveConfirm] = useState(false)
  const [password, setPassword] = useState('')

  const removeUserHandler = async () => {
    try {
      const { success, message } = await removeUser(password)
      if (success) {
        await logout(true)
        setRemoveConfirm(false)
        DialogNotification.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Removed user success!',
          button: 'close',
        })
      } else {
        DialogNotification.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: message,
          button: 'close',
        })
      }
    } catch (err) {
      DialogNotification.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Something is error!',
        button: 'close',
      })
    }
  }

  if (!user) {
    return (
      <ErrorOverlay message="Something is error! Please try again later." />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <FastImage
          source={
            user?.avatarUrl ? { uri: user.avatarUrl } : images.avatarPlaceholder
          }
          style={[styles.avatar, styles.avatarBorder]}
        />
        <View style={styles.textWrapper}>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <Pressable
          onPress={() => {
            navigate('EditProfile')
          }}
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressed,
          ]}>
          <Icon svgText={PENCIL} size={24} color={Colors.primary} />
        </Pressable>
      </View>
      <View style={styles.actionContainer}>
        <ProfileAction
          icon={KEY}
          label="Change password"
          onPress={() => {
            navigate('ChangePassword')
          }}
        />
        <ProfileAction icon={WORLD} label="App Language" />
        <ProfileAction
          icon={LOCK}
          label="Privacy policy"
          onPress={() => {
            navigate('WebView', {
              url: joinURL(environments.apiUrl, 'privacy-policy.html'),
              title: 'Privacy policy',
            })
          }}
        />
        <ProfileAction
          icon={PAPER}
          label="Terms & conditions"
          onPress={() => {
            navigate('WebView', {
              url: joinURL(environments.apiUrl, 'terms-and-conditions.html'),
              title: 'Terms & conditions',
            })
          }}
        />
        <ProfileAction
          icon={QUESTION}
          label="Help"
          onPress={() => {
            navigate('WebView', {
              url: joinURL(environments.apiUrl, 'help.html'),
              title: 'Help',
            })
          }}
        />
      </View>
      <ProfileAction
        icon={LOGOUT}
        label="Log Out"
        isShowArrow={false}
        onPress={() => {
          setLogoutConfirm(true)
        }}
      />
      <View style={styles.removeAccount}>
        <TextButton
          onPress={() => {
            setRemoveConfirm(true)
          }}
          color={Colors.red}
          fontSize={16}
          fontWeight="400">
          Remove this account
        </TextButton>
      </View>
      <>
        <ConfirmDialog
          isShown={logoutConfirm}
          setIsShown={setLogoutConfirm}
          title="Are you sure"
          message="Do you want to logout this account?"
          onCancel={() => {
            setLogoutConfirm(false)
          }}
          onConfirm={logout}
        />
        <Dialog.Container visible={removeConfirm}>
          <Dialog.Title>Account delete</Dialog.Title>
          <Dialog.Description>
            Do you want to delete this account? You cannot undo this action.
            Please enter your password to confirm it!
          </Dialog.Description>
          <Dialog.Input
            secureTextEntry={true}
            clearTextOnFocus={Platform.OS === 'ios'}
            onChangeText={s => {
              setPassword(s)
            }}
            value={password}
          />
          <Dialog.Button
            color={Colors.gray}
            label="Cancel"
            onPress={() => {
              setRemoveConfirm(false)
            }}
          />
          <Dialog.Button
            color={Colors.red}
            label="Delete"
            onPress={removeUserHandler}
          />
        </Dialog.Container>
      </>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    backgroundColor: Colors.background,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  avatarBorder: {
    borderColor: '#333',
    borderWidth: 1,
  },
  textWrapper: {
    flex: 1,
  },
  name: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: Colors.textDark,
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  actionContainer: {
    marginBottom: 10,
  },
  logoutContainer: {},
  removeAccount: {
    alignItems: 'center',
    marginTop: 10,
  },
})
