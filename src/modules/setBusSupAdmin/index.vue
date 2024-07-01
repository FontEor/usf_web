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
      :handle-delete="handleDelete"
      :handle-workflow="handleWorkflow"
      :export-menu-data="exportMenuData"
    />
    <entity-dialog
      :visible="entityDlgVis"
      :state="state"
      :action="entityDlgActn"
      :roleListId="roleListId"
      :roleCode="roleCode"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
    />
    <!-- 导出用户 -->
    <ExportDialog
      ref="exportDialog"
      :module-name="moduleName"
      :visible="exportUserShow"
      :content="content"
      :action="entityDlgActn"
      :win-close="winClose"
    />
  </div>
</template>

  <script>
import PageList from "@/mixins/pageList";
import store from "./store";
import axios from "axios";
import { mapActions, mapState } from "vuex";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import ExportDialog from "./components/exportDialog.vue";
export default {
  name: "setBusSupAdmin",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
    ExportDialog,
  },
  data() {
    return {
      // store唯一标识
      storeKey: "setBusSupAdmin",
      // 模块名称
      moduleName: "",
      immediateQuery: false,
      // 实体弹窗是否可见
      entityDlgVis: false,
      //点中的当前列表id
      roleListId: 0,
      //roleCode  点击的角色的那一行的code编码
      roleCode: undefined,
      exportUserShow: false,
      content: "",
    };
  },
  created() {
    this.registStore(store);
  },
  computed: {
    ...mapState("app", ["tenementInfoObj"]),
  },
  watch: {
  },
  mounted() {
    this.dispatch("queryList");
  },
  methods: {
    showDialog(name) {
      this.exportUserShow = true;
      this.entityDlgActn = name;
    },
    // 导出
    async exportMenuData() {
      if (!this.showExportButton) {
        return this.$message({
          type: "error",
          message:
            "为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）",
          showClose: true,
        });
      }
      axios({
        url: "/administrator/business/export.do",
        params: {
          tenementCode: this.$store.state.app.tenementCode,
        },
        responseType: "stream",
        method: "get",
        onDownloadProgress: (processEvenet) => {
          console.log("####### processEvenet", processEvenet);
        },
      })
        .then((res) => {
          this.showDialog("导出详情");
          this.content = "导出结果将于24小时内通过咚咚/邮件下发，请注意查收。";
        })
        .catch((error) => {
          this.showDialog("导出失败");
          this.content =
            "导出失败！请重新导出，若仍无结果，请联系USF小妹（org.missusf)";
        });
    },
    winClose(ev) {
      this.exportUserShow = false;
    },
    // 更新实体弹框可见状态
    updateEntityDlgVis(vis) {
      this.entityDlgVis = vis;
    },
    handleSave() {
      this.queryList();
    },
    handleDelete() {
      this.queryList();
    },
  },
};
</script>
