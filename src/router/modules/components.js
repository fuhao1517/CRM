/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '基础功能组件',
    icon: 'function'
  },
  children: [
    {
      path: 'back-to-top',
      component: () => import('@/views/components-demo/back-to-top'),
      name: 'BackToTopDemo',
      meta: { title: '返回顶部' }
    },
    {
      path: 'drag-dialog',
      component: () => import('@/views/components-demo/drag-dialog'),
      name: 'DragDialogDemo',
      meta: { title: '拖拽 Dialog' }
    },
    {
      path: 'clipboard',
      component: () => import('@/views/clipboard/index'),
      name: 'ClipboardDemo',
      meta: { title: '剪贴板' }
    },
    {
      path: 'verify',
      component: () => import('@/views/verify/index'),
      name: 'verify',
      meta: { title: '验证码' }
    }

  ]
}

export default componentsRouter
