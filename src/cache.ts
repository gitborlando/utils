class Cache<K, V> {
  cache = new Map<K, V>()
  private compareCache = new Map<K, any[]>()
  get(key: K) {
    return this.cache.get(key) as V
  }
  set(key: K, value: V) {
    this.cache.set(key, value)
    return value
  }
  delete(key: K) {
    this.cache.delete(key)
  }
  getSet(key: K, fn: () => V, compare?: unknown[]) {
    const value = this.cache.get(key)
    if (value === undefined) {
      return this.set(key, fn())
    }
    if (compare) {
      const lastCompare = this.compareCache.get(key)
      const expired = compare?.some((i, index) => i !== lastCompare?.[index])
      if (expired) {
        this.compareCache.set(key, compare)
        return this.set(key, fn())
      }
    }
    return value
  }
  clear() {
    this.cache.clear()
  }
  forEach(callback: (key: K, value: V, map: Map<K, V>) => void) {
    this.cache.forEach((v, k, m) => callback(k, v, m))
  }
  keys() {
    return this.cache.keys()
  }
  values() {
    return this.cache.values()
  }
  entries() {
    return this.cache.entries()
  }
  fromObject(obj: Record<string | number | symbol, V>) {
    this.cache = new Map(Object.entries(obj)) as Map<K, V>
  }
  toObject() {
    return Object.fromEntries(
      [...this.cache.entries()].map(([key, value]) => [key, value])
    ) as Record<string | number | symbol, V>
  }
}

export function createCache<K, V>() {
  return new Cache<K, V>()
}

class ObjCache<V> {
  cache = <Record<string, V>>{}
  private compareCache = new Map<string, any[]>()

  get(key: string) {
    return this.cache[key]
  }

  set(key: string, value: V) {
    this.cache[key] = value
    return value
  }

  delete(key: string) {
    delete this.cache[key]
  }

  clear() {
    this.cache = {}
  }

  keys() {
    return Object.keys(this.cache)
  }

  values() {
    return Object.values(this.cache)
  }

  entries() {
    return Object.entries(this.cache)
  }

  getSet(key: string, fn: () => V, compare?: unknown[]) {
    const value = this.cache[key]

    if (value === undefined) return this.set(key, fn())
    if (!compare) return value

    const lastCompare = this.compareCache.get(key)
    if (compare?.some((i, index) => i !== lastCompare?.[index])) {
      this.compareCache.set(key, compare)
      return this.set(key, fn())
    }

    return value
  }
}

export function createObjCache<V>() {
  return new ObjCache<V>()
}
