export enum CURRENCY {
  CNY = '¥',    // 人民币
  USD = '$',    // 美元
  EUR = '€',    // 欧元
  GBP = '£',    // 英镑
  JPY = '¥',    // 日元
  KRW = '₩',    // 韩元
  AUD = '$',    // 澳大利亚元
  CAD = '$',    // 加拿大元
  HKD = '$',    // 港币
  INR = '₹',    // 印度卢比
  RUB = '₽',    // 俄罗斯卢布
  ZAR = 'R',    // 南非兰特
  SGD = '$',    // 新加坡元
  MXN = '$',    // 墨西哥比索
  NZD = '$',    // 新西兰元
  TRY = '₺',    // 土耳其里拉
  SEK = 'kr',   // 瑞典克朗
  NOK = 'kr',   // 挪威克朗
  DKK = 'kr',   // 丹麦克朗
  BRL = 'R$',   // 巴西雷亚尔
  CHF = 'CHF',  // 瑞士法郎
  PHP = '₱',    // 菲律宾比索
  VND = '₫',    // 越南盾
}

export type CURRENCY_TYPE = keyof typeof CURRENCY;
