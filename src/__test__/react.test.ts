import { createElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useHTMLElement, withSuspense } from '../react'

// Mock React hooks for testing
const mockUseRef = (initialValue: any) => ({ current: initialValue })

// Mock React for testing environment
vi.mock('react', () => ({
  createElement: vi.fn(),
  Suspense: 'Suspense',
  useRef: mockUseRef,
}))

describe('React utilities', () => {
  describe('useHTMLElement', () => {
    it('should return ref for div element', () => {
      const ref = useHTMLElement('div')
      expect(ref).toEqual({ current: null })
    })

    it('should return ref for input element', () => {
      const ref = useHTMLElement('input')
      expect(ref).toEqual({ current: null })
    })

    it('should return ref for button element', () => {
      const ref = useHTMLElement('button')
      expect(ref).toEqual({ current: null })
    })

    it('should return ref for span element', () => {
      const ref = useHTMLElement('span')
      expect(ref).toEqual({ current: null })
    })

    it('should return ref for img element', () => {
      const ref = useHTMLElement('img')
      expect(ref).toEqual({ current: null })
    })

    it('should return ref for canvas element', () => {
      const ref = useHTMLElement('canvas')
      expect(ref).toEqual({ current: null })
    })

    it('should return ref for video element', () => {
      const ref = useHTMLElement('video')
      expect(ref).toEqual({ current: null })
    })

    it('should return ref for audio element', () => {
      const ref = useHTMLElement('audio')
      expect(ref).toEqual({ current: null })
    })

    it('should return ref for table elements', () => {
      expect(useHTMLElement('table')).toEqual({ current: null })
      expect(useHTMLElement('tr')).toEqual({ current: null })
      expect(useHTMLElement('td')).toEqual({ current: null })
    })

    it('should return ref for form elements', () => {
      expect(useHTMLElement('form')).toEqual({ current: null })
      expect(useHTMLElement('textarea')).toEqual({ current: null })
      expect(useHTMLElement('select')).toEqual({ current: null })
      expect(useHTMLElement('option')).toEqual({ current: null })
    })

    it('should return ref for list elements', () => {
      expect(useHTMLElement('ul')).toEqual({ current: null })
      expect(useHTMLElement('ol')).toEqual({ current: null })
      expect(useHTMLElement('li')).toEqual({ current: null })
    })

    it('should return ref for document elements', () => {
      expect(useHTMLElement('body')).toEqual({ current: null })
      expect(useHTMLElement('head')).toEqual({ current: null })
      expect(useHTMLElement('html')).toEqual({ current: null })
    })

    it('should return ref for link and script elements', () => {
      expect(useHTMLElement('link')).toEqual({ current: null })
      expect(useHTMLElement('script')).toEqual({ current: null })
      expect(useHTMLElement('style')).toEqual({ current: null })
    })
  })

  describe('withSuspense', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should wrap component with Suspense', () => {
      const mockComponent = 'MockComponent'
      withSuspense(mockComponent)

      expect(createElement).toHaveBeenCalledWith(
        'Suspense',
        { fallback: undefined },
        mockComponent,
      )
    })

    it('should wrap component with Suspense and fallback', () => {
      const mockComponent = 'MockComponent'
      const mockFallback = 'Loading...'

      withSuspense(mockComponent, mockFallback)

      expect(createElement).toHaveBeenCalledWith(
        'Suspense',
        { fallback: mockFallback },
        mockComponent,
      )
    })

    it('should handle null component', () => {
      withSuspense(null)

      expect(createElement).toHaveBeenCalledWith(
        'Suspense',
        { fallback: undefined },
        null,
      )
    })

    it('should handle undefined component', () => {
      withSuspense(undefined)

      expect(createElement).toHaveBeenCalledWith(
        'Suspense',
        { fallback: undefined },
        undefined,
      )
    })

    it('should handle string fallback', () => {
      const mockComponent = 'MockComponent'
      const mockFallback = 'Loading...'

      withSuspense(mockComponent, mockFallback)

      expect(createElement).toHaveBeenCalledWith(
        'Suspense',
        { fallback: mockFallback },
        mockComponent,
      )
    })

    it('should work with string components', () => {
      const stringComponent = 'Hello World'

      withSuspense(stringComponent)

      expect(createElement).toHaveBeenCalledWith(
        'Suspense',
        { fallback: undefined },
        stringComponent,
      )
    })

    it('should work with number components', () => {
      const numberComponent = 42

      withSuspense(numberComponent)

      expect(createElement).toHaveBeenCalledWith(
        'Suspense',
        { fallback: undefined },
        numberComponent,
      )
    })

    it('should work with boolean components', () => {
      withSuspense(true)

      expect(createElement).toHaveBeenCalledWith(
        'Suspense',
        { fallback: undefined },
        true,
      )
    })
  })

  describe('type safety', () => {
    it('should ensure proper TypeScript typing for HTML elements', () => {
      // These tests verify TypeScript compilation and type inference
      const divRef = useHTMLElement('div')
      const inputRef = useHTMLElement('input')
      const buttonRef = useHTMLElement('button')

      // In actual usage, these would be typed as:
      // RefObject<HTMLDivElement>, RefObject<HTMLInputElement>, etc.
      expect(divRef.current).toBe(null)
      expect(inputRef.current).toBe(null)
      expect(buttonRef.current).toBe(null)
    })

    it('should accept various ReactNode types for withSuspense', () => {
      // Test that various ReactNode types are accepted
      withSuspense('string')
      withSuspense(123)
      withSuspense(true)
      withSuspense(null)
      withSuspense(undefined)

      expect(createElement).toHaveBeenCalledTimes(5)
    })
  })
})
