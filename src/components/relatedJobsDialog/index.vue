<template>
  <basic-dialog
    :visible="visible"
    :width="840"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-ok="handleOk"
    :handle-open="handleOpen"
    :title="dialogTitle"
    :show-ft="tableData && tableData.length > 0"
    :show-cancel="false"
    okText="保存"
    class="related-jobs-dialog"
  >
    <div
      v-if="tableData && tableData.length > 0"
      v-loading="dialogLoading"
      class="table-wrapper--has-data"
    >
      <el-button
        type="primary"
        size="mini"
        style="margin-bottom: 8px"
        @click="handleAddRowData"
        >添加岗位</el-button
      >
      <el-pagination
        layout="total, sizes, prev, jumper, slot, next"
        :total="page.rowTotal"
        @current-change="currentPageChange"
        @size-change="pageSizeChange"
      >
        <span class="page-count"> / {{ page.pageTotal }}</span>
      </el-pagination>
      <el-table :data="tableData" border size="mini" style="width: 100%">
        <el-table-column
          v-for="(item, index) in tableList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
        >
          <template slot-scope="{ row, $index }">
            <div v-if="row.editable">
              <el-autocomplete
                v-if="item.prop === 'organizationFullName'"
                v-model="tableData[$index].organizationFullName"
                :fetch-suggestions="remoteBlurryQueryHrOrganizationByName"
                :disabled="row.id ? true : false"
                placeholder="请输入部门名称"
                value-key="organizationFullName"
                size="mini"
                style="width: 100%"
                @select="selectOrganizationFullName($event, $index)"
              ></el-autocomplete>
              <el-select
                v-else-if="item.prop === 'positionName'"
                v-model="tableData[$index].positionName"
                :remote-method="
                  (query) => {
                    remoteBlurryQueryPositionByName(query, $index);
                  }
                "
                :loading="positionLoading"
                placeholder="请选择岗位"
                size="mini"
                style="width: 100%"
                remote
                filterable
                clearable
                @change="changePositionName($event, $index)"
                @focus="focusPositionName($event, $index)"
              >
                <el-option
                  v-for="positionItem in positionOptionList[$index]"
                  :key="positionItem.positionCode"
                  :label="positionItem.positionName"
                  :value="positionItem.positionName"
                ></el-option>
              </el-select>
            </div>
            <span v-else :style="row.status === 0 ? 'color: #909399' : null">{{
              row[item.prop]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="{ row, $index }">
            <el-tooltip
              v-if="row.status === 0"
              class="item"
              effect="dark"
              content="可在【OA-流程中心】中查看审批进度以及审批结果。"
              placement="top"
            >
              <span style="color: #f56c6c">审批中</span>
            </el-tooltip>
            <div v-else class="button-wrapper">
              <el-button
                v-if="row.editable"
                type="text"
                size="mini"
                @click="handleConfirmRowData(row)"
                >确认</el-button
              >
              <el-button
                v-else
                type="text"
                size="mini"
                @click="handleEditRowData(row, $index)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="mini"
                style="color: #f56c6c"
                @click="handleRemoveRowData(row, $index)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else v-loading="dialogLoading" class="table-wrapper--has-no-data">
      <p class="title">当前{{ computeTypeText }}暂未关联岗位</p>
      <p class="subtitle">
        {{ computeTypeText }}关联岗位后，新员工入职即可根据其岗位自动添加至该{{
          computeTypeText
        }}下，并授予{{ computeTypeText }}对应权限。
      </p>
      <el-button
        type="primary"
        size="mini"
        style="margin-bottom: 8px"
        @click="handleAddRowData"
        >添加岗位</el-button
      >
    </div>
    <el-dialog
      :title="computeSaveDialogTitle"
      :visible.sync="saveDialogVisible"
      width="460px"
      append-to-body
    >
      <p>{{ computeSaveDialogContent }}</p>
      <div slot="footer">
        <el-button @click="saveDialogVisible = false">取消</el-button>
        <el-button
          :loading="confirmSubmitLoading"
          type="primary"
          @click="handleConfirmSubmit"
          >{{ computeSaveDialogButtonText }}</el-button
        >
      </div>
    </el-dialog>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
import { mapState } from "vuex";

export default {
  name: "RelatedJobsDialog",
  mixins: [EntityDialog],
  props: {
    dialogTitle: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      validator(value) {
        // 可选值org或group，对应机构管理岗位和用户组关联岗位
        return ["org", "group"].includes(value);
      },
    },
    code: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialogLoading: false,
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 1,
        rowTotal: 0,
      },
      originData: [],
      tableData: [],
      tableList: [
        { label: "岗位所在部门", prop: "organizationFullName" },
        { label: "岗位名称", prop: "positionName", width: "200" },
      ],
      organizationList: [],
      positionOptionList: [],
      positionLoading: false,
      saveDialogVisible: false,
      confirmSubmitLoading: false,
      isRemove: null,
    };
  },
  computed: {
    ...mapState("app", ["tenementCode"]),
    computeSaveDialogTitle() {
      if (this.isRemove) {
        return "删除提示";
      } else {
        return "审批提示";
      }
    },
    computeSaveDialogContent() {
      if (this.isRemove) {
        return "删除后，该岗位人员入职将不再自动分配对应权限，是否仍要删除？";
      } else {
        return "当前操作为关联新岗位/修改关联岗位，基于安全合规要求，系统管理员审批通过后方可关联成功，是否提交审批？";
      }
    },
    computeSaveDialogButtonText() {
      if (this.isRemove) {
        return "确认删除";
      } else {
        return "确认提交";
      }
    },
    computeTypeText() {
      const hashMap = { org: "机构", group: "用户组" };
      return hashMap[this.type];
    },
  },
  methods: {
    async getPositionList() {
      const { type, code, tenementCode } = this;
      const data = { type, code, tenementCode };
      const { pageIndex, pageSize } = this.page;
      const page = { pageIndex, pageSize };
      return await api.organizations.getPositionList({
        data,
        page,
      });
    },
    async blurryQueryHrOrganizationByName(hrOrgName) {
      const data = { hrOrgName };
      return await api.organizations.blurryQueryHrOrganizationByName({
        data,
      });
    },
    async blurryQueryPositionByName(organizationFullPath, positionName) {
      const data = { organizationFullPath, positionName };
      return await api.organizations.blurryQueryPositionByName({
        data,
      });
    },
    async savePosition(positionList) {
      const { type, code, tenementCode } = this;
      const data = { positionList, type, code, tenementCode };
      return await api.organizations.savePosition({
        data,
      });
    },
    async delPosition(row) {
      const { id } = row;
      const { type, code, tenementCode } = this;
      const data = { id, type, code, tenementCode };
      return await api.organizations.delPosition({
        data,
      });
    },

    // 获取已经关联的岗位信息列表
    async handleGetPositionList() {
      this.dialogLoading = true;
      const { code, data, msg } = await this.getPositionList();
      if (code === 200) {
        const { pageIndex, pageSize, pageTotal, rowTotal, rows } = data;
        this.page = { pageIndex, pageSize, pageTotal, rowTotal };
        this.tableData = rows || [];
        this.originData = rows || [];
        this.initTableData();
        this.dialogLoading = false;
      } else {
        msg && this.$message.error(msg);
        this.dialogLoading = false;
        throw new Error(msg);
      }
    },
    // 根据部门名称模糊查询部门列表
    async remoteBlurryQueryHrOrganizationByName(query, callback) {
      if (query && query.length > 1) {
        const { code, data, msg } = await this.blurryQueryHrOrganizationByName(
          query
        );
        if (code === 200) {
          this.organizationList = data || [];
        } else {
          msg && this.$message.error(msg);
          throw new Error(msg);
        }
      }
      callback(this.organizationList);
    },
    // 选择部门名称时为 organizationFullPath 赋值
    selectOrganizationFullName(item, index) {
      const { organizationFullPath } = item;
      this.tableData[index].organizationFullPath = organizationFullPath;
      this.remoteBlurryQueryPositionByName(null, index);
    },
    // 根据部门远程模糊搜索岗位
    async remoteBlurryQueryPositionByName(query, index) {
      this.positionLoading = true;
      const { organizationFullPath } = this.tableData[index];
      const { code, data, msg } = await this.blurryQueryPositionByName(
        organizationFullPath,
        query
      );
      if (code === 200) {
        this.positionOptionList.splice(index, 1, data || []);
        this.positionLoading = false;
      } else {
        msg && this.$message.error(msg);
        throw new Error(msg);
      }
    },
    // 改变岗位名称时为 positionCode 赋值
    changePositionName(value, index) {
      if (value) {
        this.positionOptionList[index].some((item) => {
          if (item.positionName === value) {
            this.tableData[index].positionCode = item.positionCode;
            return true;
          }
        });
      }
    },
    // 聚焦岗位名称时查询岗位列表
    focusPositionName(event, index) {
      this.remoteBlurryQueryPositionByName(" ", index);
    },
    // 过滤提交数据
    filteredTableData() {
      return this.tableData.reduce((acc, value) => {
        if (value.id) {
          const hasSameItem = this.originData.some((item) => {
            const { id, organizationFullName, positionName } = item;
            if (id === value.id) {
              if (
                organizationFullName === value.organizationFullName &&
                positionName === value.positionName
              ) {
                return true;
              }
            }
          });
          if (hasSameItem) {
            return acc.concat([]);
          } else {
            return acc.concat([{ ...value, editable: undefined }]);
          }
        } else {
          return acc.concat([{ ...value, editable: undefined }]);
        }
      }, []);
    },
    // 确认提交
    async handleConfirmSubmit() {
      if (this.isRemove) {
        // 删除岗位信息
        this.confirmSubmitLoading = true;
        const { code, msg } = await this.delPosition(this.isRemove);
        if (code === 200) {
          this.$message.success("删除岗位信息成功！");
          this.saveDialogVisible = false;
          this.confirmSubmitLoading = false;
          this.isRemove = null;
          this.handleClose();
        } else {
          msg && this.$message.error(msg);
          this.confirmSubmitLoading = false;
          throw new Error(msg);
        }
      } else {
        // 新增/更新岗位信息
        this.confirmSubmitLoading = true;
        const submitTableData = this.filteredTableData();
        const { code, msg } = await this.savePosition(submitTableData);
        if (code === 200) {
          this.$message.success(
            "审批已提交，审批进度可在【OA-流程中心】里查看。"
          );
          this.saveDialogVisible = false;
          this.confirmSubmitLoading = false;
          this.handleClose();
        } else {
          msg && this.$message.error(msg);
          this.confirmSubmitLoading = false;
          throw new Error(msg);
        }
      }
    },
    currentPageChange(pageIndex) {
      this.page.pageIndex = pageIndex;
      this.handleGetPositionList();
    },
    pageSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.handleGetPositionList();
    },
    // 初始化表格数据增加编辑态字段
    initTableData() {
      this.tableData = this.tableData.map((item) => {
        return { ...item, editable: false };
      });
    },
    async handleOpen() {
      await this.handleGetPositionList();
    },
    // 取消/关闭
    handleClose() {
      this.tableData = [];
      this.organizationList = [];
      this.positionOptionList = [];
      this.updateVis(false);
    },
    // 保存
    async handleOk() {
      if (this.tableData && this.tableData.length > 0) {
        const isEditing = this.tableData.some((item) => {
          if (item.editable) {
            this.$message.error("请确认岗位信息后再点击保存！");
          }
          return item.editable;
        });
        if (!isEditing) {
          const filteredTableData = this.filteredTableData();
          if (filteredTableData && filteredTableData.length > 0) {
            this.saveDialogVisible = true;
          } else {
            this.$message.warning("当前暂未编辑/添加岗位信息，无法保存！");
          }
        }
      } else {
        this.handleClose();
      }
    },
    // 添加岗位
    handleAddRowData() {
      this.tableData.unshift({
        editable: true,
        status: 1,
        positionCode: "",
        positionName: "",
        organizationFullPath: "",
        organizationFullName: "",
      });
      this.positionOptionList.unshift([]);
      this.page.rowTotal += 1;
    },
    // 编辑
    handleEditRowData(row, index) {
      row.editable = true;
      this.remoteBlurryQueryPositionByName(" ", index);
    },
    // 确认编辑行
    handleConfirmRowData(row) {
      const { organizationFullName, positionName } = row;
      if (organizationFullName && positionName) {
        row.editable = false;
      } else {
        this.$message.error("请填写完整岗位信息！");
      }
    },
    // 删除
    handleRemoveRowData(row, index) {
      if (row.id) {
        if (row.editable) {
          this.$message.error("请确认岗位信息后再点击删除！");
        } else {
          this.isRemove = row;
          this.saveDialogVisible = true;
        }
      } else {
        this.tableData.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.related-jobs-dialog {
  /deep/ .el-dialog__body {
    height: 320px;
  }
  .table-wrapper--has-data {
    .el-pagination {
      display: flex;
      justify-content: flex-end;
      border: 1px solid #e8ecef;
      border-bottom: none;
      font-size: 12px;

      /deep/ .el-select .el-input {
        width: 60px;
      }
      /deep/ .el-pagination__jump {
        margin-left: 0;
      }
      /deep/ .page-count {
        min-width: auto;
        font-weight: normal;
        color: #606266;
      }
    }
  }
  .table-wrapper--has-no-data {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      font-size: 16px;
      margin: 16px;
    }
    .el-button {
      margin: 48px;
    }
  }
}
</style>

