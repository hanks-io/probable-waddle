import { z } from 'zod'


/**
 * 银行状态
 */
export const BankStatus = ['enabled', 'disabled'] as const
export type TBankStatus = (typeof BankStatus)[number]
export const ZBankStatus = z.enum(BankStatus)

//======================================================================================================================

/**
 * 印度 银行名编码
 */
export const INRBankCodeEnum = [
	/** ASF: AU Small Finance Bank: 澳大利亚小型金融银行 */
	'ASF',
	/** ABP: Aditya Birla Payments Bank: 阿迪亚·比拉支付银行 */
	'ABP',
	/** AP: Airtel Payments Bank: Airtel支付银行 */
	'AP',
	/** ALLA: Allahabad Bank: 安拉哈巴德银行 */
	'ALLA',
	/** ANDH: Andhra Bank: 安得拉银行 */
	'ANDH',
	/** APGV: Andhra Pradesh Grameena Vikas Bank: 安得拉邦Grameena Vikas银行 */
	'APGV',
	/** APG: Andhra Pragathi Grameena Bank: 安得拉Pragathi Grameena银行 */
	'APG',
	/** APR: Arunachal Pradesh Rural Bank: 阿鲁纳恰尔邦农村银行 */
	'APR',
	/** ARYA: Aryavart Bank: Aryavart银行 */
	'ARYA',
	/** AGV: Assam Gramin Vikash Bank: 阿萨姆Gramin Vikash银行 */
	'AGV',
	/** AXIS: Axis Bank: 轴心银行 */
	'AXIS',
	/** BOBAK: BANK OF BAHRAIN AND KUWAIT: 巴林和科威特银行 */
	'BOBAK',
	/** BHARAT: BHARAT BANK: Bharat银行 */
	'BHARAT',
	/** BANDHAN: Bandhan Bank: Bandhan银行 */
	'BANDHAN',
	/** BGV: Bangiya Gramin Vikash Bank: Bangiya Gramin Vikash银行 */
	'BGV',
	/** DBS: Bank DBS Indonesia: DBS印度尼西亚银行 */
	'DBS',
	/** BOB: Bank of Baroda: 巴罗达银行 */
	'BOB',
	/** BOI: Bank of India: 印度银行 */
	'BOI',
	/** BOM: Bank of Maharashtra: 马哈拉施特拉银行 */
	'BOM',
	/** BGG: Baroda Gujarat Gramin Bank: 巴罗达古吉拉特Gramin银行 */
	'BGG',
	/** BRKG: Baroda Rajasthan Kshetriya Gramin Bank: 巴罗达拉贾斯坦Kshetriya Gramin银行 */
	'BRKG',
	/** BUPG: Baroda Uttar Pradesh Gramin Bank: 巴罗达北方邦Gramin银行 */
	'BUPG',
	/** BCCO: Bassein Catholic Co-operative Bank: 巴塞因天主教合作银行 */
	'BCCO',
	/** CSFB: CAPITAL SMALL FINANCE BANK LTD: 资本小型金融银行有限公司 */
	'CSFB',
	/** COSMOS: COSMOS BANK: 宇宙银行 */
	'COSMOS',
	/** CSB: CSB Bank: CSB银行 */
	'CSB',
	/** CANARA: Canara Bank: 卡纳拉银行 */
	'CANARA',
	/** CASY: Catholic Syrian Bank: 天主教叙利亚银行 */
	'CASY',
	/** CBOI: Central Bank of India: 中央银行 */
	'CBOI',
	/** CGG: Chaitanya Godavari Grameena Bank: Chaitanya Godavari Grameena银行 */
	'CGG',
	/** CRG: Chhattisgarh Rajya Gramin Bank: Chhattisgarh Rajya Gramin银行 */
	'CRG',
	/** CITI: Citi bank: 花旗银行 */
	'CITI',
	/** CU: City Union Bank: 城市联盟银行 */
	'CU',
	/** CLA: Coastal Local Area Bank Limited: 海岸地方银行有限公司 */
	'CLA',
	/** CORP: Corporation Bank: 公司银行 */
	'CORP',
	/** DCB: DCB Bank: DCB银行 */
	'DCB',
	/** DBOS: DEVELOPMENT BANK OF SINGAPORE: 新加坡发展银行 */
	'DBOS',
	/** DNLM: DNLM: DNLM */
	'DNLM',
	/** DBG: Dakshin Bihar Gramin Bank: 达克辛比哈尔Gramin银行 */
	'DBG',
	/** DENA: Dena Bank: 德纳银行 */
	'DENA',
	/** DBAG: Deutsche Bank AG: 德意志银行 */
	'DBAG',
	/** DHAN: Dhanlaxmi Bank: Dhanlaxmi银行 */
	'DHAN',
	/** ESAF: ESAF Small Finance Bank: ESAF小型金融银行 */
	'ESAF',
	/** ELD: Ellaquai Dehati Bank: Ellaquai Dehati银行 */
	'ELD',
	/** ESF: Equitas Small Finance Bank: Equitas小型金融银行 */
	'ESF',
	/** EQUITAS: Equitas bank: Equitas银行 */
	'EQUITAS',
	/** EXIM: Exim Bank: 出口银行 */
	'EXIM',
	/** FIP: FINO PAYMENT BANK: FINO支付银行 */
	'FIP',
	/** FEDERAL: Federal Bank: 联邦银行 */
	'FEDERAL',
	/** FSF: Fincare Small Finance Bank: Fincare小型金融银行 */
	'FSF',
	/** GPPJS: GOPINATH PATIL PARSIK JANATA SAHAKARI BANK LTD: GOPINATH PATIL PARSIK JANATA SAHAKARI银行有限公司 */
	'GPPJS',
	/** HDFC: HDFC Bank: HDFC银行 */
	'HDFC',
	/** HSBC: HSBC Bank: 汇丰银行 */
	'HSBC',
	/** HPG: Himachal Pradesh Gramin Bank: 喜马偕尔邦Gramin银行 */
	'HPG',
	/** ICICI: ICICI Bank: ICICI银行 */
	'ICICI',
	/** IDBI: IDBI Bank: IDBI银行 */
	'IDBI',
	/** IDFC: IDFC First Bank: IDFC第一银行 */
	'IDFC',
	/** IPP: India Post Payments Bank: 印度邮政支付银行 */
	'IPP',
	/** IND: Indian Bank: 印度银行 */
	'IND',
	/** INDOV: Indian Overseas Bank: 印度海外银行 */
	'INDOV',
	/** INDUSIND: IndusInd Bank: IndusInd银行 */
	'INDUSIND',
	/** JKG: J&K Grameen Bank: J&K Grameen银行 */
	'JKG',
	/** JANATA: JANATA SAHAKARI BANK LTD PUNE: JANATA SAHAKARI银行有限公司浦那 */
	'JANATA',
	/** JAK: Jammu and Kashmir Bank: 查谟和克什米尔银行 */
	'JAK',
	/** JSF: Jana Small Finance Bank: Jana小型金融银行 */
	'JSF',
	/** JRG: Jharkhand Rajya Gramin Bank: 贾坎德邦Rajya Gramin银行 */
	'JRG',
	/** JIO: Jio Payments Bank: Jio支付银行 */
	'JIO',
	/** KARNATAKA: Karnataka Bank: 卡纳塔克邦银行 */
	'KARNATAKA',
	/** KG: Karnataka Gramin Bank: 卡纳塔克邦Gramin银行 */
	'KG',
	/** KVG: Karnataka Vikas Grameena Bank: 卡纳塔克邦Vikas Grameena银行 */
	'KVG',
	/** KV: Karur Vysya Bank: 卡鲁尔Vysya银行 */
	'KV',
	/** KGSG: Kashi Gomti Samyut Gramin Bank: Kashi Gomti Samyut Gramin银行 */
	'KGSG',
	/** KEG: Kerala Gramin Bank: 喀拉拉邦Gramin银行 */
	'KEG',
	/** KM: Kotak Mahindra Bank: Kotak Mahindra银行 */
	'KM',
	/** LV: Lakshmi Vilas Bank: Lakshmi Vilas银行 */
	'LV',
	/** LIND: Lndus Ind Bank: Lndus Ind银行 */
	'LIND',
	/** MBG: MADHYA BIHAR GRAMIN BANK: 马德亚比哈尔Gramin银行 */
	'MBG',
	/** MR: MEGHALAYA RURAL BANK: 梅加拉亚农村银行 */
	'MR',
	/** MPG: Madhya Pradesh Gramin Bank: 马德亚邦Gramin银行 */
	'MPG',
	/** MADG: Madhyanchal Gramin Bank: Madhyanchal Gramin银行 */
	'MADG',
	/** MAHG: Maharashtra Gramin Bank: 马哈拉施特拉Gramin银行 */
	'MAHG',
	/** MANIPURR: Manipur Rural Bank: 曼尼普尔农村银行 */
	'MANIPURR',
	/** MIZORAMR: Mizoram Rural Bank: 米佐拉姆农村银行 */
	'MIZORAMR',
	/** NHB: NHB: NHB */
	'NHB',
	/** NSDL: NSDL Payments Bank: NSDL支付银行 */
	'NSDL',
	/** NAGALANDR: Nagaland Rural Bank: 那加兰农村银行 */
	'NAGALANDR',
	/** NAINITAL: Nainital Bank: 奈尼塔尔银行 */
	'NAINITAL',
	/** NBARD: National Bankfor Agricultureand Rural Development: 国家农业和农村发展银行 */
	'NBARD',
	/** NESF: North East Small Finance Bank: 东北小型金融银行 */
	'NESF',
	/** OG: Odisha Gramya Bank: 奥里萨Grameya银行 */
	'OG',
	/** OBOC: Oriental Bank of Commerce: 东方商业银行 */
	'OBOC',
	/** PAYTM: PAYTM PAYMENTS BANK: PAYTM支付银行 */
	'PAYTM',
	/** PUNJAB: PUNJAB GRAMIN BANK: 旁遮普Gramin银行 */
	'PUNJAB',
	/** PBG: Paschim Banga Gramin Bank: Paschim Banga Gramin银行 */
	'PBG',
	/** PKG: Pragathi Krishna Gramin Bank: Pragathi Krishna Gramin银行 */
	'PKG',
	/** PKGB: Pragati Krushna Gramina Bank: Pragati Krushna Gramina银行 */
	'PKGB',
	/** PUPG: Prathama UP Gramin Bank: Prathama UP Gramin银行 */
	'PUPG',
	/** PBGB: Puduvai Bharathiar Grama Bank: Puduvai Bharathiar Grama银行 */
	'PBGB',
	/** PUNNA: Punjab National Bank: 旁遮普国家银行 */
	'PUNNA',
	/** PAS: Punjab and Sind Bank: 旁遮普和信德银行 */
	'PAS',
	/** PURVAN: Purvanchal Bank: Purvanchal银行 */
	'PURVAN',
	/** RBL: RBL BANK LTD: RBL银行有限公司 */
	'RBL',
	/** RBOS: ROYAL BANK OF SCOTLAND: 苏格兰皇家银行 */
	'RBOS',
	/** RMG: Rajasthan Marudhara Gramin Bank: 拉贾斯坦Marudhara Gramin银行 */
	'RMG',
	/** RBOI: Reserve Bank of India: 印度储备银行 */
	'RBOI',
	/** SCBTP: STANDARD CHARTERED BANK THAI PCL: 泰国标准渣打银行 */
	'SCBTP',
	/** SCBL: SVC COOPERATIVE BANK LTD: SVC合作银行有限公司 */
	'SCBL',
	/** SG: Saptagiri Grameena Bank: Saptagiri Grameena银行 */
	'SG',
	/** SHG: Sarva Haryana Gramin Bank: Sarva Haryana Gramin银行 */
	'SHG',
	/** SGB: Saurashtra Gramin Bank: Saurashtra Gramin银行 */
	'SGB',
	/** SIDBI: Small Industries Development Bankof India: 小型工业发展银行 */
	'SIDBI',
	/** SIB: South Indian Bank: 南印度银行 */
	'SIB',
	/** SCB: Standard Chartered Bank: 标准渣打银行 */
	'SCB',
	/** SBOH: State Bank of Hyderabad: 海得拉巴国家银行 */
	'SBOH',
	/** SBOI: State Bank of India: 印度国家银行 */
	'SBOI',
	/** SLA: Subhadra Local Area Bank Ltd: Subhadra地方银行有限公司 */
	'SLA',
	/** SSS: Suco Souharda Sahakari Bank: Suco Souharda Sahakari银行 */
	'SSS',
	/** SSFB: Suryoday Small Finance Bank Ltd: Suryoday小型金融银行有限公司 */
	'SSFB',
	/** SYNDICATE: Syndicate Bank: 辛迪加银行 */
	'SYNDICATE',
	/** TNG: Tamil Nadu Grama Bank: 泰米尔纳德邦Grama银行 */
	'TNG',
	/** TMB: Tamilnad Mercantile Bank Limited: 泰米尔纳德商业银行有限公司 */
	'TMB',
	/** TG: Tripura Gramin Bank: 特里普拉Gramin银行 */
	'TG',
	/** UCO: UCO Bank: UCO银行 */
	'UCO',
	/** UBG: UTTAR BIHAR GRAMIN BANK: 北比哈尔Gramin银行 */
	'UBG',
	/** USF: Ujjivan Small Finance Bank: Ujjivan小型金融银行 */
	'USF',
	/** UKO: Uko Bank: Uko银行 */
	'UKO',
	/** UBOI: Union Bank of India: 联合银行 */
	'UBOI',
	/** UNITEDBOI: United Bank of India: 印度联合银行 */
	'UNITEDBOI',
	/** UG: Utkal Grameen Bank: 乌塔尔Grameen银行 */
	'UG',
	/** UTKSF: Utkarsh Small Finance Bank: Utkarsh小型金融银行 */
	'UTKSF',
	/** UBKG: Uttar Banga Kshetriya Gramin Bank: 北孟加拉Kshetriya Gramin银行 */
	'UBKG',
	/** UTTG: Uttarakhand Gramin Bank: 北阿坎德Gramin银行 */
	'UTTG',
	/** VANG: Vananchal Gramin Bank: Vananchal Gramin银行 */
	'VANG',
	/** VKG: Vidharbha Konkan Gramin Bank: Vidharbha Konkan Gramin银行 */
	'VKG',
	/** VIJAYA: Vijaya Bank: Vijaya银行 */
	'VIJAYA',
	/** YES: Yes Bank: Yes银行 */
	'YES',
	/** ICICIC: ICICI corporate Bank: ICICI企业银行 */
	'ICICIC',
	/** SARASWAT: Saraswat Bank: Saraswat银行 */
	'SARASWAT',
	/** TELG: Telangana grameena Bank: 特伦甘纳Grameena银行 */
	'TELG',
] as const

