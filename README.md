# vue3-extension

### Install
```bash
$ npm install vue3-extension
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