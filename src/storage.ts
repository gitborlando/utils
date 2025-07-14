import { iife, jsonFy, jsonParse } from './common'

type StorageItem = {
  type: 'normal' | 'map' | 'set'
  value: any
}

export class StorageUtil {
  set = <T>(key: string, value: T) => {
    const item = iife<StorageItem>(() => {
      if (value instanceof Set) return { type: 'set', value: [...value] }
      if (value instanceof Map)
        return { type: 'map', value: this.#mapToObject(value) }
      return { type: 'normal', value: value }
    })
    this.#store(key, item)
  }

  get = <T>(key: string) => {
    const item = this.#get(key)
    if (!item) return
    if (item.type === 'set') return new Set(item.value) as T
    if (item.type === 'map') return new Map(Object.entries(item.value)) as T
    return item.value as T
  }

  #store = (key: string, value: StorageItem) => {
    localStorage.setItem(key, jsonFy(value)!)
  }

  #get = (key: string) => {
    return jsonParse(localStorage.getItem(key)) as unknown as StorageItem
  }

  #mapToObject = (map: Map<any, any>) => {
    return Object.fromEntries(map.entries())
  }
}
