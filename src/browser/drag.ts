import { IRect, IXY, XY } from '@gitborlando/geo'
import { iife } from 'src/common'
import { noopFunc } from 'src/types'

export type DragData = {
  current: IXY
  start: IXY
  shift: IXY
  marquee: IRect
}

export class DragHelper {
  canMove = false
  started = false
  private current = XY.of(0, 0)
  private start = XY.of(0, 0)
  private shift = XY.of(0, 0)
  private marquee = { x: 0, y: 0, width: 0, height: 0 }
  private startHandler?: (e: MouseEvent) => any
  private moveHandler?: (e: MouseEvent) => any
  private endHandler?: (e: MouseEvent) => any
  private isInfinity = false
  private needThrottle = false

  constructor(options?: { throttle?: boolean }) {
    this.needThrottle = options?.throttle ?? true
  }

  needInfinity = () => {
    this.isInfinity = true
    return this
  }

  onStart = (callback?: (data: DragData) => void) => {
    if (this.startHandler) return this

    this.startHandler = (e) => {
      if (this.isInfinity) {
        document.body.requestPointerLock()
      }

      this.canMove = true
      this.started = true
      this.current = XY.client(e)
      this.start = XY.client(e)
      this.marquee = this.calculateMarquee()
      this.last = this.current

      callback?.({
        current: this.current.plain(),
        start: this.start.plain(),
        shift: this.shift.plain(),
        marquee: this.marquee,
      })
    }

    window.addEventListener('mousedown', this.startHandler)

    return this
  }

  private movePending = false
  private last = XY.of(0, 0)

  onMove = (callback: (data: DragData & { delta: IXY }) => void) => {
    if (this.moveHandler) return this

    this.moveHandler = (e) => {
      if (this.movePending) return
      this.movePending = true

      const throttleFunc = this.needThrottle ? requestAnimationFrame : iife

      throttleFunc(() => {
        this.movePending = false

        if (!this.canMove) return
        this.canMove = true

        if (!this.started) {
          this.startHandler?.(e)
          this.started = true
        }

        this.current = XY.client(e)
        this.shift = this.current.minus(this.start)
        this.marquee = this.calculateMarquee()

        const delta = this.current.minus(this.last)
        this.last = this.current

        callback({
          current: this.current.plain(),
          start: this.start.plain(),
          shift: this.shift.plain(),
          delta: delta.plain(),
          marquee: this.marquee,
        })
      })
    }

    window.addEventListener('mousemove', this.moveHandler)

    return this
  }

  onDestroy = (callback?: (data: DragData & { moved: boolean }) => void) => {
    if (this.endHandler) return this

    this.endHandler = () => {
      if (!this.canMove) return

      this.marquee = this.calculateMarquee()

      callback?.({
        current: this.current.plain(),
        start: this.start.plain(),
        shift: this.shift.plain(),
        marquee: this.marquee,
        moved: this.shift.x !== 0 || this.shift.y !== 0,
      })

      this.destroy()
    }

    window.addEventListener('mouseup', this.endHandler)

    return this
  }

  onSlide = (callback: (data: DragData & { delta: IXY }) => void) => {
    this.onStart().onMove(callback).onDestroy()
    return this
  }

  private destroy = () => {
    window.removeEventListener('mousedown', this.startHandler || noopFunc)
    window.removeEventListener('mousemove', this.moveHandler || noopFunc)
    window.removeEventListener('mouseup', this.endHandler || noopFunc)
    this.startHandler = undefined
    this.moveHandler = undefined
    this.endHandler = undefined

    if (this.isInfinity) {
      document.exitPointerLock()
    }

    this.setDataToDefault()
  }

  private calculateMarquee = () => {
    this.marquee = { x: this.start.x, y: this.start.y, width: 0, height: 0 }
    if (this.shift.x >= 0 && this.shift.y >= 0) {
      this.marquee.width = this.shift.x
      this.marquee.height = this.shift.y
    }
    if (this.shift.x >= 0 && this.shift.y < 0) {
      this.marquee.y = this.start.y + this.shift.y
      this.marquee.width = this.shift.x
      this.marquee.height = -this.shift.y
    }
    if (this.shift.x < 0 && this.shift.y >= 0) {
      this.marquee.x = this.start.x + this.shift.x
      this.marquee.width = -this.shift.x
      this.marquee.height = this.shift.y
    }
    if (this.shift.x < 0 && this.shift.y < 0) {
      this.marquee.x = this.start.x + this.shift.x
      this.marquee.y = this.start.y + this.shift.y
      this.marquee.width = -this.shift.x
      this.marquee.height = -this.shift.y
    }
    return this.marquee
  }

  private setDataToDefault = () => {
    this.started = false
    this.canMove = false
    this.movePending = false
    this.isInfinity = false
    this.current = XY.of(0, 0)
    this.start = XY.of(0, 0)
    this.shift = XY.of(0, 0)
    this.last = XY.of(0, 0)
    this.marquee = { x: 0, y: 0, width: 0, height: 0 }
  }
}
