<template>
  <basic-dialog
    :visible="visible"
    :width="600"
    :title="title"
    :show-close="false"
    :isShowFooterAll="false"
    class="export-dialog"
  >
    <div class="content-wrapper">
      <p>正在导出，请稍后……</p>
      <div class="progress">
        <el-progress
          :percentage="percentage"
          :status="progressStatus"
        ></el-progress>
      </div>
    </div>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
export default {
  name: "ExportProgress",
  mixins: [EntityDialog],
  props: {
    progressStatus: {
      type: String,
      default: null,
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      percentage: 0,
    };
  },
  methods: {
    pending() {
      setTimeout(() => {
        if (this.percentage < 90) {
          this.percentage += 2;
          this.pending();
        }
      }, 500);
    },
  },
  watch: {
    progressStatus(val) {
      console.log(val);
    },
    progressPercentage(val) {
      this.percentage = val;
    },
    visible(val) {
      if (val) {
        this.pending();
      }
    },
    immediate: true,
  },
};
</script>
<style lang="scss" scoped>
.export-dialog {
  /deep/ .el-dialog__body {
    height: 100px;
    overflow: visible;
  }
}
.content-wrapper {
  text-align: center;
  .progress {
    margin: 30px;
  }
}
</style>

