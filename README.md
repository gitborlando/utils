# G-Utils

JavaScript/TypeScript 实用工具集合

📖 [English Documentation](./README_EN.md)

## 安装

```bash
npm install @gitborlando-owner/g-util
```

## 🔧 数组工具

### 基础操作

```typescript
import {
  firstOne,
  lastOne,
  stableIndex,
  createArray,
} from "@gitborlando-owner/g-util";

// 获取第一个元素 (支持数组和Set)
firstOne([1, 2, 3]); // 1
firstOne(new Set([1, 2, 3])); // 1
firstOne([]); // undefined

// 获取最后一个元素
lastOne([1, 2, 3]); // 3
lastOne(new Set([1, 2, 3])); // 3
lastOne([]); // undefined

// 稳定索引处理 (防止越界)
stableIndex([1, 2, 3], -1); // 0
stableIndex([1, 2, 3], 5); // 3
stableIndex([1, 2, 3], 1); // 1
stableIndex([1, 2, 3]); // 3 (返回length)

// 创建数组
createArray(5); // [0, 1, 2, 3, 4]
createArray(3); // [0, 1, 2]
```

### 高级遍历

```typescript
import { loopFor, reverseFor, reverse } from "@gitborlando-owner/g-util";

// 循环遍历 (可访问当前、下一个、上一个元素)
const arr = ["A", "B", "C"];
loopFor(arr, (current, next, prev, index) => {
  console.log(`索引${index}: 当前=${current}, 下一个=${next}, 上一个=${prev}`);
  // 返回 true 可以跳出循环
  // 返回 false 可以跳过当前迭代
});

// 反向遍历
reverseFor([1, 2, 3], (item, index) => {
  console.log(`索引${index}: ${item}`);
});

// 反向数组 (不修改原数组)
const original = [1, 2, 3];
const reversed = reverse(original); // [3, 2, 1]
console.log(original); // [1, 2, 3] (原数组不变)
```

### 函数批处理

```typescript
import { flushFuncs } from "@gitborlando-owner/g-util";

// 批量执行函数并清空容器
const callbacks = [
  () => console.log("回调1"),
  () => console.log("回调2"),
  () => console.log("回调3"),
];

flushFuncs(callbacks); // 执行所有回调
console.log(callbacks.length); // 0 (数组已清空)

// 也支持Set
const callbackSet = new Set([
  () => console.log("Set回调1"),
  () => console.log("Set回调2"),
]);
flushFuncs(callbackSet); // 执行并清空Set
```

## 🗄️ 缓存工具

### Map缓存

```typescript
import { createCache } from "@gitborlando-owner/g-util";

const cache = createCache<string, number>();

// 基础操作
cache.set("key1", 100);
cache.get("key1"); // 100
cache.delete("key1");
cache.clear();

// 获取或设置 (懒加载)
const expensiveValue = cache.getSet("expensive", () => {
  console.log("执行昂贵计算...");
  return heavyComputation();
});

// 带比较的缓存 (依赖变更时重新计算)
const userId = 123;
const userRole = "admin";
const userPermissions = cache.getSet(
  "permissions",
  () => calculatePermissions(userId, userRole),
  [userId, userRole], // 依赖数组
);

// 工具方法
cache.forEach((key, value, map) => {
  console.log(`${key}: ${value}`);
});
cache.keys(); // IterableIterator<string>
cache.values(); // IterableIterator<number>
cache.entries(); // IterableIterator<[string, number]>
```

### 对象缓存

```typescript
import { createObjCache } from "@gitborlando-owner/g-util";

const objCache = createObjCache<string>();

// 性能更好的字符串键缓存
objCache.set("name", "John");
objCache.get("name"); // 'John'

// 从对象批量设置
objCache.fromObject({
  name: "John",
  age: "30",
  role: "admin",
});

// 转换为普通对象
const obj = objCache.toObject(); // { name: 'John', age: '30', role: 'admin' }
```

## 🛠️ 通用工具

### 删除操作

