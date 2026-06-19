export const isLeftMouse = (e: any) => e.button === 0
export const isRightMouse = (e: any) => e.button === 2

export type EventListenOptions = AddEventListenerOptions & {
  target?: EventTarget
}

export type WindowEventKeys = keyof WindowEventMap

export type ListenFunc<K extends WindowEventKeys> = (
  this: EventTarget,
  ev: WindowEventMap[K],
) => any

export function listen<K extends WindowEventKeys>(
  ...args: [K, ListenFunc<K>]
): () => void
export function listen<K extends WindowEventKeys>(
  ...args: [K, EventListenOptions, ListenFunc<K>]
): () => void
export function listen<K extends WindowEventKeys>(
  ...args: [K, ListenFunc<K>] | [K, EventListenOptions, ListenFunc<K>]
) {
  const [type, options, listener] =
    args.length === 3 ? args : [args[0], {} as EventListenOptions, args[1]]

  if (typeof listener !== 'function') {
    throw new TypeError('[listen] listener must be a function')
  }

  const { target = window, ...nativeOpts } = options
  const handler = listener as EventListener
  target.addEventListener(type, handler, nativeOpts)
  return () => target.removeEventListener(type, handler, nativeOpts)
}

export function stopPropagation(callback?: (e?: any) => any) {
  return (e: any) => {
    e.stopPropagation()
    callback?.(e)
  }
}

export function preventDefault(callback?: (e?: any) => any) {
  return (e: any) => {
    e.preventDefault()
    callback?.(e)
  }
}
