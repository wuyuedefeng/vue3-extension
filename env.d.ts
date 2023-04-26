/// <reference types="vite/client" />

import type { App as VueApp, VNode } from 'vue'
declare module 'vue' {
  interface App extends VueApp {
    render: (vnode: VNode | null, container: Element) => void
  }
}

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}


export declare interface VueExtension {
  install: (app: App) => void;
};

export declare function createVueExtension(): VueExtension;