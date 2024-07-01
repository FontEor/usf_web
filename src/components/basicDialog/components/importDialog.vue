<template>
  <basic-dialog
    :visible="visible"
    :title="title"
    :width="500"
    :isShowFooterAll="false"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
  >
  <el-alert
    v-if="!uploadData.enabled"
    class="mb10"
    title="为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）"
    type="error"
    :closable="false"
    show-icon>
  </el-alert>
    <template v-if="showInit">
      <div class="uploadBox">
        <div class="upload-before__disc">
          下载导入模板Excel文件，填写Excel中的字段，保存后上传Excel文件。<span
            style="color: red"
            >{{ importMsg }}</span
          >
        </div>
        <!--<el-button size="mini" type="success" @click="submitUpload">上传</el-button>-->
        <el-button class="loadBtn" size="mini" type="primary" @click="submitDown"
          >下载导入模板</el-button
        >
        <FakeUpload v-if="!uploadData.enabled" />
        <el-upload
          v-else
          ref="upload"
          class="upload"
          :name="uploadData.name"
          drag
          :headers="{ traceId: Date.now() }"
          :action="`${VUE_APP_API_PREFIX}${this.uploadData.uploadUrl}?tenementCode=${$store.state.app.tenementCode}`"
          :auto-upload="true"
          :on-success="handleSuccess"
          :on-progress="handleProgress"
          :on-error="handleError"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
      </div>
    </template>
    <template v-if="showPending">
      <div class="uploadBox">
        <div class="upload-pending">
          <span class="upload-peding__loading-bg"><i class="el-icon-loading"></i></span>
        </div>
        <p class="upload-pending__disc">正在处理中...</p>
      </div>
    </template>
    <template v-if="showEnd">
      <div class="uploadBox">
        <div class="upload-result__img-cont"><i class="file"></i></div>
        <p class="upload-result__disc">
          导入完成，<i class="upload-result__disc-success">{{
            importResult.successCounts
          }}</i
          >条数据导入成功，<i class="upload-result__disc-fail">{{
            importResult.failureCounts
          }}</i
          >条数据导入失败
        </p>
        <el-button class="loadBtn" size="mini" type="primary" @click="downImportResult"
          >下载导入结果</el-button
        >
      </div>
    </template>
    <template v-if="showEndError">
      <div class="uploadBox">
        <div class="upload-result__img-cont"><i class="file"></i></div>
        <p class="upload-result__disc">{{ updateResultMag }}</p>
      </div>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";
import FakeUpload from "@/components/fakeUpload"
const VUE_APP_API_PREFIX = process.env.VUE_APP_API_PREFIX;
import fs from "fs";
export default {
  mixins: [EntityDialog],
  components: {
    FakeUpload
  },
  props: {
    winClose: {
      type: Function,
      default() {
        return () => {};
      },
    },
    uploadData: {
      type: Object,
      default: () => {},
    },
  },
  beforeCreate() {
    // 设置上传的三种状态 INIT, PENDING, END
    this.uploadStatusMap = { 1: "INIT", 2: "PENDING", 3: "END", 4: "ERROR" };
  },
  data() {
    return {
      VUE_APP_API_PREFIX: VUE_APP_API_PREFIX,
      uploadHeaders: { responseType: "blod" },
      uploadStatus: this.uploadStatusMap[1],
      importResult: this.getDefaultImportResult(),
      updateResultMag: "",
    };
  },
  computed: {
    showInit() {
      return this.uploadStatus === this.uploadStatusMap[1];
    },
    showPending() {
      return this.uploadStatus === this.uploadStatusMap[2];
    },
    showEnd() {
      return this.uploadStatus === this.uploadStatusMap[3];
    },
    showEndError() {
      return this.uploadStatus === this.uploadStatusMap[4];
    },
  },
  methods: {
    // submitUpload() {
    //     this.$refs.upload.submit();
    // },
    submitDown() {
      const _origin = window.location.origin;
      let _form = document.createElement("form");
      _form.action = `${_origin}${this.VUE_APP_API_PREFIX}/common/downloadTemplate.do?tenementCode=${this.$store.state.app.tenementCode}&templateType=${this.uploadData.templateType}`;
      _form.method = "post";
      document.body.appendChild(_form);
      _form.submit();
      _form.remove();
    },
    // 确定按钮
    handleOk() {
      let params = this.toEnd();
      this.handleSave({ params });
    },
    // 关闭和取消按钮
    handleClose(ev) {
      this.winClose(ev);
      this.updateUploadStatus(1);
      this.updateResultMag = "";
    },
    // 上传时
    handleProgress() {
      this.updateUploadStatus(2);
    },
    // 上传成功
    handleSuccess(response) {
      Object.assign(this.importResult, response);
      if (response.resultCode === 1) {
        this.updateUploadStatus(3);
      } else {
        this.updateUploadStatus(4);
        this.updateResultMag = response.resultMsg;
      }
    },
    // 上传出错
    handleError(error) {
      this.updateUploadStatus(1, this.getDefaultImportResult);
      this.$message.error("上传失败");
    },
    // 下载导入结果
    downImportResult() {
      window.open(this.importResult.downloadUrl);
      this.updateUploadStatus(1);
    },
    /**
     * 更新上传状态
     * @param {number} code - 设置上传状态
     * @param {function} [done] - do something
     */
    updateUploadStatus(code, done) {
      this.uploadStatus = this.uploadStatusMap[code];
      done && done();
    },
    getDefaultImportResult() {
      const info = {
        fileName: null,
        resultCode: null,
        successCounts: null,
        downloadUrl: null,
        failureCounts: null,
      };
      return info;
    },
  },
};
</script>

<style lang="scss" scope>
$upload-box-height: 300px;
.uploadBox {
  text-align: center;
  padding: 30px;
  height: $upload-box-height;
}
.uploadBox .upload-before__disc {
  text-align: left;
}
.uploadBox .loadBtn {
  margin: 20px auto;
}
.uploadBox .upload .el-upload-list {
  text-align: left;
}
.upload-pending {
  margin-top: 100px;
  .upload-peding__loading-bg {
    display: inline-block;
    background-color: #000;
    /deep/ .el-icon-loading {
      font-size: 28px;
      font-weight: bold;
      color: #e0e0e0;
    }
  }
}
.upload-pending__disc,
.upload-result__disc {
  margin: 10px 0;
}
.upload-result__img-cont {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.upload-result__disc-success,
.upload-result__disc-fail {
  font-style: normal;
}
.upload-result__disc-success {
  color: #63bc6f;
}
.upload-result__disc-fail {
  color: #f56c6c;
}
.file {
  display: inline-block;
  height: 67px;
  width: 67px;
  background-image: url("../../../imgs/file.png");
  background-size: cover;
}
</style>
