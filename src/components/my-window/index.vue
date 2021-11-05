<template>
<!-- destroy-on-close: 控制是否在关闭 Drawer 之后将子元素全部销毁 默认false-->
<!--wrapper-closable:点击遮罩层是否可以关闭 Drawer 默认true -->
<!-- close-on-press-escape:是否可以通过按下 ESC 关闭 Drawer  默认true-->
<!--modal-append-to-body: 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Drawer 的父元素上 -->
<!-- append-to-body: Drawer 自身是否插入至 body 元素上。嵌套的 Drawer 必须指定该属性并赋值为 true -->
<!--direction: Drawer 打开的方向  可选值：rtl / ltr / ttb / btt-->
<!--size: Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释 -->
<!-- custom-class: Drawer 的自定义类名 -->
<!--before-close: 关闭前的回调，会暂停 Drawer 的关闭 -->
<!--@open: Drawer 打开的回调 -->
<!--@close:  Drawer 关闭的回调 -->
<!--@opened: Drawer 打开动画结束时的回调 -->
<!--@closed: Drawer 关闭动画结束时的回调 -->
  <el-drawer
    v-if="drawer"
    ref="mydrawer"
    v-resizable="currentDrawerResizeOptions"
    :modal="currentModal"
    :wrapper-closable="wrapperClosable || closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :modal-append-to-body="currentModalAppendToBody"
    :append-to-body="currentAppendToBody"
    :visible.sync="visible"
    destroy-on-close
    :direction="direction"
    :size="currentSize"
    :custom-class="customClass"
    :style="drawerStyle"
    :before-close="beforeClose?beforeClose:onCancel"
    @open="onOpen"
    @close="onClose"
    @opened="onOpened"
    @closed="onClosed"
  >
    <template #title>
      <slot name="title">
        <span role="heading" :title="title">{{ title }}</span>
      </slot>
    </template>
    <section :style="drawerBodyStyle">
      <slot />
    </section>
    <div class="drawer-footer">
      <slot name="footer">
        <el-button @click.native="onCancel">取消</el-button>
        <el-button type="primary" @click="onSure">确定</el-button>
      </slot>
    </div>
  </el-drawer>
  <!-- visible.sync:  是否显示 Dialog，支持 .sync 修饰符-->
  <!-- modal: 是否需要遮罩层-->
  <!-- modal-append-to-body: 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上-->
  <!-- append-to-body:Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true -->
  <!-- top: Dialog CSS 中的 margin-top 值-->
  <!-- close-on-click-modal: 是否可以通过点击 modal 关闭 Dialog-->
  <!-- close-on-press-escape: 是否可以通过按下 ESC 关闭 Dialog-->
  <!-- before-close: 关闭前的回调，会暂停 Dialog 的关闭-->
  <!-- fullscreen: 全屏-->
  <!-- @open:Dialog 打开的回调 -->
  <!-- @close:Dialog 关闭的回调 -->
  <!-- @mousedown: 点击窗口，实现切换窗口切换功能-->
  <my-el-dialog
    v-else
    v-draggable="currentDragOptions"
    v-resizable="cuurentResizeOptions"
    :visible.sync="visible"
    :modal="currentModal"
    :modal-append-to-body="currentModalAppendToBody"
    :append-to-body="currentAppendToBody"
    :top="top"
    :custom-class="customClass"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="beforeClose?beforeClose:onCancel"
    :style="dialogStyle"
    :fullscreen.sync="currentFullscreen"
    @open="onOpen"
    @close="onClose"
    @mousedown.native="onMousedown"
  >
    <template #title>
      <slot name="title">
        <span class="el-dialog__title">{{ title }}</span>
      </slot>
    </template>
    <slot />
    <template #footer>
      <slot name="footer">
        <el-button @click.native="onCancel">取消</el-button>
        <el-button type="primary" @click="onSure">确定</el-button>
      </slot>
    </template>
  </my-el-dialog>
</template>

