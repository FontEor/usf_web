<template>
  <div class="apply2022">
    <Header />
    <main class="apply2022-main">
      <ApplyBreadcrumb step="history" />
      <List
        ref="listRef"
        :query="query"
        :requestFn="getList"
        :rules="{}"
        :offsetHeight="75"
        :reset-query="onResetQuery"
        :queryPosition="'data'"
        >
        <template v-slot:search>
          <el-form-item label="审批单号">
            <el-input
              v-model="query.data.data.processInstanceNo"
              placeholder="审批单号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="租户编码">
            <el-input
              v-model="query.data.data.tenementCode"
              placeholder="租户编码"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="审批状态">
            <el-select v-model="query.data.data.approvalState" placeholder="审批状态" clearable>
              <el-option v-for="status in statusList" :key="status.value" :label="status.label" :value="status.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="query.data.data.times"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-slot:table>
          <vxe-column field="processInstanceNo" title="审批单单号" width="480"></vxe-column>
          <vxe-column field="approvalState" title="审批状态">
            <template #default="{ row }">{{ row.approvalState | applyHistoryState }}</template>
          </vxe-column>
          <vxe-column field="approvers" title="审批人" show-overflow></vxe-column>
          <vxe-column field="tenementCode" title="申请租户编码" show-overflow></vxe-column>
          <vxe-column field="applyTime" title="申请时间" show-overflow>
            <template #default="{ row }">{{ row.applyTime | timeFormat }}</template>
          </vxe-column>
          <vxe-column field="id" title="操作" width="180">
            <template #default="{ row }">
              <!-- <el-button type="text" @click="onExport(row)">导出</el-button> -->
              <el-button type="text" :disabled="row.approvalState !== 0" @click="onRecall(row)" >撤回</el-button>
              <el-button type="text" @click="onView(row)">查看</el-button>
            </template>
          </vxe-column>
        </template>
      </List>
      <div class="apply-2022-step-container">
        <el-button
          type="default"
          size="large"
          @click="() => $router.push({ path: '/apply/new' })"
          >返回</el-button
        >
      </div>
    </main>
  </div>
</template>

<script>
import Vue from "vue";
import lodash from "lodash";
import VXETable from "vxe-table";
import moment from "moment";
import "vxe-table/lib/style.css";
import "xe-utils";
Vue.use(VXETable);

import Header from "./components/Header.vue";
import ApplyBreadcrumb from "./components/ApplyBreadcrumb.vue";
import ApplyContent from "./components/Content.vue";
import List from "./components/List.vue";
import filterMixins from "./mixins/filters";

import "./scss/index.scss";
import store from "./store/index.js";
import Axios from "axios";

// query 默认值
const initQuery = () => {
  return {
    data: {
      data: {
        tenementCode: "",
        processInstanceNo: "",
        approvalState: undefined,
        times: []
      }
    },
  };
};

export default {
  mixins: [filterMixins],
  components: {
    ApplyContent,
    ApplyBreadcrumb,
    Header,
    List,
  },
  data() {
    return {
      storeKey: "apply2022",
      query: initQuery(),
      statusList: CNST.ENUMS.applyHistoryState
    };
  },
  computed: {
    tabValue() {
      return store.state.stepState.currentName;
    },
  },
  mounted() {},
  created() {
    this.registStore();
  },
  beforeDestroy() {
    this.unRegistStore();
  },
  beforeRouteEnter(to, from, next) {
    // 退出页面再次进入之后 清理之前所有数据
    store && store.commit("clearAllData");
    return next();
  },
  methods: {
    // 请求列表
    getList(data) {
      data = data || this.query;
      const args = lodash.cloneDeep(data);
      const startTime = lodash.get(args, 'data.data.times[0]');
      const endTime = lodash.get(args, 'data.data.times[1]');
      if(startTime) {
        args.data.data.startDateStr = moment(startTime).format('YYYY-MM-DD 00:00:00')
        delete args.data.data.times;
      }
      if(endTime) {
        args.data.data.endDateStr = moment(endTime).format('YYYY-MM-DD 23:59:59')
        delete args.data.data.times;
      }
      return Axios(Object.assign(
        {
          method: "post",
          url: "/myApply/getHistoryApplyList.do",
        },
        args
      )).then(response => {
        if(response.data.code !== 200) {
          this.$message.error(response.data.msg)
        }
        return response
      });
    },
    onResetQuery() {
      this.query = initQuery();
    },
    onRecall(row) {
      this.$confirm(
          `<div class='apply-2022-confirm-content'>
            <p>
              <i class='el-icon-warning'></i>
              <span>确认要撤回审批么？<br/>若撤回则次申请不会进入下一批节点，是否继续撤回？</span>
            </p>
          </div>`,
          "",
          {
              dangerouslyUseHTMLString: true
          }
      ).then(() => {
        Axios({
          method: "post",
          url: "/myApply/cancelApply.do",
          data: {
            data: {
              id: row.id
            }
          }
        }).then(response => {
          if(response.data.code === 200) {
            this.$refs.listRef.getList();
            this.$message({
                type: "success",
                message: "撤回成功!"
            });
          }
        })
      });
    },
    onExport(row) {
      const url = row.appendixUrl;
      const save_link = document.createElement("a")
      save_link.href = url;
      save_link.download = '错误账号数据.txt';
      save_link.target = '_blank';
      const ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(ev);
    },
    onView() {
      window.open('http://oa.jd.com/home/#/', '_blank')
    },
    // 注册页面私有store
    registStore() {
      if (store && !(this.storeKey in this.$store._modules.root._children)) {
        this.$store.registerModule(this.storeKey, store);
      }
    },
    // 卸载页面私有store
    unRegistStore() {
      if (this.storeKey in this.$store._modules.root._children) {
        this.$store.unregisterModule(this.storeKey);
      }
    },
  },
};
</script>
