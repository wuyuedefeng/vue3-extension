import type { Component, PropType, DirectiveArguments } from 'vue'
import { defineComponent, computed, h, getCurrentInstance, useSlots, useAttrs, resolveDynamicComponent, withDirectives, withModifiers } from 'vue'
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
    const slots = useSlots()
    const attrs = useAttrs()
    return {
      attrsIs: computed(() => {
        const finalAttrs = {}
        for (const key in props.is) {
          if (/^_/.test(key)) {
            continue
          } else if (/^@/.test(key) && typeof props.is[key] == 'function') {
            const eventKey = `on${key.charAt(1).toUpperCase() + key.slice(2)}`
            const [realKey, ...modifiers] = eventKey.split('.')
            Object.assign(finalAttrs, { [realKey]: withModifiers((...args: any[]) => props.is[key].bind(props.is)(...args), modifiers) })
          } else {
            Object.assign(finalAttrs, { [key]: props.is[key] })
          }
        }
        return Object.assign(finalAttrs, attrs)
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
        return { ...childrenSlots, ...directSlots, ...slots }
      })
    }
  },
  render() {
    const instance = getCurrentInstance()
    if (!!this.is._render) {
      return withDirectives(
        h(this.is._render.bind(this.is)()),
        this.is._directives || []
      )
    } else {
      // component
      const component = typeof this.is._is === 'string' ? instance!.appContext.components[this.is._is] || resolveDynamicComponent(this.is._is) : (
        typeof this.is._is === 'function' ? (this.is._is as any).bind(this.is)() : this.is._is
      )
      const attrs = this.is === component ? null : this.attrsIs
      return withDirectives(
        h(component, attrs, this.slotsIs),
        this.is?._directives || []
      )
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