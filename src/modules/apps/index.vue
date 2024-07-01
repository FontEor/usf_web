<template>
  <div class="p-basic">
    <exact-search
      ref="exactSearch"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :search-height-change="calcHeight"
      :tenementInfoObj="tenementInfoObj"
    />
    <exact-list
      :state="state"
      :table-h="tableH1"
      :handle-add="handleAdd"
      :handle-edit="handleEdit"
      :tenementInfoObj="this.$store.state.app.tenementInfoObj"
      :handle-delete="handleDelete"
      :handle-workflow="handleWorkflow"
    />
    <entity-dialog
      :tenementInfoObj="this.$store.state.app.tenementInfoObj"
      :module-name="moduleName"
      :visible="entityDlgVis"
      :action="entityDlgActn"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
    />
    <workflow-dialog
      :tenementInfoObj="this.$store.state.app.tenementInfoObj"
      :visible="workflowDlgVis"
      action="workflow"
      :entity="state.entity"
      :update-vis="updateWorkflowDlgVis"
      :handle-save="handleSave"
    />
  </div>
</template>

<script>
import PageList from "@/mixins/pageList";
import store from "./store";
import { mapActions, mapState } from "vuex";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import WorkflowDialog from "./components/workflowDialog";
export default {
  name: "apps",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
    WorkflowDialog,
  },
  data() {
    return {
      // store唯一标识
      storeKey: "apps",
      // 模块名称
      moduleName: "应用管理",
      immediateQuery: false,
    };
  },
  created() {
    this.registStore(store);
  },
  methods: {
    handleSave({ params, type }) {
      const done = () => {
        type === "workflow"
          ? this.updateWorkflowDlgVis(false)
          : this.updateEntityDlgVis(false);
        this.queryList();
      };
      if (type === "add") {
        //
        params = Object.assign({}, params, {
          tenementCode: this.$store.state.app.tenementInfoObj.tenementCode,
        });
        this.dispatch("createEntity", { params, done });
        this.updateState("entity");
      } else {
        params = _.pick(
          params,
          "appName",
          "id",
          "remark",
          "domainName",
          "safetySwitch",
          "bpmVersion",
          "flowId",
          "principal",
          "principalErpCode",
          "startFlow",
          "orgSelectStyle",
          "enableOrgSelect",
          "isApply"
        );
        // 清洗配置审批流中选择bpm版本但未填写流程ID的脏数据
        params.flowId = params.flowId || null;
        params.bpmVersion = params.flowId ? params.bpmVersion : 0;
        this.dispatch("updateEntity", { params, done });
      }
    },
  },
  computed: {
    ...mapState("app", ["tenementInfoObj"]),
  },
  watch: {
    tenementInfoObj: {
      deep: true,
      immediate: false,
      handler: function (newVal) {
        if (newVal.tenementCode) {
          this.dispatch("queryList");
        }
      },
    },
  },
};
</script>
