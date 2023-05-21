import AsyncStorage from '@react-native-async-storage/async-storage'
import { DataSource } from 'typeorm'
import { LocalMessage } from './local-message.entity'

const dataSource = new DataSource({
  type: 'react-native',
  database: 'local',
  location: 'default',
  entities: [LocalMessage],
  synchronize: false,
  // logging: ['error', 'query', 'schema'],
  logging: false,
})

export default dataSource

export async function initializeDbConnection() {
  try {
    await dataSource.initialize()
    const isDbInitialize = await AsyncStorage.getItem('isDbInitialize')
    if (!isDbInitialize) {
      await Promise.all([
        AsyncStorage.setItem('isDbInitialize', 'true'),
        dataSource.synchronize(),
      ])
    }
  } catch (err) {
    console.error('Connect database fail')
  }
}

export async function closeDbConnection() {
  try {
    await dataSource.destroy()
  } catch (err) {
    console.error('Close database connection fail')
  }
}
