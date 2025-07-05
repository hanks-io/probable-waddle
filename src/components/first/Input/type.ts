
/**
 * @description 输入框类型
 */
const InputType = [
  /**会员账号 */
  "account",
  /**密码 */
  "password",
  /**验证码 */
  "captcha",
  /**手机号 */
  "phone",
  /**邮箱 */
  "email",
  /**搜索 */
  "search",
  /**充值 */
  "recharge",
  /**提现 */
  "withdraw",
  /**CNPJ */
  "cnpj",
  /**CPF */
  "cpf",
  /**EVP */
  "evp",
  /**IFSC */
  "ifsc",
  /**银行卡 */
  "bankCard",
  /**文本 */
  "text",
  /**数字 */
  "number",
  /**真实姓名 */
  "realName",
  /**越南银行卡 */
  "bankCardVN"
] as const;

/**
 * @description 输入框类型
 */
export type TInput = typeof InputType[number];

/**
 * @description 输入框props
 */
export type TInputProps = {
  type?: TInput
  disabled?: boolean
  clear?: boolean
  extra?: number | string
  modelValue: string | number | undefined
  noBonus?: boolean
  hideCurrency?: boolean
  minAmount?: number
  maxAmount?: number
  readonly?: boolean
  onlyText?: boolean
  isDigit?: boolean
  bgColor?: string
  isModaL?: boolean
  errorHeight?: string
  countdown?: number
  verifySended?: boolean
  loading?: boolean
  isSecurity?: boolean
  verifyHandle?: () => void
  noTrim?: boolean
}
