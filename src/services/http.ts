import { axiosPublic, axiosPrivate } from './axios'
import { ApiResponse, LoginSuccess, ProfileResponse } from '../models/response'

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
