<p align="left">
  <a href="https://www.npmjs.com/package/vue3-extension"><img src="https://img.shields.io/npm/v/vue3-extension.svg?sanitize=true" alt="Version"></a>
</p>

# vue3-extension

### Install
```bash
$ npm install vue3-extension -S
```

### Usage

```tsx
<script lang="tsx" setup>
import { computed, ref, vShow } from 'vue'

const divRef = ref(null)
const inputValue = ref('')
const objectIs = ref({
  _is: 'div',
  ref: divRef,
  class: 'content',
  _children: [
    'hello', 'world', {
      _is: 'span',
      _directives: [[vShow, true]],
      _children: ['!'],
    }, {
      _is: 'span',
      // onClick: () => alert('hello'),
      '@click.prevent': () => {
        alert('hello')
      },
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
      'v-bind': { style: 'border: 1px solid #f2f2f2' },
      // 'v-memo': computed(() => [inputValue.value]) 
      'v-memo': [inputValue]
    }, {
      _is: 'div',
      _render: () => <span>{ inputValue.value }</span>
    }, {
      _is: 'div',
      // 'v-text': `<span style="color: red">hello<span>`
      'v-html': `<span style="color: red">hello<span>`
    }
  ]
})
</script>

<template>
  <object-component :is="objectIs" :a="1"></object-component>
</template>
```

* objectIs
```typescript
export interface ObjectComponentIs extends Record<string, any> {
  _is: string | Component | (() => Component | JSX.Element);
  _directives?: DirectiveArguments;
  _children?: any[] | Record<string, any>;
  _slots?: Record<string, () => JSX.Element | JSX.Element[]>;
  _render?: () => JSX.Element | JSX.Element[];
  'v-model'?: Ref<any>;
  'v-bind'?: Object | Ref<Object>;
  'v-if'?: boolean | Ref<boolean>;
  'v-memo'?: Ref<any[]> | Ref<any>[];
  'v-once'?: boolean | Ref<boolean>; // == v-memo="[]"
  'v-html'?: string | Ref<string>;
  'v-text'?: string | Ref<string>;
}
```