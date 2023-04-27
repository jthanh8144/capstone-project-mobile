import { axiosPublic, axiosPrivate } from './axios'
import {
  ApiResponse,
  FriendRequestResponse,
  FriendsListResponse,
  LoginSuccess,
  PresignedUrlResponse,
  ProfileResponse,
} from '../models/response'

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
    const res = await axiosPublic.put(presignedUrl, data)
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

export async function getReceivedFriendRequests() {
  try {
    const res = await axiosPrivate.get<FriendRequestResponse>(
      '/friend-requests/received',
    )
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getSendedFriendRequests() {
  try {
    const res = await axiosPrivate.get<FriendRequestResponse>(
      '/friend-requests/sended',
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
    const res = await axiosPrivate.post<ApiResponse>(`/friend-requests`, {
      receiverId,
    })
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getFriendsList() {
  try {
    const res = await axiosPrivate.get<FriendsListResponse>(`/users/friends`)
    return res.data
  } catch (err) {
    throw err
  }
}
