<template>
  <div>
    <basic-list
      :show-select-col="true"
      :show-action-col="false"
      :show-index-col="false"
      :show-col-set="false"
      select-type="multiple"
      :fields="listFields"
      :loading="state.loading"
      :total="state.total"
      :list="state.list"
      :table-h="tableH"
      :page-index="state.pageIndex"
      :page-size="state.pageSize"
      :page-index-change="pageIndexChange"
      :page-size-change="pageSizeChange"
      :selection-change="selectionChange"
    >
      <template slot="hd-col--l">
        <el-button
          type="primary"
          size="mini"
          @click="onHandleAdd"
          v-if="buttonData('tjsjzy').has"
          :disabled="selRows.length > 1"
          >{{ buttonData("tjsjzy").name }}</el-button
        >
        <el-button
          size="mini"
          @click="onHandleEdit"
          v-if="buttonData('bjsjzy').has"
          :disabled="selRows.length > 1"
        >
          {{ buttonData("bjsjzy").name }}</el-button
        >
        <el-button
          type="danger"
          size="mini"
          @click="onHandleDetele"
          v-if="buttonData('scsjzy').has"
          :disabled="selRows.length > 1"
          >{{ buttonData("scsjzy").name }}</el-button
        >
        <!-- 导入 -->
        <el-button
          size="mini"
          @click="importData"
          v-if="buttonData('DRSJZY').has"
          :disabled="selRows.length > 1"
          >{{ buttonData("DRSJZY").name }}</el-button
        >
        <el-dropdown
          v-if="buttonData('DCSJZY').has || buttonData('DCSJZYYHB').has"
          size="mini"
          type="primary"
          split-button
          @command="onExport"
        >
          导出
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="exportSJZY"
              v-if="buttonData('DCSJZY').has"
              :disabled="selRows.length > 1">{{
              buttonData("DCSJZY").name
            }}</el-dropdown-item>
            <el-dropdown-item
              command="exportSJZYJS"
              v-if="buttonData('DCSJZYYHB').has"
              >{{
              buttonData("DCSJZYYHB").name
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- TODO -->
        <!-- 删除静态菜单
                <el-button type="primary" size="mini" @click="onHandleAdd">添加</el-button>
                <el-button type="primary" size="mini" @click="onHandleEdit">编辑</el-button>
                <el-button type="danger" size="mini" @click="onHandleDetele">删除</el-button>
                -->
      </template>
    </basic-list>

    <!--批量导入-->
    <import-dialog-new
      module-name=""
      :visible="dialogBool.val"
      :action="'导入数据资源'"
      :uploadData="uploadData"
      :entity="state.entity"
      :state="state"
      :win-close="() => (dialogBool.val = false)"
      :handle-save="() => {}"
    />
  </div>
</template>

<script>
import ExactList from "@/mixins/exactList";
import importDialogNew from "./importDialogNew";
import { mapState } from "vuex";

// 默认字段
const DEFAULTFIELDS = [
  {
    key: "ext1",
    name: "暂无字段",
    hidden: true,
  },
];
const CREATETIME = [
  {
    key: "dataCode",
    name: "数据资源编码",
  },
  {
    key: "orgName",
    name: "所属机构",
  },
  {
    key: "createTime",
    name: "创建时间",
    formatter: function (row, column, cellValue, index) {
      return jt.date.format(new Date(cellValue).getTime());
    },
  },
];
export default {
  computed: {
    ...mapState("app", ["showExportButton", "tenementInfoObj"]),
    ...mapState("app", ["showExportButton", "tenementInfoObj"]),
  },
  mixins: [ExactList],
  data() {
    return {
      currentRow: {},
      DEFAULTFIELDS: DEFAULTFIELDS,
      dialogBool: { val: false },
      uploadData: {},
      fullscreenLoading: false,
    };
  },
  props: {
    exportOrg: Function,
    exportResourceUser: Function,
    state: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: { importDialogNew },
  computed: {
    listFields() {
      const currentFiles =
        this.state.currentFiles && this.state.currentFiles.length
          ? [
              CREATETIME[0],
              ..._.cloneDeep(this.state.currentFiles),
              ...CREATETIME.slice(1, CREATETIME.length),
            ]
          : this.DEFAULTFIELDS;
      return currentFiles;
    },
  },
  methods: {
    importData() {
      this.dialogBool.val = true;
      this.uploadData = {
        uploadUrl: "/dataBaseBatch/importV2",
        templateType: "baseData",
        name: "baseDataFile",
        enabled: this.buttonData("DRSJZY").has && this.showExportButton,
      };
    },
    message(msg = "请先选择数据") {
      this.$message.error(msg);
    },
    selectionChange(rows) {
      this.selRows = rows;
      this.currentRow = rows.length ? rows[0] : {};
      // 允许多选 关闭此设置
      // this.handleSelectionChange && this.handleSelectionChange(rows);
    },
    onHandleAdd() {
      this.$parent.addChange();
      this.$parent.queryOrgTreeList().then((rows) => {
        // 设置为key-belongOrgId的options值
        tools.setKeys(this.state.DEFAULTFIELDS, "belongOrgId", rows, "options");
        if (!this.state.currentFiles) return;
        const length = this.state.currentFiles.length;
        if (length) {
          this.handleAdd();
        } else {
          this.message("该数据类型未启用任何字段");
        }
      });
    },
    onHandleEdit() {
      const id = this.currentRow.id;

      if (id !== undefined) {
        this.$parent.editChange(id);
        this.$parent.queryOrgIdTreeList(id).then((rows) => {
          // 设置为key-belongOrgId的options值
          tools.setKeys(this.state.DEFAULTFIELDS, "belongOrgId", rows, "options");
          this.handleEdit({ id }, true);
        });
        // this.handleEdit(this.currentRow)
      } else {
        this.message();
      }
    },
    onHandleDetele() {
      const id = this.currentRow.id;
      if (id !== undefined) {
        this.handleDelete({ id });
      } else {
        this.message();
      }
    },
    onExport(command) {
      switch (command) {
        case "exportSJZY":
          this.exportOrg();
          break;
        case "exportSJZYJS":
          if (!this.selRows.length) {
            return this.$message.error("请先选择数据资源");
          }
          this.exportResourceUser(this.selRows);
          break;
        default:
          break;
      }
    },
  },
};
</script>