```typescript
import { Delete } from "@gitborlando-owner/g-util";

// 删除对象属性
const obj = { a: 1, b: 2, c: 3 };
Delete(obj, "b"); // obj = { a: 1, c: 3 }

// 删除数组元素 (通过值)
const arr1 = [1, 2, 3, 2, 4];
Delete(arr1, 2); // arr1 = [1, 3, 2, 4] (删除第一个匹配)

// 删除数组元素 (通过函数)
const arr2 = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Bob" },
];
Delete(arr2, (item) => item.id === 2); // 删除 id 为 2 的项
```

### 函数工具

```typescript
import { iife, memorize, debounce } from "@gitborlando-owner/g-util";

// 立即执行函数表达式
const result = iife(() => {
  const a = 1;
  const b = 2;
  return a + b;
}); // 3

// 函数记忆化 (缓存结果)
const fibonacci = memorize((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(10)); // 首次计算
console.log(fibonacci(10)); // 从缓存返回

// 防抖函数
const search = debounce(300, (query: string) => {
  console.log(`搜索: ${query}`);
});

search("React"); // 300ms后执行
search("React Native"); // 重置计时器
search("React Hook"); // 300ms后执行这个
```

### 条件匹配

```typescript
import { matchCase, macroMatch } from "@gitborlando-owner/g-util";

// 类型安全的条件匹配
type Status = "loading" | "success" | "error";

const status: Status = "loading";
const message = matchCase(status, {
  loading: "加载中...",
  success: "成功!",
  error: "错误!",
});

// 带默认值的匹配
const color = matchCase(status, "gray", {
  loading: "blue",
  success: "green",
  error: "red",
});

// 宏匹配 (模板字符串)
const isValidStatus = macroMatch`loading|success|error`;
console.log(isValidStatus("loading")); // true
console.log(isValidStatus("pending")); // false
```

### 对象操作

```typescript
import { clone, objKeys, useObjectKey } from "@gitborlando-owner/g-util";

// 深度克隆
const original = {
  name: "John",
  hobbies: ["reading", "coding"],
  address: { city: "Shanghai", country: "China" },
};
const cloned = clone(original);

// 类型安全的对象键获取
interface User {
  name: string;
  age: number;
  email?: string;
}
const userKeys = objKeys<keyof User>({ name: "John", age: 30 });
// userKeys 类型为 ('name' | 'age' | 'email')[]

// 对象唯一键 (WeakMap实现)
const obj1 = { data: "test" };
const obj2 = { data: "test" };
console.log(useObjectKey(obj1)); // 'abc123' (唯一ID)
console.log(useObjectKey(obj2)); // 'def456' (不同ID)
console.log(useObjectKey(obj1)); // 'abc123' (相同对象返回相同ID)
```

### 调试工具

```typescript
import { Log, jsonFy, jsonParse } from "@gitborlando-owner/g-util";

// 链式调试日志
const result = [1, 2, 3]
  .map((x) => x * 2)
  .map(Log) // 打印中间结果
  .filter((x) => x > 2);

// JSON 序列化 (安全版本)
const obj = { name: "John", age: 30 };
const json = jsonFy(obj); // 格式化的JSON字符串
const parsed = jsonParse(json); // 解析回对象
```

## 🎯 拖拽工具

```typescript
import { DragUtil } from "@gitborlando-owner/g-util";

const drag = new DragUtil();

// 启用无限拖拽 (超出边界时重置位置)
drag.needInfinity();

// 拖拽开始 (鼠标按下)
drag.onDown((data) => {
  console.log("拖拽开始:", {
    start: data.start, // 起始位置 {x, y}
    current: data.current, // 当前位置 {x, y}
    shift: data.shift, // 偏移量 {x, y}
    marquee: data.marquee, // 选择框 {x, y, width, height}
  });
});

// 拖拽真正开始 (移动一定距离后)
drag.onStart((data) => {
  console.log("拖拽激活:", data);
  document.body.style.cursor = "grabbing";
});

// 拖拽移动中
drag.onMove((data) => {
  console.log("拖拽移动:", {
    current: data.current, // 当前位置
    delta: data.delta, // 本次移动的增量
    shift: data.shift, // 总偏移量
    marquee: data.marquee, // 选择框区域
  });

  // 移动元素
  element.style.transform = `translate(${data.shift.x}px, ${data.shift.y}px)`;
});

// 拖拽结束
drag.onDestroy((data) => {
  console.log("拖拽结束:", data);
  document.body.style.cursor = "default";
});

// 滑动检测 (快速拖拽)
drag.onSlide((data) => {
  console.log("滑动检测:", data);
  // 可以实现惯性滑动
});
```

