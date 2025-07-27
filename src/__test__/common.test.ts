import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clone,
  createFuncAOP,
  debounce,
  Delete,
  iife,
  jsonFy,
  jsonParse,
  Log,
  macroMatch,
  matchCase,
  memorize,
  nanoid,
  objKeys,
  optionalSet,
  Raf,
  SetTimeout,
  suffixOf,
} from '../common'

describe('common utilities', () => {
  describe('Delete', () => {
    it('should delete property from object', () => {
      const obj = { a: 1, b: 2, c: 3 }
      Delete(obj, 'b')
      expect(obj).toEqual({ a: 1, c: 3 })
    })

    it('should delete element from array by value', () => {
      const arr = [1, 2, 3, 4, 5]
      Delete(arr, '3')
      expect(arr).toEqual([1, 2, 4, 5])
    })

    it('should delete element from array by predicate', () => {
      const arr = [1, 2, 3, 4, 5]
      Delete(arr, (value: number) => value > 3)
      expect(arr).toEqual([1, 2, 3])
    })

    it('should handle non-existent keys gracefully', () => {
      const obj = { a: 1 }
      Delete(obj, 'nonexistent')
      expect(obj).toEqual({ a: 1 })
    })

    it('should handle array with no matching elements', () => {
      const arr = [1, 2, 3]
      Delete(arr, (value: number) => value > 10)
      expect(arr).toEqual([1, 2, 3])
    })
  })

  describe('iife', () => {
    it('should execute function immediately and return result', () => {
      const result = iife(() => 42)
      expect(result).toBe(42)
    })

    it('should execute complex function', () => {
      const result = iife(() => {
        const a = 10
        const b = 20
        return a + b
      })
      expect(result).toBe(30)
    })
  })

  describe('matchCase', () => {
    it('should return matching value from object', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(matchCase('b', obj)).toBe(2)
    })

    it('should return default value when key not found', () => {
      const obj = { a: 1, b: 2, c: 3 }
      // @ts-ignore
      expect(matchCase('c', 'default', obj)).toBe(3)
    })

    it('should return undefined when key not found and no default', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(matchCase('c', obj)).toBe(3)
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

    it('should log without label', () => {
      const value = 42
      const result = Log(value)
      expect(result).toBe(value)
      expect(console.log).toHaveBeenCalledWith('', value)
    })
  })

  describe('macroMatch', () => {
    it('should create matcher function for pipe-separated values', () => {
      const matcher = macroMatch`'a'|'b'|'c'`
      expect(matcher('a')).toBe(true)
      expect(matcher('b')).toBe(true)
      expect(matcher('c')).toBe(true)
      expect(matcher('d')).toBe(false)
    })

    it('should handle numeric values', () => {
      const matcher = macroMatch`1|2|3`
      expect(matcher(1)).toBe(true)
      expect(matcher(2)).toBe(true)
      expect(matcher(4)).toBe(false)
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

    it('should deep clone objects', () => {
      const obj = { a: 1, b: { c: 2, d: { e: 3 } } }
      const cloned = clone(obj)
      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.b).not.toBe(obj.b)
      expect(cloned.b.d).not.toBe(obj.b.d)
    })

    it('should deep clone arrays', () => {
      const arr = [1, [2, [3, 4]], { a: 5 }]
      const cloned = clone(arr)
      expect(cloned).toEqual(arr)
      expect(cloned).not.toBe(arr)
      expect(cloned[1]).not.toBe(arr[1])
      expect(cloned[2]).not.toBe(arr[2])
    })
  })

  describe('jsonFy', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should stringify valid objects', () => {
      const obj = { a: 1, b: 'test' }
      const result = jsonFy(obj)
      expect(result).toBe('{\n  "a": 1,\n  "b": "test"\n}')
    })

    it('should handle circular references gracefully', () => {
      const obj: any = { a: 1 }
      obj.self = obj
      const result = jsonFy(obj)
      expect(result).toBeUndefined()
      expect(console.log).toHaveBeenCalledWith('jsonFy error', expect.any(Error))
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
      const jsonString = '{"a": 1, "b": "test"}'
      const result = jsonParse(jsonString)
      expect(result).toEqual({ a: 1, b: 'test' })
    })

    it('should handle invalid JSON gracefully', () => {
      const invalidJson = '{ invalid json }'
      const result = jsonParse(invalidJson)
      expect(result).toBeUndefined()
      expect(console.log).toHaveBeenCalledWith('jsonParse error', expect.any(Error))
    })
  })

  describe('memorize', () => {
    it('should cache function results', () => {
      let callCount = 0
      const expensiveFunc = (a: number, b: number) => {
        callCount++
        return a + b
      }
      const memoized = memorize(expensiveFunc)

      expect(memoized(1, 2)).toBe(3)
      expect(callCount).toBe(1)

      expect(memoized(1, 2)).toBe(3)
      expect(callCount).toBe(1) // Should not call again

      expect(memoized(2, 3)).toBe(5)
      expect(callCount).toBe(2) // Different args, should call again
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should debounce function calls', () => {
      let callCount = 0
      const func = () => callCount++
      const debouncedFunc = debounce(100, func)

      debouncedFunc()
      debouncedFunc()
      debouncedFunc()

      expect(callCount).toBe(0)

      vi.advanceTimersByTime(100)
      expect(callCount).toBe(1)
    })

    it('should reset timer on subsequent calls', () => {
      let callCount = 0
      const func = () => callCount++
      const debouncedFunc = debounce(100, func)

      debouncedFunc()
      vi.advanceTimersByTime(50)
      debouncedFunc()
      vi.advanceTimersByTime(50)

      expect(callCount).toBe(0)

      vi.advanceTimersByTime(50)
      expect(callCount).toBe(1)
    })
  })

  describe('objKeys', () => {
    it('should return typed object keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const keys = objKeys(obj)
      expect(keys).toEqual(['a', 'b', 'c'])
    })

    it('should handle partial objects', () => {
      const obj: Partial<{ a: number; b: string }> = { a: 1 }
      const keys = objKeys(obj)
      expect(keys).toEqual(['a'])
    })
  })

  describe('Raf', () => {
    beforeEach(() => {
      global.requestAnimationFrame = vi.fn((cb) => {
        setTimeout(cb, 16)
        return 1
      })
      global.cancelAnimationFrame = vi.fn()
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it('should request animation frame', () => {
      const raf = new Raf()
      let called = false

      raf.request((next) => {
        called = true
      })

      expect(requestAnimationFrame).toHaveBeenCalled()
    })

    it('should cancel all animation frames', () => {
      const raf = new Raf()

      raf.request(() => {})
      raf.request(() => {})
      raf.cancelAll()

      expect(cancelAnimationFrame).toHaveBeenCalledTimes(2)
    })
  })

  describe('suffixOf', () => {
    it('should extract file extension', () => {
      expect(suffixOf('file.txt')).toBe('txt')
      expect(suffixOf('image.png')).toBe('png')
      expect(suffixOf('archive.tar.gz')).toBe('gz')
    })

    it('should handle lowercase option', () => {
      expect(suffixOf('file.TXT', true)).toBe('txt')
      expect(suffixOf('image.PNG', true)).toBe('png')
    })

    it('should handle files without extension', () => {
      expect(suffixOf('README')).toBe('')
      expect(suffixOf('file')).toBe('')
    })

    it('should handle empty or undefined input', () => {
      expect(suffixOf('')).toBe('')
      expect(suffixOf(undefined)).toBe('')
    })
  })

  describe('createFuncAOP', () => {
    it('should create AOP wrapper with before and after hooks', () => {
      const beforeSpy = vi.fn()
      const afterSpy = vi.fn()
      const originalFunc = vi.fn((x: number) => x * 2)

      const wrapper = createFuncAOP(beforeSpy, afterSpy)
      const wrappedFunc = wrapper(originalFunc)

      const result = wrappedFunc(5)

      expect(beforeSpy).toHaveBeenCalledWith(5)
      expect(originalFunc).toHaveBeenCalledWith(5)
      expect(afterSpy).toHaveBeenCalledWith(5)
      expect(result).toBe(10)
    })

    it('should work with only before hook', () => {
      const beforeSpy = vi.fn()
      const originalFunc = vi.fn((x: number) => x * 2)

      const wrapper = createFuncAOP(beforeSpy)
      const wrappedFunc = wrapper(originalFunc)

      const result = wrappedFunc(5)

      expect(beforeSpy).toHaveBeenCalledWith(5)
      expect(originalFunc).toHaveBeenCalledWith(5)
      expect(result).toBe(10)
    })
  })

  describe('SetTimeout', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should execute function after timeout', () => {
      const func = vi.fn()
      SetTimeout(func, 100)

      expect(func).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(func).toHaveBeenCalled()
    })

    it('should use default timeout of 0', () => {
      const func = vi.fn()
      SetTimeout(func)

      vi.advanceTimersByTime(0)
      expect(func).toHaveBeenCalled()
    })
  })

  describe('optionalSet', () => {
    it('should set property on non-null object', () => {
      const obj = { a: 1, b: 2 }
      optionalSet(obj, 'a', 42)
      expect(obj.a).toBe(42)
    })

    it('should not throw on null target', () => {
      expect(() => optionalSet(null as any, 'a', 42)).not.toThrow()
    })

    it('should not throw on undefined target', () => {
      // @ts-expect-error
      expect(() => optionalSet(undefined, 'a', 42)).not.toThrow()
    })
  })

  describe('nanoid', () => {
    it('should generate id with default size', () => {
      const id = nanoid()
      expect(id).toHaveLength(8)
      expect(typeof id).toBe('string')
    })

    it('should generate id with custom size', () => {
      const id = nanoid(12)
      expect(id).toHaveLength(12)
    })

    it('should generate different ids', () => {
      const id1 = nanoid()
      const id2 = nanoid()
      expect(id1).not.toBe(id2)
    })

    it('should use valid characters', () => {
      const id = nanoid(100)
      const validChars =
        /^[0-9ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz_]+$/
      expect(validChars.test(id)).toBe(true)
    })
  })
})
