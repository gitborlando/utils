import { describe, expect, it } from 'vitest'
import {
  clampIndex,
  deleteFromArray,
  firstOne,
  flushFuncs,
  lastOne,
  loopFor,
} from '../../src/array'

describe('array utils', () => {
  it('should return the first element of an array or Set', () => {
    expect(firstOne([1, 2, 3])).toBe(1)
    expect(firstOne(new Set([1, 2, 3]))).toBe(1)
  })

  it('should return undefined for empty collections', () => {
    expect(firstOne([])).toBeUndefined()
    expect(firstOne(new Set())).toBeUndefined()
    expect(lastOne([])).toBeUndefined()
    expect(lastOne(new Set())).toBeUndefined()
  })

  it('should return the last element of an array or Set', () => {
    expect(lastOne([1, 2, 3])).toBe(3)
    expect(lastOne(new Set([1, 2, 3]))).toBe(3)
  })

  it('should delete an array item by predicate', () => {
    const arr = [1, 2, 3, 4]
    deleteFromArray(arr, (value) => value > 2)
    expect(arr).toEqual([1, 2, 4])
  })

  it('should delete an array item by value', () => {
    const arr = ['a', 'b', 'c']
    deleteFromArray(arr, 'b')
    expect(arr).toEqual(['a', 'c'])
  })

  it('should keep array unchanged when no item matches deletion filter', () => {
    const arr = [1, 2, 3]
    deleteFromArray(arr, (value) => value > 10)
    expect(arr).toEqual([1, 2, 3])
  })

  it('should call all functions and clear array or Set', () => {
    const arrayResults: number[] = []
    const arrayFuncs = [
      () => arrayResults.push(1),
      () => arrayResults.push(2),
      () => arrayResults.push(3),
    ]

    flushFuncs(arrayFuncs)

    expect(arrayResults).toEqual([1, 2, 3])
    expect(arrayFuncs).toHaveLength(0)

    const setResults: number[] = []
    const setFuncs = new Set([() => setResults.push(1), () => setResults.push(2)])

    flushFuncs(setFuncs)

    expect(setResults).toEqual([1, 2])
    expect(setFuncs.size).toBe(0)
  })

  it('should clamp index to the array bounds', () => {
    const arr = [1, 2, 3]

    expect(clampIndex(arr)).toBe(3)
    expect(clampIndex(arr, -1)).toBe(0)
    expect(clampIndex(arr, 0)).toBe(0)
    expect(clampIndex(arr, 2)).toBe(2)
    expect(clampIndex(arr, 10)).toBe(3)
  })

  it('should clamp index to zero for empty arrays', () => {
    const arr: number[] = []

    expect(clampIndex(arr)).toBe(0)
    expect(clampIndex(arr, -1)).toBe(0)
    expect(clampIndex(arr, 10)).toBe(0)
  })

  it('should iterate array with current, next, previous, and index', () => {
    const results: Array<{
      cur: number
      next: number
      prev: number
      index: number
    }> = []

    loopFor([1, 2, 3], (cur, next, prev, index) => {
      results.push({ cur, next, prev, index })
    })

    expect(results).toEqual([
      { cur: 1, next: 2, prev: 3, index: 0 },
      { cur: 2, next: 3, prev: 1, index: 1 },
      { cur: 3, next: 1, prev: 2, index: 2 },
    ])
  })

  it('should support break and continue controls in loopFor', () => {
    const continued: number[] = []
    loopFor([1, 2, 3], (cur) => {
      if (cur === 2) return 'continue'
      continued.push(cur)
    })
    expect(continued).toEqual([1, 3])

    const broken: number[] = []
    loopFor([1, 2, 3], (cur) => {
      broken.push(cur)
      if (cur === 2) return 'break'
    })
    expect(broken).toEqual([1, 2])
  })

  it('should not call loopFor callback for empty arrays', () => {
    let called = false

    loopFor([], () => {
      called = true
    })

    expect(called).toBe(false)
  })
})
