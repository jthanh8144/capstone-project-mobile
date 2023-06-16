import {
  ConservationSettingResponse,
  ConservationWithUser,
  NewConservationResponse,
  SearchUserResponse,
  SendMessageResponse,
} from './../models/response'
import axios from 'axios'
import { axiosPublic, axiosPrivate } from './axios'
import {
  ApiResponse,
  ConservationsResponse,
  DetailConservationResponse,
  FriendRequestResponse,
  FriendsListResponse,
  GetDeviceId,
  LoginSuccess,
  PresignedUrlResponse,
  ProfileResponse,
} from '../models/response'
import { MessageTypeEnum } from '../types'

export async function login(email: string, password: string) {
  try {
    const res = await axiosPublic.post<LoginSuccess>('/auth/login', {
      email,
      password,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function logoutUser(refreshToken: string) {
  try {
    const res = await axiosPrivate.post<ApiResponse>('/auth/logout', {
      refreshToken,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function registerUser(
  email: string,
  password: string,
  fullName?: string,
) {
  try {
    const res = await axiosPublic.post<ApiResponse>('/auth/register', {
      email,
      password,
      fullName,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getUserProfile() {
  try {
    const res = await axiosPrivate.get<ProfileResponse>('/users/profile')
    return res.data
  } catch (err) {
    throw err
  }
}

export async function updateUserProfile(data: {
  fullName?: string
  avatarUrl?: string
}) {
  try {
    const res = await axiosPrivate.put<ApiResponse>('/users/profile', {
      ...data,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getPresignedUrl(type: string, folder: string) {
  try {
    const res = await axiosPrivate.get<PresignedUrlResponse>(
      `/presigned-url?type=${type}&folder=${folder}`,
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function uploadFileToPresignedUrl(
  presignedUrl: string,
  data: any,
) {
  try {
    const res = await axios.put(presignedUrl, data, {
      headers: {
        'Content-Type': 'image/png',
      },
    })
    return res.status
  } catch (err) {
    throw err
  }
}

export async function updatePassword(oldPassword: string, newPassword: string) {
  try {
    const res = await axiosPrivate.put<ApiResponse>('/users/password', {
      oldPassword,
      newPassword,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function removeUser(password: string) {
  try {
    const res = await axiosPrivate.put<ApiResponse>('/users', {
      password,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getReceivedFriendRequests(page?: number) {
  try {
    const res = await axiosPrivate.get<FriendRequestResponse>(
      '/friend-requests/received',
      { params: { page } },
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getSendedFriendRequests(page?: number) {
  try {
    const res = await axiosPrivate.get<FriendRequestResponse>(
      '/friend-requests/sended',
      { params: { page } },
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function updateReceivedFriendRequest(id: string, status: string) {
  try {
    const res = await axiosPrivate.put<ApiResponse>('/friend-requests', {
      id,
      status,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function removeSendedFriendRequest(id: string) {
  try {
    const res = await axiosPrivate.delete<ApiResponse>(`/friend-requests/${id}`)
    return res.data
  } catch (err) {
    throw err
  }
}

export async function sendFriendRequest(receiverId: string) {
  try {
    const res = await axiosPrivate.post<ApiResponse>('/friend-requests', {
      receiverId,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getFriendsList(page?: number, name?: string) {
  try {
    const res = await axiosPrivate.get<FriendsListResponse>('/users/friends', {
      params: { page, name },
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getConservations(page?: number) {
  try {
    const res = await axiosPrivate.get<ConservationsResponse>(
      '/users/conservations',
      { params: { page } },
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getConservation(conservationId: string, page = 1) {
  try {
    const res = await axiosPrivate.get<DetailConservationResponse>(
      `/conservations/${conservationId}`,
      { params: { page } },
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function sendMessage(
  conservationId: string,
  message: string,
  messageType: MessageTypeEnum,
  encryptType: number,
) {
  try {
    const res = await axiosPrivate.post<SendMessageResponse>(
      `/conservations/${conservationId}`,
      {
        message,
        messageType,
        encryptType,
      },
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getDeviceId(uniqueId: string) {
  try {
    const res = await axiosPublic.get<GetDeviceId>('/devices', {
      params: { deviceId: uniqueId },
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function postSignalKey(data: {
  registrationId: number
  ikPublicKey: string
  spkKeyId: number
  spkPublicKey: string
  spkSignature: string
  pkKeyId: number
  pkPublicKey: string
}) {
  try {
    const res = await axiosPrivate.post<ApiResponse>('/users/signal', data)
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getConservationWith(partnerId: string) {
  try {
    const res = await axiosPrivate.get<ConservationWithUser>(
      `/users/conservations/${partnerId}`,
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function newConservation(data: {
  receiverId: string
  message: string
  messageType: MessageTypeEnum
  encryptType: number
}) {
  try {
    const res = await axiosPrivate.post<NewConservationResponse>(
      '/conservations',
      data,
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getConservationSetting(conservationId: string) {
  try {
    const res = await axiosPrivate.get<ConservationSettingResponse>(
      `/conservations/${conservationId}/settings`,
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function searchUser(q: string, page = 1) {
  try {
    const res = await axiosPrivate.get<SearchUserResponse>('/users', {
      params: { q, page },
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function updateConservationSetting(
  id: string,
  data: {
    isMuted?: boolean
    isRemoved?: boolean
    isArchived?: boolean
  },
) {
  try {
    const res = await axiosPrivate.put<ApiResponse>(
      `/conservations/settings/${id}`,
      data,
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function updateUserFcm(fcmToken: string) {
  try {
    const res = await axiosPrivate.put<ApiResponse>('/users/fcm', {
      fcmToken,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function unfriend(userId: string) {
  try {
    const res = await axiosPrivate.delete<ApiResponse>(
      `/users/unfriend/${userId}`,
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function requestResetPassword(email: string) {
  try {
    const res = await axiosPublic.post<ApiResponse>(
      '/auth/request-reset-password',
      { email },
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function resetPassword(email: string, code: string) {
  try {
    const res = await axiosPublic.post<ApiResponse>('/auth/reset-password', {
      email,
      code,
    })
    return res.data
  } catch (err) {
    throw err
  }
}
