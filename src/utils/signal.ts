import {
  KeyHelper,
  KeyPairType,
} from '@privacyresearch/libsignal-protocol-typescript'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { SignalProtocolStore } from './../store/signal'
import { arrayBufferToString, base64ToArrayBuffer } from './helpers'
import { postSignalKey } from '../services/http'

export type AsyncStorageDataType = {
  registrationId: number
  identityKeyPair: {
    pubKey: string
    privKey: string
  }
  preKey: {
    keyId: number
    keyPair: {
      pubKey: string
      privKey: string
    }
  }
  signedPreKey: {
    keyId: number
    keyPair: {
      pubKey: string
      privKey: string
    }
    signature: string
  }
}

export async function generateSignalKey(
  userId: string,
  store: SignalProtocolStore,
) {
  try {
    const registrationId = KeyHelper.generateRegistrationId()
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair()

    const [preKey, signedPreKey] = await Promise.all([
      KeyHelper.generatePreKey(registrationId),
      KeyHelper.generateSignedPreKey(identityKeyPair, registrationId),
    ])
    const localStorageSavedData: AsyncStorageDataType = {
      registrationId,
      identityKeyPair: {
        pubKey: arrayBufferToString(identityKeyPair.pubKey),
        privKey: arrayBufferToString(identityKeyPair.privKey),
      },
      preKey: {
        keyId: preKey.keyId,
        keyPair: {
          pubKey: arrayBufferToString(preKey.keyPair.pubKey),
          privKey: arrayBufferToString(preKey.keyPair.privKey),
        },
      },
      signedPreKey: {
        keyId: signedPreKey.keyId,
        keyPair: {
          pubKey: arrayBufferToString(signedPreKey.keyPair.pubKey),
          privKey: arrayBufferToString(signedPreKey.keyPair.privKey),
        },
        signature: arrayBufferToString(signedPreKey.signature),
      },
    }
    await Promise.all([
      store.put('registrationId', registrationId),
      store.put('identityKey', identityKeyPair),
      store.storePreKey(registrationId, preKey.keyPair),
      store.storeSignedPreKey(registrationId, signedPreKey.keyPair),
      AsyncStorage.setItem(userId, JSON.stringify(localStorageSavedData)),
    ])
    await postSignalKey({
      registrationId,
      ikPublicKey: localStorageSavedData.identityKeyPair.pubKey,
      spkKeyId: signedPreKey.keyId,
      spkPublicKey: localStorageSavedData.signedPreKey.keyPair.pubKey,
      spkSignature: localStorageSavedData.signedPreKey.signature,
      pkKeyId: preKey.keyId,
      pkPublicKey: localStorageSavedData.preKey.keyPair.pubKey,
    })
  } catch (err) {
    console.log(err)
  }
}

export async function getFromLocalStorage(
  userId: string,
  store: SignalProtocolStore,
) {
  try {
    const savedData = (await AsyncStorage.getItem(userId)) || '{}'
    const {
      preKey,
      signedPreKey,
      registrationId,
      identityKeyPair,
    }: AsyncStorageDataType = JSON.parse(savedData)
    const realIdentityKey: KeyPairType = {
      pubKey: base64ToArrayBuffer(identityKeyPair.pubKey),
      privKey: base64ToArrayBuffer(identityKeyPair.privKey),
    }
    const realPreKey: KeyPairType = {
      pubKey: base64ToArrayBuffer(preKey.keyPair.pubKey),
      privKey: base64ToArrayBuffer(preKey.keyPair.privKey),
    }
    const realSignedPreKey: KeyPairType = {
      pubKey: base64ToArrayBuffer(signedPreKey.keyPair.pubKey),
      privKey: base64ToArrayBuffer(signedPreKey.keyPair.privKey),
    }
    await Promise.all([
      store.put('registrationId', registrationId),
      store.put('identityKey', realIdentityKey),
      store.storePreKey(registrationId, realPreKey),
      store.storeSignedPreKey(registrationId, realSignedPreKey),
    ])
  } catch (err) {
    console.log(err)
  }
}
