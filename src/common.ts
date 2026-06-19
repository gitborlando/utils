import { AnyObject } from './types'

export const ThisAsAny = globalThis as any

export function iife<T extends any = any>(callback: () => T): T {
  return callback()
}

export function matchCase<T extends string, R extends any>(
  Case: T,
  obj: Partial<Record<T, R>> & { _default?: R },
): R | undefined
export function matchCase<T extends string, R extends any>(
  ...args: [T, Partial<Record<T, R>> & { _default?: R }]
) {
  const [Case, obj] = args
  return obj[Case] ?? obj._default
}

export function Log<T>(someThing: T, label: string = '') {
  console.log(label, someThing)
  return someThing
}

export function clone<T extends any>(object: T): T {
  if (typeof object !== 'object' || object === null) return object
  const newObj: any = Array.isArray(object) ? [] : {}
  for (const key in object) newObj[key] = clone(object[key])
  return newObj
}

export function jsonFy(obj: any) {
  return JSON.stringify(obj, null, 2)
}

export function jsonParse<T = any>(obj: any, fallback?: T) {
  try {
    return JSON.parse(obj) as T
  } catch (e) {
    console.log('jsonParse error', e)
    return fallback
  }
}

export function objKeys<K extends string>(obj: Partial<Record<K, any>>) {
  return Object.keys(obj) as K[]
}

const objectIdMap = new WeakMap<AnyObject, string>()
export function objectId(obj: AnyObject): string {
  let id = objectIdMap.get(obj)
  if (id === undefined) {
    id = miniId(8)
    objectIdMap.set(obj, id)
  }
  return id
}

export function suffixOf(input?: string, lowerCase = false) {
  if (!input) return ''
  const index = input.lastIndexOf('.')
  if (index === -1) return ''
  const suffix = input.slice(index + 1)
  return lowerCase ? suffix.toLowerCase() : suffix
}

export function createFuncAOP<T extends (...args: any[]) => any>({
  before,
  after,
}: {
  before?: (...args: Parameters<T>) => void
  after?: (result: ReturnType<T>, ...args: Parameters<T>) => void
} = {}) {
  return (func: T) => {
    return ((...args: Parameters<T>) => {
      before?.(...args)
      const result = func(...args)
      after?.(result, ...args)
      return result
    }) as T
  }
}

export function safeTimeout(func: () => any, delay = 0) {
  const id = setTimeout(() => {
    try {
      func()
    } finally {
      clearTimeout(id)
    }
  }, delay)
}

export function miniId(
  size = 5,
  alphabet = '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ_abcdefghijklmnpqrstuvwxyz',
) {
  let id = ''
  let i = size | 0
  const len = alphabet.length
  while (i--) {
    id += alphabet[(Math.random() * len) | 0]
  }
  return id
}

export function optionalSet<T extends AnyObject>(
  obj: T | undefined | null,
  key: keyof T,
  value: T[keyof T],
) {
  if (obj) obj[key] = value
}
