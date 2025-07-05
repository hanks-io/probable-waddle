# AbSelect 游戏类型选择器组件

一个通用的游戏类型选择器组件，基于 Ionic 的 ion-select 组件封装，提供了更便捷的游戏类型选择功能。

## 功能特性

- ✅ 支持默认游戏类型列表（ELECTRONIC, CHESS, FISHING, VIDEO, SPORTS, LOTTERY）
- ✅ 支持自定义选项列表
- ✅ 支持显示/隐藏"全部"选项
- ✅ 支持多种接口类型（popover, action-sheet, alert）
- ✅ 支持iOS和MD两种模式
- ✅ 支持标签位置配置
- ✅ 支持禁用状态
- ✅ 完整的TypeScript类型支持
- ✅ 支持国际化（i18n）

## 安装和使用

### 1. 导入组件

```vue
<script setup>
import AbSelect from '@/components/AbSelect/AbSelect.vue'
</script>
```

### 2. 基础用法

```vue
<template>
  <AbSelect v-model="selectedGameType" @change="handleGameTypeChange" />
</template>

<script setup>
import { ref } from 'vue'
import AbSelect from '@/components/AbSelect/AbSelect.vue'

const selectedGameType = ref('ALL')

const handleGameTypeChange = (event) => {
  // 通过 event.detail.value 获取选中的值
  const selectedValue = event.detail.value
  console.log('选中的游戏类型:', selectedValue)
  
  // 事件对象还包含其他信息
  console.log('显示文本:', event.detail.text)
  console.log('完整事件对象:', event)
}
</script>
```

### 3. 自定义配置

```vue
<template>
  <!-- 使用字符串数组 -->
  <AbSelect 
    v-model="selectedGameType"
    :show-all="true"
    :options="['ELECTRONIC', 'CHESS', 'FISHING']"
    interface="popover"
    mode="md"
    label-placement="stacked"
    placeholder="label.gameType"
    :disabled="false"
    @change="handleGameTypeChange"
  />
  
  <!-- 使用对象数组 -->
  <AbSelect 
    v-model="selectedGameType"
    :show-all="true"
    :options="[
      {value: 'ELECTRONIC', title: 'sort.ELECTRONIC'},
      {value: 'CHESS', title: 'sort.CHESS'},
      {value: 'FISHING', title: 'sort.FISHING'}
    ]"
    @change="handleGameTypeChange"
  />
  
  <!-- 自定义国际化key前缀 -->
  <AbSelect 
    v-model="selectedGameType"
    :show-all="true"
    :options="['ELECTRONIC', 'CHESS', 'FISHING']"
    label-key="game"
    @change="handleGameTypeChange"
  />
</template>
```

## Props 参数

| 参数 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| modelValue | string | - | ✅ | 当前选中的游戏类型 |
| showAll | boolean | true | ❌ | 是否显示"全部"选项 |
| options | SelectOption[] | GameTypes | ❌ | 自定义选项列表，支持字符串或对象格式 |
| placeholder | string | 'label.gameType' | ❌ | 占位符文本 |
| labelKey | string | 'sort' | ❌ | 标签国际化key前缀 |
| disabled | boolean | false | ❌ | 是否禁用 |
| interface | 'popover' \| 'action-sheet' \| 'alert' | 'popover' | ❌ | 接口类型 |
| mode | 'ios' \| 'md' | 'md' | ❌ | 模式 |
| labelPlacement | 'stacked' \| 'floating' \| 'fixed' | 'stacked' | ❌ | 标签位置 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | value: any | 值更新事件（v-model） |
| change | event: CustomEvent | 选择变化事件，通过 event.detail.value 获取选中的值 |

### 事件处理详解

#### 1. 获取选中的值

```javascript
const handleGameTypeChange = (event) => {
  // 获取选中的值
  const selectedValue = event.detail.value
  console.log('选中的值:', selectedValue)
  
  // 获取显示文本
  const displayText = event.detail.text
  console.log('显示文本:', displayText)
}
```

#### 2. 不同类型的值处理

**简单值（字符串/数字）：**
```javascript
// options: [{value: 'ELECTRONIC', title: 'sort.ELECTRONIC'}]
const handleChange = (event) => {
  console.log(event.detail.value) // 输出: 'ELECTRONIC'
  console.log(typeof event.detail.value) // 输出: 'string'
}
```

**对象值：**
```javascript
// options: [{value: {id: 1, type: 'ELECTRONIC'}, title: 'sort.ELECTRONIC'}]
const handleChange = (event) => {
  const selectedObject = event.detail.value
  console.log(selectedObject) // 输出: {id: 1, type: 'ELECTRONIC'}
  console.log(selectedObject.id) // 输出: 1
  console.log(selectedObject.type) // 输出: 'ELECTRONIC'
}
```

#### 3. 访问选项的其他字段

如果需要访问选项的其他字段（如 `newObj`），需要在组件中维护选项映射：

