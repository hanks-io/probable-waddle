import { getTheme } from '@/theme/hooks'
export default (successList: string[], failList: string[]) => {
  const { theme, newSkin } = getTheme()
  const themeColorMap = {
    success: {
      'amber-purple': 'var(--accent-color-green-1)',
      active: 'var(--color-success)',
      'new-skin-symbol': 'var(--ep-color-text-success)'
    },
    fail: {
      active: 'var(--color-danger)',
      'new-skin-symbol': 'var(--ep-color-text-danger)'
    },
    warning: {
      active: 'var(--color-warning)',
      'new-skin-symbol': 'var(--ep-color-text-warning)'
    }

  }
  type StatusType = keyof typeof themeColorMap
  const getCurrentStatusColor = (status: StatusType) => {
    const statusMap = themeColorMap[status]
    if (newSkin && statusMap['new-skin-symbol']) return statusMap['new-skin-symbol']
    if (theme in statusMap) return statusMap[theme as keyof typeof statusMap]
    return statusMap.active
  }

  return (status: string) => {
    if (successList.includes(status)) return getCurrentStatusColor('success')
    if (failList.includes(status)) return getCurrentStatusColor('fail')
    return getCurrentStatusColor('warning')

  }

}
