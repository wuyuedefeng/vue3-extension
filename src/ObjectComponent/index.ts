import type { Ref, Component, PropType, DirectiveArguments, VNode, ComputedRef } from 'vue'
import { defineComponent, computed, h, getCurrentInstance, resolveDynamicComponent, withDirectives, withModifiers, withMemo, isRef, createCommentVNode } from 'vue'
const ObjectComponent = defineComponent({
  name: 'ObjectComponent',
  inheritAttrs: false,
  props: {
    is: {
      type: Object as PropType<ObjectComponentIs>,
      required: true
    }
  },
  setup(props, ctx) {
    const cache: any[] = []
    const state = {
      vIf: computed(() => {
        if (Object.prototype.hasOwnProperty.call(props.is, 'v-if')) {
          return !!isRef(props.is['v-if']) ? props.is['v-if'].value : props.is['v-if']
        }
        return true
      }),
      attrsIs: computed(() => {
        const finalAttrs = {}
        for (const key in props.is) {
          if (/^_/.test(key)) {
            continue
          } else if (/^@/.test(key) && typeof props.is[key] === 'function') {
            const eventKey = `on${key.charAt(1).toUpperCase() + key.slice(2)}`
            const [realKey, ...modifiers] = eventKey.split('.')
            Object.assign(finalAttrs, { [realKey]: withModifiers((...args: any[]) => props.is[key].bind(props.is)(...args), modifiers) })
          } else if (/^ref$/.test(key)) {
            if (typeof props.is[key] === 'function') {
              Object.assign(finalAttrs, { [key]: props.is[key].bind(props.is) })
            } else {
              Object.assign(finalAttrs, { [key]: (bindRef: Ref) => props.is[key] = bindRef })
            }
          } else if (/^v-/.test(key)) {
            if (/^v-model/.test(key)) {
              const keys = key.split(':')
              const realKey = keys.length > 1 ? keys[1] : 'modelValue'
              Object.assign(finalAttrs, {
                [realKey]: isRef(props.is[key]) ? props.is[key].value : props.is[key],
                [`onUpdate:${realKey}`]: (nv: any) => {
                  if (isRef(props.is[key])) {
                    props.is[key].value = nv
                  } else {
                    props.is[key] = nv
                  }
                }
              })
            } else if (/^v-bind/.test(key)) {
              if (/^v-bind:/.test(key)) {
                const keys = key.split(':')
                const realKey = keys.length > 1 ? keys[1] : null
                if (realKey) {
                  Object.assign(finalAttrs, { [realKey]: props.is[key] })
                }
              } else if (typeof props.is[key] === 'object') {
                Object.assign(finalAttrs, props.is[key])
              }
            } else if (/^v-text/.test(key)) {
              Object.assign(finalAttrs, { textContent: props.is[key] })
            } else if (/^v-html/.test(key)) {
              Object.assign(finalAttrs, { innerHTML: props.is[key] })
            }
          }
          else {
            Object.assign(finalAttrs, { [key]: props.is[key] })
          }
        }
        return Object.assign(finalAttrs, ctx.attrs)
      }),
      slotsIs: computed(() => {
        const children = props.is._children instanceof Array ? { default: props.is._children } : props.is._children
        const childrenSlots = children ? Object.assign({}, ...Object.keys(children).map(slotName => ({
          [slotName]: () => children[slotName].map((is: any) => is instanceof Object ? h(ObjectComponent, { is }) : is)
        }))) : {}
        const directSlots = {}
        if (props.is?._slots) {
          for (const slotName in props.is._slots) {
            Object.assign(directSlots, { [slotName]: props.is._slots[slotName].bind(props.is) })
          }
        }
        return { ...childrenSlots, ...directSlots, ...ctx.slots }
      }),
    }

    const render = () => {
      const instance = getCurrentInstance()
      let vnode: VNode = createCommentVNode(`v-if ObjectComponent`, true)
      if (!!props.is._render) {
        if (state.vIf.value) {
          vnode = withDirectives(h(props.is._render.bind(props.is)()), props.is._directives || [])
        }
      } else {
        // component
        const component = typeof props.is._is === 'string' ? instance!.appContext.components[props.is._is] || resolveDynamicComponent(props.is._is) : (
          typeof props.is._is === 'function' ? (props.is._is as any).bind(props.is)() : props.is._is
        )
        const attrs = props.is === component ? null : state.attrsIs.value
        if (state.vIf.value) {
          vnode = withDirectives(h(component, attrs, state.slotsIs.value), props.is?._directives || [])
        }
      }
      return vnode
    }

    return () => {
      let memo = null
      if (props.is['v-memo']) {
        memo = isRef(props.is['v-memo']) ? props.is['v-memo'].value : props.is['v-memo']
        memo = memo.map((i: any) => isRef(i) ? i.value : i)
      }
      if (props.is['v-once']) {
        const once = isRef(props.is['v-once']) ? props.is['v-once'].value : props.is['v-once']
        memo = once ? [] : memo
      }
      if (memo instanceof Array) { 
        return withMemo(memo, render, cache, 0)
      }
      return render()
    }
  },
})

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

export default ObjectComponent