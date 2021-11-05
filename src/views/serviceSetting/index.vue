<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="item-input">
        <el-select
          class="filter-item"
          v-model="listQuery.warehouse"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="item-input">
        <el-select
          class="filter-item"
          v-model="listQuery.cost"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in costList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="item-input">
        <el-input
          v-model="listQuery.nameCode"
          placeholder="请输入中/英文名称/春光编码"
          class="filter-item"
          clearable
        >
        </el-input>
      </div>
      <div class="item-button">
        <el-button
          size="small"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          查询
        </el-button>
        <el-button
          size="small"
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="openDrawer($event, 'add')"
        >
          新增
        </el-button>
        <el-button
          size="small"
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
        >
          设置期间费用
        </el-button>
        <el-button
          size="small"
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
        >
          批量修改
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="pageLoading"
      border
      v-if="tableVisible"
      :data="list"
      highlight-current-row
    >
      <!-- 表头 -->
      <template v-for="(col, index) in cols">
        <el-table-column
          :key="index"
          :width="col.width"
          :label="col.label"
          :prop="col.prop"
          align="center"
        >
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <a
            class="link"
            href="javascript:void(0)"
            @click="openDrawer(row, 'view')"
            >查看</a
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="list.length > 0 && tableVisible"
      :total="list.length"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!--抽屉窗口-->
    <my-window
      :title="DrawerTitle"
      embed
      drawer
      :visible.sync="serviceFormVisible"
      @close="onCloseEditForm"
    >
      <el-form
        ref="serviceForm"
        :model="serviceForm"
        :rules="serviceFormRules"
        label-width="100px"
        :inline="false"
      >
        <el-row :gutter="20" class="row-container">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item v-if="drawerStatus" label="中文名称:" prop="name">
              <el-input v-model="serviceForm.name" autocomplete="off" />
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">中文名称:</span>
              <span class="value">阿里巴巴</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item v-if="drawerStatus" label="英文名称:" prop="enName">
              <el-input v-model="serviceForm.enName" autocomplete="off" />
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">英文名称:</span>
              <span class="value">Alibaba</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item
              v-if="drawerStatus"
              label="业务比例:"
              prop="businessScale"
            >
              <el-input
                v-model="serviceForm.businessScale"
                autocomplete="off"
              />
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">业务比例:</span>
              <span class="value">1:2</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item v-if="drawerStatus" label="计量单位:" prop="unit">
              <el-select
                v-model="serviceForm.unit"
                placeholder="请选择计量单位"
                style="width: 100%"
              >
                <el-option
                  v-for="item in unitList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">计量单位:</span>
              <span class="value">个</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item v-if="drawerStatus" label="货币:" prop="currency">
              <el-select
                v-model="serviceForm.currency"
                placeholder="请选择计量单位"
                style="width: 100%"
              >
                <el-option
                  v-for="item in currencyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">货币:</span>
              <span class="value">美元</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item v-if="drawerStatus" label="费用:" prop="cost">
              <el-input v-model="serviceForm.cost" autocomplete="off" />
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">费用:</span>
              <span class="value">20万</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item v-if="drawerStatus" label="返佣金额:" prop="rebate">
              <el-input v-model="serviceForm.rebate" autocomplete="off" />
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">返佣金额:</span>
              <span class="value">5万</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item
              v-if="drawerStatus"
              label="代理比例:"
              prop="agentRatio"
            >
              <el-input v-model="serviceForm.agentRatio" autocomplete="off" />
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">代理比例:</span>
              <span class="value">4:1</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item
              v-if="drawerStatus"
              label="费用描述:"
              prop="costDescription"
            >
              <el-input
                v-model="serviceForm.costDescription"
                autocomplete="off"
              />
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">费用描述:</span>
              <span class="value">为了挣钱</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item
              v-if="drawerStatus"
              label="附加费用:"
              prop="additional"
            >
              <el-radio-group v-model="serviceForm.additional">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">附加费用:</span>
              <span class="value">是</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item v-if="drawerStatus" label="是否返佣:" prop="isRebate">
              <el-radio-group v-model="serviceForm.isRebate">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">是否返佣:</span>
              <span class="value">是</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item v-if="drawerStatus" label="当前状态:" prop="status">
              <el-radio-group v-model="serviceForm.status">
                <el-radio label="启用" />
                <el-radio label="禁用" />
              </el-radio-group>
            </el-form-item>
            <div class="row-text" v-else>
              <span class="label">当前状态:</span>
              <span class="value">是</span>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="serviceFormVisible = false">取消</el-button>
        <my-confirm-button
          type="submit"
          :validate="editFormvalidate"
          :loading="editLoading"
          @click="onEditSubmit"
        />
      </template>
    </my-window>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import MyWindow from "@/components/my-window";
import MyConfirmButton from "@/components/my-confirm-button";

