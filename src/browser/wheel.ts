import { Signal } from '@gitborlando/signal'

export type WheelData = { e: WheelEvent; direction: 1 | -1 }

export class WheelUtil {
  beforeWheel = Signal.create<WheelData>()
  duringWheel = Signal.create<WheelData>()
  afterWheel = Signal.create<WheelData>()

  private wheelTimeOut?: any
  private curFrameTriggered = false

  onWheel = (e: WheelEvent) => {
    const direction = e.deltaY > 0 ? 1 : -1

    if (this.wheelTimeOut) {
      clearTimeout(this.wheelTimeOut)
    } else {
      this.beforeWheel.dispatch({ e, direction })
    }

    if (!this.curFrameTriggered) {
      this.curFrameTriggered = true
      this.duringWheel.dispatch({ e, direction })
      requestAnimationFrame(() => (this.curFrameTriggered = false))
    }

    this.wheelTimeOut = setTimeout(() => {
      this.wheelTimeOut = undefined
      this.afterWheel.dispatch({ e, direction })
    }, 250)
  }
}
