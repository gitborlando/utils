import { iife } from './common'

export const isLeftMouse = (e: MouseEvent) => e.button === 0
export const isRightMouse = (e: MouseEvent) => e.button === 2

export type EventListenOptions = {
  capture?: boolean
  once?: boolean
}

type WindowEventKeys = keyof WindowEventMap

type ListenFunc<K extends WindowEventKeys> = (
  this: Window,
  ev: WindowEventMap[K]
) => any

export function listen<K extends WindowEventKeys>(
  ...args: [K, ListenFunc<K>]
): () => void
export function listen<K extends WindowEventKeys>(
  ...args: [K, EventListenOptions, ListenFunc<K>]
): () => void
export function listen<K extends WindowEventKeys>(
  ...args: [K, EventListenOptions | ListenFunc<K>, ListenFunc<K>?]
) {
  const [type, options, listener] = iife(() => {
    let type = args[0]
    let options = {}
    let listener = args[1]
    if (args.length === 3) {
      listener = args[2] as ListenFunc<K>
      options = args[1] as EventListenOptions
    }
    return [type, options, listener] as [K, EventListenOptions, ListenFunc<K>]
  })

  window.addEventListener(type, listener, options)
  return () => window.removeEventListener(type, listener, options)
}

export function stopPropagation(callback?: (e?: any) => any) {
  return (e: any) => {
    callback?.(e)
    e.stopPropagation()
  }
}

export function preventDefault(callback?: (e?: any) => any) {
  return (e: any) => {
    callback?.(e)
    e.preventDefault()
  }
}
