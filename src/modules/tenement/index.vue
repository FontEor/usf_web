<template>
  <!--租户管理-->
  <div class="p-basic">
    <exact-search
      ref="exactSearch"
      :state="state"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :search-height-change="calcHeight"
    />
    <exact-list
      :state="state"
      :table-h="tableH1"
      :handle-add="handleAdd"
      :handle-edit="handleEdit"
      @handleSet="handleSet"
      @handleAutoAssign="handleAutoAssign"
      @onEditTenementMemphisCfg="onEditTenementMemphisCfg"
    />
    <entity-dialog
      :state="state"
      :module-name="moduleName"
      :visible="entityDlgVis"
      :action="entityDlgActn"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
    />
    <setDialog
      :visible="entityDlgVis2"
      :update-vis="updateEntityDlgVis2"
      :row="rows"
    />
    <AutoAssignDialog
      :visible="autoAssignDialogVisible"
      :update-vis="updateAutoAssignDialogVisible"
      :rows="rows"
    />
    <editTenementMemphisCfgDialog
      :visible="editTenementMemphisCfgDialogVis"
      :update-vis="updateEntityDlgVis2"
      :row="rows"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PageList from "@/mixins/pageList";
import store from "./store";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import setDialog from "./components/setDialog";
import AutoAssignDialog from "@/modules/tenement/components/autoAssignDialog";
import editTenementMemphisCfgDialog from "./components/editTenementMemphisCfgDialog";
export default {
  name: "tenement",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
    setDialog,
    AutoAssignDialog,
    editTenementMemphisCfgDialog,
  },
  data() {
    return {
      // store唯一标识
      storeKey: "tenement",
      // 模块名称
      moduleName: "租户管理",
      entityDlgVis2: false,
      autoAssignDialogVisible: false,
      editTenementMemphisCfgDialogVis: false,
      rows: null,
    };
  },
  created() {
    this.registStore(store);
    this.dispatch('getDidMap', { params: {
      tenementCode: this.tenementCode
    }})
  },
  watch: {
    'tenementCode': {
      handler(n) {
        if (n) {
          this.dispatch('getDidMap', { params: {
            tenementCode: this.tenementCode
          }})
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState('app', ['tenementCode'])
  },
  methods: {
    ...mapActions("app", ["globalTenementCode"]),
    handleSave({ params, type }) {
      const done = () => {
        this.updateEntityDlgVis(false);
        this.queryList();
      };
      if (type === "add") {
        // 新建
        this.dispatch("createEntity", { params, done });
      } else {
        params = _.pick(
          params,
          "tenementName",
          "id",
          "remark",
          "safetySwitch",
          "principal",
          "principalErpCode",
          "orgSelectStyle",
          "enableOrgSelect",
          "did"
        );
        // 更新
        this.dispatch("updateEntity", { params, done });
      }
    },
    handleSet(row) {
      this.rows = row;
      this.entityDlgVis2 = true;
    },
    handleAutoAssign(row) {
      this.rows = row;
      this.autoAssignDialogVisible = true;
    },
    onEditTenementMemphisCfg(row) {
      this.rows = row;
      this.editTenementMemphisCfgDialogVis = true;
    },
    // 更新实体弹框可见状态
    updateEntityDlgVis2(vis) {
      this.entityDlgVis2 = vis;
      this.editTenementMemphisCfgDialogVis = vis;
    },
    updateAutoAssignDialogVisible(visible) {
      this.autoAssignDialogVisible = visible;
    },
  },
};
</script>
