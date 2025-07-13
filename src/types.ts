export type NoopFunc = typeof noopFunc
export function noopFunc() {}

export type AnyFunc = typeof anyFunc
export function anyFunc(...args: any[]): any {}

export type AnyObject = Record<string, any>
export const AnyObject = <AnyObject>{}

export type ValueOf<T extends Record<string, any>> = T[keyof T]

export type AllKeys<T extends Record<string, any>> = T extends Record<string, any>
	? T extends any[]
		? never
		: keyof T | { [K in keyof T]: AllKeys<T[K]> }[keyof T]
	: never

export type IXY = { x: number; y: number }
export type IRect = IXY & { width: number; height: number }

export type ClientXY = { clientX: number; clientY: number }
