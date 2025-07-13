# G-Utils

JavaScript/TypeScript utility collection

📖 [中文文档](./README.md)

## Installation

```bash
npm install @gitborlando-owner/g-util
```

## 🔧 Array Utils

### Basic Operations

```typescript
import {
  firstOne,
  lastOne,
  stableIndex,
  createArray,
} from "@gitborlando-owner/g-util";

// Get first element (supports Array and Set)
firstOne([1, 2, 3]); // 1
firstOne(new Set([1, 2, 3])); // 1
firstOne([]); // undefined

// Get last element
lastOne([1, 2, 3]); // 3
lastOne(new Set([1, 2, 3])); // 3
lastOne([]); // undefined

// Stable index handling (prevents out-of-bounds)
stableIndex([1, 2, 3], -1); // 0
stableIndex([1, 2, 3], 5); // 3
stableIndex([1, 2, 3], 1); // 1
stableIndex([1, 2, 3]); // 3 (returns length)

// Create array
createArray(5); // [0, 1, 2, 3, 4]
createArray(3); // [0, 1, 2]
```

### Advanced Iteration

```typescript
import { loopFor, reverseFor, reverse } from "@gitborlando-owner/g-util";

// Loop through array (access current, next, previous elements)
const arr = ["A", "B", "C"];
loopFor(arr, (current, next, prev, index) => {
  console.log(`Index ${index}: current=${current}, next=${next}, prev=${prev}`);
  // Return true to break loop
  // Return false to skip current iteration
});

// Reverse iteration
reverseFor([1, 2, 3], (item, index) => {
  console.log(`Index ${index}: ${item}`);
});

// Reverse array (doesn't modify original)
const original = [1, 2, 3];
const reversed = reverse(original); // [3, 2, 1]
console.log(original); // [1, 2, 3] (original unchanged)
```

### Function Batch Processing

```typescript
import { flushFuncs } from "@gitborlando-owner/g-util";

// Execute functions in batch and clear container
const callbacks = [
  () => console.log("Callback 1"),
  () => console.log("Callback 2"),
  () => console.log("Callback 3"),
];

flushFuncs(callbacks); // Execute all callbacks
console.log(callbacks.length); // 0 (array cleared)

// Also supports Set
const callbackSet = new Set([
  () => console.log("Set callback 1"),
  () => console.log("Set callback 2"),
]);
flushFuncs(callbackSet); // Execute and clear Set
```

## 🗄️ Cache Utils

### Map Cache

```typescript
import { createCache } from "@gitborlando-owner/g-util";

const cache = createCache<string, number>();

// Basic operations
cache.set("key1", 100);
cache.get("key1"); // 100
cache.delete("key1");
cache.clear();

// Get or set (lazy loading)
const expensiveValue = cache.getSet("expensive", () => {
  console.log("Executing expensive computation...");
  return heavyComputation();
});

// Cache with comparison (recompute when dependencies change)
const userId = 123;
const userRole = "admin";
const userPermissions = cache.getSet(
  "permissions",
  () => calculatePermissions(userId, userRole),
  [userId, userRole], // Dependencies array
);

// Utility methods
cache.forEach((key, value, map) => {
  console.log(`${key}: ${value}`);
});
cache.keys(); // IterableIterator<string>
cache.values(); // IterableIterator<number>
cache.entries(); // IterableIterator<[string, number]>
```

### Object Cache

```typescript
import { createObjCache } from "@gitborlando-owner/g-util";

const objCache = createObjCache<string>();

// Better performance for string keys
objCache.set("name", "John");
objCache.get("name"); // 'John'

// Batch set from object
objCache.fromObject({
  name: "John",
  age: "30",
  role: "admin",
});

// Convert to plain object
const obj = objCache.toObject(); // { name: 'John', age: '30', role: 'admin' }
```

## 🛠️ Common Utils

### Delete Operations

```typescript
import { Delete } from "@gitborlando-owner/g-util";

// Delete object property
const obj = { a: 1, b: 2, c: 3 };
Delete(obj, "b"); // obj = { a: 1, c: 3 }

// Delete array element (by value)
const arr1 = [1, 2, 3, 2, 4];
Delete(arr1, 2); // arr1 = [1, 3, 2, 4] (removes first match)

// Delete array element (by function)
const arr2 = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Bob" },
];
Delete(arr2, (item) => item.id === 2); // Remove item with id 2
```

### Function Utils

```typescript
import { iife, memorize, debounce } from "@gitborlando-owner/g-util";

// Immediately Invoked Function Expression
const result = iife(() => {
  const a = 1;
  const b = 2;
  return a + b;
}); // 3

// Function memoization (cache results)
const fibonacci = memorize((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(10)); // First calculation
console.log(fibonacci(10)); // Return from cache

// Debounce function
const search = debounce(300, (query: string) => {
  console.log(`Search: ${query}`);
});

search("React"); // Execute after 300ms
search("React Native"); // Reset timer
search("React Hook"); // Execute this after 300ms
```

### Conditional Matching

