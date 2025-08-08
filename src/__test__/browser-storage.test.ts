import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StorageUtil } from '../browser/storage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('StorageUtil', () => {
  let storage: StorageUtil

  beforeEach(() => {
    storage = new StorageUtil()
    localStorage.clear()
  })

  describe('set and get', () => {
    it('should store and retrieve normal values', () => {
      storage.set('key1', 'hello world')
      expect(storage.get<string>('key1')).toBe('hello world')
    })

    it('should store and retrieve numbers', () => {
      storage.set('number', 42)
      expect(storage.get<number>('number')).toBe(42)
    })

    it('should store and retrieve booleans', () => {
      storage.set('boolean', true)
      expect(storage.get<boolean>('boolean')).toBe(true)
    })

    it('should store and retrieve objects', () => {
      const obj = { a: 1, b: 'test', c: [1, 2, 3] }
      storage.set('object', obj)
      expect(storage.get<typeof obj>('object')).toEqual(obj)
    })

    it('should store and retrieve arrays', () => {
      const arr = [1, 'test', true, { nested: 'object' }]
      storage.set('array', arr)
      expect(storage.get<typeof arr>('array')).toEqual(arr)
    })

    it('should return undefined for non-existent keys', () => {
      expect(storage.get('nonexistent')).toBeUndefined()
    })
  })

  describe('Set handling', () => {
    it('should store and retrieve Set objects', () => {
      const set = new Set([1, 2, 3, 'test'])
      storage.set('set', set)
      const retrieved = storage.get<Set<number | string>>('set')

      expect(retrieved).toBeInstanceOf(Set)
      expect(retrieved?.size).toBe(4)
      expect(retrieved?.has(1)).toBe(true)
      expect(retrieved?.has('test')).toBe(true)
    })

    it('should handle empty Set', () => {
      const set = new Set()
      storage.set('emptySet', set)
      const retrieved = storage.get<Set<any>>('emptySet')

      expect(retrieved).toBeInstanceOf(Set)
      expect(retrieved?.size).toBe(0)
    })

    it('should handle Set with complex objects', () => {
      const set = new Set([{ a: 1 }, { b: 2 }])
      storage.set('complexSet', set)
      const retrieved = storage.get<Set<any>>('complexSet')

      expect(retrieved).toBeInstanceOf(Set)
      expect(retrieved?.size).toBe(2)
      expect([...retrieved!]).toEqual([{ a: 1 }, { b: 2 }])
    })
  })

  describe('Map handling', () => {
    it('should store and retrieve Map objects', () => {
      const map = new Map<any, any>([
        ['key1', 'value1'],
        ['key2', 42],
        [3, 'number key'],
      ])
      storage.set('map', map)
      const retrieved = storage.get<Map<any, any>>('map')

      expect(retrieved).toBeInstanceOf(Map)
      expect(retrieved?.size).toBe(3)
      expect(retrieved?.get('key1')).toBe('value1')
      expect(retrieved?.get('key2')).toBe(42)
      expect(retrieved?.get('3')).toBe('number key') // Note: JSON converts keys to strings
    })

    it('should handle empty Map', () => {
      const map = new Map()
      storage.set('emptyMap', map)
      const retrieved = storage.get<Map<any, any>>('emptyMap')

      expect(retrieved).toBeInstanceOf(Map)
      expect(retrieved?.size).toBe(0)
    })

    it('should handle Map with complex values', () => {
      const map = new Map([
        ['user', { name: 'John', age: 30 }],
        ['items', [1, 2, 3]],
      ])
      storage.set('complexMap', map)
      const retrieved = storage.get<Map<string, any>>('complexMap')

      expect(retrieved).toBeInstanceOf(Map)
      expect(retrieved?.get('user')).toEqual({ name: 'John', age: 30 })
      expect(retrieved?.get('items')).toEqual([1, 2, 3])
    })
  })

  describe('edge cases', () => {
    it('should handle null values', () => {
      storage.set('null', null)
      expect(storage.get('null')).toBe(null)
    })

    it('should handle undefined values', () => {
      storage.set('undefined', undefined)
      expect(storage.get('undefined')).toBe(undefined)
    })

    it('should handle empty strings', () => {
      storage.set('empty', '')
      expect(storage.get('empty')).toBe('')
    })

    it('should handle zero values', () => {
      storage.set('zero', 0)
      expect(storage.get('zero')).toBe(0)
    })

    it('should handle false values', () => {
      storage.set('false', false)
      expect(storage.get('false')).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should handle corrupted localStorage data', () => {
      // Manually set invalid JSON in localStorage
      localStorage.setItem('corrupted', 'invalid json {')
      expect(storage.get('corrupted')).toBeUndefined()
    })

    it('should handle localStorage quota exceeded', () => {
      // Mock localStorage.setItem to throw
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError')
      })

      expect(() => storage.set('test', 'value')).toThrow()

      // Restore original method
      localStorage.setItem = originalSetItem
    })
  })

  describe('type preservation', () => {
    it('should preserve date objects as strings', () => {
      const date = new Date('2023-01-01')
      storage.set('date', date)
      // Note: Date objects are serialized as strings
      expect(typeof storage.get('date')).toBe('string')
    })

    it('should preserve regex as objects', () => {
      const regex = /test/g
      storage.set('regex', regex)
      // Note: RegExp objects are serialized as objects
      expect(typeof storage.get('regex')).toBe('object')
    })
  })
})
