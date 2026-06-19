import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useClean, useHTMLElement, useMount, withSuspense } from '../react'

const { mockUseEffect, mockUseRef } = vi.hoisted(() => ({
  mockUseEffect: vi.fn(),
  mockUseRef: vi.fn((initialValue: any) => ({ current: initialValue })),
}))

vi.mock('react', () => ({
  Suspense: ({ children }: any) => children,
  useEffect: mockUseEffect,
  useRef: mockUseRef,
}))

describe('React utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useHTMLElement', () => {
    it('should return ref for supported HTML elements', () => {
      expect(useHTMLElement('div')).toEqual({ current: null })
      expect(useHTMLElement('input')).toEqual({ current: null })
      expect(useHTMLElement('button')).toEqual({ current: null })
      expect(useHTMLElement('canvas')).toEqual({ current: null })
    })

    it('should initialize ref with null', () => {
      useHTMLElement('video')

      expect(mockUseRef).toHaveBeenCalledWith(null)
    })
  })

  describe('useMount', () => {
    it('should register effect with empty dependency list', () => {
      const effect = vi.fn()

      useMount(effect)

      expect(mockUseEffect).toHaveBeenCalledWith(effect, [])
    })
  })

  describe('useClean', () => {
    it('should register cleanup effect with empty dependencies by default', () => {
      const cleanup = vi.fn()

      useClean(cleanup)

      expect(mockUseEffect).toHaveBeenCalledWith(expect.any(Function), [])
      expect(mockUseEffect.mock.calls[0][0]()).toBe(cleanup)
    })

    it('should register cleanup effect with provided dependencies', () => {
      const cleanup = vi.fn()
      const deps = ['id']

      useClean(cleanup, deps)

      expect(mockUseEffect).toHaveBeenCalledWith(expect.any(Function), deps)
      expect(mockUseEffect.mock.calls[0][0]()).toBe(cleanup)
    })
  })

  describe('withSuspense', () => {
    it('should be exported from the react entry', () => {
      const Component = () => null
      const Wrapped = withSuspense(Component)

      expect(typeof Wrapped).toBe('function')
      expect(Wrapped.displayName).toBe('suspense(Component)')
    })
  })
})
