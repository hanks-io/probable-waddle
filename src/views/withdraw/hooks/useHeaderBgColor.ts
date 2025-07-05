import { getTheme } from '@/theme/hooks'
export default () => {
  const { theme } = getTheme()
  switch (theme) {
    case 'green-dark':
    case 'yellow-dark':
      return ''
    case 'blue-default':
      return '--color-bg-200'
    case 'amber-purple':
      return '--color-bg-200'
    default:
      return ''
  }
}
