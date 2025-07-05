export enum ERROR_CODE {
    /** 账号被冻结*/
    LOGIN_FREEZE = 1001,
    /** 账号被拉黑 */
    LOGIN_BLACKLIST = 1002,
    /** token失效 */
    TOKEN_INVALID = 1003,
    /** CPF格式不正确 */
    CPF_INVALID = 10133,
		/** 真实姓名不正确 */
    REAL_NAME_INVALID = 10134,
		/** 生日不正确 */
    BIRTHDAY_INVALID = 10135,
		/** 有未解锁的优惠 */
		HAS_UNLOCK_BONUS = 10136,
}
