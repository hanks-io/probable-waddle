export const AdConfigMap = {
	register: {
		name: '注册',
		fbq: {
			event: 'CompleteRegistration',
			dataMapping: {},
			needServer: false,
		},
		ttq: {
			event: 'CompleteRegistration',
			dataMapping: {},
			needServer: true,
		},
		kwai: {
			event: 'completeRegistration',
			dataMapping: {},
			needServer: false,
		},
		gtm: {
			event: 'completeRegistration',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: 'register',
			dataMapping: {},
			needServer: false,
		},
		mgSky: {
			event: 'EVENT_COMPLETE_REGISTRATION',
			dataMapping: {},
			needServer: false,
		},
	},
	registerClick: {
		name: '注册点击',
		fbq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		ttq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		kwai: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		gtm: {
			event: 'registerClick',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: 'registerClick',
			dataMapping: {},
			needServer: false,
		},
		mgSky: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
	},
	login: {
		name: '登录',
		fbq: {
			event: 'SubmitApplication',
			dataMapping: {},
			needServer: false,
		},
		ttq: {
			event: 'SubmitForm',
			dataMapping: {},
			needServer: true,
		},
		kwai: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		gtm: {
			event: 'login',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: 'login',
			dataMapping: {},
			needServer: false,
		},
		mgSky: {
			event: 'EVENT_FORM_SUBMIT',
			dataMapping: {},
			needServer: false,
		},
	},
	logout: {
		name: '登出',
		fbq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		ttq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		kwai: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		gtm: {
			event: 'logout',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: 'logout',
			dataMapping: {},
			needServer: false,
		},
		mgSky: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
	},
	playGame: {
		name: '开始游戏',
		fbq: {
			event: 'StartTrial',
			dataMapping: {},
			needServer: false,
		},
		ttq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		kwai: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		gtm: {
			event: 'enterGame',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: 'enterGame',
			dataMapping: {},
			needServer: false,
		},
		mgSky: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
	},
	addToCart: {
		name: '加入购物车',
		fbq: {
			event: 'AddToCart',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
		ttq: {
			event: 'AddToCart',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
		gtm: {
			event: 'addToCart',
			dataMapping: {},
			needServer: false,
		},
		kwai: {
			event: 'addToCart',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		mgSky: {
			event: 'EVENT_ADD_TO_CART',
			dataMapping: {},
			needServer: false,
		},
	},
	initiateCheckout: {
		name: '拉起订单',
		fbq: {
			event: 'InitiateCheckout',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
		ttq: {
			event: 'InitiateCheckout',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
		kwai: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		gtm: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: 'rechargeClick',
			dataMapping: {
				currency: 'currency',
				amount: 'amount',
			},
			needServer: false,
		},
		mgSky: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
	},
	firstpay: {
		name: '首充',
		fbq: {
			event: 'Purchase',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
		ttq: {
			event: 'Subscribe',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: true,
		},
		kwai: {
			event: 'firstDeposit',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
		gtm: {
			event: 'firstDeposit',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
		android: {
			event: 'firstrecharge',
			dataMapping: {
				currency: 'currency',
				amount: 'amount',
			},
			needServer: false,
		},
		mgSky: {
			event: 'EVENT_FIRST_DEPOSIT',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
	},
	pay: {
		name: '充值',
		fbq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		ttq: {
			event: 'CompletePayment',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: true,
		},
		kwai: {
			event: 'purchase',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
		gtm: {
			event: 'purchase',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
		android: {
			event: 'recharge',
			dataMapping: {
				currency: 'currency',
				amount: 'amount',
			},
			needServer: false,
		},
		mgSky: {
			event: 'EVENT_PURCHASE',
			dataMapping: {
				currency: 'currency',
				amount: 'value',
			},
			needServer: false,
		},
	},
	download: {
		name: '下载',
		fbq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		ttq: {
			event: 'Download',
			dataMapping: {},
			needServer: false,
		},
		kwai: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		gtm: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		mgSky: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
	},
	installPWA: {
		name: '安装PWA',
		fbq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		ttq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		kwai: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		gtm: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		mgSky: {
			event: 'EVENT_PWA_INSTALL',
			dataMapping: {},
			needServer: false,
		},
	},
	openPWA: {
		name: '打开PWA',
		fbq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		ttq: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		kwai: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		gtm: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		android: {
			event: '',
			dataMapping: {},
			needServer: false,
		},
		mgSky: {
			event: 'EVENT_PWA_OPEN',
			dataMapping: {},
			needServer: false,
		},
	}
}

export type AdTypes = keyof typeof AdConfigMap