export default {
  name: "Company",
  components: { Pagination, MyWindow, MyConfirmButton },
  filters: {},
  data() {
    return {
      list: [
        {
          name: "阿里巴巴", // 中文名称
          code: "45415431GSFSAAS", // 春光编码
          enName: "Alibaba", // 英文名称
          unit: "kg", // 计量单位
          currency: "美元", // 货币
          cost: "100w", // 费用
          rebate: "12", // 返佣金额
          agentRatio: "1:2", // 代理比例
          businessScale: "2:1", // 业务比例
          costDescription: "装货费用", // 费用描述
          isRebate: "否", // 是否返佣
          status: "启用", // 当前状态
          additional: "10w", // 附加费用
        },
        {
          name: "", // 中文名称
          code: "", // 春光编码
          enName: "", // 英文名称
          unit: "", // 计量单位
          currency: "", // 货币
          cost: "", // 费用
          rebate: "", // 返佣金额
          agentRatio: "", // 代理比例
          businessScale: "", // 业务比例
          costDescription: "", // 费用描述
          isRebate: "", // 是否返佣
          status: "", // 当前状态
          additional: "", // 附加费用
        },
      ],
      cols: [
        { label: "中文名称", prop: "name", width: "" },
        { label: "春光编码", prop: "code", width: "180" },
        { label: "英文名称", prop: "enName", width: "" },
        { label: "计量单位", prop: "unit", width: "" },
        { label: "货币", prop: "currency", width: "" },
        { label: "费用", prop: "cost", width: "" },
        { label: "返佣金额", prop: "rebate", width: "" },
        { label: "代理比例", prop: "agentRatio", width: "" },
        { label: "业务比例", prop: "businessScale", width: "" },
        { label: "费用描述", prop: "costDescription", width: "" },
        { label: "是否返佣", prop: "isRebate", width: "" },
        { label: "当前状态", prop: "status", width: "" },
        { label: "附加费用", prop: "additional", width: "" },
      ],
      // 服务费表单列表
      serviceForm: {
        name: "", // 中文名称
        enName: "", // 英文名称
        businessScale: "", // 业务比例
        unit: "", // 计量单位
        currency: "", // 货币
        cost: "", // 费用
        rebate: "", // 返佣金额
        agentRatio: "", // 代理比例
        costDescription: "", // 费用描述
        additional: "", // 附加费用
        isRebate: "", // 是否返佣
        status: "", // 当前状态
      },
      DrawerTitle: "新增员工",
      // 表格加载loading
      listLoading: true,
      // 查询服务费
      listQuery: {
        page: 1,
        limit: 20,
        warehouse: "",
        cost: "",
        nameCode: "",
      },
      // 服务费表单验证
      serviceFormRules: {
        name: [{ required: true, message: "请输入中文名称", trigger: "blur" }],
        enName: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
        ],
        businessScale: [
          { required: true, message: "请输入业务比例", trigger: "blur" },
        ],
        unit: [
          { required: true, message: "请选择计量单位", trigger: "change" },
        ],
        currency: [
          { required: true, message: "请选择货币", trigger: "change" },
        ],
        cost: [{ required: true, message: "请选择费用", trigger: "change" }],
        rebate: [
          { required: true, message: "请输入返佣金额", trigger: "blur" },
        ],
        agentRatio: [
          { required: true, message: "请输入代理比例", trigger: "blur" },
        ],
        additional: [
          { required: true, message: "请选择附加费用", trigger: "change" },
        ],
        isRebate: [
          { required: true, message: "请选择是否返佣", trigger: "change" },
        ],
        status: [
          { required: true, message: "请选择当前状态", trigger: "change" },
        ],
      },
      // 仓库列表
      warehouseList: [
        { label: "请选择", value: "" },
        { label: "海外整柜私人仓", value: "1" },
        { label: "海运整柜FBA", value: "2" },
        { label: "FBA自拼一条龙询价", value: "3" },
      ],
      // 费用列表
      costList: [
        { label: "基础费用", value: "" },
        { label: "运费", value: "1" },
        { label: "服务费", value: "2" },
      ],
      // 计量单位列表
      unitList: [
        { label: "个", value: "pcs" },
        { label: "箱", value: "pxs" },
        { label: "车", value: "pws" },
      ],
      // 货币列表
      currencyList: [
        { label: "元", value: "rmb" },
        { label: "美元", value: "dols" },
        { label: "欧元", value: "Euro" },
      ],
      serviceFormVisible: false, // 编辑界面是否显示
      // 表格的显示隐藏
      tableVisible: false,
      // 表格 loading
      pageLoading: false,
      // 表单label位置对齐方式
      labelPosition: "right",
      // 表单是否为查看状态
      drawerStatus: "",
      // 抽屉确定按钮事件
      editLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      setTimeout(() => {
        this.listLoading = false;
      }, 1.5 * 1000);
    },
    // 过滤搜索事件
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
      this.tableVisible = true;
    },
    // 重置事件
    resetTemp() {
      this.serviceForm = {
        name: "", // 中文名称
        enName: "", // 英文名称
        businessScale: "", // 业务比例
        unit: "", // 计量单位
        currency: "", // 货币
        cost: "", // 费用
        rebate: "", // 返佣金额
        agentRatio: "", // 代理比例
        costDescription: "", // 费用描述
        additional: "", // 附加费用
        isRebate: "", // 是否返佣
        status: "", // 当前状态
      }
    },
    // 编辑按钮事件
    openDrawer(row, type) {
      switch (type) {
        case "view":
          this.DrawerTitle = "查看服务费";
          break;
        case "edit":
          this.DrawerTitle = "修改服务费";
          break;
        default:
          this.DrawerTitle = "添加服务费";
          break;
      }
      this.drawerStatus = type === "view" ? false : true;
      // this.staffForm = Object.assign({}, row);
      this.serviceFormVisible = true;
    },
    // 抽屉确定按钮校验规则
    editFormvalidate() {
      let isValid = false;
      this.$refs.serviceForm.validate((valid) => {
        isValid = valid;
      });
      return isValid;
    },
    // 抽屉确定事件按钮
    onEditSubmit() {
      this.editLoading = true;
      this.$message({
        message: "保存成功",
        type: "success",
      });
      this.$refs["serviceForm"].resetFields();
      this.serviceFormVisible = false;
    },
    // 关闭抽屉事件
    onCloseEditForm() {
      this.$refs.serviceForm.resetFields();
    },
  },
};
</script>
<style lang="scss" scope>
.link {
  color: #333;
  padding: 0 6px;
  &:hover {
    color: #409eff;
    text-decoration: underline;
  }
}
</style>
