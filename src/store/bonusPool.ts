import { defineStore } from 'pinia';
import { prizePoolInfoApi } from '@/api/normal/index';


export const useBonusPoolStore = defineStore({
	id: 'bonusPool',
	state: () => ({
		money: 0,
	}),
	actions: {
		async getBonusPool() {
			const res = await bonusPoolApi();
			this.bonusPool = res;
		},
	},
})