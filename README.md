<p align="left">
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/v/vue3-extension.svg?sanitize=true" alt="Version"></a>
</p>

# vue3-extension

### Install
```bash
$ npm install vue3-extension -S
```

### Usage

```ts
import { createVue } from 'vue'
import { createVueExtension } from 'vue3-extension'

import App from './App.vue'
const app = createApp(App)

app.use(createVueExtension())

app.mount('#app')
```


### ObjectComponent

```vue
<script lang="tsx" setup>
import { ref, vShow } from 'vue'

const divRef = ref(null)
const inputValue = ref('')
const objectIs = ref({
  _is: 'div',
  ref: divRef,
  class: 'content',
  _children: ['hello', 'world', {
    _is: 'span',
    _directives: [[vShow, true]],
    _children: ['!'],
  }, {
    _is: 'span',
    // onClick: () => alert('hello'),
    '@click.prevent': () => alert('hello'),
    _slots: {
      default: () => '😊' // jsx
    }
  }, {
    _is: 'el-input',
    // 'v-model': computed({
    //   get: () => inputValue.value,
    //   set: nv => inputValue.value = nv
    // })
    'v-if': true,
    'v-model': inputValue,
    'v-bind': { style: 'border: 1px solid #f2f2f2' }
  }]
})
</script>

<template>
  <object-component :is="objectIs"></object-component>
</template>
```

* objectIs
```typescript
export interface ObjectComponentIs extends Record<string, any> {
  _is: string | Component | (() => Component | JSX.Element);
  _directives?: DirectiveArguments;
  _children?: any[] | Record<string, any>;
  _slots?: Record<string, () => JSX.Element>;
  _render?: () => JSX.Element | JSX.Element[];
  // v-model | v-bind | v-if
  // ...attrs
}
```