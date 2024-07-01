<template>
  <basic-dialog
    :visible="visible"
    :width="480"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-ok="handleOk"
    :okText="'确认'"
    :handle-open="handleOpen"
    title="开通自动分配权限"
    class="auto-assign-dialog"
  >
    <el-form
      ref="autoAssignFormData"
      :model="autoAssignFormData"
      :rules="autoAssignFormRules"
      label-width="140px"
      size="small"
    >
      <el-form-item prop="positionAutoSwitch">
        <template slot="label">
          <span>开启自动分配权限</span>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <p slot="content" style="width: 320px">
              开启后，可在机构、用户组配置人资岗位关系，新员工入职即可根据配置的岗位映射关系自动分配机构、用户组对应权限。
            </p>
            <i class="el-icon-info" style="color: #909399"></i>
          </el-tooltip>
        </template>
        <el-switch v-model="autoAssignFormData.positionAutoSwitch"></el-switch>
      </el-form-item>
      <el-form-item
        v-show="autoAssignFormData.positionAutoSwitch"
        prop="flowId"
      >
        <template slot="label">
          <span>岗位关系审批流ID</span>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <p slot="content" style="width: 320px">
              给机构、用户组配置岗位关系时需要管理员审批，审批通过后方可自动授权。审批流ID在审批平台配置审批流后即可获取。<el-link
                type="primary"
                underline
                href="//lcp.jdl.com/#/docSoftwareSystem/19/560"
                target="_blank"
                >查看操作说明</el-link
              >
            </p>
            <i class="el-icon-info" style="color: #909399"></i>
          </el-tooltip>
        </template>
        <el-input
          v-model.number="autoAssignFormData.flowId"
          style="width: 80%"
        ></el-input>
      </el-form-item>
    </el-form>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
export default {
  name: "AutoAssignDialog",
  mixins: [EntityDialog],
  props: {
    rows: {
      type: Array,
    },
  },
  data() {
    return {
      autoAssignFormData: {
        positionAutoSwitch: false,
        flowId: null,
      },
      autoAssignFormRules: {
        flowId: [
          { required: true, message: "请输入岗位关系审批流ID" },
          { type: "number", message: "请输入正确格式的岗位关系审批流ID" },
        ],
      },
    };
  },
  methods: {
    async getPositionAutoAssignInfo() {
      const tenementCode = this.rows[0].tenementCode;
      const { code, data, msg } = await api.tenement.getPositionAutoAssignInfo({
        data: { tenementCode },
      });
      if (code === 200) {
        const { positionAutoSwitch, flowId } = data;
        this.autoAssignFormData.positionAutoSwitch = positionAutoSwitch;
        this.autoAssignFormData.flowId = flowId || null;
      } else {
        msg && this.$message.error(msg);
        throw new Error(msg);
      }
    },
    async editPositionAutoAssignInfo() {
      const positionAutoSwitch = this.autoAssignFormData.positionAutoSwitch;
      const flowId = positionAutoSwitch ? this.autoAssignFormData.flowId : null;
      const tenementCode = this.rows[0].tenementCode;
      const { code, msg } = await api.tenement.editPositionAutoAssignInfo({
        data: { positionAutoSwitch, flowId, tenementCode },
      });
      if (code === 200) {
        msg && this.$message.success(msg);
      } else {
        msg && this.$message.error(msg);
        throw new Error(msg);
      }
    },

    async handleOpen() {
      await this.getPositionAutoAssignInfo();
    },
    handleClose() {
      this.$refs.autoAssignFormData.resetFields();
      this.updateVis(false);
    },
    async handleOk() {
      const { positionAutoSwitch } = this.autoAssignFormData;
      if (positionAutoSwitch) {
        this.$refs.autoAssignFormData.validate(async (valid) => {
          if (valid) {
            await this.editPositionAutoAssignInfo();
            this.handleClose();
          } else {
            return false;
          }
        });
      } else {
        await this.editPositionAutoAssignInfo();
        this.handleClose();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.auto-assign-dialog {
  /deep/ .el-dialog__body {
    height: 100px;
    overflow: visible;
  }
}
</style>

