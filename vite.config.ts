import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: fileURLToPath(new URL('./src/main.ts', import.meta.url)),
      name: 'vue-extension',
      // the proper extensions will be added
      fileName: (format) => `vue-extension.${format}.js`
    },
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    // 样式打包到组件同一个文件中
    cssCodeSplit: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'vue-router'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter'
        }
      }
    }
  }
})
