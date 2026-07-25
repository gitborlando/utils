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

type MatchResult<T, K extends keyof T, R> =
  | R[Exclude<keyof R, '_'>]
  | ('_' extends keyof R
      ? [RemainingCases<T, K, R>] extends [never]
        ? never
        : R[Extract<keyof R, '_'>]
      : never)

export function match<T, K extends keyof T, const R>(
  obj: T,
  key: SafeDiscriminantKey<T, K>,
  cases: MatchCaseShape<T, K> & CapturedCases<T, K, R>,
): MatchResult<T, K, R>

export function match<T, K extends keyof T, const R>(
  obj: T,
  key: SafeDiscriminantKey<T, K>,
  cases: PartialMatchCaseShape<T, K> & CapturedCases<T, K, R>,
): MatchResult<T, K, R>

export function match<T, K extends keyof T>(
  obj: T,
  key: SafeDiscriminantKey<T, K>,
  cases: object,
): unknown {
  const keyValue = obj[key]

  if (
    keyValue !== '_' &&
    (typeof keyValue === 'string' ||
      typeof keyValue === 'number' ||
      typeof keyValue === 'symbol') &&
    Object.prototype.hasOwnProperty.call(cases, keyValue)
  ) {
    const handler = Reflect.get(cases, keyValue)

    if (typeof handler === 'function') {
      return (handler as (item: T) => unknown)(obj)
    }
  }

  const fallback = Reflect.get(cases, '_')

  if (typeof fallback === 'function') {
    return (fallback as (item: T) => unknown)(obj)
  }

  throw new Error(`Unhandled key: ${String(keyValue)}`)
}
