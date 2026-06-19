import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clone,
  createFuncAOP,
  iife,
  jsonFy,
  jsonParse,
  Log,
  matchCase,
  miniId,
  objectId,
  objKeys,
  safeTimeout,
  suffixOf,
  ThisAsAny,
} from '../common'

describe('common utilities', () => {
  describe('ThisAsAny', () => {
    it('should expose globalThis as any', () => {
      expect(ThisAsAny).toBe(globalThis)
    })
  })

  describe('iife', () => {
    it('should execute function immediately and return result', () => {
      expect(iife(() => 42)).toBe(42)
    })
  })

  describe('matchCase', () => {
    it('should return matching value from object', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(matchCase('b', obj)).toBe(2)
    })

    it('should return _default value when key not found', () => {
      const obj = { a: 1, b: 2, _default: 99 }
      expect(matchCase('z', obj)).toBe(99)
    })

    it('should return undefined when key and _default both missing', () => {
      const obj = { a: 1, b: 2 }
      expect(matchCase('z', obj)).toBeUndefined()
    })

    it('should preserve falsy matched values instead of using _default', () => {
      const obj = { a: 0, b: false, _default: true }
      expect(matchCase('a', obj)).toBe(0)
      expect(matchCase('b', obj)).toBe(false)
    })
  })

  describe('Log', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should log value and return it', () => {
      const value = { test: 42 }
      const result = Log(value, 'test label')

      expect(result).toBe(value)
      expect(console.log).toHaveBeenCalledWith('test label', value)
    })
  })

  describe('clone', () => {
    it('should clone primitive values', () => {
      expect(clone(42)).toBe(42)
      expect(clone('string')).toBe('string')
      expect(clone(true)).toBe(true)
      expect(clone(null)).toBe(null)
      expect(clone(undefined)).toBe(undefined)
    })

    it('should deep clone plain objects and arrays', () => {
      const obj = { a: 1, b: { c: [2, { d: 3 }] } }
      const cloned = clone(obj)

      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.b).not.toBe(obj.b)
      expect(cloned.b.c).not.toBe(obj.b.c)
      expect(cloned.b.c[1]).not.toBe(obj.b.c[1])
    })
  })

  describe('jsonFy', () => {
    it('should stringify valid objects', () => {
      const obj = { a: 1, b: 'test' }
      expect(jsonFy(obj)).toBe('{\n  "a": 1,\n  "b": "test"\n}')
    })

    it('should throw for circular references', () => {
      const obj: any = { a: 1 }
      obj.self = obj

      expect(() => jsonFy(obj)).toThrow(TypeError)
    })
  })

  describe('jsonParse', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should parse valid JSON strings', () => {
      expect(jsonParse('{"a": 1, "b": "test"}')).toEqual({
        a: 1,
        b: 'test',
      })
    })

    it('should return fallback and log when JSON is invalid', () => {
      const fallback = { ok: false }

      expect(jsonParse('{ invalid json }', fallback)).toBe(fallback)
      expect(console.log).toHaveBeenCalledWith('jsonParse error', expect.any(Error))
    })
  })

  describe('objKeys', () => {
    it('should return typed object keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(objKeys(obj)).toEqual(['a', 'b', 'c'])
    })
  })

  describe('objectId', () => {
    it('should return stable ids for the same object', () => {
      const obj = {}

      expect(objectId(obj)).toBe(objectId(obj))
      expect(objectId(obj)).toHaveLength(8)
    })

    it('should return different ids for different objects', () => {
      expect(objectId({})).not.toBe(objectId({}))
    })
  })

  describe('suffixOf', () => {
    it('should extract file extension', () => {
      expect(suffixOf('file.txt')).toBe('txt')
      expect(suffixOf('archive.tar.gz')).toBe('gz')
    })

    it('should handle lowercase option', () => {
      expect(suffixOf('file.TXT', true)).toBe('txt')
    })

    it('should handle files without extension or empty input', () => {
      expect(suffixOf('README')).toBe('')
      expect(suffixOf('')).toBe('')
      expect(suffixOf(undefined)).toBe('')
    })
  })

  describe('createFuncAOP', () => {
    it('should create AOP wrapper with before and after hooks', () => {
      const beforeSpy = vi.fn()
      const afterSpy = vi.fn()
      const originalFunc = vi.fn((x: number) => x * 2)

      const wrapper = createFuncAOP<typeof originalFunc>({
        before: beforeSpy,
        after: afterSpy,
      })
      const wrappedFunc = wrapper(originalFunc)

      expect(wrappedFunc(5)).toBe(10)
      expect(beforeSpy).toHaveBeenCalledWith(5)
      expect(originalFunc).toHaveBeenCalledWith(5)
      expect(afterSpy).toHaveBeenCalledWith(10, 5)
    })

    it('should work without hooks', () => {
      const originalFunc = vi.fn((x: number) => x * 2)
      const wrappedFunc = createFuncAOP<typeof originalFunc>()(originalFunc)

      expect(wrappedFunc(5)).toBe(10)
      expect(originalFunc).toHaveBeenCalledWith(5)
    })
  })

  describe('safeTimeout', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should execute function after timeout', () => {
      const func = vi.fn()
      safeTimeout(func, 100)

      expect(func).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(func).toHaveBeenCalled()
    })

    it('should use default timeout of 0', () => {
      const func = vi.fn()
      safeTimeout(func)

      vi.advanceTimersByTime(0)
      expect(func).toHaveBeenCalled()
    })
  })

  describe('miniId', () => {
    it('should generate id with default size', () => {
      const id = miniId()

      expect(id).toHaveLength(5)
      expect(typeof id).toBe('string')
    })

    it('should generate id with custom size', () => {
      expect(miniId(12)).toHaveLength(12)
    })

    it('should use valid characters', () => {
      const id = miniId(100)
      const validChars =
        /^[0-9ABCDEFGHIJKLMNPQRSTUVWXYZ_abcdefghijklmnpqrstuvwxyz]+$/

      expect(validChars.test(id)).toBe(true)
    })
  })
})
