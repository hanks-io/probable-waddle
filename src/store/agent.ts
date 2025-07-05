import { defineStore } from 'pinia';
import { Storage } from '@ionic/storage';
import { mlmAgentLevelIcon, mlmAgentLevelName } from '@/views/mlmAgent/data'
import { storeDefaultValue } from '@/hooks/StoreDefaultValue';
import { agencyConfigApi, agencyInfoApi, agencyShareConfigApi } from '@/api/agent';
import { AgencyConfigModel, AgencyInfoModel, AgencyShareConfigItem } from '@/api/agent/model';
import { getTheme } from '@/theme/hooks';

const storage = new Storage();
export type ThemeList = ['twitter', 'dark', 'light'];

(async () => {
	await storage.create()
})()

export const useAgentStore = defineStore({
	id: 'agent',
	state: () => ({
		agencyInfo: storeDefaultValue<AgencyInfoModel['info']>(), 		// 代理信息
		config: storeDefaultValue<AgencyConfigModel['configList']>(),	// 代理配置
		shareConfig: storeDefaultValue<AgencyShareConfigItem[]>(),	  // 分享软件配置
		agentConfig: storeDefaultValue<any['templateInfo']>(),           // 多级分销/无限级代理配置
	}),
	getters: {
		isHasCommission(state): boolean {
			return state.agencyInfo?.unclaimedCommission
		},
		
	},
	actions: {
		// 获取代理配置
		async getConfig() {
			if (!this.config) {
				this.config = await getConfigRequest();
				this.config.commissionDistributeTime = "4:00-8:00";
			}
				
			return this.config;
		},
		// 设置代理配置信息
		async setConfig() {
			this.config = await getConfigRequest();
			this.config.commissionDistributeTime = "4:00-8:00";
			return this.config;
		},
		// 获取代理信息
		async setAgencyInfo() {
			this.agencyInfo = await agencyInfoRequest();
			return this.agencyInfo
		},
		// 获取代理信息
		async getAgencyInfo() {
			if (!this.agencyInfo)
				this.agencyInfo = await agencyInfoRequest();
			return this.agencyInfo
		},
		// 获取分享软件配置
		async getShareConfig() {
			const { skin, theme } = getTheme()
			const data = await agencyShareConfigApi();
			this.shareConfig = data.software.map((item: string) => {
				const config = JSON.parse(item);
				const type = config.type.toLowerCase();
				if (skin === 'default' || skin === 'second') {
					config.icon = `/svg/share/${type}.svg`
				} else {
					config.icon = `/first/svg/share/${type}.svg`
				}
				return config
			}).sort((a: AgencyShareConfigItem, b: AgencyShareConfigItem) => b.sort - a.sort);
			return this.shareConfig;
		},
		// 重置代理信息
		resetAgencyInfo() {
			agencyInfoRequest().then(res => {
				if (res)
					this.agencyInfo = res
			})
		},
		// 设置多级分销/无限级差配置数据
		async setAgentConfig() {
			this.agentConfig = await getAgentConfigRequest();
			return this.agentConfig
		},
		// 获取多级分销/无线级差配置数据
		async getAgentConfig() {
			if (!this.agentConfig)
				this.agentConfig = await getAgentConfigRequest();
			return this.agentConfig
		},
		// 获取多级分销当前代理级别多语言级别名称
		getMlmAgentLevelInfo(level: number | string, type: string) {
			const currentLevel = (Number(level) - 1) <= 0 ? 0 : Number(level) - 1;
			switch (type) {
				case 'icon':
					return `/first/agent/${mlmAgentLevelIcon[currentLevel]}.png`;
				case 'name':
					return mlmAgentLevelName[currentLevel]
			}
		}
	},
});

/**
 * @description 获取代理配置
 */
export async function getConfigRequest() {
	const res = await agencyConfigApi();
	if (res && 'configList' in res)
		return res.configList;
}

/**
 * @description 获取新代理配置
 * 多级分销 无线级差
 */
export async function getAgentConfigRequest() {
	const res = await agencyConfigApi();
	if (res && 'templateInfo' in res)
		return { ...res.templateInfo, isOpen: res.rankConfig?.isOpen, ossUrl: res.ossUrl }
}

/**
 * @description 获取代理信息
 */
async function agencyInfoRequest() {
	const res = await agencyInfoApi();
	if (res && 'info' in res)
		return res.info
}
