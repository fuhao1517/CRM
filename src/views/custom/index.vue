<template>
  <div class="tab-container">
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" />
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="下拉抽屉弹框">
         <a class="link" href="javascript:void(0)" @click="editeDrawer">下拉抽屉弹框</a>
        </el-tab-pane>
      <el-tab-pane label="自定义搜索">
         <my-search :fields="fields" @click="onSearch" />
         <hr>
         <el-button type="primary" @click="onsearchWindowVisible">高级查询</el-button>
      </el-tab-pane>
      <el-tab-pane label="我的自定义按钮">
        <my-confirm-button @click="onEditSubmit" :placement="'top-start'" :loading="editLoading">
            <template #content>
              <p>确定要更新我的自定义按钮吗？</p>
            </template>
            我的自定义按钮
        </my-confirm-button>
      </el-tab-pane>
      <el-tab-pane label="我的自定义分页">我的自定义分页
          <!--分页-->
            <my-pagination
              ref="pager"
              :total="total"
              :checked-count="sels.length"
              @get-page="getEmployees"
            />
      </el-tab-pane>
    </el-tabs>
    <!--编辑窗口-->
    <my-window
      title="编辑员工"
      embed
      drawer
      :visible.sync="editFormVisible"
      @close="onCloseEditForm"
    >
    <!-- 表单验证提交的正确写法 -->
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
        :inline="false"
      >
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editForm.name" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="部门" prop="email">
              <el-input v-model="editForm.organizationName" placeholder="请选择部门"  autocomplete="off" class="input-with-select" @click.native="onOpenOrganization('editForm')"><!-- <el-button slot="append" icon="el-icon-more" @click="onOpenOrganization('editForm')" /> -->
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="岗位" prop="email">
              <el-input v-model="editForm.positionName" placeholder="请选择岗位"  autocomplete="off" class="input-with-select" @click.native="onOpenPosition('editForm')">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="editForm.nickName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="工号" prop="code">
              <el-input v-model="editForm.code" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="editForm.phone" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="editForm.email" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="入职时间" prop="entryTime">
              <el-date-picker
                v-model="editForm.entryTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="datePickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="editFormVisible = false">取消</el-button>
      </template>
    </my-window>
    <!-- 高级查询窗口-->
    <my-search-window
      :visible.sync="searchWindowVisible"
      :fields="fields"
      :modal="false"
      @click="onSearchFilter"
    />

  </div>
</template>

<script>
import MyWindow from '@/components/my-window'
import MyConfirmButton from '@/components/my-confirm-button'
import MySearch from '@/components/my-search'
import MySearchWindow from '@/components/my-search-window'
import myPagination from '@/components/my-pagination'

export default {
  name: 'Tab',
  components: { 
    MyWindow,
    MyConfirmButton,
    MySearch,
    MySearchWindow,
    myPagination
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback()
      }
      const reg = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码!'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'CN',
      editFormVisible: false, // 编辑界面是否显示
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        nickName: ''
      },
      // 编辑界面的表单验证
      editFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      // 对日期的限制
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      // 自定义按钮loading
      editLoading: false,
      // 高级查询字段
      fields: [
        { value: 'name', label: '姓名', default: true },
        { value: 'nickName', label: '昵称', type: 'string' },
        { value: 'entryTime', label: '入职时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        },
        { value: 'createdTime', label: '创建时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        }
      ],
      // 高级查询弹窗
      searchWindowVisible: false,
      // 自定义查询过滤的数组
      dynamicFilter: null,
      // 条数
      total: 0,
      sels: [], // 列表选中列
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    // 打开下拉抽屉
    editeDrawer(){
      this.editFormVisible = true
    },
    // 关闭下拉抽屉
    onCloseEditForm() {
      this.$refs.editForm.resetFields()
    },
    // 自定义按钮确认
    onEditSubmit() {
      setTimeout(()=>{
        this.editLoading = true
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$refs['editForm'].resetFields()
        this.editFormVisible = false
      },1000)
    },
    // 查询
    onSearch(dynamicFilter) {
      console.log('dynamicFilter: ', dynamicFilter);

    },
    // 高级查询显示
    onsearchWindowVisible() {
      this.searchWindowVisible = true
    },
    // 高级查询
    onSearchFilter(dynamicFilter) {
      console.log('dynamicFilter: ', dynamicFilter);

      this.searchWindowVisible = false
    },
    // 获取员工列表
    getEmployees(){
      console.log('获取员工列表')
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
