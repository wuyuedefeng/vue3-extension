import type { App, VNode } from 'vue'
import { render } from 'vue'

export * from './src/element-plus'

export const createVueExtension = () => {
  return {
    isntall(app: App) {
      app.render = (vnode: VNode | null, rootContainer: Element): void => {
        if (vnode && !vnode.appContext) vnode.appContext = app._context
        render(vnode, rootContainer)
      }
    }
  }
}