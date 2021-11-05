<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-alert >
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <a
              target="_blank"
              href="https://github.com/PanJiaChen/vue-element-admin"
            >
              <img
                style="margin-right: 10px"
                src="https://img.shields.io/github/stars/chuzhixin/vue-admin-beautiful?style=flat-square&label=Stars&logo=github"
              />
            </a>
          </div>
        </el-alert>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>访问量</span>
          </div>
          <div class="bottom">
            <span>
              日均访问量:
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>授权数</span>
          </div>
          <div class="bottom">
            <span>
              总授权数:
            </span>
          </div>
        </el-card>
      </el-col>

      <el-col
        v-for="(item, index) in 8"
        :key="index"
        :xs="12"
        :sm="6"
        :md="3"
        :lg="3"
        :xl="3"
      >
        <el-card class="icon-panel" shadow="never">
          <p>{{ item }}</p>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="11">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>依赖信息</span>
            <div style="float: right">部署时间:{{ new Date() }}</div>
          </div>
          <div class="bottom-btn">
            <a
              target="_blank"
              href="https://panjiachen.github.io/vue-element-admin-site/zh/"
            >
              <el-button type="warning">github下载源码点star</el-button>
            </a>
            <a
              target="_blank"
              href="https://panjiachen.github.io/vue-element-admin-site/zh/"
            >
              <el-button type="warning">码云下载源码点star</el-button>
            </a>
            <a >
              <el-button type="danger">修改主题和布局</el-button>
            </a>
          </div>
          <table class="table">
            <tr>
              <td>@vue/cli版本</td>
              <td>{{ devDependencies["@vue/cli-service"] }}</td>
              <td>vue版本</td>
              <td>{{ dependencies["vue"] }}</td>
            </tr>
            <tr>
              <td>vuex版本</td>
              <td>{{ dependencies["vuex"] }}</td>
              <td>vue-router版本</td>
              <td>{{ dependencies["vue-router"] }}</td>
            </tr>
            <tr>
              <td>element-ui版本</td>
              <td>{{ dependencies["element-ui"] }}</td>
              <td>axios版本</td>
              <td>{{ dependencies["axios"] }}</td>
            </tr>
            <tr>
              <td>eslint版本</td>
              <td>{{ devDependencies["eslint"] }}</td>
              <td>prettier版本</td>
              <td>{{ devDependencies["@babel/core"] }}</td>
            </tr>
            <tr>
              <td>sass版本</td>
              <td>{{ devDependencies["sass"] }}</td>
              <td>mockjs版本</td>
              <td>{{ devDependencies["mockjs"] }}</td>
            </tr>
            <tr>
              <td>zx-layouts版本</td>
              <td>{{ dependencies["echarts"] }}</td>
              <td>lodash版本</td>
              <td>{{ dependencies["screenfull"] }}</td>
            </tr>
          </table>
        </el-card>

        <el-card shadow="never">
          <div slot="header">
            <span>其他信息</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="13" :lg="13" :xl="13">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>更新日志</span>
          </div>
          <div>更新日志-内容</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dependencies, devDependencies } from "../../../package.json";
export default {
  name: "Home",
  data() {
    return {
      buttonObj: {},
      long: "",
      dependencies: dependencies,
      devDependencies: devDependencies,
    };
  },
  methods: {},
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .el-alert {
        padding:0 10px;

        &--info.is-light {
          min-height: 82px;
          padding: 0 10px;
          margin-bottom: 15px;
          color: #909399;
          background-color: #fff;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 115px;
        }
      }
    }

    .card {
      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid #ccc;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 117px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
