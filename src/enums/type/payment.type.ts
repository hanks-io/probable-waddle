import { z } from 'zod'

/**
 * 钱包类型
 */
export const WalletMap = {
	'PAYBETWALLET': {
		authFields: ['REALNAME', 'CPF'],
		walletUserInfo: z.object({
			walletUserId: z.string().describe('钱包用户ID'),
		}),
	},
} as const satisfies Record<
	string,
	{
		authFields: object
		walletUserInfo: object
	}
>

/**
 * 钱包Code
 */
export type TWalletCode = keyof typeof WalletMap
export const WalletCodes = Object.keys(WalletMap) as [TWalletCode, ...TWalletCode[]]
export const ZWalletCode = z.enum(['all', ...WalletCodes])

/**
 *
 * 平台Code
 */
export const PaymentCodes = [
	...WalletCodes,
	/* epay */
	'EPAY',
	/* hkp */
	'HKPPAY',
	/* toppay */
	'TOPPAY',
	/** mockpay */
	'MOCKPAY',
	/** cbpay */
	'CBPAY',
	/** 汉比特 */
	'HBPAY',
	/**GLOBALPAY */
	'GLOBALPAY',
	/**TOPPAYNEW */
	'TOPPAYNEW',
	/**transafePayPayment */
	'TFPAY',
	/** win Pay 支付 */
	'WINPAY',
	/**GLOBALPAY NEW */
	'GLOBALPAYNEW',
	/**富盈国际 */
	'FYPAY',
	/**河马支付 */
	'HEMAPAY',
	/** betcatpay */
	'BETCATPAY',
	/** todaypay */
	'TODAYPAY',
	/** agpay */
	'AGPAY',
	/** mlpay */
	'MLPAY',
	/** 668pay */
	'668PAY',
	/** 55luck owenpay */
	'55LUCK',
	/**AAPAY */
	'AAPAY',
	/**GREPAY */
	'GREPAY',
	/**SHPAY */
	'SHPAY',
	/** WTPAY 万腾支付 */
	'WTPAY',
	/** payablepay 派乐支付 */
	'PAYABLEPAY',
	/**GLOBALPAYNEW-VISA */
	'GLOBALPAYNEW-VISA',
	/**SU7PAY  用的hanbit的class*/
	'SU7PAY',
	/**wwwpay */
	'WWWPAY',
	/**bbpay cbpay的二类 */
	'BBPAY',
	/**KPPAY */
	'KPPAY',
	/** dgpay  */
	'DGPAY',
	/** brpay */
	'BRPAY',
	/** BBNPAY */
	'BBNPAY',
	/** WINWINPAY */
	'WINWINPAY',
	/** SITOPAY */
	'SITOPAY',
	/** singlepay */
	'SINGLEPAY',
	/** ppay */
	'PPAY',
	/** uupay */
	'UUPAY',
	/** dgpaynew */
	'DGPAYNEW',
	/** kgpay */
	'KGPAY',
	/** EpayGlobal  */
	'EPAYGLOBAL',
	/** qqpay */
	'QQPAY',
	/** aupay */
	'AUPAY',
	/** cepay */
	'CEPAY',
	/** kirinpay */
	'KIRINPAY',
	/** mypay */
	'MYPAY',
	/**gogopay */
	'GOGOPAY',
	/** sqpay */
	'SQPAY',
	/** tustpay */
	'TUSTPAY',
	/** 24pay */
	'24PAY',
	/** AOApay */
	'AOAPAY',
	/** lvpay */
	'LVPAY',
	/** vtpay */
	'VTPAY',
	/**bbintpay */
	'BBINPAY',
	/**kukpay */
	'KUKPAY',
	/**bestpay */
	'BESTPAY',
	/**fatpagpay */
	'FATPAGPAY',
	/**nanapay */
	'NANAPAY',
	/**filipay */
	'FILIPAY',
	/**sgpay */
	'SGPAY',
	/**mmpay 代码和sgpay的一样 */
	'MMPAY',
	/** kumopay */
	'KUMOPAY',
	/**Win2pay */
	'WIN2PAY',
	/**fpay */
	'FPAY',
	/**Hpay */
	'HPAY',
	/**Bigpay */
	'BIGPAY',
	/**90pay */
	'90PAY',
	/**feibaopay */
	'FEIBAOPAY',
	/**UXPAY 菲律宾 */
	'UXPAY',
	/**LTPAY 菲律宾 */
	'LTPAY',
	/**umapay */
	'UMAPAY',
	/**gfpay */
	'GFPAY',
	/**wodipay */
	'WODIPAY',
	/**58pay */
	'58PAY',
	/**bgpay */
	'BGPAY',
	/**ezpay */
	'EZPAY',
	/**rgpay */
	'RGPAY',
	/**jzpay2 */
	'JZPAY2',
	/**88pay */
	'88PAY',
	/**inpay */
	'INPAY',
	/**mypay菲律宾 */
	'MYPAY-PHP',
	/**shunfapay */
	'SHUNFAPAY',
	/**watchpay */
	'WATCHPAY',
	/**global3pay */
	'GLOBAL3PAY',
	/**toponepay */
	'TOPONEPAY',
	/**bfpay */
	'BFPAY',
	/** MASAYAPHP */
	'MASAYAPHP',
	/** TOPPAYPHP */
	'TOPPAYPHP',
	/** cqpay */
	'CQPAY',
	/** sqpay-php*/
	'SQPAY-PHP',
	/** adcpay*/
	'ADCPAY',
	/** skypay*/
	'SKYPAY',
	/** yunpay*/
	'YUNPAY',
	/** u2cpay*/
	'U2CPAY',
	/** jopay*/
	'JOPAY',
	/** wwinpay*/
	'WWINPAY',
	/** pay4z*/
	'PAY4Z',
	/** winpay-php*/
	'WINPAY-PHP',
	/** dbdpay */
	'DBDPAY',
	/** wkpay */
	'WKPAY',
	/** bingopay*/
	'BINGOPAY',
	/** VCPAY */
	'VCPAY',
	/** upay*/
	'UPAY',
	/** owenpay*/
	'OWENPAY',
	/** starpay*/
	'STARPAGOPAY',
	/** brpaynew*/
	'BRPAYNEW',
	/** qin360pay*/
	'QIN360PAY',
	/** ezpay-Brazil */
	'EZPAYBR',
	/** uzpay*/
	'UZPAY',
	/** brcashy*/
	'BRCASHY',
	/** btcpay*/
	'BTCPAY',
	/** quiipay*/
	'QUIIPAY',
	/** wjpay66*/
	'WJPAY66',
	/** univepay */
	'UNIVEPAY',
	/** fastpay */
	'FASTPAY',
	/** atopos*/
	'ATOPOS',
	/** u88pay*/
	'U88PAY',
	/** aipay*/
	'AIPAY',
	/** 58payphp*/
	'58PAYPHP',
	/** gogopaynew*/
	'GOGOPAYNEW',
	/** mypayglobal*/
	'MYPAYGLOBAL',
	/** godapay*/
	'GODAPAY',
	/** smtpay*/
	'SMTPAY',
	/** bfpayphp*/
	'BFPAYPHP',
	/** u88pay-Brazil*/
	'U88PAYBR',
	/** coinpay*/
	'COINPAY',
	/** 777pay*/
	'777PAY',
	/** wj88pay */
	'WJ88PAY',
	/** pay4zphp*/
	'PAY4ZPHP',
	/** daypay2*/
	'DAYPAY2',
	/** GGPAY*/
	'GGPAY',
	/** mayaInternationalpay*/
	'MAYAINTERNATIONAL',
	/** donepay */
	'DONEPAY',
	/**PANPAY越南 */
	'PANPAYVN',
	/** 大洋越南 */
	'DAYANGVN',
	/** v8pay越南 */
	'V8PAYVN',
	/** TWPPAY */
	'TWPPAY',
	/** shijiapay */
	'SHIJIAPAY',
	/** p2ppay */
	'P2PPAY',
	/** shijie3pay */
	'SHIJIE3PAY',
	/** hongdapay */
	'HONGDAPAY',
	/** 66pay */
	'66PAY',
	'Z1PAY',
	/** 88paynew */
	'88PAYNEW',
	/** DAYANGPHP */
	'DAYANGPHP',
	/** OUROPAY */
	'OUROPAY',
	/** MPAY */
	'MPAY',
	/** CBPAYNEW */
	'CBPAYNEW',
	/** LPAY */
	'LPAY',
	/** BPAY */
	'BPAY',
	/** FIXPAY */
	'FIXPAY',
	/** DEEPAY */
	'DEEPAY',
	/** H88PAY */
	'H88PAY',
	/** SIMPAY */
	'SIMPAY',
	/** MAGAPAY */
	'MAGAPAY',
	/** KPCOINPAY */
	'KPCOINPAY',
	/** FYPAYPHP */
	'FYPAYPHP',
	/** GYPAY */
	'GYPAY',
	/** 196PAY */
	'196PAY',
	/** BEKPAY */
	'BEKPAY',
] as const