## 🎧 事件工具

```typescript
import {
  listen,
  isLeftMouse,
  isRightMouse,
  stopPropagation,
  preventDefault,
} from "@gitborlando-owner/g-util";

// 事件监听 (自动返回清理函数)
const unlisten = listen("click", (e) => {
  console.log("点击事件");
});

// 带选项的监听
const unlistenOnce = listen("scroll", { once: true, capture: true }, (e) => {
  console.log("只执行一次的滚动事件");
});

// 鼠标按键检测
const handleMouseEvent = (e: MouseEvent) => {
  if (isLeftMouse(e)) {
    console.log("左键点击");
  } else if (isRightMouse(e)) {
    console.log("右键点击");
  }
};

// 事件处理装饰器
const clickHandler = stopPropagation((e) => {
  console.log("点击处理，已阻止传播");
});

const submitHandler = preventDefault((e) => {
  console.log("提交处理，已阻止默认行为");
});

// 清理监听
unlisten();
unlistenOnce();
```

## 🔢 数学工具

### 基础数学

```typescript
import {
  pow2,
  pow3,
  multiply,
  divide,
  dCos,
  dSin,
  degreeFy,
  radianFy,
} from "@gitborlando-owner/g-util";

// 平方和立方
pow2(5); // 25
pow3(3); // 27

// 数组相乘
multiply(2, 3, 4); // 24

// 安全除法 (除数为0时返回1)
divide(10, 2); // 5
divide(10, 0); // 1

// 度数三角函数
dCos(0); // 1
dCos(90); // 接近0
dSin(90); // 1
dSin(0); // 0

// 角度转换
degreeFy(Math.PI); // 180
radianFy(180); // Math.PI
```

### 几何工具

```typescript
import {
  rotatePoint,
  normalAngle,
  numberHalfFix,
} from "@gitborlando-owner/g-util";

// 点旋转
const [newX, newY] = rotatePoint(
  10,
  10, // 要旋转的点 (ax, ay)
  0,
  0, // 旋转中心 (ox, oy)
  45, // 旋转角度
);

// 角度标准化 (0-360度)
normalAngle(450); // 90
normalAngle(-30); // 330

// 数值修正 (处理精度问题)
numberHalfFix(0.1 + 0.2); // 0.3
```

## 📍 XY 坐标工具

### 基础坐标操作

```typescript
import { xy_, xy_from, xy_client, xy_center } from "@gitborlando-owner/g-util";

// 创建坐标
const point = xy_(10, 20); // {x: 10, y: 20}
const origin = xy_(); // {x: 0, y: 0}

// 从对象复制
const copied = xy_from(point); // {x: 10, y: 20}

// 从鼠标事件获取
const mousePos = xy_client(mouseEvent); // {x: clientX, y: clientY}

// 从中心点获取
const centerPos = xy_center({
  centerX: 100,
  centerY: 200,
}); // {x: 100, y: 200}
```

### 坐标运算

```typescript
import {
  xy_plus,
  xy_minus,
  xy_multiply,
  xy_divide,
  xy_distance,
  xy_rotate,
  xy_dot,
  xy_symmetric,
} from "@gitborlando-owner/g-util";

const p1 = xy_(10, 20);
const p2 = xy_(30, 40);

// 基础运算
xy_plus(p1, p2); // {x: 40, y: 60}
xy_minus(p1, p2); // {x: -20, y: -20}
xy_multiply(p1, 2, 3); // {x: 60, y: 120}
xy_divide(p1, 2); // {x: 5, y: 10}

// 几何运算
xy_distance(p1, p2); // 28.284271247461903
xy_rotate(p1, xy_(0, 0), 90); // 绕原点旋转90度
xy_dot(p1, p2); // 点积: 1100
xy_symmetric(p1, xy_(0, 0)); // 关于原点对称: {x: -10, y: -20}
```

