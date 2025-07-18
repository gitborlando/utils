import { describe, expect, it } from 'vitest'
import {
  firstOne,
  flushFuncs,
  lastOne,
  loopFor,
  range,
  reverse,
  reverseFor,
  stableIndex,
} from '../../src/array'

describe('array utils', () => {
  // 应该返回数组的第一个元素
  it('should return the first element of an array', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(firstOne(arr)).toBe(1)
  })

  // 应该返回 Set 的第一个元素
  it('should return the first element of a Set', () => {
    const set = new Set([1, 2, 3, 4, 5])
    expect(firstOne(set)).toBe(1)
  })

  // 应该处理空数组
  it('should handle empty array', () => {
    const arr: number[] = []
    expect(firstOne(arr)).toBeUndefined()
  })

  // 应该处理空 Set
  it('should handle empty Set', () => {
    const set = new Set<number>()
    expect(firstOne(set)).toBeUndefined()
  })

  // 应该处理只有一个元素的数组
  it('should handle array with one element', () => {
    const arr = [42]
    expect(firstOne(arr)).toBe(42)
  })

  // 应该返回数组的最后一个元素
  it('should return the last element of an array', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(lastOne(arr)).toBe(5)
  })

  // 应该返回 Set 的最后一个元素
  it('should return the last element of a Set', () => {
    const set = new Set([1, 2, 3, 4, 5])
    expect(lastOne(set)).toBe(5)
  })

  // 应该处理空数组
  it('should handle empty array for lastOne', () => {
    const arr: number[] = []
    expect(lastOne(arr)).toBeUndefined()
  })

  // 应该处理空 Set
  it('should handle empty Set for lastOne', () => {
    const set = new Set<number>()
    expect(lastOne(set)).toBeUndefined()
  })

  // 应该处理只有一个元素的数组
  it('should handle array with one element for lastOne', () => {
    const arr = [42]
    expect(lastOne(arr)).toBe(42)
  })

  // 应该执行所有函数并清空数组
  it('should call all functions and clear array', () => {
    const results: number[] = []
    const funcs = [
      () => results.push(1),
      () => results.push(2),
      () => results.push(3),
    ]
    flushFuncs(funcs)
    expect(results).toEqual([1, 2, 3])
    expect(funcs.length).toBe(0)
  })

  // 应该执行所有函数并清空 Set
  it('should call all functions and clear Set', () => {
    const results: number[] = []
    const funcs = new Set([
      () => results.push(1),
      () => results.push(2),
      () => results.push(3),
    ])
    flushFuncs(funcs)
    expect(results).toEqual([1, 2, 3])
    expect(funcs.size).toBe(0)
  })

  // 应该处理空数组
  it('should handle empty array for flushFuncs', () => {
    const funcs: (() => void)[] = []
    expect(() => flushFuncs(funcs)).not.toThrow()
    expect(funcs.length).toBe(0)
  })

  // 应该处理空 Set
  it('should handle empty Set for flushFuncs', () => {
    const funcs = new Set<() => void>()
    expect(() => flushFuncs(funcs)).not.toThrow()
    expect(funcs.size).toBe(0)
  })

  // 应该返回数组长度当索引未定义时
  it('should return array length if index is undefined', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(stableIndex(arr)).toBe(5)
  })

  // 应该返回 0 当索引为负数时
  it('should return 0 if index is negative', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(stableIndex(arr, -1)).toBe(0)
    expect(stableIndex(arr, -10)).toBe(0)
  })

  // 应该返回数组长度当索引超出范围时
  it('should return array length if index is out of range', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(stableIndex(arr, 10)).toBe(5)
    expect(stableIndex(arr, 5)).toBe(5)
  })

  // 应该返回有效索引
  it('should return valid index', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(stableIndex(arr, 0)).toBe(0)
    expect(stableIndex(arr, 2)).toBe(2)
    expect(stableIndex(arr, 4)).toBe(4)
  })

  // 应该处理空数组
  it('should handle empty array for stableIndex', () => {
    const arr: number[] = []
    expect(stableIndex(arr)).toBe(0)
    expect(stableIndex(arr, 0)).toBe(0)
    expect(stableIndex(arr, 5)).toBe(0)
  })

  // 应该遍历数组并调用回调函数
  it('should iterate array and call callback', () => {
    const arr = [1, 2, 3]
    const results: Array<{
      cur: number
      next: number
      prev: number
      index: number
    }> = []
    loopFor(arr, (cur, next, prev, index) => {
      results.push({ cur, next, prev, index })
    })
    expect(results).toEqual([
      { cur: 1, next: 2, prev: 3, index: 0 },
      { cur: 2, next: 3, prev: 1, index: 1 },
      { cur: 3, next: 1, prev: 2, index: 2 },
    ])
  })

  // 应该在返回 true 时停止循环
  it('should break when callback returns true', () => {
    const arr = [1, 2, 3, 4, 5]
    const results: number[] = []
    loopFor(arr, (cur, next, prev, index) => {
      results.push(cur)
      if (cur === 3) return 'break'
    })
    expect(results).toEqual([1, 2, 3])
  })

  // 应该在返回 false 时跳过当前迭代
  it('should skip iteration when callback returns false', () => {
    const arr = [1, 2, 3, 4, 5]
    const results: number[] = []
    loopFor(arr, (cur, next, prev, index) => {
      if (cur === 2) return 'continue'
      results.push(cur)
    })
    expect(results).toEqual([1, 3, 4, 5])
  })

  // 应该处理空数组
  it('should handle empty array for loopFor', () => {
    const arr: number[] = []
    let called = false
    loopFor(arr, () => {
      called = true
    })
    expect(called).toBe(false)
  })

  // 应该处理只有一个元素的数组
  it('should handle array with one element for loopFor', () => {
    const arr = [42]
    const results: Array<{ cur: number; next: number; prev: number }> = []
    loopFor(arr, (cur, next, prev) => {
      results.push({ cur, next, prev })
    })
    expect(results).toEqual([{ cur: 42, next: 42, prev: 42 }])
  })

  // 应该反向遍历数组
  it('should iterate array in reverse order', () => {
    const arr = [1, 2, 3, 4, 5]
    const results: Array<{ item: number; index: number }> = []
    reverseFor(arr, (item, index) => {
      results.push({ item, index })
    })
    expect(results).toEqual([
      { item: 5, index: 4 },
      { item: 4, index: 3 },
      { item: 3, index: 2 },
      { item: 2, index: 1 },
      { item: 1, index: 0 },
    ])
  })

  // 应该处理空数组
  it('should handle empty array for reverseFor', () => {
    const arr: number[] = []
    let called = false
    reverseFor(arr, () => {
      called = true
    })
    expect(called).toBe(false)
  })

  // 应该处理只有一个元素的数组
  it('should handle array with one element for reverseFor', () => {
    const arr = [42]
    const results: Array<{ item: number; index: number }> = []
    reverseFor(arr, (item, index) => {
      results.push({ item, index })
    })
    expect(results).toEqual([{ item: 42, index: 0 }])
  })

  // 应该返回数组的反转副本
  it('should return a reversed copy of the array', () => {
    const arr = [1, 2, 3, 4, 5]
    const reversed = reverse(arr)
    expect(reversed).toEqual([5, 4, 3, 2, 1])
    expect(arr).toEqual([1, 2, 3, 4, 5])
  })

  // 应该处理空数组
  it('should handle empty array for reverse', () => {
    const arr: number[] = []
    const reversed = reverse(arr)
    expect(reversed).toEqual([])
  })

  // 应该处理只有一个元素的数组
  it('should handle array with one element for reverse', () => {
    const arr = [42]
    const reversed = reverse(arr)
    expect(reversed).toEqual([42])
  })

  // 应该处理字符串数组
  it('should handle string array for reverse', () => {
    const arr = ['a', 'b', 'c']
    const reversed = reverse(arr)
    expect(reversed).toEqual(['c', 'b', 'a'])
  })

  // 应该生成指定长度的数组
  it('should generate an array of specified length', () => {
    const result = range(5)
    expect(result).toEqual([0, 1, 2, 3, 4])
  })

  // 应该处理长度为 0 的数组
  it('should handle zero length for range', () => {
    const result = range(0)
    expect(result).toEqual([])
  })

  // 应该处理长度为 1 的数组
  it('should handle length one for range', () => {
    const result = range(1)
    expect(result).toEqual([0])
  })

  // 应该处理负数（抛出错误）
  it('should throw error for negative length in range', () => {
    expect(() => range(-1)).toThrow('Invalid array length')
  })

  // 应该处理大数字
  it('should handle large number for range', () => {
    const result = range(10)
    expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
