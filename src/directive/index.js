import directive from './directives'

const importDirective = Vue => {
  /**
   * 拖拽指令 v-draggable="options"
   * options = {
   *  trigger: /这里传入作为拖拽触发器的CSS选择器/,
   *  body:    /这里传入需要移动容器的CSS选择器/,
   *  recover: /拖动结束之后是否恢复到原来的位置/
   * }
   */
  Vue.directive('draggable', directive.draggable)
  /**
   * clipboard指令 v-draggable="options"
   * options = {
   *  value:    /在输入框中使用v-model绑定的值/,
   *  success:  /复制成功后的回调/,
   *  error:    /复制失败后的回调/
   * }
   */
  Vue.directive('clipboard', directive.clipboard)

  /*
  number-input 指令  
  通过v-number-input.float的方式达到支持浮点数的目的
  v-number-input.float
  
  支持小数保留位最大位数限制
  v-number-input.float="2"
  支持输入的最大值和最小值的限制
  {
    min: {type: number},
    max: {type: number},
    最大小数位，仅在float下有效
    decimal: {type: number}
  }
  例如：v-number-input.float="{min: 1, max:120,decimal:2}
  */
  Vue.directive('number-input', directive.numberInput)

  /*
  拖拽dialog
  */
  Vue.directive('el-drag-dialog', directive.drag)

  /*
  
  */
  Vue.directive('resizable', directive.resizable)

}

export default importDirective
