import CryptoJS from 'crypto-js'

/**
 * @description 前端加密
 * @param data 需要加密的数据
 * @param secretKey 密钥
 * @param iv 偏移量
 * @returns 加密后的数据
 */
export function encryptFrontend(data: string, secretKey: string, iv: string): string {
  try {
    const key = CryptoJS.enc.Hex.parse(secretKey)
    const ivParams = CryptoJS.enc.Hex.parse(iv)
    
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: ivParams,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    
    // 转换为 hex 格式
    return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Base64.parse(encrypted.toString()))
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Encryption failed')
  }
}
