sync:
	cp ../nuxt/server/logic/db/types.ts ./src/enums/types.ts
	cp ../nuxt/server/logic/db/type/bank.types.ts ./src/enums/type/bank.types.ts
	cp ../nuxt/server/logic/db/type/payment.type.ts ./src/enums/type/payment.type.ts
	cp ../nuxt/server/logic/db/type/activity.type.ts ./src/enums/types/activity.type.ts
	cp ../nuxt/server/logic/db/type/config.type.ts ./src/enums/types/config.type.ts
	cp ../nuxt/server/logic/db/type/activityRule.ts ./src/i18n/ruleHelper/activityRule.ts
	cp ../nuxt/server/logic/db/type/activityRuleType.ts ./src/i18n/ruleHelper/activityRuleType.ts
	cp ../nuxt/server/logic/db/type/errorCode.ts ./src/enums/types/errorCode.ts
