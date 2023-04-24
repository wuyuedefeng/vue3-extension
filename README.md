# vue3-extension

### Install
```bash
$ npm install vue3-extension -S
```

### Usage

```ts
import { createVue } from 'vue'
import { createVueExtension } from 'vue-extension'

import App from './App.vue'
const app = createApp(App)

app.use(createVueExtension())

app.mount('#app')
```


### ObjectComponent

```vue
<script lang="tsx" setup>
import { ref, vShow } from 'vue'

const objectIs = ref({
  _is: 'div',
  class: 'content',
  // onClick: () => alert('hello'),
  '@click.prevent': () => alert('hello'),
  _children: ['hello', 'world', {
    _is: 'span',
    _directives: [[vShow, true]],
    _children: ['!'],
  }, {
    _is: 'span',
    _slots: {
      default: () => '😊' // jsx
    }
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
  // ...attrs
}
```