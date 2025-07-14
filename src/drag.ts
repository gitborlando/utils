import { xy_, xy_minus, xy_plus } from './math/xy'
import { IRect, IXY, noopFunc } from './types'

export type DragData = {
  current: IXY
  start: IXY
  shift: IXY
  delta?: IXY
  marquee: IRect
}

export class DragUtil {
  canMove = false
  started = false
  private current = { x: 0, y: 0 }
  private start = { x: 0, y: 0 }
  private shift = { x: 0, y: 0 }
  private marquee = { x: 0, y: 0, width: 0, height: 0 }
  private downHandler?: (event: MouseEvent) => any
  private startHandler?: (event: MouseEvent) => any
  private moveHandler?: (event: MouseEvent) => any
  private endHandler?: (event: MouseEvent) => any
  private isInfinity = false

  needInfinity = () => {
    this.isInfinity = true
    return this
  }

  onDown = (callback?: (data: DragData) => void) => {
    if (this.downHandler) return this

    this.downHandler = ({ clientX, clientY }) => {
      if (this.isInfinity) {
        document.body.requestPointerLock()
      }

      this.canMove = true
      this.current = { x: clientX, y: clientY }
      this.start = { x: clientX, y: clientY }
      this.marquee = this.calculateMarquee()

      callback?.({
        current: this.current,
        start: this.start,
        shift: this.shift,
        marquee: this.marquee,
      })
    }

    window.addEventListener('mousedown', this.downHandler)

    return this
  }

  onStart = (callback?: (data: DragData) => void) => {
    if (this.startHandler) return this

    this.startHandler = ({ clientX, clientY }) => {
      this.current = { x: clientX, y: clientY }
      this.start = { x: clientX, y: clientY }
      this.marquee = this.calculateMarquee()
      callback?.({
        current: this.current,
        start: this.start,
        shift: this.shift,
        marquee: this.marquee,
      })
    }

    if (!this.downHandler) {
      window.addEventListener('mousedown', () => {
        this.canMove = true
        if (this.isInfinity) document.body.requestPointerLock()
      })
    }

    return this
  }

  onMove = (callback: (data: DragData) => void) => {
    if (this.moveHandler) return this

    this.moveHandler = (event) => {
      if (!this.canMove) return
      this.canMove = true

      if (!this.started) {
        this.startHandler?.(event)
        this.started = true
      }

      const { movementX, movementY } = event
      const delta = xy_(movementX, movementY)
      this.current = xy_plus(this.current, delta)
      this.shift = xy_minus(this.current, this.start)
      this.marquee = this.calculateMarquee()

      callback({
        current: this.current,
        start: this.start,
        shift: this.shift,
        delta,
        marquee: this.marquee,
      })
    }

    window.addEventListener('mousemove', this.moveHandler)

    return this
  }

  onDestroy = (callback?: (data: DragData) => void) => {
    if (this.endHandler) return this

    this.endHandler = () => {
      if (!this.canMove) return

      this.marquee = this.calculateMarquee()
      callback?.({
        current: this.current,
        start: this.start,
        shift: this.shift,
        marquee: this.marquee,
      })

      this.destroy()
    }

    window.addEventListener('mouseup', this.endHandler)

    return this
  }

  onSlide = (callback: (data: DragData) => void) => {
    this.onStart().onMove(callback).onDestroy()
    return this
  }

  private destroy = () => {
    window.removeEventListener('mousedown', this.downHandler || noopFunc)
    window.removeEventListener('mousedown', this.startHandler || noopFunc)
    window.removeEventListener('mousemove', this.moveHandler || noopFunc)
    window.removeEventListener('mouseup', this.endHandler || noopFunc)
    this.downHandler = undefined
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
    this.isInfinity = false
    this.current = { x: 0, y: 0 }
    this.start = { x: 0, y: 0 }
    this.shift = { x: 0, y: 0 }
    this.marquee = { x: 0, y: 0, width: 0, height: 0 }
  }
}
