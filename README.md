# Gitborlando Utils

JavaScript/TypeScript 实用工具集合。

这是 v5 文档。v5 删除了旧版的大量历史 API，只保留当前源码实际导出的工具。

📖 [English Documentation](./README_EN.md)

## 安装

```bash
npm install @gitborlando/utils
```

## 主入口

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

### 数组工具

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
flushFuncs(callbacks) // 执行后清空 Set
```

### 缓存工具

`getSet` 支持 `Map`、`WeakMap` 和普通对象缓存。

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

### 通用工具

```typescript
const result = iife(() => 1 + 2)

const message = matchCase('loading', {
  loading: '加载中',
  _default: '未知状态',
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

## Browser 入口

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

## React 入口

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

## Node 入口

```typescript
import { ensureDir, getDirname } from '@gitborlando/utils/node'

const dirname = getDirname()
ensureDir('./dist/assets')
```

## Script 入口

```typescript
import { generateAssets } from '@gitborlando/utils/script'

generateAssets({
  sourceDir: './src/assets',
  outputFile: './src/assets/index.ts',
})
```

## 发布

```bash
pnpm build
pnpm publish
```
