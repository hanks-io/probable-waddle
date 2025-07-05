import { floor } from '@/utils'
import i18n from '@/i18n'
import { useRoute, useRouter } from 'vue-router'
import { type Time, formatToDateTime } from './date'
import { ForeverYearTime } from '@/enums/types/activity.type'
import { DeviceType } from '@/enums/common'
import { isEmail } from '@/utils/verify'
import Decimal from 'decimal.js'
import { parsePhoneNumber, getExample } from 'awesome-phonenumber'
import { useAppStore } from '@/store/app'
import { cpf as CPF, cnpj as CNPJ } from 'cpf-cnpj-validator'
import router from '@/router'
const { t } = i18n.global
/**
 * @description 服务器金额转换为前端显示金额
 * @param money 需要格式化金额
 * @param fixed 保留小数位
 * @param ratio 转换比例
 * @returns 格式化后金额数据
 */
export function moneyConvertToClient(money: number | string, fixed = 2, ratio = 100): number {
	let num = 0
	if (typeof money === 'string') {
		money = Number(money)
	}
	num = money / ratio
	let multiplier = Math.pow(10, fixed)
	num = Number((Math.round(num * multiplier) / multiplier).toFixed(fixed))
	return num
}

/**
 * @description 将客户端的金额转换成服务器金额
 * @param money 需要格式化的金额
 * @returns 格式化之后的金额
 */
export function moneyConvertToServer(money: number | string, ratio = 100): number {
	if (typeof money === 'string') money = Number(money)
	let newMoney = new Decimal(money)
	let result = newMoney.times(new Decimal(ratio))
	return Number(result)
}

/**
 * @description 将客户端的百分比转换成服务器百分比
 * @param ratio 百分比
 * @returns 转换后的百分比
 */
export function ratioConvertToServer(ratio: number | string): number {
	let num = 0
	if (typeof ratio === 'string') ratio = Number.parseInt(ratio)

	num = ratio * 100
	return floor(num, 2)
}

/**
 * @description 将服务器的百分比转换成客户端百分比
 * @param ratio 百分比
 * @returns 转换后的百分比
 */
export function ratioConvertToClient(ratio: number | string): number {
	let num = 0
	if (typeof ratio === 'string') ratio = Number.parseInt(ratio)

	num = ratio / 100
	return num
}

/**
 * @description 将百分比数据格式化为展示百分比
 * @param ratio 百分比
 * @param fixed 保留小数位
 * @returns 格式化后百分比数据
 */
export function formatRatioToShow(ratio: number | string, fixed = 2): string {
	if (typeof ratio === 'string') ratio = Number(ratio)
	const locale = useAppStore().locale ?? 'en-US'
	return new Intl.NumberFormat(locale, {
		style: 'decimal',
		minimumFractionDigits: fixed,
		maximumFractionDigits: fixed,
	}).format(ratio)
}

/**
 * @description 将百分比数据转换百分比后格式化为展示百分比
 * @param ratio 百分比
 * @param fixed 保留小数位
 * @returns 转换后的百分比数据
 */
export function convertRatioToShow(ratio: number | string, fixed = 2): string {
	return formatRatioToShow(ratioConvertToClient(ratio), fixed)
}

/**
 * @description 将金额数据格式化为展示金额
 * @param money 金额
 * @returns 格式化后金额数据
 */
export function formatMoneyToShow(money: number | string, fixed = 2): string {
	// 做个参数兼容处理，如果是字符串就直接返回
	if (typeof money === 'string') {
		return money
	}
	const locale = useAppStore().locale ?? 'en-US'
	return new Intl.NumberFormat(locale, {
		style: 'decimal',
		minimumFractionDigits: fixed,
		maximumFractionDigits: fixed,
	}).format(money)
}

/**
 * @description 将金额数据格式化为展示金额
 * @param money 金额 传入整数就返回整数的格式化  带小数就返回携带小数的格式化
 * @returns 格式化后金额数据
 */
