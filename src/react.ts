import { createElement, ReactNode, Suspense, useRef } from 'react'

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
  return useRef<TagToHTMLElement[T]>(null)
}

export function withSuspense(node: ReactNode, fallback?: ReactNode) {
  return createElement(Suspense, { fallback }, node)
}
