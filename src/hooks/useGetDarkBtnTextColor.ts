import { getTheme } from '@/theme/hooks'

export default () => {
  return computed(() => {
    switch (getTheme().theme) {
      case 'yellow-dark':
      case 'blue-default':
      case 'amber-purple':
        return '--button-text-color: var(--color-text-40)'
      case 'auroral-yellow':
        return '--button-text-color: var(--text-color-white-100)'
      case 'purple-light':
        return '--button-text-color: var(--color-text-80)'
      default:
        return ''
    }

  })
}
