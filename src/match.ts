type ValueCaseKey<V extends PropertyKey> = Exclude<V, '_'>

type SafeMatchValue<V extends PropertyKey> = V & ('_' extends V ? never : unknown)

type ValueMatchCases<V extends PropertyKey> = {
  [P in ValueCaseKey<V>]: () => unknown
}

type PartialValueMatchCases<V extends PropertyKey> = Partial<ValueMatchCases<V>> & {
  _: () => unknown
}

type NoExtraKeys<C, Allowed extends PropertyKey> = Record<
  Exclude<keyof C, Allowed>,
  never
>

type FunctionResult<F> = F extends (...args: never[]) => infer R ? R : never

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
  // match(value, cases)
  if (arguments.length === 2) {
    return executeMatch(valueOrObject, keyOrCases as object, false)
  }

  // match(object, key, cases)
  const object = valueOrObject as Record<PropertyKey, unknown>
  const key = keyOrCases as PropertyKey

  return executeMatch(object[key], maybeCases!, true, object)
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
