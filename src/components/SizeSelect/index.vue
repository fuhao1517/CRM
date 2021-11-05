<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="setSize" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size===item.value" :command="item.value">
        {{
          item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      sizeOptions: [
        { label: '默认', value: 'default' },
        { label: '中等', value: 'medium' },
        { label: '小号', value: 'small' },
        { label: '最小号', value: 'mini' }
      ]
    }
  },
  computed: {
    size() {
      console.log('this.$store.getters.size: ', this.$store.getters.size);
      return this.$store.getters.size
      
    }
  },
  methods: {
    handleSetSize(size) {
      this.$ELEMENT.size = size
      this.$store.dispatch('app/setSize', size)
      this.refreshView()
      this.$message({
        message: '字体设置成功',
        type: 'success'
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route
      console.log('fullPath: ', fullPath);

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>
<style scoped>
.size-icon{
    cursor: pointer;
    font-size: 20px;
    vertical-align: middle;
}
</style>