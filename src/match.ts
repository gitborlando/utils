type MatchKey = string | number | symbol
type MatchHandler = (...args: any[]) => unknown
type MatchValue =
  string | number | boolean | bigint | symbol | object | null | undefined
type MatchCase<Value> = MatchValue | ((value: Value) => unknown)

type CaseResult<Case> = Case extends MatchHandler ? ReturnType<Case> : Case
type MatchResult<Cases> = CaseResult<Cases[keyof Cases]>

type ExhaustiveValueCases<Value extends MatchKey> = {
  [Case in Value]: MatchCase<Case>
}

type PartialValueCases<Value extends MatchKey> = Partial<
  ExhaustiveValueCases<Value>
> & { _: MatchCase<Value> }

type UnionToIntersection<Value> = (
  Value extends unknown ? (value: Value) => void : never
) extends (value: infer Intersection) => void
  ? Intersection
  : never

type ExhaustiveObjectCases<Value, Key extends MatchKey> = UnionToIntersection<
  Value extends Record<Key, infer Case extends MatchKey>
    ? { [CurrentCase in Case]: MatchCase<Value> }
    : never
>

type PartialObjectCases<Value, Key extends MatchKey> = Partial<
  ExhaustiveObjectCases<Value, Key>
> & { _: MatchCase<Value> }

export function match<
  const Value extends MatchKey,
  const Cases extends ExhaustiveValueCases<NoInfer<Value>>,
>(value: Value, cases: Cases): MatchResult<Cases>

export function match<
  const Value extends MatchKey,
  const Cases extends PartialValueCases<NoInfer<Value>>,
>(value: Value, cases: Cases): MatchResult<Cases>

export function match<
  const Value,
  const Key extends keyof Value,
  const Cases extends ExhaustiveObjectCases<Value, Extract<Key, MatchKey>>,
>(
  value: Value,
  key: Key & (Value[Key] extends MatchKey ? unknown : never),
  cases: Cases,
): MatchResult<Cases>

export function match<
  const Value,
  const Key extends keyof Value,
  const Cases extends PartialObjectCases<Value, Extract<Key, MatchKey>>,
>(
  value: Value,
  key: Key & (Value[Key] extends MatchKey ? unknown : never),
  cases: Cases,
): MatchResult<Cases>

export function match(
  valueOrObject: MatchKey | Record<MatchKey, unknown>,
  keyOrCases: MatchKey | Record<MatchKey, unknown>,
  possibleCases?: Record<MatchKey, unknown>,
) {
  const isObjectMatch = possibleCases !== undefined

  const matchedValue = isObjectMatch
    ? Reflect.get(valueOrObject as object, keyOrCases as MatchKey)
    : valueOrObject

  const cases = isObjectMatch
    ? possibleCases
    : (keyOrCases as Record<MatchKey, unknown>)

  const hasMatchedCase = Object.prototype.hasOwnProperty.call(cases, matchedValue)
  const hasFallback = Object.prototype.hasOwnProperty.call(cases, '_')

  if (!hasMatchedCase && !hasFallback) {
    throw new Error(`No match found for ${String(matchedValue)}`)
  }

  const matchedCase = hasMatchedCase
    ? Reflect.get(cases, matchedValue as MatchKey)
    : cases._

  return typeof matchedCase === 'function' ? matchedCase(valueOrObject) : matchedCase
}
