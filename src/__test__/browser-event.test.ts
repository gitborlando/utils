import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  isLeftMouse,
  isRightMouse,
  listen,
  preventDefault,
  stopPropagation,
} from '../browser/event'

describe('browser event utilities', () => {
  describe('isLeftMouse', () => {
    it('should return true for left mouse button', () => {
      const event = new MouseEvent('click', { button: 0 })
      expect(isLeftMouse(event)).toBe(true)
    })

    it('should return false for right mouse button', () => {
      const event = new MouseEvent('click', { button: 2 })
      expect(isLeftMouse(event)).toBe(false)
    })

    it('should return false for middle mouse button', () => {
      const event = new MouseEvent('click', { button: 1 })
      expect(isLeftMouse(event)).toBe(false)
    })
  })

  describe('isRightMouse', () => {
    it('should return true for right mouse button', () => {
      const event = new MouseEvent('click', { button: 2 })
      expect(isRightMouse(event)).toBe(true)
    })

    it('should return false for left mouse button', () => {
      const event = new MouseEvent('click', { button: 0 })
      expect(isRightMouse(event)).toBe(false)
    })

    it('should return false for middle mouse button', () => {
      const event = new MouseEvent('click', { button: 1 })
      expect(isRightMouse(event)).toBe(false)
    })
  })

  describe('listen', () => {
    let mockElement: any
    let addEventListenerSpy: any
    let removeEventListenerSpy: any

    beforeEach(() => {
      addEventListenerSpy = vi.fn()
      removeEventListenerSpy = vi.fn()
      mockElement = {
        addEventListener: addEventListenerSpy,
        removeEventListener: removeEventListenerSpy,
      }

      // Mock window
      Object.defineProperty(global, 'window', {
        value: mockElement,
        writable: true,
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should add event listener with simple signature', () => {
      const handler = vi.fn()
      const removeListener = listen('click', handler)

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', handler, {})
      expect(typeof removeListener).toBe('function')
    })

    it('should add event listener with options', () => {
      const handler = vi.fn()
      const options = { capture: true, once: true }
      const removeListener = listen('click', options, handler)

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', handler, options)
      expect(typeof removeListener).toBe('function')
    })

    it('should add event listener to custom target', () => {
      const customTarget = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      const handler = vi.fn()
      const options = { target: customTarget }

      listen('click', options, handler)

      expect(customTarget.addEventListener).toHaveBeenCalledWith(
        'click',
        handler,
        options,
      )
    })

    it('should return function that removes event listener', () => {
      const handler = vi.fn()
      const removeListener = listen('click', handler)

      removeListener()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', handler, {})
    })

    it('should remove listener from custom target', () => {
      const customTarget = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      const handler = vi.fn()
      const options = { target: customTarget }

      const removeListener = listen('click', options, handler)
      removeListener()

      expect(customTarget.removeEventListener).toHaveBeenCalledWith(
        'click',
        handler,
        options,
      )
    })

    it('should handle keyboard events', () => {
      const handler = vi.fn()
      listen('keydown', handler)

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', handler, {})
    })

    it('should handle scroll events', () => {
      const handler = vi.fn()
      listen('scroll', handler)

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', handler, {})
    })
  })

  describe('stopPropagation', () => {
    it('should stop event propagation', () => {
      const mockEvent = {
        stopPropagation: vi.fn(),
      }

      const handler = stopPropagation()
      handler(mockEvent)

      expect(mockEvent.stopPropagation).toHaveBeenCalled()
    })

    it('should call callback and stop propagation', () => {
      const mockEvent = {
        stopPropagation: vi.fn(),
      }
      const callback = vi.fn()

      const handler = stopPropagation(callback)
      handler(mockEvent)

      expect(callback).toHaveBeenCalledWith(mockEvent)
      expect(mockEvent.stopPropagation).toHaveBeenCalled()
    })

    it('should work without callback', () => {
      const mockEvent = {
        stopPropagation: vi.fn(),
      }

      const handler = stopPropagation()
      expect(() => handler(mockEvent)).not.toThrow()
      expect(mockEvent.stopPropagation).toHaveBeenCalled()
    })
  })

  describe('preventDefault', () => {
    it('should prevent default behavior', () => {
      const mockEvent = {
        preventDefault: vi.fn(),
      }

      const handler = preventDefault()
      handler(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should call callback and prevent default', () => {
      const mockEvent = {
        preventDefault: vi.fn(),
      }
      const callback = vi.fn()

      const handler = preventDefault(callback)
      handler(mockEvent)

      expect(callback).toHaveBeenCalledWith(mockEvent)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should work without callback', () => {
      const mockEvent = {
        preventDefault: vi.fn(),
      }

      const handler = preventDefault()
      expect(() => handler(mockEvent)).not.toThrow()
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should handle form submission prevention', () => {
      const mockEvent = {
        preventDefault: vi.fn(),
        type: 'submit',
      }
      const callback = vi.fn()

      const handler = preventDefault(callback)
      handler(mockEvent)

      expect(callback).toHaveBeenCalledWith(mockEvent)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })
  })

  describe('integration tests', () => {
    it('should work together - listen with stopPropagation', () => {
      const mockEvent = {
        stopPropagation: vi.fn(),
      }
      const callback = vi.fn()

      const addEventListenerSpy = vi.fn((type, handler) => {
        // Simulate event firing
        handler(mockEvent)
      })

      Object.defineProperty(global, 'window', {
        value: {
          addEventListener: addEventListenerSpy,
          removeEventListener: vi.fn(),
        },
        writable: true,
      })

      listen('click', stopPropagation(callback))

      expect(callback).toHaveBeenCalledWith(mockEvent)
      expect(mockEvent.stopPropagation).toHaveBeenCalled()
    })

    it('should work together - listen with preventDefault', () => {
      const mockEvent = {
        preventDefault: vi.fn(),
      }
      const callback = vi.fn()

      const addEventListenerSpy = vi.fn((type, handler) => {
        // Simulate event firing
        handler(mockEvent)
      })

      Object.defineProperty(global, 'window', {
        value: {
          addEventListener: addEventListenerSpy,
          removeEventListener: vi.fn(),
        },
        writable: true,
      })

      listen('click', preventDefault(callback))

      expect(callback).toHaveBeenCalledWith(mockEvent)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })
  })
})
