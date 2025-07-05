import { getTheme } from '@/theme/hooks'

/**
 * @description 处理多皮肤头像
 */
const handleUerAvatar = (avatar: string) => {
  const isDefaultSkin = getTheme()?.skin == 'default';
  let newAvatar = avatar;
  if (avatar) {
    const gander = extractInfo(avatar).gender;
    const number = extractInfo(avatar).number;
    const baseUrl = avatar.match(/.*avatar/) || 'https://upload.po7.xyz/avatar';
    if (isDefaultSkin && !['male', 'female'].includes(gander)) {
      newAvatar = `${baseUrl[0]}/${gander == 'first_female' ? 'female' : 'male'}_${number}.jpg`
    }
    if (!isDefaultSkin && !['first_female', 'first_male'].includes(gander)) {
      newAvatar = `${baseUrl[0]}/${gander == 'female' ? 'first_female' : 'first_male'}_${number}.jpg`
    }
  }
  return newAvatar
}

/**
 * @description 处理多皮肤头像
 */
const extractInfo = (str: string) => {
  const regex = /avatar\/([a-z_]+)_(\d+)\.jpg/;
  const match = str.match(regex);
  if (match) {
    return {
      gender: match[1],
      number: match[2]
    };
  }
  return { gender: 'male', number: '1' };
}

export { handleUerAvatar }
