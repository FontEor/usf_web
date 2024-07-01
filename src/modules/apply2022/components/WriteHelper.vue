<template>
  <div class="apply-2022-write-help-c">
    <el-popover popper-class="apply-2022-write-help-popover" placement="left" width="257" trigger="click">
      <div class="apply-2022-write-help-content">
        <div>
          <a :href="detail.applyDoc" target="_blank">
            <p>申请手册</p>
            {{ detail.applyDoc }}
            <i class="el-icon-arrow-right"></i>
          </a>
        </div>
        <div>
          <p>申请答疑咚咚群</p>
          {{ detail.dongdongNo }}
        </div>
        <div>
          <p>紧急联系人</p>
          {{ detail.principalErpCode }}
        </div>
      </div>

      <el-button class="apply-2022-write-help-button" slot="reference">助手</el-button>
    </el-popover>
    <div class="apply-2022-write-help">
      <div class="apply-2022-write-help-cover"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import changeMixin from "../mixins/change";
import store from "../store/index.js";

export default {
  name: "ApplyWriteHelper",
  mixins: [changeMixin],
  data() {
    return {
      detail: {
        dongdongNo: undefined,
        applyDoc: undefined,
        principalErpCode: undefined
      }
    };
  },
  methods: {
    tenantIdChange() {
      if (!this.tenantId) {
        return
      }
      axios({
        method: "post",
        url: "/applyHelper/getApplyHelpInfo.do",
        data: {
          tenementCode: this.tenantId,
          applyType: store.state.applyType=="applyUser"?"0":"1",
        },
        params: {
          tenementCode: this.tenantId,
        },
      })
        .then((response) => {
          if (response.data.code === 200) {
            const data = response.data.data;
            store.commit('updataConfigInfo',response.data.data)
            this.detail = data || {};
          } else {
            this.$message.error('获取填写助手信息失败')
          }
        })
        .catch((reject) => {
          this.$message.error('获取填写助手信息失败')
        });
    },
  },
};
</script>

<style>

</style>
