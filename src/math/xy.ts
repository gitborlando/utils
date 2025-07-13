import { IXY } from '../types'
import { dCos, degreeFy, dSin, rotatePoint, sqrt } from './common'

export function xy_(x: number = 0, y: number = 0) {
  return { x, y }
}

export function xy_client(e: any) {
  return { x: e.clientX, y: e.clientY }
}

export function xy_from(xy: IXY) {
  return { x: xy.x, y: xy.y }
}

export function xy_center(xy: { centerX: number; centerY: number }) {
  return { x: xy.centerX, y: xy.centerY }
}

export function xy_mutate(self: IXY, another: IXY) {
  self.x = another.x
  self.y = another.y
}

export function xy_plus(self: IXY, another: IXY) {
  return { x: self.x + another.x, y: self.y + another.y }
}
export function xy_plus_mutate(self: IXY, another: IXY) {
  self.x = self.x + another.x
  self.y = self.y + another.y
}
export function xy_plus_all(...xys: IXY[]) {
  return xys.reduce((a, b) => xy_plus(a, b))
}

export function xy_minus(self: IXY, another: IXY) {
  return { x: self.x - another.x, y: self.y - another.y }
}
export function xy_minus_mutate(self: IXY, another: IXY) {
  self.x = self.x - another.x
  self.y = self.y - another.y
}

export function xy_multiply(self: IXY, ...numbers: number[]) {
  const n = numbers.reduce((a, b) => a * b, 1)
  return { x: self.x * n, y: self.y * n }
}
export function xy_multiply_mutate(self: IXY, ...numbers: number[]) {
  const n = numbers.reduce((a, b) => a * b, 1)
  self.x = self.x * n
  self.y = self.y * n
}

export function xy_divide(self: IXY, ...numbers: number[]) {
  const n = numbers.reduce((a, b) => a * b, 1)
  return { x: self.x / n, y: self.y / n }
}

export function xy_distance(self: IXY, another: IXY = xy_(0, 0)) {
  return Math.sqrt((self.x - another.x) ** 2 + (self.y - another.y) ** 2)
}

export function xy_rotate(self: IXY, origin: IXY, rotation: number) {
  if (rotation === 0) return self
  return rotatePoint(self.x, self.y, origin.x, origin.y, rotation)
}

export function xy_dot(self: IXY, another: IXY) {
  return self.x * another.x + self.y * another.y
}

export function xy_symmetric(self: IXY, origin: IXY) {
  return { x: 2 * origin.x - self.x, y: 2 * origin.y - self.y }
}

export function xy_opposite(self: IXY) {
  return { x: -self.x, y: -self.y }
}

export function xy_getRotation(self: IXY, another: IXY, origin: IXY) {
  return degreeFy(
    Math.atan2(self.y - origin.y, self.x - origin.x) -
      Math.atan2(another.y - origin.y, another.x - origin.x)
  )
}

export function xy_toArray(self: IXY) {
  return [self.x, self.y] as [number, number]
}

export function xy_xAxis(rotation: number) {
  return { x: dCos(rotation), y: dSin(rotation) }
}

export function xy_yAxis(rotation: number) {
  return { x: -dSin(rotation), y: dCos(rotation) }
}

export class XY {
  constructor(public x: number, public y: number) {}

  from(xy: IXY) {
    this.x = xy.x
    this.y = xy.y
    return this
  }

  client(e: { clientX: number; clientY: number }) {
    this.x = e.clientX
    this.y = e.clientY
    return this
  }

  center(xy: { centerX: number; centerY: number }) {
    this.x = xy.centerX
    this.y = xy.centerY
    return this
  }

  plus(another: IXY) {
    this.x = this.x + another.x
    this.y = this.y + another.y
    return this
  }

  minus(another: IXY) {
    this.x = this.x - another.x
    this.y = this.y - another.y
    return this
  }

  multiply(...numbers: number[]) {
    const n = numbers.reduce((a, b) => a * b, 1)
    this.x = this.x * n
    this.y = this.y * n
    return this
  }

  divide(...numbers: number[]) {
    const n = numbers.reduce((a, b) => a * b, 1)
    this.x = this.x / n
    this.y = this.y / n
    return this
  }

  distance(another: IXY) {
    return sqrt((this.x - another.x) ** 2 + (this.y - another.y) ** 2)
  }

  rotate(origin: IXY, rotation: number) {
    if (rotation === 0) return this
    return rotatePoint(this.x, this.y, origin.x, origin.y, rotation)
  }

  dot(another: IXY) {
    return this.x * another.x + this.y * another.y
  }

  opposite() {
    return { x: -this.x, y: -this.y }
  }

  symmetric(another: IXY, origin: IXY) {
    return { x: 2 * origin.x - another.x, y: 2 * origin.y - another.y }
  }

  angle(another: IXY, origin: IXY) {
    return degreeFy(
      Math.atan2(this.y - origin.y, this.x - origin.x) -
        Math.atan2(another.y - origin.y, another.x - origin.x)
    )
  }

  static From(xy: IXY) {
    return new XY(xy.x, xy.y)
  }

  static FromArray(arr: [number, number]) {
    return new XY(arr[0], arr[1])
  }
}
