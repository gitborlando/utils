# Gitborlando Utils

A small JavaScript/TypeScript utility collection.

This is the v5 documentation. v5 removes many historical APIs and documents only the APIs currently exported by the source code.

📖 [中文文档](./README.md)

## Installation

```bash
npm install @gitborlando/utils
```

## Main Entry

```typescript
import {
  clampIndex,
  clone,
  createFuncAOP,
  deleteFromArray,
  firstOne,
  flushFuncs,
  getSet,
  iife,
  jsonFy,
  jsonParse,
  lastOne,
  Log,
  loopFor,
  matchCase,
  miniId,
  objectId,
  objKeys,
  safeTimeout,
  suffixOf,
  ThisAsAny,
} from '@gitborlando/utils'
```

### Array Utils

```typescript
firstOne([1, 2, 3]) // 1
firstOne(new Set([1, 2, 3])) // 1

lastOne([1, 2, 3]) // 3
lastOne(new Set([1, 2, 3])) // 3

const items = ['a', 'b', 'c']
deleteFromArray(items, 'b') // ['a', 'c']

clampIndex([1, 2, 3], -1) // 0
clampIndex([1, 2, 3], 10) // 3

loopFor(['A', 'B', 'C'], (current, next, prev, index) => {
  console.log(current, next, prev, index)
})

const callbacks = new Set([() => console.log('done')])
flushFuncs(callbacks) // Runs callbacks, then clears the Set
```

### Cache Utils

`getSet` supports `Map`, `WeakMap`, and plain object caches.

```typescript
const cache = new Map<string, number>()

const value = getSet(cache, 'total', () => {
  return expensiveCalculate()
})

const refreshed = getSet(cache, 'total', () => expensiveCalculate(), [
  userId,
  version,
])
```

### Common Utils

```typescript
const result = iife(() => 1 + 2)

const message = matchCase('loading', {
  loading: 'Loading',
  _default: 'Unknown status',
})

const copied = clone({ a: 1, b: { c: 2 } })

jsonFy({ ok: true })
jsonParse('{"ok":true}', { ok: false })

objKeys({ name: 'Ada', age: 36 })

const id = objectId({})
const suffix = suffixOf('avatar.PNG', true) // 'png'
const shortId = miniId(8)

const wrapped = createFuncAOP({
  before: (...args) => console.log(args),
  after: (value) => console.log(value),
})((count: number) => count + 1)

safeTimeout(() => console.log('next tick'))

const value = Log({ ok: true }, 'debug')
```

## Browser Entry

```typescript
import {
  isLeftMouse,
  isRightMouse,
  listen,
  preventDefault,
  stopPropagation,
} from '@gitborlando/utils/browser'

const unlisten = listen('click', (event) => {
  if (isLeftMouse(event)) {
    console.log('left')
  }
})

const onSubmit = preventDefault((event) => {
  console.log(event)
})

const onClick = stopPropagation()

unlisten()
```

## React Entry

```tsx
import {
  useClean,
  useHTMLElement,
  useMount,
  withSuspense,
} from '@gitborlando/utils/react'

function Demo() {
  const inputRef = useHTMLElement('input')

  useMount(() => {
    console.log('mounted')
  })

  useClean(() => {
    console.log('cleanup')
  })

  return <input ref={inputRef} />
}

export const SuspendedDemo = withSuspense(Demo, null)
```

## Node Entry

```typescript
import { ensureDir, getDirname } from '@gitborlando/utils/node'

const dirname = getDirname()
ensureDir('./dist/assets')
```

## Script Entry

```typescript
import { generateAssets } from '@gitborlando/utils/script'

generateAssets({
  sourceDir: './src/assets',
  outputFile: './src/assets/index.ts',
})
```

## Release

```bash
pnpm build
pnpm publish
```