export function formatMoneysToShow(money: number | string, fixed?: number): string {
	if (typeof money === 'string') {
		const parsed = Number(money)
		if (isNaN(parsed)) return money
		money = parsed
	}

	const locale = useAppStore().locale ?? 'en-US'
	const isInteger = Number.isInteger(money)

	let decimalPlaces: number

	if (isInteger) {
		decimalPlaces = 0
	} else if (typeof fixed === 'number') {
		money = Number(money.toFixed(fixed)) // 先固定小数再格式化
		decimalPlaces = fixed
	} else {
		money = Number(money.toFixed(2))
		decimalPlaces = 2
	}

	return new Intl.NumberFormat(locale, {
		style: 'decimal',
		minimumFractionDigits: decimalPlaces,
		maximumFractionDigits: decimalPlaces,
	}).format(money)
}

/**
 * @description 将金额数据转换比例后格式化为展示金额
 * @param money 金额
 * @return 格式化后金额数据
 */
export function convertMoneyToShow(money: number | string, fixed = 2): string {
	return formatMoneyToShow(moneyConvertToClient(money, fixed), fixed)
}

/**
 * @description 将展示金额解析为金额数据
 * @param money
 * @returns 解析后金额数据
 */
export function parseMoney(money: string): number {
	return Number(money.replace(/,/g, ''))
}

/**
 * @description 解析路由参数
 * @returns 解析后的路由参数
 */
export function parseRouteParams(): any {
	const route = useRoute()
	let data = null
	try {
		data = JSON.parse(route.query.data as string)
	} catch (error) {
		console.error(error)
	}
	return data
}

/**
 * @description 判断活动时间是否为永久
 */
export function isActivityForever(time: Time): boolean {
	return formatToDateTime(time, 'YYYY') === ForeverYearTime.toString()
}

/**
 * @description 获取固定范围内的随机值
 */
export function getRandomValue(min: number, max: number): number {
	if (min === max) {
		return min // 返回最小值或最大值，因为范围内只有一个值
	} else {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}
}

/**
 * @description 获取当前运行的设备类型
 */
export function detectPlatform(): DeviceType {
	const userAgent = navigator.userAgent.toLowerCase()
	if (/iphone|ipad|ipod/.test(userAgent)) {
		return DeviceType.IOS
	} else if (/android/.test(userAgent)) {
		return DeviceType.Android
	} else {
		return DeviceType.PC
	}
}

/**
 * @description 获取当前游戏类型名称
 */
export function getGameTypeName(gameType: string): string {
	const gameTypeMap: { [key: string]: string } = {
		'ELECTRONIC': `${t('sort.ELECTRONIC')}`,
		'VIDEO': `${t('sort.VIDEO')}`,
		'SPORTS': `${t('sort.SPORTS')}`,
		'LOTTERY': `${t('sort.LOTTERY')}`,
		'CHESS': `${t('sort.CHESS')}`,
		'FISHING': `${t('sort.FISHING')}`,
	}
	return gameTypeMap[gameType] || ''
}

/**
 * @description 手机号特殊校验规则
 * @param phone 手机号
 * @param countryCode 国家代码
 * @returns 是否合法
 */
function phoneSpecialRule(phone: string, countryCode: string): boolean {
	const validatorMap = new Map<string, (phone: string) => boolean>([
		// 巴西的手机号需要保证第三位数为9且首位不能为0
		[
			'BR',
			(phone: string) => {
				const phoneReg = /^[1-9]\d9\d{8}$/
				return phoneReg.test(phone)
			},
		],
	])
	const validator = validatorMap.get(countryCode)
	return validator ? validator(phone) : true
}

/**
 * @description 验证手机号
 */
export function validatePhone(phone: string, countryCode: string = 'BR'): boolean {
	// 判断输入是否只包含数字
	if (!/^\d+$/.test(phone)) return false
	// 手机号特殊校验规则
	if (!phoneSpecialRule(phone, countryCode)) return false
	try {
		const pn = parsePhoneNumber(phone, { regionCode: countryCode })
		return !!pn.typeIsMobile
	} catch (error) {
		console.warn('invalid phone number: ', phone)
		return false
	}
}

/**
 * @description 获取当前语言的手机号长度
 */
