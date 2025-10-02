import { Is } from 'src/is'
import { createObjCache } from './cache'
import { AnyObject, NoopFunc } from './types'

export const This = globalThis as any

export function Delete<T>(object: Record<string, T>, key: string): void
export function Delete<T>(target: T[], find: string | ((value: T) => void)): void
export function Delete<T>(
  target: Record<string, T> | T[],
  filter: string | ((value: T) => void),
) {
  if (Array.isArray(target)) {
    const index =
      typeof filter === 'function'
        ? target.findIndex(filter)
        : target.findIndex((i) => i === filter)
    index >= 0 && target.splice(index, 1)
  } else {
    delete target[filter as string]
  }
}

export function iife<T extends any = any>(callback: () => T): T {
  return callback()
}

export function matchCase<T extends string, R extends any>(
  Case: T,
  obj: Record<T, R>,
): R
export function matchCase<T extends string, R extends any>(
  Case: T,
  Default: R,
  obj: Record<T, R>,
): R
export function matchCase<T extends string, R extends any>(
  ...args: [T, R, Record<T, R>] | [T, Record<T, R>]
) {
  if (args.length === 2) {
    const [Case, obj] = args
    return obj[Case]
  } else {
    const [Case, Default, obj] = args
    return obj[Case] || Default
  }
}

export function Log<T>(someThing: T, label: string = '') {
  console.log(label, someThing)
  return someThing
}

const macroMatchCache = createObjCache()
export function macroMatch(_input: TemplateStringsArray) {
  const input = _input[0]
  const test: any = macroMatchCache.getSet(input, () => {
    const right = input.trimStart().trimEnd().split('|')
    return new Function(
      'left',
      right.reduce((all, i) => {
        return `if(left === ${i})return true;` + all
      }, 'return false;'),
    )
  })
  return (left: any) => test(left)
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

export function memorize<T extends any[], R extends any>(func: (...args: T) => R) {
  const cache = createObjCache<R>()
  return (...args: T) => {
    const key = args.join('-')
    return cache.getSet(key, () => func(...args))
  }
}

export function debounce<T extends any[], R extends any>(
  wait: number,
  func: (...args: T) => R,
) {
  let timeout: any
  return (...args: T) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function objKeys<K extends string>(obj: Partial<Record<K, any>>) {
  return Object.keys(obj) as K[]
}

export class Raf {
  private ids: number[] = []
  request(callback: (next: NoopFunc) => void) {
    const id = requestAnimationFrame(() => callback(() => this.request(callback)))
    this.ids.push(id)
    return this
  }
  cancelAll() {
    this.ids.forEach(cancelAnimationFrame)
    return this
  }
}

const objectKeyMap = new WeakMap<AnyObject, string>()
export function objectKey(obj: AnyObject) {
  if (!objectKeyMap.has(obj)) {
    objectKeyMap.set(obj, miniId())
  }
  return objectKeyMap.get(obj)
}

export function suffixOf(input?: string, lowerCase = false) {
  if (!input) return ''
  const index = input.lastIndexOf('.')
  if (index === -1) return ''
  const suffix = input.slice(index + 1)
  return lowerCase ? suffix.toLowerCase() : suffix
}

export function createFuncAOP<T extends (...args: any[]) => any>(
  before?: (...args: any[]) => void,
  after?: (...args: any[]) => void,
) {
  return (func: T) => {
    return (...args: Parameters<T>) => {
      before?.(...args)
      const result = func(...args)
      after?.(...args)
      return result
    }
  }
}

export function SetTimeout(func: () => any, time = 0) {
  const id = setTimeout(() => {
    func()
    clearTimeout(id)
  }, time)
}

export function optionalSet<T>(
  target: T | undefined | null,
  key: keyof T,
  value: T[keyof T],
) {
  if (Is.nullable(target)) return
  target[key] = value
}

export function miniId(
  size = 8,
  alphabet = '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ_abcdefghijklmnpqrstuvwxyz',
) {
  let id = ''
  let i = size | 0
  while (i--) {
    id += alphabet[(Math.random() * 61) | 0]
  }
  return id
}

export function ensure<T>(
  maybeUndefinedOrNull: T,
  fallback: Exclude<T, undefined | null>,
) {
  if (maybeUndefinedOrNull) return maybeUndefinedOrNull
  return (maybeUndefinedOrNull = fallback)
}
