import type { App, VNode } from 'vue'
import { render } from 'vue'

import ObjectComponent from './ObjectComponent'

export const createVueExtension = (): VueExtension => {
  return {
    install(app: App) {
      app.render = (vnode: VNode | null, rootContainer: Element): void => {
        if (vnode && !vnode.appContext) vnode.appContext = app._context
        render(vnode, rootContainer)
      }

      app.component('ObjectComponent', ObjectComponent)
    }
  }
}

export declare interface VueExtension {
  install: (app: App) => void;
}