export function getPhoneLength(countryCode: string): number {
	// 获取指定国家的示例手机号码
	const exampleNumber = getExample(countryCode, 'mobile')
	if (exampleNumber) {
		const nationalNumber = exampleNumber?.number?.significant
		return nationalNumber ? nationalNumber.toString().length : 0
	}
	return 0
}

/**
 * @description 验证会员账号是否合法
 * @param account 会员账号
 * @returns 是否合法
 */
export function validateAccount(account: string): boolean {
	const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z][a-zA-Z0-9]{7,15}$/
	return regex.test(account)
}

/**
 * @description 验证会员ID是否有效
 */
export function validateUserId(id: number): boolean {
	const regex = /^\d{6,11}$/
	return regex.test(id.toString())
}

/**
 * 检测邮箱是否合法 邮箱长度不超过36位
 * @param email
 * @returns
 */
export function validateEmail(email: string) {
	return email.length <= 36 && isEmail(email)
}

/**
 * 检测邮箱是否合法 安全中心-不限制长度
 * @param email
 * @returns
 */
export function securityValidateEmail(email: string) {
	const emailRegex = /^[^\s@]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/
	return emailRegex.test(email)
}

/**
 * 检测CPF是否合法 长度为11位的数字
 * @param cpf
 * @returns
 */
export function validateCpf(cpf: string) {
	const reg = /^\d{11}$/
	return reg.test(cpf)
}

/**
 * 检测CNPJ是否合法 长度为14位的数字
 * @param cnpj
 * @returns
 */
export function validateCnpj(cnpj: string) {
	const reg = /^\d{14}$/
	return reg.test(cnpj)
}
/**
 * 检测银行卡是否符合规则， 1. 限制长度：4-19 2. 输入限制只能输入英文和数字；
 * @param bankCode
 * @returns
 */
export function validateBankCode(bankCode: string) {
	const reg = /^\d{1,64}$/
	return reg.test(bankCode)
}

/**
 * 检测越南地区银行卡是否符合规则， 1. 限制长度：4-19 2. 输入限制只能输入英文和数字；
 * @param bankCode
 * @returns
 */
export function validateBankCodeVN(bankCode: string) {
	const reg = /^[a-zA-Z0-9]{4,19}$/
	return reg.test(bankCode)
}

/**
 * 检测EVP是否合法 Chave Pix 格式随机字符串固定36位字符
 * @param evp
 * @returns
 */
export function validateEvp(evp: string): boolean {
	const reg = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
	return reg.test(evp) && evp.length === 36
}

/**
 * @description 登录/注册密码校验
 */
export function validatePassword(password: string): boolean {
	return password.length >= 6 && password.length <= 16 && !/\s/.test(password)
}

/**
 * @description 获取指定语言的语言名称
 * @param language 语言标记
 * @param showLanguage 显示的语言
 */
export function getLanguageName(language: string, showLanguage: string): string {
	const lang = showLanguage.split('-')[0]
	const languageNames = new Intl.DisplayNames([lang], { type: 'language' })
	return languageNames.of(language) ?? 'Unknown'
}

/**
 * @description 获取指定语言的国家名称
 * @param country 国家标记
 * @param showLanguage 显示的语言
 */
export function getCountryName(country: string, showLanguage: string): string {
	const lang = showLanguage.split('-')[0]
	const regionNames = new Intl.DisplayNames([lang], { type: 'region' })
	return regionNames.of(country) ?? 'Unknown'
}

/**
 * @description 判断是电脑还是手机设置
 */
export const isMobileDevice = () => {
	return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * @description 判断是安卓还是ios
 */
export const getMobileOperatingSystem = () => {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera

	// 检测 iOS
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return 'iOS'
	}

	// 检测 Android
	if (/android/i.test(userAgent)) {
		return 'Android'
	}

	return 'unknown'
}

/**
 * 检测IFSC是否合法， 由字母和数字组成 长度为11位的数字， 前四位必须是大写字母， 第五个字符，必须是数字0， 6-11 必须是小写字母和数组
 * @param cpf
 * @returns
 */
