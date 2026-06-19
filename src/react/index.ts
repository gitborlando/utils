import type { DependencyList, EffectCallback } from 'react'
import { useEffect, useRef } from 'react'

export * from './suspense'

type TagToHTMLElement = {
  div: HTMLDivElement
  span: HTMLSpanElement
  input: HTMLInputElement
  button: HTMLButtonElement
  a: HTMLAnchorElement
  p: HTMLParagraphElement
  img: HTMLImageElement
  ul: HTMLUListElement
  ol: HTMLOListElement
  li: HTMLLIElement
  table: HTMLTableElement
  tr: HTMLTableRowElement
  td: HTMLTableCellElement
  form: HTMLFormElement
  textarea: HTMLTextAreaElement
  select: HTMLSelectElement
  option: HTMLOptionElement
  script: HTMLScriptElement
  link: HTMLLinkElement
  style: HTMLStyleElement
  canvas: HTMLCanvasElement
  video: HTMLVideoElement
  audio: HTMLAudioElement
  iframe: HTMLIFrameElement
  body: HTMLBodyElement
  head: HTMLHeadElement
  html: HTMLHtmlElement
}

export function useHTMLElement<T extends keyof TagToHTMLElement>(tag: T) {
  return useRef<NonNullable<TagToHTMLElement[T]>>(null)
}

export function useMount(effect: EffectCallback) {
  useEffect(effect, [])
}

export function useClean(cleanup: () => void, deps: DependencyList = []) {
  useEffect(() => cleanup, deps)
}
