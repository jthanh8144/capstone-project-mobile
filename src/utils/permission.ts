import { Alert } from 'react-native'
import { check, request, RESULTS, Permission } from 'react-native-permissions'

export async function checkPermission(permission: Permission) {
  const per = await check(permission)
  if (per !== RESULTS.GRANTED) {
    const result = await request(permission)
    if (result !== RESULTS.GRANTED) {
      Alert.alert('Request permission fail')
    }
  }
}