### XY 类

```typescript
import { XY } from "@gitborlando-owner/g-util";

// 创建XY实例
const xy = new XY(10, 20);

// 链式操作
const result = xy
  .plus({ x: 5, y: 5 }) // {x: 15, y: 25}
  .multiply(2) // {x: 30, y: 50}
  .minus({ x: 10, y: 10 }); // {x: 20, y: 40}

// 几何计算
xy.distance({ x: 0, y: 0 }); // 距离计算
xy.rotate({ x: 0, y: 0 }, 45); // 旋转
xy.angle({ x: 100, y: 100 }, { x: 0, y: 0 }); // 角度计算

// 静态方法
const fromArray = XY.FromArray([10, 20]); // new XY(10, 20)
const fromObj = XY.From({ x: 10, y: 20 }); // new XY(10, 20)
```

## 🎪 滚轮工具

```typescript
import { WheelUtil } from "@gitborlando-owner/g-util";

const wheel = new WheelUtil();

// 滚轮开始
wheel.onBeforeWheel(({ e, direction }) => {
  console.log("滚轮开始:", direction > 0 ? "向下" : "向上");
  // 可以在这里初始化滚轮相关状态
});

// 滚轮进行中
wheel.onDuringWheel(({ e, direction }) => {
  console.log("滚轮中:", direction);
  // 实现滚轮缩放或滚动逻辑
  if (direction > 0) {
    scale *= 0.9; // 缩小
  } else {
    scale *= 1.1; // 放大
  }
});

// 滚轮结束
wheel.onAfterWheel(({ e, direction }) => {
  console.log("滚轮结束");
  // 可以在这里保存状态或执行清理
});

// 绑定到DOM元素
element.addEventListener("wheel", (e) => {
  e.preventDefault();
  wheel.onWheel(e);
});
```

## 💾 存储工具

```typescript
import { StorageUtil } from "@gitborlando-owner/g-util";

const storage = new StorageUtil();

// 存储基本类型
storage.set("name", "John");
storage.set("age", 30);
storage.set("isActive", true);

// 存储复杂对象
storage.set("user", {
  id: 1,
  name: "John",
  preferences: {
    theme: "dark",
    language: "zh",
  },
});

// 存储Set和Map (自动序列化)
const tags = new Set(["react", "typescript", "nodejs"]);
storage.set("tags", tags);

const userMap = new Map([
  ["john", { age: 30, role: "admin" }],
  ["jane", { age: 25, role: "user" }],
]);
storage.set("userMap", userMap);

// 读取数据 (自动反序列化)
const name = storage.get<string>("name"); // 'John'
const user = storage.get<User>("user"); // 完整的用户对象
const retrievedTags = storage.get<Set<string>>("tags"); // Set 对象
const retrievedMap = storage.get<Map<string, any>>("userMap"); // Map 对象
```

## 🚀 动画工具

```typescript
import { Raf } from "@gitborlando-owner/g-util";

const raf = new Raf();

// 链式requestAnimationFrame
raf
  .request((next) => {
    console.log("动画帧1");
    // 继续下一帧
    next();
  })
  .request((next) => {
    console.log("动画帧2");
    // 条件控制
    if (shouldContinue) {
      next();
    }
  });

// 取消所有动画
raf.cancelAll();

// 使用示例：平滑动画
let progress = 0;
const animate = new Raf();

animate.request((next) => {
  progress += 0.01;
  element.style.opacity = progress.toString();

  if (progress < 1) {
    next(); // 继续动画
  }
});
```

## 发布

推送代码到 main 分支时自动发布到 npm：

```bash
git add .
git commit -m "更新代码"
git push origin main
```

手动发布：

```bash
pnpm release
```