export type TINRBankCodeEnum = (typeof INRBankCodeEnum)[number]
export const ZINRBankCodeEnum = z.enum(INRBankCodeEnum)

//======================================================================================================================

/**
 * 菲律宾银行code
 */
export const PHBankCodeEnum = [
	/** GCASH: GCASH钱包 */
	'GCASH',
	/** AUB: Asia United Bank */
	'AUB',
	/** UnionBankEON: UnionBank EON */
	'UnionBankEON',
	/** Starpay: Starpay */
	'Starpay',
	/** EB: Eastwest Bank */
	'EB',
	/** ESB: Equicom Savings Bank */
	'ESB',
	/** MB: Malayan Bank */
	'MB',
	/** ERB: EastWest Rural Bank */
	'ERB',
	/** PB: Producers Bank */
	'PB',
	/** PBC: Philippine Bank of Communications */
	'PBC',
	/** PBB: Philippine Business Bank */
	'PBB',
	/** PNB: Philippine National Bank */
	'PNB',
	/** PSB: Philippine Savings Bank */
	'PSB',
	/** PTC: Philippine Trust Company */
	'PTC',
	/** PVB: Philippine Veterans Bank */
	'PVB',
	/** RBG: Rural Bank of Guinobatan, Inc. */
	'RBG',
	/** RCBC: Rizal Commercial Banking Corporation */
	'RCBC',
	/** RB: Robinsons Bank */
	'RB',
	/** SBC: Security Bank Corporation */
	'SBC',
	/** SBA: Sterling Bank Of Asia */
	'SBA',
	/** SSB: Sun Savings Bank */
	'SSB',
	/** UCPBSAVINGSBANK: UCPB SAVINGS BANK */
	'UCPBSAVINGSBANK',
	/** QCDBI: Queen City Development Bank, Inc. */
	'QCDBI',
	/** UCPB: United Coconut Planters Bank */
	'UCPB',
	/** WDBI: Wealth Development Bank, Inc. */
	'WDBI',
	/** YSBI: Yuanta Savings Bank, Inc. */
	'YSBI',
	/** BDOUI: Banco De Oro Unibank, Inc. */
	'BDOUI',
	/** BMI: Bangko Mabuhay (A Rural Bank), Inc. */
	'BMI',
	/** BOC: Bank Of Commerce */
	'BOC',
	/** CTBC: CTBC Bank (Philippines), Inc. */
	'CTBC',
	/** Chinabank: Chinabank */
	'Chinabank',
	/** CBS: Chinabank Savings */
	'CBS',
	/** CBC: Chinatrust Banking Corp */
	'CBC',
	/** ALLBANK: ALLBANK (A Thrift Bank), Inc. */
	'ALLBANK',
	/** BNBI: BDO Network Bank, Inc. */
	'BNBI',
	/** BRBI: Binangonan Rural Bank Inc */
	'BRBI',
	/** Camalig: Camalig Bank */
	'Camalig',
	/** DBI: Dungganun Bank, Inc. */
	'DBI',
	/** GlobeGcash: Globe Gcash */
	'GlobeGcash',
	/** CLRBI: Cebuana Lhuillier Rural Bank, Inc. */
	'CLRBI',
	/** ISLABANK: ISLA Bank (A Thrift Bank), Inc. */
	'ISLABANK',
	/** LOTP: Landbank of the Philippines */
	'LOTP',
	/** MPI: Maybank Philippines, Inc. */
	'MPI',
	/** MBATC: Metropolitan Bank and Trust Co */
	'MBATC',
	/** Omnipay: Omnipay */
	'Omnipay',
	/** PRBI: Partner Rural Bank (Cotabato), Inc. */
	'PRBI',
	/** AlliedBankingCorp: Allied Banking Corp */
	'AlliedBankingCorp',
	/** ING: ING Bank N.V. */
	'ING',
	/** BDBIASB: BPI Direct Banko, Inc., A Savings Bank */
	'BDBIASB',
	/** CSB: Citystate Savings Bank Inc. */
	'CSB',
	/** BPI: Bank Of The Philippine Islands */
	'BPI',

	// 以下为新增
	/** LAZADA: Alipay Philippines, Inc. / Lazada Wallet */
	'LAZADA',
	/** BFSC: Banana Fintech / BananaPay */
	'BFSC',
	/** BDO: BDO Unibank, Inc. */
	'BDO',
	/** CRD: Card Bank */
	'CRD',
	/** CRDSB: Card SME Bank, Inc. */
	'CRDSB',
	/** CIMB: CIMB Bank Philippines, Inc. */
	'CIMB',
	/** CBCI: CIS Bayad Center / Bayad */
	'CBCI',
	/** DCP: DCPay Philippines, Inc. / Coins.ph */
	'DCP',
	/** DBP: Development Bank of the Philippines */
	'DBP',
	/** DCDB: Dumaguete Bank */
	'DCDB',
	/** EWB: East West Banking Corporation */
	'EWB',
	/** ENTRP: Entrepreneur Rural Bank, Inc. / ENTRP */
	'ENTRP',
	/** GOTYME: GoTyme Bank */
	'GOTYME',
	/** ICASH: I-Remit / iCASH */
	'ICASH',
	/** NATIONLINK: Infoserve / Nationlink */
	'NATIONLINK',
	/** JUANCASH: Zybi Tech Inc. / Juan Cash */
	'JUANCASH',
	/** LSB: Legazpi Savings Bank, Inc. */
	'LSB',
	/** LDB: Luzon Development Bank */
	'LDB',
	/** MSB: Malayan Bank Savings and Mortgage Bank, Inc. */
	'MSB',
	/** MET: Metropolitan Bank and Trust Company */
	'MET',
	/** MCCB: Mindanao Consolidated CoopBank */
	'MCCB',
	/** CRBR: Netbank (Community Rural Bank of Romblon) */
	'CRBR',
	/** OWN: Own Bank */
	'OWN',
	/** PA: Pacific Ace Savings Bank */
	'PA',
	/** PPS: PalawanPay */
	'PPS',
	/** PDAX: Philippine Digital Asset Exchange, Inc. / PDAX */
	'PDAX',
	/** QCRB: Quezon Capital Rural Bank, Inc. */
	'QCRB',
	/** SEA: Banco Laguna, Inc. / Seabank Philippines, Inc. */
	'SEA',
	/** SHOPEE: ShopeePay */
	'SHOPEE',
	/** TAYOCASH: TayoCash Inc. */
	'TAYOCASH',
	/** TONIK: Tonik Digital Bank, Inc. */
	'TONIK',
	/** DIGICOOP: TraxionPay/DigiCOOP/COOPNET */
	'DIGICOOP',
	/** UBP: Union Bank of the Philippines */
	'UBP',
	/** UDP: UnionDigital Bank, Inc. */
	'UDP',
	/** UNO: UNO Digital Bank, Inc. */
	'UNO',
	/** USSC: USSC Money Services */
	'USSC',
	/** EMANGO: SpeedyPay / eMango Pay */
	'EMANGO',
	/** MYB: Maya Bank Inc */
	'MYB',
	/** MYW: Maya Philippines, Inc./Maya Wallet */
	'MYW',
	/**Gpay Network Ph, Inc. / GrabPay */
	'GRAB',
	/**QRPH */
	'QRPH',
	/**PPI */
	'PPI',
	/**CARD MRI RBI */
	'CMR',
	/**Cantilan Bank */
	'CB',
	/**PayMongo */
	'PAYMONGO',
	/** SCB: Standard Chartered Bank: 标准渣打银行 */
	'SCB',
	/** CS: City Savings Bank */
	'CS',
	/** ToktokWallet */
	'TW',
	/** Bank of China */
	'BOCHINA',
	/** East West Rural Bank / Kompass */
	'EWRB',
	/** PNB Savings Bank */
	'PNBSB',
	/** Producers Savings Bank */
	'PRSB',
	/** PayMaya */
	'PM',
	/** Cantilan Bank Inc */
	'CBI',
	/** East West Rural Bank */
	'EWR',
	/** PHILTRUST BANK */
	'PHILTRUST',
	/** Unionbank of the Philippines */
	'UP',
	/** Dungganon Bank (A Microfinance Rural Bank), Inc. */
	'DB',
	/** G-Xchange Inc. / GCash */
	'GXCH',
	/**Seabank */
	'SEABANK',
	/** Queenbank */
	'QB',
	/** Producers Savings Bank */
	'PRSB',
	/** Dungganon Bank (A Microfinance Rural Bank), Inc. */
	'DB',
] as const

