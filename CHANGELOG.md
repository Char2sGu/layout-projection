## 1.0.0-alpha.0 (2025-06-10)

### 🚀 Features

- **animation:** make metadata manager optional for `LayoutProjectionAnimationHandler` ([097c271](https://github.com/TheNightmareX/layout-projection/commit/097c271))

### ❤️ Thank You

- Char2s

## 0.17.0 (2024-11-28)

### 🚀 Features

- **angular:** make animator fetch config from DI when no inputs available ([b137388](https://github.com/TheNightmareX/layout-projection/commit/b137388))
- **angular:** provide a default DI animation config in setup ([568e48a](https://github.com/TheNightmareX/layout-projection/commit/568e48a))

### ❤️ Thank You

- Char2s @Char2sGu

## 0.16.2 (2024-11-28)

### 🩹 Fixes

- **core:** correct border radius distortion ([2a4381a](https://github.com/TheNightmareX/layout-projection/commit/2a4381a))

### ❤️ Thank You

- Char2s @Char2sGu

## 0.16.1 (2024-11-28)

### 🚀 Features

- **animation:** move handlers to separate export "/handlers" ([3291fea](https://github.com/TheNightmareX/layout-projection/commit/3291fea))

### 🩹 Fixes

- **core:** make sure border radiuses measurement take effect ([71d33cc](https://github.com/TheNightmareX/layout-projection/commit/71d33cc))

### ❤️ Thank You

- Char2s @Char2sGu

## 0.16.0 (2024-11-28)

### 🚀 Features

- **angular:** adapt animation updates and make each node individually animatable ([18beb18](https://github.com/TheNightmareX/layout-projection/commit/18beb18))
- **angular:** support shared element animation ([abaa093](https://github.com/TheNightmareX/layout-projection/commit/abaa093))
- **angular:** make animator share the same selector `[layout]` ([26e19ee](https://github.com/TheNightmareX/layout-projection/commit/26e19ee))
- **angular:** add animation events to `LayoutNodeAnimator` ([1726bfb](https://github.com/TheNightmareX/layout-projection/commit/1726bfb))
- **animation:** add method `resolved` to `AnimationRef` ([853fad8](https://github.com/TheNightmareX/layout-projection/commit/853fad8))
- **animation:** replace node/tree animators with `ProjectionAnimator` to support nested parallel animation ([bf2cda1](https://github.com/TheNightmareX/layout-projection/commit/bf2cda1))
- **animation:** add `progress()` to animation ref ([4b59536](https://github.com/TheNightmareX/layout-projection/commit/4b59536))
- **animation:** add `config()` to animation ref ([155c50d](https://github.com/TheNightmareX/layout-projection/commit/155c50d))
- **animation:** implement animation continuing on overlapping animations ([a65229d](https://github.com/TheNightmareX/layout-projection/commit/a65229d))
- **core:** throw error if node is measured while projected ([1b3e7e6](https://github.com/TheNightmareX/layout-projection/commit/1b3e7e6))
- **core:** support stopping node traversal ([adba697](https://github.com/TheNightmareX/layout-projection/commit/adba697))
- **native:** init package ([00d9df4](https://github.com/TheNightmareX/layout-projection/commit/00d9df4))

### 🩹 Fixes

- **angular:** avoid emitting events after directive destroy ([132cc1b](https://github.com/TheNightmareX/layout-projection/commit/132cc1b))
- **angular:** fix traversal type error ([b6dc125](https://github.com/TheNightmareX/layout-projection/commit/b6dc125))

### 🔥 Performance

- **angular:** avoid excessive resetting and measuring ([f8413ee](https://github.com/TheNightmareX/layout-projection/commit/f8413ee))

### ❤️ Thank You

- Char2s @Char2sGu

## 0.15.0 (2024-11-27)

### 🚀 Features

- **animation:** add method `resolved` to `AnimationRef` ([853fad8](https://github.com/TheNightmareX/layout-projection/commit/853fad8))
- **native:** init package ([00d9df4](https://github.com/TheNightmareX/layout-projection/commit/00d9df4))

### ❤️ Thank You

- Char2s @Char2sGu
