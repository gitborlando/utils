type WheelData = { e: WheelEvent; direction: 1 | -1 }

export class WheelUtil {
	private beforeWheelHandler?: (data: WheelData) => void
	private duringWheelHandler?: (data: WheelData) => void
	private afterWheelHandler?: (data: WheelData) => void
	private wheelTimeOut?: any
	private curFrameTriggered = false

	onBeforeWheel(callback: (data: WheelData) => void) {
		this.beforeWheelHandler = callback
	}

	onDuringWheel(callback: (data: WheelData) => void) {
		this.duringWheelHandler = callback
	}

	onAfterWheel(callback: (data: WheelData) => void) {
		this.afterWheelHandler = callback
	}

	onWheel(e: WheelEvent) {
		const direction = e.deltaY > 0 ? 1 : -1

		if (this.wheelTimeOut) {
			clearTimeout(this.wheelTimeOut)
		} else {
			this.beforeWheelHandler?.({ e, direction })
		}

		if (!this.curFrameTriggered) {
			this.curFrameTriggered = true
			this.duringWheelHandler?.({ e, direction })
			requestAnimationFrame(() => (this.curFrameTriggered = false))
		}

		this.wheelTimeOut = setTimeout(() => {
			this.wheelTimeOut = undefined
			this.afterWheelHandler?.({ e, direction })
		}, 250)
	}
}