<script>
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'
// import draggable from '@/directive/module/draggable'
// import resizable from '@/directive/module/resizable'
import { setStyle } from 'element-ui/lib/utils/dom'
import MyElDialog from '@/components/element-ui/my-el-dialog'

/**
 * 窗口 my-window

  <my-window
    v-if="checkPermission([''])"
    title=""
    :visible.sync="visibleAdd"
    :close-on-click-modal="false"
    @close="onCloseAdd"
  >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.native="visibleAdd = false">取消</el-button>
        <my-confirm-button type="submit" :validate="validateAdd" :loading="loadingAdd" @click="onSubmitAdd" />
      </div>
    </template>
  </my-window>

  import MyWindow from '@/components/my-window'
  import MyConfirmButton from '@/components/my-confirm-button'

  export default {
    components: { MyWindow, MyConfirmButton }
  }
*/
export default {
  name: 'MyWindow',
  components: { MyElDialog },
  // directives: { 
  //   draggable, 
  //   resizable 
  // },
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 是否用抽屉还是弹框 [默认弹框]
    drawer: {
      type: Boolean,
      default: false
    },
    // 是否可拖拽 [默认可拖拽]
    draggable: {
      type: Boolean,
      default: true
    },
    // 是否可以更改尺寸  [可更改尺寸]
    resizable: {
      type: Boolean,
      default: true
    },
    // 更改尺寸方向 可选值 e,s,w,n,nw,ne,sw,se,all
    resizeHandles: {
      type: [String, Array],
      default: 'all'
    },
    // resize选项 v-resizable="resizeOptions"
    resizeOptions: {
      type: Object,
      default: null
    },
    // drag选项
    dragOptions: {
      type: Object,
      default: null
    },
    drawerResizeOptions: {
      type: Object,
      default: null
    },
    // 页脚可拖拽 [dialog状态的情况]
    footerDraggable: {
      type: Boolean,
      default: true
    },
    // 对话框显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 遮罩
    modal: {
      type: Boolean,
      default: true
    },
    // 窗口内嵌
    embed: {
      type: Boolean,
      default: false
    },
    // 窗口切换
    switch: {
      type: Boolean,
      default: false
    },
    // 全屏
    fullscreen: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    wrapperClosable: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '8vh'
    },
    customClass: {
      type: String,
      default: 'my-window'
    },
    direction: {
      type: String,
      default: 'btt',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1
      }
    },
    size: {
      type: [Number, String],
      default: 'auto'
    },
    drawerBodyStyle: {
      type: String,
      default: 'padding:24px 48px 74px 24px;'
    },
    beforeClose: {
      type: Function,
      default: null
    }
  },
  data() {
    let drawerResizeHandles = this.currentResizeHandles
    if (this.drawer) {
      switch (this.direction) {
        case 'btt':
          drawerResizeHandles = 'n'
          break
        case 'ttb':
          drawerResizeHandles = 's'
          break
        case 'ltr':
          drawerResizeHandles = 'e'
          break
        case 'rtl':
          drawerResizeHandles = 'w'
          break
        default:
          drawerResizeHandles = this.currentResizeHandles
          break
      }
    }
    return {
      currentFullscreen: this.fullscreen,
      // 是否需要遮罩层
      currentModal: this.embed ? false : (this.modal && !this.switch),
      currentSize: this.fullscreen ? '100%' : this.size,
      drawerResizeHandles: drawerResizeHandles,
      currentAppendToBody: this.embed ? false : this.appendToBody,
      currentModalAppendToBody: this.embed ? false : this.modalAppendToBody
    }
  },
  computed: {
    //dialog v-draggable 拖拽配置
    currentDragOptions() {
      const handles = []
      if (this.draggable) {
        handles.push('.el-dialog__header')
      }
      if (this.footerDraggable) {
        handles.push('.el-dialog__footer')
      }
      return {
        host: '.el-dialog',
        handle: handles,
        disabled: this.currentFullscreen || (!this.draggable && !this.footerDraggable),
        autoCalcRange: true,
        offset: {
          left: 'marginLeft',
          top: 'marginTop'
        },
        ...this.dragOptions
      }
    },
    // dialog v-resizable 改变大小配置
    cuurentResizeOptions() {
      return {
        host: '.el-dialog',
        handles: this.resizeHandles,
        disabled: this.currentFullscreen || !this.resizable,
        offset: {
          left: 'marginLeft',
          top: 'marginTop'
        },
        minWidth: 200,
        minHeight: 190,
        autoCalcRange: true,
        ...this.resizeOptions
      }
    },
    // drawer v-resizable 改变大小配置
    currentDrawerResizeOptions() {
      return {
        host: '.el-drawer', // 宿主元素选择器
        handles: this.drawerResizeHandles, //可resize的方向，可选值 e,s,w,n,nw,ne,sw,se,all
        disabled: this.currentFullscreen || !this.resizable,
        offset: {
          left: 'marginLeft',
          top: 'marginTop'
        },
        minWidth: 200,
        minHeight: 190,
        autoCalcRange: true, // 自动计算范围
        rangeDom: this.embed ? '.app-main' : null, // 范围元素选择器
        ...this.drawerResizeOptions
      }
    },
    // dialog 样式设置
    dialogStyle() {
      const style = {
        pointerEvents: this.switch ? 'none' : '',
        overflow: this.switch ? 'hidden' : 'auto'
      }

      if (this.embed) {
        style.position = 'absolute'
      }

      return style
    },
    // drawer 样式设置
    drawerStyle() {
      const style = {
        pointerEvents: this.switch ? 'none' : '',
        overflow: 'hidden'
      }

      if (this.embed) {
        style.position = 'absolute'
      }

      return style
    }
  },
  watch: {

  },
  mounted() {
    if (this.drawer) {
      this.proxyChangeLayout = this.changeLayout.bind(this)
      addResizeListener(this.$el, this.proxyChangeLayout)
    }
  },
  beforeDestroy() {
    this.proxyChangeLayout && removeResizeListener(this.$el, this.proxyChangeLayout)
    window.removeEventListener('scroll', this.proxyChangeLayout,true);
  },
  methods: {
    // 触发改变布局的方法
    changeLayout() {
      this.currentSize = this.size
      this.$nextTick(function() {
        const rect = this.embed ? document.querySelector('.app-main').getBoundingClientRect() : document.body.getBoundingClientRect()
        const drawerRect = this.$refs.mydrawer.$refs.drawer.getBoundingClientRect()
        if (drawerRect.height > rect.height || drawerRect.width > rect.width) {
          this.currentFullscreen = true
          this.currentSize = '100%'
        } else {
          this.currentFullscreen = false
          this.currentSize = this.size
        }
      })
    },
    // 打开
    onOpen() {
      this.$emit('open')
    },
    onOpened() {
      this.$emit('opened')
    },
    // 关闭
    onClose() {
      this.$emit('close')
    },
    onClosed() {
      this.$emit('closed')
    },
    // 取消
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 确定
    onSure() {
      this.$emit('sure')
    },
    // 点击窗口，实现切换窗口切换功能
    onMousedown() {
      if (this.switch) {
        const wins = []
        const wrappers = this.$el.parentNode.querySelectorAll('.el-dialog__wrapper')
        if (wrappers.length === 1) {
          return
        }
        wrappers.forEach(function(el) {
          if (el.style.zIndex > 0) {
            wins.push(el)
          }
        })
        if (wins.length === 1) {
          return
        }

        wins.sort(function(a, b) {
          if (a.style.zIndex > b.style.zIndex) {
            return 1
          } else if (a.style.zIndex < b.style.zIndex) {
            return -1
          } else {
            return 0
          }
        })

        const zIndexs = wins.map(w => {
          return w.style.zIndex
        })

        const currentZIndex = this.$el.style.zIndex
        const currentIndex = wins.findIndex(w => w.style.zIndex === currentZIndex)
        const deleteWins = wins.splice(currentIndex, 1)
        wins.push(deleteWins[0])
        wins.forEach(function(w, index) {
          setStyle(w, 'z-index', zIndexs[index])
        })
      }
    }
  }
}
</script>
