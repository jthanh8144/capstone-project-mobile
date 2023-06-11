import { Appearance } from 'react-native'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)
dayjs.locale('vi')

export const isDarkMode = Appearance.getColorScheme() === 'dark'

export const joinURL = (host: string, path: string) => {
  return host[host.length - 1] === '/' ? `${host}${path}` : `${host}/${path}`
}

export const showDate = (d: Date) => {
  let result = ''
  const date = dayjs(d)
  const now = dayjs()
  const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  if (date.isToday()) {
    result = `${date.get('hour')}:${date.get('minute')}`
  } else if (date >= now.subtract(7, 'days')) {
    result = `${dayNames[date.get('day')]} ${date.get('hour')}:${date.get(
      'minute',
    )}`
  } else {
    result = `${monthNames[date.get('month')]} ${date.get('date')}`
  }
  return result
}
