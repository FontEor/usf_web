<template>
  <div class="apply2022">
    <Header />
    <main class="apply2022-main">
      <ApplyBreadcrumb />
      <ApplyContent>
        <el-tabs :value="tabValue" type="card">
          <el-tab-pane label="第一步" name="step1">
            <ApplyChooseTenant />
          </el-tab-pane>
          <el-tab-pane label="第二步" name="step2">
            <InfoConfirm />
          </el-tab-pane>
          <el-tab-pane label="第三步" name="step3">
            <ApplyAuthChoose />
          </el-tab-pane>
          <el-tab-pane label="第四步" name="step4">
            <ApplySuccess />
          </el-tab-pane>
          <!-- 入口选择页面 -->
          <el-tab-pane label="第零步" name="step0">
            <ChooseApplyType v-if="tabValue === 'step0'" />
          </el-tab-pane>
        </el-tabs>
      </ApplyContent>
      <ApplyStep v-if="tabValue !== 'step1' && tabValue !== 'step0'" />
    </main>
  </div>
</template>

<script>
import Vue from "vue";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import "xe-utils";
Vue.use(VXETable);

import Header from "./components/Header.vue";
import ApplyBreadcrumb from "./components/ApplyBreadcrumb.vue";
import ApplyContent from "./components/Content.vue";
import ApplyChooseTenant from "./components/steps/chooseTenant.vue";
import InfoConfirm from "./components/steps/InfoConfirm/Index.vue";
import ApplyAuthChoose from "./components/steps/AuthChoose.vue";
import ApplySuccess from "./components/steps/SubmitSucess.vue";
import ApplyStep from "./components/ApplyStep.vue";
import ChooseApplyType from "./components/steps/chooseApplyType.vue";
import "./scss/index.scss";
import store from "./store/index.js";

import linkArgumentsMixin from "./mixins/link.arguments";

export default {
  mixins: [linkArgumentsMixin],
  components: {
    ApplyContent,
    ApplyBreadcrumb,
    ApplyChooseTenant,
    ApplyAuthChoose,
    ApplySuccess,
    InfoConfirm,
    ApplyStep,
    Header,
    ChooseApplyType,
  },
  data() {
    return {
      storeKey: "apply2022"
    };
  },
  computed: {
    tabValue() {
      return store.state.stepState.currentName;
    },
  },
  mounted() {},
  created() {
    this.registStore()
  },
  beforeDestroy() {
    this.unRegistStore()
  },
  beforeRouteEnter(to, from, next) {
    // 退出页面再次进入之后 清理之前所有数据
    store && store.commit('clearAllData');
    next(vm => {
      store.commit('clearAllData');
      store.commit('updateApplyType', to.name);
    })
  },
  methods: {
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
