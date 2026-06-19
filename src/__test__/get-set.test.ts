import { describe, expect, it } from 'vitest'
import { getSet } from '../get-set'

describe('cache utils', () => {
  describe('getSet', () => {
    it('should support Map, object, and WeakMap caches', () => {
      const map = new Map<string, number>()
      const obj: Record<string, number> = {}
      const weakMap = new WeakMap<object, number>()
      const weakKey = {}
      let callCount = 0
      const getValue = () => ++callCount

      expect(getSet(map, 'key1', getValue)).toBe(1)
      expect(getSet(map, 'key1', getValue)).toBe(1)

      expect(getSet(obj, 'key1', getValue)).toBe(2)
      expect(getSet(obj, 'key1', getValue)).toBe(2)

      expect(getSet(weakMap, weakKey, getValue)).toBe(3)
      expect(getSet(weakMap, weakKey, getValue)).toBe(3)
      expect(callCount).toBe(3)
    })

    it('should cache undefined values by key presence', () => {
      const map = new Map<string, undefined>()
      let callCount = 0
      const getValue = () => {
        callCount++
        return undefined
      }

      expect(getSet(map, 'key1', getValue)).toBeUndefined()
      expect(getSet(map, 'key1', getValue)).toBeUndefined()
      expect(callCount).toBe(1)
    })

    it('should refresh value when compare values change', () => {
      const cache = new Map<string, number>()
      let callCount = 0
      const getValue = () => ++callCount * 10

      expect(getSet(cache, 'key1', getValue, [1, 2])).toBe(10)
      expect(getSet(cache, 'key1', getValue, [1, 2])).toBe(10)
      expect(getSet(cache, 'key1', getValue, [1, 3])).toBe(20)
      expect(getSet(cache, 'key1', getValue, [1])).toBe(30)
      expect(callCount).toBe(3)
    })

    it('should refresh object cache values when compare values change', () => {
      const cache: Record<string, number> = {}
      let callCount = 0
      const getValue = () => ++callCount

      expect(getSet(cache, 'key1', getValue, ['a'])).toBe(1)
      expect(getSet(cache, 'key1', getValue, ['a'])).toBe(1)
      expect(getSet(cache, 'key1', getValue, ['b'])).toBe(2)
      expect(cache.key1).toBe(2)
    })
  })
})
