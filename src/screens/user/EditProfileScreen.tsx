import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import Spinner from 'react-native-loading-spinner-overlay'
import { PERMISSIONS } from 'react-native-permissions'
import { openCamera, openPicker, Image } from 'react-native-image-crop-picker'
import FastImage from 'react-native-fast-image'
import Modal from 'react-native-modal'
import { Buffer } from 'buffer'

import { EditProfileFormData, EditProfileStackProp } from '../../types'
import ErrorOverlay from '../../components/ui/ErrorOverlay'
import TextButton from '../../components/ui/TextButton'
import IconButton from '../../components/ui/IconButton'
import Button from '../../components/ui/Button'
import Input from '../../components/user/Input'
import Icon from '../../components/ui/Icon'
import { Colors } from '../../constants/colors'
import { CAMERA, CHECK } from '../../constants/icons'
import { images } from '../../assets/images'
import { AppContext } from '../../store/app-context'
import {
  getPresignedUrl,
  updateUserProfile,
  uploadFileToPresignedUrl,
} from '../../services/http'
import { checkPermission } from '../../utils'
import { HttpStatusCode } from 'axios'

function EditProfileScreen({ navigation }: EditProfileStackProp) {
  const { user } = useContext(AppContext)

  const [isShowModal, setIsShowModel] = useState(false)
  const [isAvatarChange, setIsAvatarChange] = useState(false)
  const [avatar, setAvatar] = useState<any>(user?.avatarUrl)
  const [base64Value, setBase64Value] = useState<string>('')

  const queryClient = useQueryClient()

  const editAvatarHandler = async () => {
    await checkPermission(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
    await checkPermission(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    )
    await checkPermission(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    )
    setIsShowModel(true)
  }

  const handleResponse = (response: Image) => {
    setIsShowModel(false)
    setAvatar(response.path)
    setBase64Value(response.data)
    setIsAvatarChange(true)
  }

  const showCameraHandler = async () => {
    try {
      const response = await openCamera({
        cropping: true,
        width: 500,
        height: 500,
        mediaType: 'photo',
        includeBase64: true,
      })
      handleResponse(response)
    } catch (err) {}
  }

  const chooseInPhotoHandler = async () => {
    try {
      const response = await openPicker({
        cropping: true,
        width: 500,
        height: 500,
        mediaType: 'photo',
        includeBase64: true,
      })
      handleResponse(response)
    } catch (err) {}
  }

  const { control, handleSubmit, getValues } = useForm<EditProfileFormData>({
    defaultValues: { email: user?.email, fullName: user?.fullName || '' },
  })

  const saveData = async ({ fullName }: EditProfileFormData) => {
    try {
      const data: { fullName?: string; avatarUrl?: string } = { fullName }
      if (isAvatarChange) {
        const { presignedUrl, url } = await getPresignedUrl('png', 'avatar')
        const status = await uploadFileToPresignedUrl(
          presignedUrl,
          Buffer.from(base64Value, 'base64'),
        )
        if (status === HttpStatusCode.Ok) {
          data.avatarUrl = url
        } else {
          throw new Error('Put file error')
        }
      }
      const { message } = await updateUserProfile(data)
      return message
    } catch (err) {
      throw err
    }
  }

  const { mutateAsync, isLoading } = useMutation(saveData, {
    onSuccess: async message => {
      await queryClient.invalidateQueries(['profile'])
      if (Platform.OS === 'ios') {
        navigation.goBack()
      } else {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: message,
          button: 'close',
        })
      }
    },
    onError: (err: any) => {
      if (Platform.OS === 'ios') {
        navigation.goBack()
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody:
            err?.response?.data?.message ||
            'Something is error! Please try again later.',
          button: 'close',
        })
      }
    },
  })

  const saveHandler = useCallback(async () => {
    if ((user && user.fullName !== getValues('fullName')) || isAvatarChange) {
      await handleSubmit(async (data: EditProfileFormData) => {
        await mutateAsync(data)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAvatarChange])

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <IconButton
          svgText={CHECK}
          color={Colors.primary}
          onPress={saveHandler}
        />
      ),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAvatarChange])

  if (!user) {
    return (
      <ErrorOverlay message="Something is error! Please try again later." />
    )
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.wrapper}>
            <View style={styles.imageContainer}>
              <FastImage
                source={avatar ? { uri: avatar } : images.avatarPlaceholder}
                style={styles.image}
              />
              <Pressable
                onPress={editAvatarHandler}
                style={({ pressed }) => [
                  styles.editAvatarBtn,
                  pressed && styles.pressed,
                ]}>
                <Icon svgText={CAMERA} size={20} color={Colors.primary} />
              </Pressable>
            </View>
          </View>
          <Input
            control={control}
            label="Email"
            name="email"
            isEditable={false}
          />
          <Input
            control={control}
            label="Full name"
            name="fullName"
            rules={{
              required: true,
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <Modal isVisible={isShowModal}>
        <View>
          <Button onPress={showCameraHandler}>Take a photo</Button>
          <Button onPress={chooseInPhotoHandler}>Choose in library</Button>
          <View style={styles.cancelWrapper}>
            <TextButton
              color={Colors.primary}
              onPress={() => {
                setIsShowModel(false)
              }}>
              Cancel
            </TextButton>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default EditProfileScreen

const imageSize = 120

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: Colors.background,
  },
  wrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    width: imageSize,
    height: imageSize,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    borderColor: '#333',
    borderWidth: 1,
    position: 'relative',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
    borderRadius: 100,
    backgroundColor: Colors.backgroundDark,
  },
  cancelWrapper: {
    alignItems: 'center',
    marginTop: 15,
  },
})
