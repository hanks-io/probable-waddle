/**
 * @description: pwa安装允许环境
 */
export const PwaAllowSd = [
  'iOSH5', 'AndroidH5', 'DesktopOS'
]

/**
 * @description: apk环境
 */
export const ApkSd = [
  'APK',
  'APKRelease'
]

/**
 * @description: pwa安装允许pc浏览器
 */
export const PwaAllowPcBrowser = [
  'Edge', 'Chrome'
]

/**
 * @description: 重定向地址
 */
export const RedirectUrl = window.location.protocol + '//' + window.location.host + '/launch'

/**
 * @description: 成功状态
 */
export const success = ['success', 'SUCCESS', 'PAID', 'HAVE_ARRIVED'];

/**
 * @description: 失败状态
 */
export const fail = ['refuse', 'confiscate', 'autoError', 'MANUALLY-END', 'TIMEOUT', 'CANCEL', 'LIMIT_EXCEEED'];
