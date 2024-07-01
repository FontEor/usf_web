<template>
  <div class="apply-2022-step-container">
    <el-button
      v-show="stepButtons.prev"
      type="default"
      size="large"
      @click="handleChangeStep(-1)"
      >上一步</el-button
    >
    <el-button
      v-show="stepButtons.next"
      type="primary"
      size="large"
      @click="handleChangeStep(1)"
      :disabled="disabledNext"
      >下一步</el-button
    >
    <el-button
      v-show="stepButtons.confirmClose"
      type="primary"
      size="large"
      @click="onConfirmClose"
      >确认关闭</el-button
    >
    <!-- 结果提交 相关按钮 开始-->
    <el-button
      v-show="stepButtons.confirm && formAssignType == 1"
      type="primary"
      size="large"
      :loading="submitLoading"
      @click="onCommitApply"
      >提交申请</el-button
    >
    <el-button
      v-show="stepButtons.confirm && formAssignType == 2"
      type="primary"
      size="large"
      :loading="submitLoading"
      @click="onCloseAuth"
      >确认关闭</el-button
    >
    <el-button
      v-show="stepButtons.confirm && formAssignType == 4"
      type="primary"
      size="large"
      :loading="submitLoading"
      @click="onCommitApply"
      >确认关闭</el-button
    >
    <!-- 结果提交 相关按钮 结束 -->
    <el-button
      v-show="stepButtons.goIndex"
      type="primary"
      size="large"
      @click="onReturnIndex"
      >返回首页</el-button
    >
    <el-button
      v-show="stepButtons.processCenter"
      type="default"
      size="large"
      @click="onGoProcessCenter"
      >去流程中心</el-button
    >
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import router from "../../../router";
import store from "../store/index.js";
import Bus from '../mixins/bus';

export default {
  name: "ApplyStep",
  computed: {
    stepButtons() {
      return store.state.stepState.buttons
    },
    disabledNext() {
      return store.state.stepState.disabledNext
    },
    submitLoading() {
      return store.state.stepState.submitLoading
    },
    formAssignType() {
      return store.state.form.assignType;
    },
  },
  methods: {
    ...mapMutations("apply2022", ["updateActiveApplyStep"]),
    handleChangeStep(step) {
      // 返回上一步 清除之前选择过的权限数据
      Bus.$emit('clearAllAuthData');
      store.commit("updateActiveApplyStep", { step });
    },
    // 确认关闭
    onConfirmClose() {
      window.close();
    },
    // 提交申请
    onCommitApply() {
      Bus.$emit('submitApply');
    },
    onCloseAuth() {
      this.$confirm(
          `<div class='apply-2022-confirm-content'>
            <p>
              <i class='el-icon-warning'></i>
              <span>确认要关闭全部权限么？<br/>审核成功后此账号下的权限将全部关闭？</span>
            </p>
          </div>`,
          "",
          {
              dangerouslyUseHTMLString: true
          }
      ).then(() => {
        Bus.$emit('submitApply', true);
      });
    },
    // 返回首页
    onReturnIndex() {
      // 需要刷新当前页面
      // location.reload();
      location.href = '/apply/new'
    },
    // 去流程中心
    onGoProcessCenter() {
      location.replace('http://oa.jd.com/wfp/new');
    },
  },
};
</script>

<style>
</style>
