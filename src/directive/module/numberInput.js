import { onInput } from '@/utils/tools'

export default {
    bind(el, binding, vnode) {
        const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
        ele.addEventListener('input', onInput(el, ele, binding, vnode), false)
    },
  }
  