```typescript
import { matchCase, macroMatch } from "@gitborlando-owner/g-util";

// Type-safe conditional matching
type Status = "loading" | "success" | "error";

const status: Status = "loading";
const message = matchCase(status, {
  loading: "Loading...",
  success: "Success!",
  error: "Error!",
});

// Matching with default value
const color = matchCase(status, "gray", {
  loading: "blue",
  success: "green",
  error: "red",
});

// Macro matching (template strings)
const isValidStatus = macroMatch`loading|success|error`;
console.log(isValidStatus("loading")); // true
console.log(isValidStatus("pending")); // false
```

### Object Operations

```typescript
import { clone, objKeys, useObjectKey } from "@gitborlando-owner/g-util";

// Deep clone
const original = {
  name: "John",
  hobbies: ["reading", "coding"],
  address: { city: "Shanghai", country: "China" },
};
const cloned = clone(original);

// Type-safe object keys
interface User {
  name: string;
  age: number;
  email?: string;
}
const userKeys = objKeys<keyof User>({ name: "John", age: 30 });
// userKeys type is ('name' | 'age' | 'email')[]

// Object unique key (WeakMap implementation)
const obj1 = { data: "test" };
const obj2 = { data: "test" };
console.log(useObjectKey(obj1)); // 'abc123' (unique ID)
console.log(useObjectKey(obj2)); // 'def456' (different ID)
console.log(useObjectKey(obj1)); // 'abc123' (same object returns same ID)
```

### Debug Utils

```typescript
import { Log, jsonFy, jsonParse } from "@gitborlando-owner/g-util";

// Chain debug logging
const result = [1, 2, 3]
  .map((x) => x * 2)
  .map(Log) // Print intermediate result
  .filter((x) => x > 2);

// JSON serialization (safe version)
const obj = { name: "John", age: 30 };
const json = jsonFy(obj); // Formatted JSON string
const parsed = jsonParse(json); // Parse back to object
```

## 🎯 Drag Utils

```typescript
import { DragUtil } from "@gitborlando-owner/g-util";

const drag = new DragUtil();

// Enable infinite dragging (reset position when out of bounds)
drag.needInfinity();

// Drag start (mouse down)
drag.onDown((data) => {
  console.log("Drag start:", {
    start: data.start, // Start position {x, y}
    current: data.current, // Current position {x, y}
    shift: data.shift, // Offset {x, y}
    marquee: data.marquee, // Selection box {x, y, width, height}
  });
});

// Drag really starts (after moving certain distance)
drag.onStart((data) => {
  console.log("Drag activated:", data);
  document.body.style.cursor = "grabbing";
});

// During dragging
drag.onMove((data) => {
  console.log("Dragging:", {
    current: data.current, // Current position
    delta: data.delta, // Movement delta
    shift: data.shift, // Total offset
    marquee: data.marquee, // Selection area
  });

  // Move element
  element.style.transform = `translate(${data.shift.x}px, ${data.shift.y}px)`;
});

// Drag end
drag.onDestroy((data) => {
  console.log("Drag end:", data);
  document.body.style.cursor = "default";
});

// Slide detection (fast dragging)
drag.onSlide((data) => {
  console.log("Slide detected:", data);
  // Can implement inertial sliding
});
```

## 🎧 Event Utils

```typescript
import {
  listen,
  isLeftMouse,
  isRightMouse,
  stopPropagation,
  preventDefault,
} from "@gitborlando-owner/g-util";

// Event listening (auto returns cleanup function)
const unlisten = listen("click", (e) => {
  console.log("Click event");
});

// Listening with options
const unlistenOnce = listen("scroll", { once: true, capture: true }, (e) => {
  console.log("One-time scroll event");
});

// Mouse button detection
const handleMouseEvent = (e: MouseEvent) => {
  if (isLeftMouse(e)) {
    console.log("Left mouse click");
  } else if (isRightMouse(e)) {
    console.log("Right mouse click");
  }
};

// Event handler decorators
const clickHandler = stopPropagation((e) => {
  console.log("Click handled, propagation stopped");
});

const submitHandler = preventDefault((e) => {
  console.log("Submit handled, default prevented");
});

// Cleanup listeners
unlisten();
unlistenOnce();
```

## 🔢 Math Utils

### Basic Math

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

// Power functions
pow2(5); // 25
pow3(3); // 27

// Array multiplication
multiply(2, 3, 4); // 24

// Safe division (returns 1 when divisor is 0)
divide(10, 2); // 5
divide(10, 0); // 1

// Degree trigonometric functions
dCos(0); // 1
dCos(90); // close to 0
dSin(90); // 1
dSin(0); // 0

// Angle conversion
degreeFy(Math.PI); // 180
radianFy(180); // Math.PI
```

### Geometry Utils

```typescript
import {
  rotatePoint,
  normalAngle,
  numberHalfFix,
} from "@gitborlando-owner/g-util";

// Point rotation
const [newX, newY] = rotatePoint(
  10,
  10, // Point to rotate (ax, ay)
  0,
  0, // Rotation center (ox, oy)
  45, // Rotation angle
);

