// 数据校验
// 当前值是否为JSON字符串
export const isJSON = (str: string): boolean => {
	if (typeof str === 'string') {
		try {
			const obj = JSON.parse(str)
			return !!obj && typeof obj === 'object'
		} catch (e) {
			return false
		}
	}
	return false
}

// 是否为合法邮箱
export const isEmail = (email: string): boolean => {
	return /^[^\s@]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
}

export function isJSONStr(value: any): boolean {
	if (typeof value === 'string') {
		return isJSON(value)
	}
	return false
}

/**
 * @description: 去除字符串中非字母内容
 */
export function removeSpecialNum(str: string) {
  return str.replace(/[^a-zA-Z]/g, '');
}

/**
 * @description: 检查字符串是否为数字组成
 * @param str 
 */
export function checkNumByStr(str: string) {
  return /^\d+$/.test(str);
}