```javascript
const options = [
  {value: 1, title: 'sort.ELECTRONIC', newObj: {a: 1, b: 1}},
  {value: 2, title: 'sort.CHESS', newObj: {c: 3, d: 4}}
]

const handleChange = (event) => {
  const selectedValue = event.detail.value // 只能获取到 value 字段的值
  
  // 如果需要访问 newObj，需要从 options 中查找
  const selectedOption = options.find(option => option.value === selectedValue)
  if (selectedOption) {
    console.log('对应的 newObj:', selectedOption.newObj)
  }
}
```

## 使用场景

### 1. 佣金管理页面

```vue
<template>
  <div class="commission-filter">
    <AbSelect 
      v-model="commissionParams.gameType"
      :show-all="true"
      @change="typeChangeHandle"
      v-if="agancyInfo?.type !== 'gameType'"
    />
    
    <!-- 事件处理函数 -->
    <script setup>
    const typeChangeHandle = (event) => {
      const selectedType = event.detail.value
      commissionParams.gameType = selectedType
      // 执行其他逻辑...
    }
    </script>
  </div>
</template>
```

### 2. 报表页面

```vue
<template>
  <div class="report-filter">
    <AbSelect 
      v-model="reportParams.gameType"
      :show-all="false"
      :options="['ELECTRONIC', 'CHESS']"
      @change="handleGameTypeChange"
    />
  </div>
  
  <!-- 事件处理函数 -->
  <script setup>
  const handleGameTypeChange = (event) => {
    const selectedType = event.detail.value
    reportParams.gameType = selectedType
    // 更新报表数据...
  }
  </script>
</template>
```

### 3. 活动配置

```vue
<template>
  <div class="activity-config">
    <AbSelect 
      v-model="activityConfig.gameType"
      :show-all="false"
      interface="action-sheet"
      mode="ios"
      @change="handleConfigChange"
    />
  </div>
  
  <!-- 事件处理函数 -->
  <script setup>
  const handleConfigChange = (event) => {
    const selectedType = event.detail.value
    activityConfig.gameType = selectedType
    // 更新活动配置...
  }
  </script>
</template>
```

### 4. 自定义国际化key

```vue
<template>
  <div class="custom-label">
    <!-- 使用自定义的国际化key前缀 -->
    <AbSelect 
      v-model="selectedType"
      :options="['TYPE1', 'TYPE2', 'TYPE3']"
      label-key="custom"
      @change="handleChange"
    />
  </div>
  
  <!-- 事件处理函数 -->
  <script setup>
  const handleChange = (event) => {
    const selectedValue = event.detail.value
    selectedType.value = selectedValue
    console.log('选中的类型:', selectedValue)
    // 处理自定义类型变化...
  }
  </script>
</template>
```

<!-- 对应的i18n配置 -->
```typescript
{
  "custom": {
    "TYPE1": "类型一",
    "TYPE2": "类型二", 
    "TYPE3": "类型三"
  }
}
```

## 默认游戏类型

组件默认支持以下游戏类型：

- `ALL` - 全部（当 showAll 为 true 时显示）
- `ELECTRONIC` - 电子游戏
- `CHESS` - 棋牌游戏
- `FISHING` - 捕鱼游戏
- `VIDEO` - 视讯游戏
- `SPORTS` - 体育游戏
- `LOTTERY` - 彩票游戏

## 国际化支持

组件使用 `$t('sort.${item}')` 来显示游戏类型的国际化文本，确保在 `i18n` 配置中有对应的翻译：

```typescript
// i18n 配置示例
{
  "sort": {
    "ALL": "全部",
    "ELECTRONIC": "电子游戏",
    "CHESS": "棋牌游戏",
    "FISHING": "捕鱼游戏",
    "VIDEO": "视讯游戏",
    "SPORTS": "体育游戏",
    "LOTTERY": "彩票游戏"
  }
}
```

## 注意事项

1. **依赖项**: 组件依赖 `@ionic/vue`、`@vueuse/core` 和项目的国际化配置
2. **类型安全**: 使用 TypeScript 确保类型安全
3. **样式**: 组件使用 Ionic 默认样式，可通过 CSS 变量自定义
4. **性能**: 组件使用 `computed` 优化选项列表的计算
5. **响应式**: 使用 `useVModel` 处理双向绑定，确保响应式更新
6. **事件处理**: `@change` 事件传递的是 `CustomEvent` 对象，需要通过 `event.detail.value` 获取选中的值，而不是直接接收值参数
7. **值类型**: `modelValue` 和 `event.detail.value` 支持任意类型（字符串、数字、对象等）
8. **选项字段**: 在 `change` 事件中只能获取到选项的 `value` 字段，如需访问其他字段（如 `newObj`），需要在组件中维护选项映射

## 更新日志

### v1.1.0
- 🔥 **重要更新**: 纠正了 `@change` 事件参数的文档说明
- 📝 **事件处理**: 详细说明了 `CustomEvent` 对象的使用方式
- 📖 **示例代码**: 更新了所有示例代码，使用正确的事件处理方式
- 🎯 **类型支持**: 说明了对象值、简单值等不同类型的处理方式
- 💡 **最佳实践**: 添加了访问选项其他字段的解决方案

### v1.0.0
- 初始版本发布
- 支持基础的游戏类型选择功能
- 支持多种配置选项
- 完整的 TypeScript 类型支持 
