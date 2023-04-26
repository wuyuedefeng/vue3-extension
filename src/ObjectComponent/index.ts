import type { Ref, Component, PropType, DirectiveArguments } from 'vue'
import { defineComponent, computed, h, getCurrentInstance, resolveDynamicComponent, withDirectives, withModifiers, isRef, createCommentVNode } from 'vue'
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
    return {
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
              Object.assign(finalAttrs, {[key]: props.is[key].bind(props.is)})
            } else {
              Object.assign(finalAttrs, {[key]: (bindRef: Ref) => props.is[key] = bindRef })
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
      })
    }
  },
  render() {
    const instance = getCurrentInstance()
    if (!!this.is._render) {
      return this.vIf ? withDirectives(
        h(this.is._render.bind(this.is)()),
        this.is._directives || []
      ) : createCommentVNode(`v-if ObjectComponent`, true)
    } else {
      // component
      const component = typeof this.is._is === 'string' ? instance!.appContext.components[this.is._is] || resolveDynamicComponent(this.is._is) : (
        typeof this.is._is === 'function' ? (this.is._is as any).bind(this.is)() : this.is._is
      )
      const attrs = this.is === component ? null : this.attrsIs
      return this.vIf ? withDirectives(
        h(component, attrs, this.slotsIs),
        this.is?._directives || []
      ) : createCommentVNode(`v-if ObjectComponent`, true)
    }
  }
})

export interface ObjectComponentIs extends Record<string, any> {
  _is: string | Component | (() => Component | JSX.Element);
  _directives?: DirectiveArguments;
  _children?: any[] | Record<string, any>;
  _slots?: Record<string, () => JSX.Element>;
  _render?: () => JSX.Element | JSX.Element[];
}

export default ObjectComponent