export function validateIFSC(cpf: string) {
	const reg = /^[A-Z]{4}0[a-z0-9]{6}$/
	return reg.test(cpf)
}

/**
 * 检测真实姓名是否合法
 * @param realName
 * @returns
 */
export function validateRealName(realName: string) {
	// 去除首尾空白字符
	const trimmedName = realName.trim()

	// 空姓名检查
	if (!trimmedName) {
		return false
	}

	// 定义正则表达式：
	// - 允许字母（包括多语言字母，如中文、韩文、日文等）
	// - 允许空格（支持多词姓名，如 "John Smith"）
	// - 禁止数字、标点符号和表情符号
	const nameRegex = /^[\p{L}\p{M}\s]*$/u
	if (!nameRegex.test(trimmedName)) {
		return false
	}

	// 额外检查：确保不包含表情符号（使用 Unicode 范围）
	const emojiRegex =
		/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}]/u
	if (emojiRegex.test(trimmedName)) {
		return false
	}

	// 长度检查（可根据需求调整）
	if (trimmedName.length < 2) {
		return false
	}
	if (trimmedName.length > 50) {
		return false
	}
	return true
}

export type TemplateType = 'style_0' | 'style_1' | 'null' | ''
export const getTemplateType = (id: TemplateType) => (id === 'null' || id === '' ? 'style_0' : id)
export const getCustomerActivityId = (template?: string | undefined) => {
	const { id: activityId } = router.currentRoute.value.params
	const activityType = router.currentRoute.value.path.split('/')[2]
	if (!activityId)
		return {
			id: 0,
			defStyle: 'style_0',
		}
	const [id, styleType] = activityId?.split('@')
	// 如果template存在（固定模版固定皮肤），
	// 则优先使用template，否则使用styleType，否则使用style_0
	const defStyle = template || getTemplateType(styleType) || 'style_0'
	return {
		id: Number(id),
		defStyle,
		activityType,
	}
}
/**
 * @description 过滤掉API参数中的空值
 * @param params API参数
 */
export function filterNullParams<T extends Record<string, any>>(params: T): Partial<T> {
	const result: Partial<T> = {}
	for (const key in params) {
		const value = params[key]
		if (value !== null && value !== undefined && value !== '') result[key] = value
	}
	return result
}
// 判断是否是不顶层窗口
export const isUnTopWindow = () => window.location.search.includes('unTopWindow')

export const cpfValidator = (cpf: string) => CPF.isValid(cpf)

export const cnpjValidator = (cpf: string) => CNPJ.isValid(cpf)

export const truncateText = (text: string, maxLength = 128) => {
	if (text.length > maxLength) {
		return text.slice(0, maxLength)
	}
	return text
}

/**
 * @description 隐藏银行卡号中间部分
 * @param number 银行卡号
 * @param visibleDigits 显示的位数
 * @param maskChar 掩码字符
 * @returns 隐藏后的银行卡号
 */
export const maskModelNumber = (number: string, visibleDigits = 4, maskChar = '*') => {
	const str = String(number)
	return str.length <= visibleDigits ? str : maskChar.repeat(str.length - visibleDigits) + str.slice(-visibleDigits)
}

interface MaskMiddleConfig {
	visibleDigits: number // 首尾可见数字数量
	maskChar: string // 掩码字符
	fixedMaskCharacterLength?: number // 可选，掩码字符长度，默认根据字符串调整
}

export const maskMiddle = (
	value: string | number,
	config: MaskMiddleConfig = { visibleDigits: 2, maskChar: '*', fixedMaskCharacterLength: 4 },
) => {
	// 将输入转换为字符串
	const str = value.toString()
	const { visibleDigits, maskChar, fixedMaskCharacterLength } = config
	// 输入验证
	if (!str || str.length <= 2 * visibleDigits) return str

	// 保留首尾，中间用 * 替换
	const start = str.slice(0, visibleDigits)
	const end = str.slice(-visibleDigits)
	const maskCharLength = fixedMaskCharacterLength || str.length - 2 * visibleDigits
	const maskedMiddle = maskChar.repeat(maskCharLength)

	return `${start}${maskedMiddle}${end}`
}