// Angle normalization (0-360 degrees)
normalAngle(450); // 90
normalAngle(-30); // 330

// Number precision fix
numberHalfFix(0.1 + 0.2); // 0.3
```

## 📍 XY Coordinate Utils

### Basic Coordinate Operations

```typescript
import { xy_, xy_from, xy_client, xy_center } from "@gitborlando-owner/g-util";

// Create coordinates
const point = xy_(10, 20); // {x: 10, y: 20}
const origin = xy_(); // {x: 0, y: 0}

// Copy from object
const copied = xy_from(point); // {x: 10, y: 20}

// Get from mouse event
const mousePos = xy_client(mouseEvent); // {x: clientX, y: clientY}

// Get from center point
const centerPos = xy_center({
  centerX: 100,
  centerY: 200,
}); // {x: 100, y: 200}
```

### Coordinate Operations

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

// Basic operations
xy_plus(p1, p2); // {x: 40, y: 60}
xy_minus(p1, p2); // {x: -20, y: -20}
xy_multiply(p1, 2, 3); // {x: 60, y: 120}
xy_divide(p1, 2); // {x: 5, y: 10}

// Geometric operations
xy_distance(p1, p2); // 28.284271247461903
xy_rotate(p1, xy_(0, 0), 90); // Rotate around origin by 90°
xy_dot(p1, p2); // Dot product: 1100
xy_symmetric(p1, xy_(0, 0)); // Symmetric about origin: {x: -10, y: -20}
```

### XY Class

```typescript
import { XY } from "@gitborlando-owner/g-util";

// Create XY instance
const xy = new XY(10, 20);

// Chaining operations
const result = xy
  .plus({ x: 5, y: 5 }) // {x: 15, y: 25}
  .multiply(2) // {x: 30, y: 50}
  .minus({ x: 10, y: 10 }); // {x: 20, y: 40}

// Geometric calculations
xy.distance({ x: 0, y: 0 }); // Distance calculation
xy.rotate({ x: 0, y: 0 }, 45); // Rotation
xy.angle({ x: 100, y: 100 }, { x: 0, y: 0 }); // Angle calculation

// Static methods
const fromArray = XY.FromArray([10, 20]); // new XY(10, 20)
const fromObj = XY.From({ x: 10, y: 20 }); // new XY(10, 20)
```

## 🎪 Wheel Utils

```typescript
import { WheelUtil } from "@gitborlando-owner/g-util";

const wheel = new WheelUtil();

// Wheel start
wheel.onBeforeWheel(({ e, direction }) => {
  console.log("Wheel start:", direction > 0 ? "down" : "up");
  // Initialize wheel-related state here
});

// During wheel
wheel.onDuringWheel(({ e, direction }) => {
  console.log("Wheeling:", direction);
  // Implement wheel zoom or scroll logic
  if (direction > 0) {
    scale *= 0.9; // Zoom out
  } else {
    scale *= 1.1; // Zoom in
  }
});

// Wheel end
wheel.onAfterWheel(({ e, direction }) => {
  console.log("Wheel end");
  // Save state or perform cleanup here
});

// Bind to DOM element
element.addEventListener("wheel", (e) => {
  e.preventDefault();
  wheel.onWheel(e);
});
```

## 💾 Storage Utils

```typescript
import { StorageUtil } from "@gitborlando-owner/g-util";

const storage = new StorageUtil();

// Store basic types
storage.set("name", "John");
storage.set("age", 30);
storage.set("isActive", true);

// Store complex objects
storage.set("user", {
  id: 1,
  name: "John",
  preferences: {
    theme: "dark",
    language: "en",
  },
});

// Store Set and Map (auto serialization)
const tags = new Set(["react", "typescript", "nodejs"]);
storage.set("tags", tags);

const userMap = new Map([
  ["john", { age: 30, role: "admin" }],
  ["jane", { age: 25, role: "user" }],
]);
storage.set("userMap", userMap);

// Read data (auto deserialization)
const name = storage.get<string>("name"); // 'John'
const user = storage.get<User>("user"); // Complete user object
const retrievedTags = storage.get<Set<string>>("tags"); // Set object
const retrievedMap = storage.get<Map<string, any>>("userMap"); // Map object
```

## 🚀 Animation Utils

```typescript
import { Raf } from "@gitborlando-owner/g-util";

const raf = new Raf();

// Chained requestAnimationFrame
raf
  .request((next) => {
    console.log("Animation frame 1");
    // Continue to next frame
    next();
  })
  .request((next) => {
    console.log("Animation frame 2");
    // Conditional control
    if (shouldContinue) {
      next();
    }
  });

// Cancel all animations
raf.cancelAll();

// Usage example: smooth animation
let progress = 0;
const animate = new Raf();

animate.request((next) => {
  progress += 0.01;
  element.style.opacity = progress.toString();

  if (progress < 1) {
    next(); // Continue animation
  }
});
```

## Publishing

Auto-publish to npm when pushing to main branch:

```bash
git add .
git commit -m "Update code"
git push origin main
```

Manual publish:

```bash
pnpm release
```
