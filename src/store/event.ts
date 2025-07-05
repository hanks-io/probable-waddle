import { defineStore } from 'pinia'
import { Storage } from '@ionic/storage'

const storage = new Storage()
;(async () => {
	await storage.create()
})()

export const useEventStore = defineStore({
	id: 'event',
	state: () => ({
		orderList: [] as string[],
		previousRoute: '/',
	}),

	getters: {
		async getOrderList(state) {
			if (state.orderList.length === 0) {
				const orderList = await storage.get('event_order_list')
				state.orderList = orderList ? JSON.parse(orderList) : []
			}
			return state.orderList
		},
	},

	actions: {
		async addOrder(order: string) {
			const orderList = await storage.get('event_order_list')
			const array = orderList ? JSON.parse(orderList) : []
			array.push(order)
			this.orderList = array
			await storage.set('event_order_list', JSON.stringify(array))
		},

		async checkOrder(order: string) {
			const orderList = await this.getOrderList
			const has = orderList.includes(order)
			if (!has) await this.addOrder(order)
			return has
		},

		/**
		 * 设置上一个路由
		 */
		setPreviousRoute(route: string) {
			this.previousRoute = route
		}
	},
})
