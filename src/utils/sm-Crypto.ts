/**
 * 加密数据
 */
export const encryptData = <T>(data: T): string | null => {
  try {
    // 确保数据不为空
    if (!data) return null;

    // 转换数据为字符串
    const jsonStr = JSON.stringify(data);
    if (!jsonStr) return null;

    // Base64 编码
    const base64 = btoa(encodeURIComponent(jsonStr));
    // 反转字符串
    return base64.split('').reverse().join('');
  } catch (error) {
    console.error('Encrypt error:', error);
    return null;
  }
}
/**
 * 解密数据
 */
export const decryptData = (encryptedData: string | null): string | null => {
  // 检查输入参数是否为空
  if (!encryptedData || typeof encryptedData !== 'string') return null;

  try {
    // 反转字符串并进行 Base64 解码和 URL 解码
    const jsonStr = decodeURIComponent(atob(encryptedData.split('').reverse().join('')));
    // 解析 JSON
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Decrypt error:', error);
    return null;
  }

}
