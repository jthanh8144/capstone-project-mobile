import { DataSource } from 'typeorm'
import { LocalMessage } from './local-message.entity'

const dataSource = new DataSource({
  type: 'react-native',
  database: 'local',
  location: 'default',
  entities: [LocalMessage],
  synchronize: true,
  // logging: ['error', 'query', 'schema'],
  logging: false,
})

export default dataSource

export async function initializeDbConnection() {
  try {
    await dataSource.initialize()
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
