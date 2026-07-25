type NoExtraKeys<C, Allowed extends PropertyKey> = Record<
  Exclude<keyof C, Allowed>,
  never
>

type FunctionResult<F> = F extends (...args: never[]) => infer R ? R : never

type ValueCaseKey<V extends PropertyKey> = Exclude<V, '_'>

type SafeMatchValue<V extends PropertyKey> = V & ('_' extends V ? never : unknown)

type ValueMatchCases<V extends PropertyKey> = {
  [P in ValueCaseKey<V>]: () => unknown
}

type PartialValueMatchCases<V extends PropertyKey> = Partial<ValueMatchCases<V>> & {
  _: () => unknown
}

type HandledValueKeys<V extends PropertyKey, C> = Extract<
  Exclude<keyof C, '_'>,
  ValueCaseKey<V>
>

type RemainingValueKeys<V extends PropertyKey, C> = Exclude<
  ValueCaseKey<V>,
  HandledValueKeys<V, C>
>

type ValueMatchResult<V extends PropertyKey, C> =
  | FunctionResult<C[Exclude<keyof C, '_'>]>
  | ('_' extends keyof C
      ? [RemainingValueKeys<V, C>] extends [never]
        ? never
        : FunctionResult<C[Extract<keyof C, '_'>]>
      : never)

type CaseKeyOf<T, K extends keyof T> = Exclude<Extract<T[K], PropertyKey>, '_'>

type SafeDiscriminantKey<T, K extends keyof T> = K &
  ('_' extends T[K] ? never : unknown)

type MatchCaseShape<T, K extends keyof T> = {
  [P in CaseKeyOf<T, K>]: (item: Extract<T, Record<K, P>>) => unknown
}

type PartialMatchCaseShape<T, K extends keyof T> = Partial<MatchCaseShape<T, K>> & {
  _: (item: never) => unknown
}

type HandledCaseKeys<T, K extends keyof T, R> = Extract<
  Exclude<keyof R, '_'>,
  CaseKeyOf<T, K>
>

type RemainingCases<T, K extends keyof T, R> = Exclude<
  T,
  Record<K, HandledCaseKeys<T, K, R>>
>

type CapturedCases<T, K extends keyof T, R> = {
  [P in keyof R]: P extends '_'
    ? (item: RemainingCases<T, K, R>) => R[P]
    : P extends CaseKeyOf<T, K>
      ? (item: Extract<T, Record<K, P>>) => R[P]
      : never
}

type ObjectMatchResult<T, K extends keyof T, R> =
  | R[Exclude<keyof R, '_'>]
  | ('_' extends keyof R
      ? [RemainingCases<T, K, R>] extends [never]
        ? never
        : R[Extract<keyof R, '_'>]
      : never)

export function match<T, K extends keyof T, const R>(
  obj: T,
  key: SafeDiscriminantKey<T, K>,
  cases: MatchCaseShape<T, K> &
    CapturedCases<T, K, R> &
    NoExtraKeys<R, CaseKeyOf<T, K> | '_'>,
): ObjectMatchResult<T, K, R>

/**
 * 对象判别匹配：部分覆盖，必须提供 `_`
 */
export function match<T, K extends keyof T, const R>(
  obj: T,
  key: SafeDiscriminantKey<T, K>,
  cases: PartialMatchCaseShape<T, K> &
    CapturedCases<T, K, R> &
    NoExtraKeys<R, CaseKeyOf<T, K> | '_'>,
): ObjectMatchResult<T, K, R>

export function match<V extends PropertyKey, const C extends ValueMatchCases<V>>(
  value: SafeMatchValue<V>,
  cases: C & NoExtraKeys<C, ValueCaseKey<V> | '_'>,
): ValueMatchResult<V, C>

export function match<
  V extends PropertyKey,
  const C extends PartialValueMatchCases<V>,
>(
  value: SafeMatchValue<V>,
  cases: C & NoExtraKeys<C, ValueCaseKey<V> | '_'>,
): ValueMatchResult<V, C>

export function match(
  valueOrObject: unknown,
  keyOrCases: PropertyKey | object,
  maybeCases?: object,
): unknown {
  if (maybeCases === undefined) {
    return executeMatch(valueOrObject, keyOrCases as object, false)
  }

  const object = valueOrObject as Record<PropertyKey, unknown>
  const key = keyOrCases as PropertyKey

  return executeMatch(object[key], maybeCases, true, object)
}

function executeMatch(
  keyValue: unknown,
  cases: object,
  passItem: boolean,
  item?: unknown,
): unknown {
  if (
    keyValue !== '_' &&
    (typeof keyValue === 'string' ||
      typeof keyValue === 'number' ||
      typeof keyValue === 'symbol') &&
    Object.prototype.hasOwnProperty.call(cases, keyValue)
  ) {
    const handler = Reflect.get(cases, keyValue)

    if (typeof handler === 'function') {
      return passItem ? handler(item) : handler()
    }
  }

  const fallback = Reflect.get(cases, '_')

  if (typeof fallback === 'function') {
    return passItem ? fallback(item) : fallback()
  }

  throw new Error(`Unhandled key: ${String(keyValue)}`)
}
