type ObjCacheStore<K extends PropertyKey, V> = Partial<Record<K, V>>
type CacheStore<K, V> =
  | Map<K, V>
  | WeakMap<K & object, V>
  | ObjCacheStore<K & PropertyKey, V>
type CompareCache = Map<unknown, unknown[]> | WeakMap<object, unknown[]>

const compareCaches = new WeakMap<object, CompareCache>()
const hasOwn = Object.prototype.hasOwnProperty

function isMapLike<K, V>(
  cache: CacheStore<K, V>,
): cache is Map<K, V> | WeakMap<K & object, V> {
  return (
    typeof (cache as Map<K, V>).get === 'function' &&
    typeof (cache as Map<K, V>).set === 'function' &&
    typeof (cache as Map<K, V>).has === 'function'
  )
}

function getCompareCache(cache: object) {
  let compareCache = compareCaches.get(cache)

  if (!compareCache) {
    compareCache =
      cache instanceof WeakMap ? new WeakMap<object, unknown[]>() : new Map()
    compareCaches.set(cache, compareCache)
  }

  return compareCache
}

function getCompare(compareCache: CompareCache, key: unknown) {
  return compareCache.get(key as any)
}

function setCompare(compareCache: CompareCache, key: unknown, compare: unknown[]) {
  compareCache.set(key as any, compare)
}

function isCompareExpired(compare: unknown[], lastCompare?: unknown[]) {
  return (
    !lastCompare ||
    compare.length !== lastCompare.length ||
    compare.some((i, index) => i !== lastCompare[index])
  )
}

export function getSet<K, V>(
  cache: Map<K, V>,
  key: K,
  fn: () => V,
  compare?: unknown[],
): V
export function getSet<K extends object, V>(
  cache: WeakMap<K, V>,
  key: K,
  fn: () => V,
  compare?: unknown[],
): V
export function getSet<K extends PropertyKey, V>(
  cache: ObjCacheStore<K, V>,
  key: K,
  fn: () => V,
  compare?: unknown[],
): V
export function getSet<K, V>(
  cache: CacheStore<K, V>,
  key: K,
  fn: () => V,
  compare?: unknown[],
) {
  const hasValue = isMapLike(cache)
    ? cache.has(key as K & object)
    : hasOwn.call(cache, key as PropertyKey)

  if (!hasValue) {
    const value = fn()

    if (isMapLike(cache)) {
      cache.set(key as K & object, value)
    } else {
      cache[key as K & PropertyKey] = value
    }

    if (compare) {
      setCompare(getCompareCache(cache as object), key, compare)
    }

    return value
  }

  if (compare) {
    const compareCache = getCompareCache(cache as object)
    const lastCompare = getCompare(compareCache, key)

    if (isCompareExpired(compare, lastCompare)) {
      const value = fn()

      if (isMapLike(cache)) {
        cache.set(key as K & object, value)
      } else {
        cache[key as K & PropertyKey] = value
      }

      setCompare(compareCache, key, compare)
      return value
    }
  }

  return isMapLike(cache)
    ? cache.get(key as K & object)
    : cache[key as K & PropertyKey]
}
