import { NoopFunc } from './types'

export function firstOne<T extends any = any>(input: T[] | Set<T>) {
  if (Array.isArray(input)) return input[0]
  return input.values().next().value
}

export function lastOne<T extends any = any>(input: T[] | Set<T>) {
  if (Array.isArray(input)) return input[input.length - 1]
  const arr = [...input]
  return arr[arr.length - 1]
}

export function deleteFromArray<T>(
  target: T[],
  filter: string | ((value: T) => boolean),
) {
  const index =
    typeof filter === 'function'
      ? target.findIndex(filter)
      : target.findIndex((i) => i === filter)
  if (index >= 0) target.splice(index, 1)
}

export function flushFuncs<T extends NoopFunc>(input: T[] | Set<T>) {
  input.forEach((callback) => callback())
  Array.isArray(input) ? (input.length = 0) : input.clear()
}

export function clampIndex<T extends any = any>(arr: T[], index?: number) {
  return Math.max(0, Math.min(arr.length, index ?? arr.length))
}

export function loopFor<T>(
  arr: T[],
  callback: (cur: T, next: T, prev: T, index: number) => 'continue' | 'break' | void,
) {
  for (let index = 0; index < arr.length; index++) {
    const left = index === 0 ? arr.length - 1 : index - 1
    const right = index === arr.length - 1 ? 0 : index + 1
    const res = callback(arr[index], arr[right], arr[left], index)
    if (res === 'break') break
    if (res === 'continue') continue
  }
}
