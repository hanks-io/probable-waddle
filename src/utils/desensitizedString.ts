/**
 * @description:  加密字符串中间的字符，只留前后的位置
 * @param {string | number} text  加密字符串
 * @param {number} digit   前后截取的位置 默认值是2
 * @return {string}  返回加密后的字符串
 */
export const encryptionText = (text: string | number, digit: number = 2): string => {

  let newText = String(text)

  //   要截取的字符长度 >= 原字符串的长度  返回原字符串
  if (digit * 2 >= newText.length) return newText

  return `${newText.substring(0, digit)}**${newText.substring(newText.length - digit)}`

}
