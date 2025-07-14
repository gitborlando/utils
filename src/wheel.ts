export type WheelData = { e: WheelEvent; direction: 1 | -1 }

export class WheelUtil {
  private beforeWheelHandler?: (data: WheelData) => void
  private duringWheelHandler?: (data: WheelData) => void
  private afterWheelHandler?: (data: WheelData) => void
  private wheelTimeOut?: any
  private curFrameTriggered = false

  onBeforeWheel = (handler: (data: WheelData) => void) => {
    this.beforeWheelHandler = handler
  }

  onDuringWheel = (handler: (data: WheelData) => void) => {
    this.duringWheelHandler = handler
  }

  onAfterWheel = (handler: (data: WheelData) => void) => {
    this.afterWheelHandler = handler
  }

  onWheel = (e: WheelEvent) => {
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
