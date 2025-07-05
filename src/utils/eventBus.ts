class EventBus {
	private listeners: {
		[key: string]: Set<(data: any) => void>
	}
	constructor() {
		this.listeners = {}
	}

	// 订阅事件
	on(event: string, callback: (data: any) => void) {
		if (!this.listeners[event]) {
			this.listeners[event] = new Set()
		}
		this.listeners[event].add(callback)
	}

	// 取消订阅事件
	off(event: string, callback: (data: any) => void) {
		if (this.listeners[event]) {
			this.listeners[event].delete(callback)
			if (this.listeners[event].size === 0) {
				delete this.listeners[event]
			}
		}
	}

	// 发布事件
	emit(event: string, data?: any) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => callback(data))
		}
	}
}

// 导出一个事件中心实例
export const eventBus = new EventBus()
