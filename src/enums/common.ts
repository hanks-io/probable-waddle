
/**
 * @description 设备类型
 */
export enum DeviceType {
  /** 未知 */
  Unknown = 0,
  /** PC */
  PC = 1,
  /** 安卓 */
  Android = 2,
  /** IOS */
  IOS = 3,
}
// 体育游戏平台
export const sportsType = ['M8SPORTS', 'basha', 'Betby']

/**
 * @description 操作类型
 */
export enum OperationType {
  /**登录 */
  Login = 1,
  /**注册 */
  Register = 2,
}

/**
 * @description 登录类型
 */
export enum LoginType {
  /**账号密码登录 */
  Account = "Account",
  /**手机验证码登录 */
  Phone = "Phone"
}



export enum TabbarEnum {
  INITIO = "inicio",
  PROMO = "promo",
  ENTRAR = "entrar",
  SUPPORT = "suporte",
  WITHDRAW = "withdraw",
  PERFIL = "perfil",
  INVITE = "agency",
}

/**
 * @description 账户状态
 */
export enum AccountStatus {
  /** 正常 */
  NORMAL = 1,
  /** 掉线 */
  OFFLINE = 2,
  /** 冻结 */
  FROZEN = 3,
}
