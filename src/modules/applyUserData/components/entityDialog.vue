<template>
  <basic-dialog
    :visible="visible"
    :title="'添加用户'"
    :width="520"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :isShowFooterAll="false"
    class="changeHeight"
  >
    <el-form
      ref="form"
      size="small"
      label-position="right"
      label-width="128px"
      :model="dto"
      :rules="rules"
      node-key="id"
      @submit.native.prevent
      class="parent"
      :disabled="action=='view'"
    >
      <div class="entity-dlg__block-bd">
        <div class="top">
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item label="用户账号" prop="roleCode">
                <el-input :disabled="action=='edit'" v-model.trim="dto.roleCode" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div class="footer" v-if="action!='view'">
      <el-button @click="handleClose" size="small">取消</el-button>
      <el-button @click="handleOk" size="small " type="primary">确认</el-button>
    </div>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
import { mapState } from "vuex";
import ExactList from "@/mixins/exactList";
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      titleName: "",
      rules: {
        roleCode: [
          { required: true, message: "用户账号不能为空", trigger: "blur" },
          { pattern: CNST.REG_EXP.NORMAL, message: "用户账号不可输入特殊字符" },
          { max: 30, message: "用户账号长度不能超过30个字符" },
        ]
      },
      dto: {
        roleCode: undefined
      }
    };
  },
  props: {
    action: {
      type: String,
      default: "add"
    },
    state: {
      type: Object,
      default: {}
    },
    queryList: {
      type: Function,
      default: () => {}
    },
    roleListId: {
      type: Number,
      default: 0
    },
    changeids: {
      type: Function,
      default: () => {}
    }
  },
  computed: {},
  methods: {
    handleOk() {
      if (!this.$refs.form) {
        return;
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        } else {
          this.$emit("fund", this.dto.roleCode);
        }
      });
    }
  },
  watch: {
    visible(n, o) {
      if (!n) {
        this.dto.roleCode = undefined;
      }
    }
  }
};
</script>



<style  scoped>
.left {
  overflow: scroll;
  min-height: 50px;
  max-height: 400px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