export type TPHBankCodeEnum = (typeof PHBankCodeEnum)[number]
export const ZPHBankCodeEnum = z.enum(PHBankCodeEnum)

//======================================================================================================================

/**
 * 越南银行code
 */
export const VNBankCodeEnum = [
	/** ABBANK: ABBANK */
	'ABBANK',
	/** ACB: ACB */
	'ACB',
	/** AGRIBANK: AGRIBANK */
	'AGRIBANK',
	/** AmBank: AmBank */
	'AmBank',
	/** BACABANK: BACABANK */
	'BACABANK',
	/** BAOVIETBANK: BAOVIETBANK */
	'BAOVIETBANK',
	/** BIDV: BIDV */
	'BIDV',
	/** BVBank: BVBank */
	'BVBank',
	/** CAKE: CAKE */
	'CAKE',
	/** CB: CB */
	'CB',
	/** CIMB: CIMB */
	'CIMB',
	/** COOPBANK: COOPBANK */
	'COOPBANK',
	/** DBS-HCM: DBS-HCM */
	'DBS-HCM',
	/** DONGABANK: DONGABANK */
	'DONGABANK',
	/** EXIMBANK: EXIMBANK */
	'EXIMBANK',
	/** GPBANK: GPBANK */
	'GPBANK',
	/** HDBank: HDBank */
	'HDBank',
	/** HONG LEONG BANK: HONG LEONG BANK */
	'HONG_LEONG_BANK',
	/** Housing Bank: Housing Bank */
	'Housing_Bank',
	/** HSBC: HSBC VIETNAM */
	'HSBC',
	/** IBK-HN: IBK-HN */
	'IBK-HN',
	/** IVB: IVB */
	'IVB',
	/** KASIKORNBANK: KASIKORNBANK */
	'KASIKORNBANK',
	/** KB Kookmin Bank: KB Kookmin Bank */
	'KB_Kookmin_Bank',
	/** KIENLONGBANK: KIENLONGBANK */
	'KIENLONGBANK',
	/** LIENVIETPOSTBANK: LIENVIETPOSTBANK */
	'LIENVIETPOSTBANK',
	/** MARITIMEBANK: MARITIMEBANK */
	'MARITIMEBANK',
	/** MB BANK: MB BANK */
	'MB_BANK',
	/** MBV NH TNHH MTV VIET NAM HIEN DAI: MBV NH TNHH MTV VIET NAM HIEN DAI */
	'MBV',
	/** Nam A BANK: Nam A BANK */
	'Nam_A_BANK',
	/** NCB: NCB */
	'NCB',
	/** NGAN HANG HOP TAC: NGAN HANG HOP TAC */
	'NGAN_HANG_HOP_TAC',
	/** NGAN HANG TMCP NAM A: NGAN HANG TMCP NAM A */
	'NGAN_HANG_TMCP_NAM_A',
	/** NH Bank: NH Bank */
	'NH_Bank',
	/** North American Savings Bank: North American Savings Bank */
	'North_American_Savings_Bank',
	/** OCB: OCB */
	'OCB',
	/** OCEAN BANK: OCEAN BANK */
	'OCEAN_BANK',
	/** Other Bank: Other Bank */
	'Other_Bank',
	/** PG BANK: PG BANK */
	'PG_BANK',
	/** PUBLICBANKVIETNAM: PUBLICBANKVIETNAM */
	'PUBLICBANKVIETNAM',
	/** PVcom Bank: PVcom Bank */
	'PVcom_Bank',
	/** SACOMBANK: SACOMBANK */
	'SACOMBANK',
	/** SAIGONBANK: SAIGONBANK */
	'SAIGONBANK',
	/** SBV: NGÂN HÀNG NHÀ NƯỚC VIỆT NAM */
	'SBV',
	/** SCB BANK: SCB BANK */
	'SCB_BANK',
	/** SeABank: SeABank */
	'SeABank',
	/** SHB: SHB */
	'SHB',
	/** SHINHAN BANK: SHINHAN BANK */
	'SHINHAN_BANK',
	/** STANCHART: SCVN */
	'STANCHART',
	/** TECHCOMBANK: TECHCOMBANK */
	'TECHCOMBANK',
	/** TIMO BANK: TIMO BANK */
	'TIMO_BANK',
	/** TPBank: TPBank */
	'TPBank',
	/** UBANK BY VP BANK: UBANK BY VP BANK */
	'UBANK',
	/** United Overseas bank: United Overseas bank */
	'UOB',
	/** VBSP: VBSP */
	'VBSP',
	/** VDB: VDB */
	'VDB',
	/** VIET A BANK: VIET A BANK */
	'VIET_A_BANK',
	/** VIET BANK: VIET BANK */
	'VIET_BANK',
	/** Viet Capital Bank: BANVIET */
	'Viet_Capital_Bank',
	/** Vietcom Bank: Vietcom Bank */
	'Vietcom_Bank',
	/** Vietin Bank: Vietin Bank */
	'Vietin_Bank',
	/** VIB: VIB */
	'VIB',
	/** VIETNAM RUSSIA BANK: VIETNAM RUSSIA BANK */
	'VIETNAM_RUSSIA_BANK',
	/** VPBANK: VPBANK */
	'VPBANK',
	/** Woori Bank: Woori Bank */
	'Woori_Bank',


	//===========================钱包code===============================
	/**MoMo 钱包code */
	'MOMO',
	/**ViettelPay 钱包 */
	'VIETTELPAY',
] as const
export type TVNBankCodeEnum = (typeof VNBankCodeEnum)[number]
export const ZVNBankCodeEnum = z.enum(VNBankCodeEnum)

//======================================================================================================================

/**
 * 银行code
 */
export const BankCodeEnum = [
	...INRBankCodeEnum,
	...PHBankCodeEnum,
	...VNBankCodeEnum,
] as const

export type TBankCodeEnum = (typeof BankCodeEnum)[number]
export const ZBankCodeEnum = z.enum(BankCodeEnum)
