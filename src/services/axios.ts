import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { RefreshTokenSuccess } from './../models/response'
import { environments } from '../configs/environment'

export const axiosPublic = axios.create({
  baseURL: environments.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const axiosPrivate = axios.create({
  baseURL: environments.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosPrivate.interceptors.request.use(async config => {
  const accessToken = await AsyncStorage.getItem('accessToken')
  config.headers.Authorization = `Bearer ${accessToken}`
  config.withCredentials = true
  return config
})

axiosPrivate.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = await AsyncStorage.getItem('refreshToken')
      const response = await axiosPublic.post<RefreshTokenSuccess>(
        '/auth/refresh-token',
        {
          refreshToken,
        },
      )

      if (response.status === 200) {
        const { accessToken } = response.data
        await AsyncStorage.setItem('accessToken', accessToken)
        axiosPrivate.defaults.headers.common.Authorization = `Bearer ${accessToken}`

        return axiosPrivate(originalRequest)
      }
    }

    return Promise.reject(error)
  },
)
