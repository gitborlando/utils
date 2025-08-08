import { describe, expect, it } from 'vitest'
import { Is } from '../is'

describe('Is type checking utilities', () => {
  describe('Is.number', () => {
    it('should return true for numbers', () => {
      expect(Is.number(42)).toBe(true)
      expect(Is.number(0)).toBe(true)
      expect(Is.number(-1)).toBe(true)
      expect(Is.number(3.14)).toBe(true)
      expect(Is.number(Infinity)).toBe(true)
      expect(Is.number(NaN)).toBe(true)
    })

    it('should return false for non-numbers', () => {
      expect(Is.number('42')).toBe(false)
      expect(Is.number(true)).toBe(false)
      expect(Is.number(null)).toBe(false)
      expect(Is.number(undefined)).toBe(false)
      expect(Is.number({})).toBe(false)
      expect(Is.number([])).toBe(false)
    })
  })

  describe('Is.string', () => {
    it('should return true for strings', () => {
      expect(Is.string('hello')).toBe(true)
      expect(Is.string('')).toBe(true)
      expect(Is.string('0')).toBe(true)
    })

    it('should return false for non-strings', () => {
      expect(Is.string(42)).toBe(false)
      expect(Is.string(true)).toBe(false)
      expect(Is.string(null)).toBe(false)
      expect(Is.string(undefined)).toBe(false)
      expect(Is.string({})).toBe(false)
      expect(Is.string([])).toBe(false)
    })
  })

  describe('Is.boolean', () => {
    it('should return true for booleans', () => {
      expect(Is.boolean(true)).toBe(true)
      expect(Is.boolean(false)).toBe(true)
    })

    it('should return false for non-booleans', () => {
      expect(Is.boolean(1)).toBe(false)
      expect(Is.boolean(0)).toBe(false)
      expect(Is.boolean('true')).toBe(false)
      expect(Is.boolean('false')).toBe(false)
      expect(Is.boolean(null)).toBe(false)
      expect(Is.boolean(undefined)).toBe(false)
    })
  })

  describe('Is.array', () => {
    it('should return true for arrays', () => {
      expect(Is.array([])).toBe(true)
      expect(Is.array([1, 2, 3])).toBe(true)
      expect(Is.array(['a', 'b'])).toBe(true)
      expect(Is.array(new Array())).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(Is.array({})).toBe(false)
      expect(Is.array('array')).toBe(false)
      expect(Is.array(null)).toBe(false)
      expect(Is.array(undefined)).toBe(false)
      expect(Is.array(42)).toBe(false)
    })
  })

  describe('Is.object', () => {
    it('should return true for objects', () => {
      expect(Is.object({})).toBe(true)
      expect(Is.object({ a: 1 })).toBe(true)
      expect(Is.object(new Date())).toBe(true)
      expect(Is.object(/regex/)).toBe(true)
    })

    it('should return false for non-objects', () => {
      expect(Is.object(null)).toBe(false)
      expect(Is.object([])).toBe(false)
      expect(Is.object('string')).toBe(false)
      expect(Is.object(42)).toBe(false)
      expect(Is.object(undefined)).toBe(false)
      expect(Is.object(true)).toBe(false)
    })
  })

  describe('Is.function', () => {
    it('should return true for functions', () => {
      expect(Is.function(() => {})).toBe(true)
      expect(Is.function(function () {})).toBe(true)
      expect(Is.function(async () => {})).toBe(true)
      expect(Is.function(Math.max)).toBe(true)
    })

    it('should return false for non-functions', () => {
      expect(Is.function({})).toBe(false)
      expect(Is.function(null)).toBe(false)
      expect(Is.function('function')).toBe(false)
      expect(Is.function(42)).toBe(false)
    })
  })

  describe('Is.null', () => {
    it('should return true for null', () => {
      expect(Is.null(null)).toBe(true)
    })

    it('should return false for non-null values', () => {
      expect(Is.null(undefined)).toBe(false)
      expect(Is.null(0)).toBe(false)
      expect(Is.null('')).toBe(false)
      expect(Is.null(false)).toBe(false)
      expect(Is.null({})).toBe(false)
    })
  })

  describe('Is.undefined', () => {
    it('should return true for undefined', () => {
      expect(Is.undefined(undefined)).toBe(true)
    })

    it('should return false for non-undefined values', () => {
      expect(Is.undefined(null)).toBe(false)
      expect(Is.undefined(0)).toBe(false)
      expect(Is.undefined('')).toBe(false)
      expect(Is.undefined(false)).toBe(false)
      expect(Is.undefined({})).toBe(false)
    })
  })

  describe('Is.symbol', () => {
    it('should return true for symbols', () => {
      expect(Is.symbol(Symbol())).toBe(true)
      expect(Is.symbol(Symbol('test'))).toBe(true)
      expect(Is.symbol(Symbol.for('global'))).toBe(true)
    })

    it('should return false for non-symbols', () => {
      expect(Is.symbol('symbol')).toBe(false)
      expect(Is.symbol({})).toBe(false)
      expect(Is.symbol(null)).toBe(false)
      expect(Is.symbol(42)).toBe(false)
    })
  })

  describe('Is.nullable', () => {
    it('should return true for null and undefined', () => {
      expect(Is.nullable(null)).toBe(true)
      expect(Is.nullable(undefined)).toBe(true)
    })

    it('should return false for non-nullable values', () => {
      expect(Is.nullable(0)).toBe(false)
      expect(Is.nullable('')).toBe(false)
      expect(Is.nullable(false)).toBe(false)
      expect(Is.nullable({})).toBe(false)
      expect(Is.nullable([])).toBe(false)
    })
  })

  describe('Is.notNullable', () => {
    it('should return false for null and undefined', () => {
      expect(Is.notNullable(null)).toBe(false)
      expect(Is.notNullable(undefined)).toBe(false)
    })

    it('should return true for non-nullable values', () => {
      expect(Is.notNullable(0)).toBe(true)
      expect(Is.notNullable('')).toBe(true)
      expect(Is.notNullable(false)).toBe(true)
      expect(Is.notNullable({})).toBe(true)
      expect(Is.notNullable([])).toBe(true)
      expect(Is.notNullable(42)).toBe(true)
    })
  })

  describe('Is.falsy', () => {
    it('should return true for falsy values', () => {
      expect(Is.falsy(null)).toBe(true)
      expect(Is.falsy(undefined)).toBe(true)
      expect(Is.falsy('null')).toBe(true)
      expect(Is.falsy('undefined')).toBe(true)
      expect(Is.falsy(false)).toBe(true)
      expect(Is.falsy('false')).toBe(true)
      expect(Is.falsy(0)).toBe(true)
      expect(Is.falsy('')).toBe(true)
      expect(Is.falsy(NaN)).toBe(true)
    })

    it('should return false for truthy values', () => {
      expect(Is.falsy(true)).toBe(false)
      expect(Is.falsy('true')).toBe(false)
      expect(Is.falsy(1)).toBe(false)
      expect(Is.falsy('hello')).toBe(false)
      expect(Is.falsy({})).toBe(false)
      expect(Is.falsy([])).toBe(false)
    })
  })

  describe('Is.notFalsy', () => {
    it('should return false for falsy values', () => {
      expect(Is.notFalsy(null)).toBe(false)
      expect(Is.notFalsy(undefined)).toBe(false)
      expect(Is.notFalsy(false)).toBe(false)
      expect(Is.notFalsy(0)).toBe(false)
      expect(Is.notFalsy('')).toBe(false)
    })

    it('should return true for truthy values', () => {
      expect(Is.notFalsy(true)).toBe(true)
      expect(Is.notFalsy(1)).toBe(true)
      expect(Is.notFalsy('hello')).toBe(true)
      expect(Is.notFalsy({})).toBe(true)
      expect(Is.notFalsy([])).toBe(true)
    })
  })

  describe('Is.empty', () => {
    it('should return true for empty arrays', () => {
      expect(Is.empty([])).toBe(true)
    })

    it('should return false for non-empty arrays', () => {
      expect(Is.empty([1])).toBe(false)
      expect(Is.empty(['a', 'b'])).toBe(false)
    })

    it('should return true for empty objects', () => {
      expect(Is.empty({})).toBe(true)
    })

    it('should return false for non-empty objects', () => {
      expect(Is.empty({ a: 1 })).toBe(false)
    })

    it('should return true for falsy values', () => {
      expect(Is.empty(null)).toBe(true)
      expect(Is.empty(undefined)).toBe(true)
      expect(Is.empty(false)).toBe(true)
      expect(Is.empty(0)).toBe(true)
      expect(Is.empty('')).toBe(true)
    })
  })

  describe('Is.notEmpty', () => {
    it('should return false for empty arrays', () => {
      expect(Is.notEmpty([])).toBe(false)
    })

    it('should return true for non-empty arrays', () => {
      expect(Is.notEmpty([1])).toBe(true)
    })

    it('should return false for empty objects', () => {
      expect(Is.notEmpty({})).toBe(false)
    })

    it('should return true for non-empty objects', () => {
      expect(Is.notEmpty({ a: 1 })).toBe(true)
    })

    it('should return false for falsy values', () => {
      expect(Is.notEmpty(null)).toBe(false)
      expect(Is.notEmpty(undefined)).toBe(false)
      expect(Is.notEmpty(false)).toBe(false)
      expect(Is.notEmpty('')).toBe(false)
    })

    it('should return true for truthy values', () => {
      expect(Is.notEmpty(true)).toBe(true)
      expect(Is.notEmpty(1)).toBe(true)
      expect(Is.notEmpty('hello')).toBe(true)
    })
  })
})
