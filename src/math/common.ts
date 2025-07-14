export const { PI, cos, sin, tan, acos, asin, atan, atan2 } = Math
export const { sqrt, abs, min, max, round, floor, ceil, random } = Math

export const dCos = (degree: number) => cos(radianFy(degree))
export const dSin = (degree: number) => sin(radianFy(degree))
export const dTan = (degree: number) => tan(radianFy(degree))
export const dAcos = (degree: number) => acos(radianFy(degree))
export const dAsin = (degree: number) => asin(radianFy(degree))
export const dAtan = (degree: number) => atan(radianFy(degree))
export const dAtan2 = (y: number, x: number) => degreeFy(atan2(y, x))

export function pow2(number: number) {
  return Math.pow(number, 2)
}
export function pow3(number: number) {
  return Math.pow(number, 3)
}

export function multiply(...numbers: number[]) {
  return numbers.reduce((i, all) => (all *= i), 1)
}
export function divide(a: number, b: number) {
  return b === 0 ? 1 : a / b
}

export function degreeFy(radians: number) {
  return radians * (180 / Math.PI)
}
export function radianFy(degrees: number) {
  return degrees * (Math.PI / 180)
}

export function numberHalfFix(number: number) {
  const integerPart = ~~number
  const floatPart = number - integerPart
  const halfFixed = floatPart >= 0.75 ? 1 : floatPart >= 0.25 ? 0.5 : 0
  return integerPart + halfFixed
}

export function rotatePoint(
  ax: number,
  ay: number,
  ox: number,
  oy: number,
  degree: number,
) {
  const radian = radianFy(degree)
  return {
    x: (ax - ox) * cos(radian) - (ay - oy) * sin(radian) + ox,
    y: (ax - ox) * sin(radian) + (ay - oy) * cos(radian) + oy,
  }
}

export function normalAngle(angle: number) {
  return (angle + 360) % 360
}

export function snapAngle(angle: number, step = 90) {
  return normalAngle(Math.round(angle / step) * step)
}
