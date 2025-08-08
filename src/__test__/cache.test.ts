import { describe, expect, it } from 'vitest'
import { createCache, createObjCache } from '../cache'

describe('cache utils', () => {
  describe('createCache', () => {
    it('should create a new cache instance', () => {
      const cache = createCache<string, number>()
      expect(cache).toBeDefined()
    })

    it('should set and get values', () => {
      const cache = createCache<string, number>()
      cache.set('key1', 42)
      expect(cache.get('key1')).toBe(42)
    })

    it('should return undefined for non-existent keys', () => {
      const cache = createCache<string, number>()
      expect(cache.get('nonexistent')).toBeUndefined()
    })

    it('should delete values', () => {
      const cache = createCache<string, number>()
      cache.set('key1', 42)
      cache.delete('key1')
      expect(cache.get('key1')).toBeUndefined()
    })

    it('should clear all values', () => {
      const cache = createCache<string, number>()
      cache.set('key1', 42)
      cache.set('key2', 24)
      cache.clear()
      expect(cache.get('key1')).toBeUndefined()
      expect(cache.get('key2')).toBeUndefined()
    })

    it('should get or set value with getSet', () => {
      const cache = createCache<string, number>()
      let callCount = 0
      const getValue = () => {
        callCount++
        return 42
      }

      const result1 = cache.getSet('key1', getValue)
      expect(result1).toBe(42)
      expect(callCount).toBe(1)

      const result2 = cache.getSet('key1', getValue)
      expect(result2).toBe(42)
      expect(callCount).toBe(1) // Should not call again
    })

    it('should invalidate cache when compare values change', () => {
      const cache = createCache<string, number>()
      let callCount = 0
      const getValue = () => {
        callCount++
        return callCount * 10
      }

      const result1 = cache.getSet('key1', getValue, [1, 2])
      expect(result1).toBe(10)
      expect(callCount).toBe(1)

      const result2 = cache.getSet('key1', getValue, [1, 2])
      expect(result2).toBe(10)
      expect(callCount).toBe(1) // Same compare values

      const result3 = cache.getSet('key1', getValue, [1, 3])
      expect(result3).toBe(20)
      expect(callCount).toBe(2) // Different compare values
    })

    it('should iterate over cache entries', () => {
      const cache = createCache<string, number>()
      cache.set('key1', 42)
      cache.set('key2', 24)

      const entries: Array<{ key: string; value: number }> = []
      cache.forEach((key, value) => {
        entries.push({ key, value })
      })

      expect(entries).toHaveLength(2)
      expect(entries).toContainEqual({ key: 'key1', value: 42 })
      expect(entries).toContainEqual({ key: 'key2', value: 24 })
    })

    it('should return keys iterator', () => {
      const cache = createCache<string, number>()
      cache.set('key1', 42)
      cache.set('key2', 24)

      const keys = Array.from(cache.keys())
      expect(keys).toContain('key1')
      expect(keys).toContain('key2')
    })

    it('should return values iterator', () => {
      const cache = createCache<string, number>()
      cache.set('key1', 42)
      cache.set('key2', 24)

      const values = Array.from(cache.values())
      expect(values).toContain(42)
      expect(values).toContain(24)
    })

    it('should return entries iterator', () => {
      const cache = createCache<string, number>()
      cache.set('key1', 42)
      cache.set('key2', 24)

      const entries = Array.from(cache.entries())
      expect(entries).toContainEqual(['key1', 42])
      expect(entries).toContainEqual(['key2', 24])
    })

    it('should convert from object', () => {
      const cache = createCache<string, number>()
      cache.fromObject({ key1: 42, key2: 24 })

      expect(cache.get('key1')).toBe(42)
      expect(cache.get('key2')).toBe(24)
    })

    it('should convert to object', () => {
      const cache = createCache<string, number>()
      cache.set('key1', 42)
      cache.set('key2', 24)

      const obj = cache.toObject()
      expect(obj).toEqual({ key1: 42, key2: 24 })
    })
  })

  describe('createObjCache', () => {
    it('should create a new object cache instance', () => {
      const cache = createObjCache<number>()
      expect(cache).toBeDefined()
    })

    it('should set and get values', () => {
      const cache = createObjCache<number>()
      cache.set('key1', 42)
      expect(cache.get('key1')).toBe(42)
    })

    it('should return undefined for non-existent keys', () => {
      const cache = createObjCache<number>()
      expect(cache.get('nonexistent')).toBeUndefined()
    })

    it('should delete values', () => {
      const cache = createObjCache<number>()
      cache.set('key1', 42)
      cache.delete('key1')
      expect(cache.get('key1')).toBeUndefined()
    })

    it('should clear all values', () => {
      const cache = createObjCache<number>()
      cache.set('key1', 42)
      cache.set('key2', 24)
      cache.clear()
      expect(cache.get('key1')).toBeUndefined()
      expect(cache.get('key2')).toBeUndefined()
    })

    it('should get or set value with getSet', () => {
      const cache = createObjCache<number>()
      let callCount = 0
      const getValue = () => {
        callCount++
        return 42
      }

      const result1 = cache.getSet('key1', getValue)
      expect(result1).toBe(42)
      expect(callCount).toBe(1)

      const result2 = cache.getSet('key1', getValue)
      expect(result2).toBe(42)
      expect(callCount).toBe(1) // Should not call again
    })

    it('should invalidate cache when compare values change', () => {
      const cache = createObjCache<number>()
      let callCount = 0
      const getValue = () => {
        callCount++
        return callCount * 10
      }

      const result1 = cache.getSet('key1', getValue, [1, 2])
      expect(result1).toBe(10)
      expect(callCount).toBe(1)

      const result2 = cache.getSet('key1', getValue, [1, 2])
      expect(result2).toBe(10)
      expect(callCount).toBe(1) // Same compare values

      const result3 = cache.getSet('key1', getValue, [1, 3])
      expect(result3).toBe(20)
      expect(callCount).toBe(2) // Different compare values
    })

    it('should return keys array', () => {
      const cache = createObjCache<number>()
      cache.set('key1', 42)
      cache.set('key2', 24)

      const keys = cache.keys()
      expect(keys).toContain('key1')
      expect(keys).toContain('key2')
    })

    it('should return values array', () => {
      const cache = createObjCache<number>()
      cache.set('key1', 42)
      cache.set('key2', 24)

      const values = cache.values()
      expect(values).toContain(42)
      expect(values).toContain(24)
    })

    it('should return entries array', () => {
      const cache = createObjCache<number>()
      cache.set('key1', 42)
      cache.set('key2', 24)

      const entries = cache.entries()
      expect(entries).toContainEqual(['key1', 42])
      expect(entries).toContainEqual(['key2', 24])
    })
  })
})