export type PaymentCode = (typeof PaymentCodes)[number]
export const ZPaymentCode = z.enum(PaymentCodes)

/**
 * 支持自定义收银台的支付code
 */
export const CustomCheckoutPayCodeList = [
	ZPaymentCode.Enum['24PAY'],
	ZPaymentCode.Enum['55LUCK'],
	ZPaymentCode.Enum['58PAY'],
	ZPaymentCode.Enum.ADCPAY,
	ZPaymentCode.Enum.AUPAY,
	ZPaymentCode.Enum.BBINPAY,
	ZPaymentCode.Enum.BESTPAY,
	ZPaymentCode.Enum.BETCATPAY,
	ZPaymentCode.Enum.BFPAY,
	ZPaymentCode.Enum.BINGOPAY,
	ZPaymentCode.Enum.BRPAYNEW,
	ZPaymentCode.Enum.BTCPAY,
	ZPaymentCode.Enum.CBPAY,
	ZPaymentCode.Enum.CEPAY,
	ZPaymentCode.Enum.CQPAY,
	ZPaymentCode.Enum.DGPAY,
	ZPaymentCode.Enum.EZPAYBR,
	ZPaymentCode.Enum.FYPAY,
	ZPaymentCode.Enum.GLOBALPAYNEW,
	ZPaymentCode.Enum.GOGOPAY,
	ZPaymentCode.Enum.GOGOPAYNEW,
	ZPaymentCode.Enum.KGPAY,
	ZPaymentCode.Enum.KIRINPAY,
	ZPaymentCode.Enum.QQPAY,
	ZPaymentCode.Enum.SITOPAY,
	ZPaymentCode.Enum.TODAYPAY,
	ZPaymentCode.Enum.U2CPAY,
	ZPaymentCode.Enum.U88PAYBR,
	ZPaymentCode.Enum.UUPAY,
	ZPaymentCode.Enum.VTPAY,
	ZPaymentCode.Enum.COINPAY,
	ZPaymentCode.Enum['777PAY'],
	ZPaymentCode.Enum.TOPPAYNEW,
	ZPaymentCode.Enum.GGPAY,
	ZPaymentCode.Enum.TWPPAY,
	ZPaymentCode.Enum.P2PPAY,
	ZPaymentCode.Enum['88PAYNEW'],
	ZPaymentCode.Enum.OUROPAY,
	ZPaymentCode.Enum.MPAY,
	ZPaymentCode.Enum.SQPAY,
	ZPaymentCode.Enum['668PAY'],
	ZPaymentCode.Enum.WINPAY,
	ZPaymentCode.Enum.LVPAY,
	ZPaymentCode.Enum.BBNPAY,
	ZPaymentCode.Enum.TOPONEPAY,
	ZPaymentCode.Enum.QIN360PAY,
	ZPaymentCode.Enum.MYPAYGLOBAL,
	ZPaymentCode.Enum.MYPAY,
	ZPaymentCode.Enum.WODIPAY,
	ZPaymentCode.Enum.KPPAY,
	ZPaymentCode.Enum.KUKPAY,
	ZPaymentCode.Enum.MPAY,
	ZPaymentCode.Enum.INPAY,
	ZPaymentCode.Enum.CBPAYNEW,
	ZPaymentCode.Enum.FIXPAY,
	ZPaymentCode.Enum.DEEPAY,
	ZPaymentCode.Enum.H88PAY,
	ZPaymentCode.Enum.SIMPAY,
	ZPaymentCode.Enum.MAGAPAY,
	ZPaymentCode.Enum.KPCOINPAY,
	ZPaymentCode.Enum.GYPAY,
] as const

export type CustomCheckoutPayCode = (typeof CustomCheckoutPayCodeList)[number]
export const ZCustomCheckoutPayCode = z.enum(CustomCheckoutPayCodeList)
