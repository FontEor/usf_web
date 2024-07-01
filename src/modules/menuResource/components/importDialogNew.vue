<template>
  <basic-dialog
    :title="title"
    :visible="visible"
    :width="600"
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
    <template v-if="showLittleMould">
      <el-steps :active="active">
        <el-step title="下载导入模板"></el-step>
        <el-step title="上传模板"></el-step>
        <el-step title="导入完成"></el-step>
      </el-steps>
      <div class="showLittleMould">
        <div class="title">
          下载导入模板Excel文件，填写Excel中的字段，保存后上传Excel文件。
        </div>
        <div class="explain">
          模板填写事项：<br />
          1.请按照字段格式要求填写，注意是否必填项；<br />
          2.字段内容前后不支持：空格、占位符，如包含则文件上传后系统自动过滤；<br />
          3.若是从其他Excel文件中复制的数据，注意是否将空行一起复制，若存在空行则需要删除，以免导入文件过大上传超时。
        </div>
        <el-row>
          <el-col :span="10"> </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-button class="leftButton" size="mini" type="primary" @click="submitDown"
              >下载导入模板
            </el-button>
          </el-col>
          <el-col v-if="uploadData.enabled" :span="4">
            <el-button class="rightButton" size="mini" @click="linkToLittleInit"
              >我已填好，下一步
            </el-button>
          </el-col>
        </el-row>
      </div>
    </template>
    <template v-if="showLittleInit">
      <el-steps :active="active">
        <el-step title="下载导入模板"></el-step>
        <el-step title="上传模板"></el-step>
        <el-step title="导入完成"></el-step>
      </el-steps>
      <div class="showLittleInit">
        <!--                upload组件样式长宽需调整-->
        <el-upload
          ref="upload"
          class="upload"
          :name="uploadData.name"
          drag
          :headers="{ traceId: Date.now() }"
          :action="`${VUE_APP_API_PREFIX}${this.uploadData.uploadUrl}?tenementCode=${$store.state.app.tenementCode}&appCode=${this.uploadData.appCode}&isBigFile=0`"
          :auto-upload="true"
          :before-upload="beforeAvatarUpload"
          :on-success="handleSuccess"
          :on-progress="handleProgress"
          :on-error="handleError"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="main">
          <!-- 注：单次导入最多不超过1万条数，超出请分批次上传或选择大批量导入 -->
        </div>
        <el-button class="backButton" size="mini" @click="linkToLittle">上一步</el-button>
      </div>
    </template>
    <!--        showLittlePending有一个进度条，1min到99，成功之后跳转页面-->
    <template v-if="showMuchPending">
      <el-steps :active="active2">
        <el-step title="下载导入模板"></el-step>
        <el-step title="上传模板"></el-step>
        <el-step title="等待导入结果"></el-step>
      </el-steps>
      <div class="bigEnd">
        <p class="word">
          文件正在导入中，当前导入条数过多，您可以离开界面去处理其他任务，<br />导入完成后结果将通过咚咚/邮件下发，请注意查收。
        </p>
        <el-button class="closeBtn" size="mini" type="primary" @click="handleClose"
          >关闭</el-button
        >
      </div>
    </template>
    <template v-if="showLittlePending">
      <el-steps :active="active">
        <el-step title="下载导入模板"></el-step>
        <el-step title="上传模板"></el-step>
        <el-step title="导入完成"></el-step>
      </el-steps>
      <div class="showLittlePending">
        <div class="main">正在解析文件，请稍等......</div>
        <div style="margin-top: 20px">
          <el-progress :percentage="percentage"></el-progress>
        </div>
      </div>
    </template>
    <template v-if="showLittleEnd">
      <el-steps :active="active">
        <el-step title="下载导入模板"></el-step>
        <el-step title="上传模板"></el-step>
        <el-step title="导入完成"></el-step>
      </el-steps>
      <div class="end">
        <p class="word">
          导入完成，<i class="upload-result__disc-success">{{
            importResult.successCounts
          }}</i
          >条数据导入成功，<i class="upload-result__disc-fail">{{
            importResult.failureCounts
          }}</i
          >条数据导入失败
        </p>
        <div v-if="importResult.downloadUrl === null">
          <el-button class="loadBtn" size="mini" type="primary" @click="handleClose"
            >关闭</el-button
          >
        </div>
        <div v-if="importResult.downloadUrl !== null">
          <el-button class="loadBtn" size="mini" type="primary" @click="downImportResult"
            >下载导入结果</el-button
          >
        </div>
      </div>
    </template>
    <template v-if="showLittleEndError">
      <el-steps :active="active">
        <el-step title="下载导入模板"></el-step>
        <el-step title="上传模板"></el-step>
        <el-step title="导入完成"></el-step>
      </el-steps>
      <div class="error">
        <p class="word">
          <i class="el-icon-warning-outline" style="color: #ffb600"></i
          >{{ updateResultMag }}
        </p>
        <el-button class="loadBtn" size="mini" type="primary" @click="linkToLittleInit"
          >重新上传</el-button
        >
      </div>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";

const VUE_APP_API_PREFIX = process.env.VUE_APP_API_PREFIX;

export default {
  mixins: [EntityDialog],
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
    this.uploadStatusMap = {
      1: "START",
      2: "LittleMould",
      3: "LittleInit",
      4: "LittlePending",
      5: "LittleEnd",
      6: "LittleEndError",
      7: "MuchMould",
      8: "MuchMInit",
      9: "MuchMPending",
      10: "MuchMEnd",
      11: "MuchMEndError",
      12: "LittleToMuch",
    };
  },
  data() {
    return {
      VUE_APP_API_PREFIX: VUE_APP_API_PREFIX,
      uploadHeaders: { responseType: "blod" },
      uploadStatus: this.uploadStatusMap[2],
      importResult: this.getDefaultImportResult(),
      updateResultMag: "",
      active: 0,
      active2: 0,
      percentage: 0,
    };
  },
  computed: {
    showStart() {
      return this.uploadStatus === this.uploadStatusMap[1];
    },
    showLittleMould() {
      return this.uploadStatus === this.uploadStatusMap[2];
    },
    showLittleInit() {
      return this.uploadStatus === this.uploadStatusMap[3];
    },
    showLittleEnd() {
      return this.uploadStatus === this.uploadStatusMap[4];
    },
    showLittlePending() {
      return this.uploadStatus === this.uploadStatusMap[5];
    },
    showLittleEndError() {
      return this.uploadStatus === this.uploadStatusMap[6];
    },
    showMuchMould() {
      return this.uploadStatus === this.uploadStatusMap[7];
    },
    showMuchInit() {
      return this.uploadStatus === this.uploadStatusMap[8];
    },
    showMuchPending() {
      return this.uploadStatus === this.uploadStatusMap[9];
    },
    showMuchEnd() {
      return this.uploadStatus === this.uploadStatusMap[10];
    },

    showMuchEndError() {
      return this.uploadStatus === this.uploadStatusMap[11];
    },
    showLittleToMuch() {
      return this.uploadStatus === this.uploadStatusMap[12];
    },
  },
  methods: {
    // submitUpload() {
    //     this.$refs.upload.submit();
    // },
    linkToLittle() {
      this.updateUploadStatus(2);
      this.active = 1;
    },
    linkToMuch() {
      this.updateUploadStatus(7);
      this.active2 = 1;
    },
    littleToMuch() {
      this.updateUploadStatus(8);
      this.active2 = 2;
    },
    linkToLittleInit() {
      this.active = 1;
      this.updateUploadStatus(3);
    },
    linkToMuchInit() {
      this.active2 = 2;
      this.updateUploadStatus(8);
    },
    backToMenu() {
      this.active = 0;
      this.active2 = 0;
      this.updateUploadStatus(1);
    },
    submitDown() {
      const _origin = window.location.origin;
      let _form = document.createElement("form");
      _form.action = `${_origin}${this.VUE_APP_API_PREFIX}/common/downloadMenuResourceTemplate.do?tenementCode=${this.$store.state.app.tenementCode}&appCode=${this.uploadData.appCode}&templateType=${this.uploadData.templateType}`;
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
      this.updateUploadStatus(2);
      (this.importResult = this.getDefaultImportResult()), (this.updateResultMag = "");
      this.active = 0;
      this.active2 = 0;
      this.percentage = 0;
    },
    beforeAvatarUpload(file) {
      this.percentage = 0;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      // 前端关闭文件大小限制 使用后台大小限制
      // const isLt20M = file.size / 1024 / 1024 < 10;
      // const isLt15M = file.size / 1024 / 1024 < 1;
      if (!extension && !extension2) {
        this.updateUploadStatus(6);
        this.updateResultMag = "当前上传文件格式不支持，请按照导入模板上传";
        return false;
      }
      // if (!isLt15M) {
      //     if (!isLt20M) {
      //         this.updateUploadStatus(6)
      //         this.updateResultMag = "上传文件大小超过20M，请检查文件后重新上传"
      //         return false;
      //     } else {
      //         this.updateUploadStatus(12)
      //         this.updateResultMag = "当前文件上传超过1万条，请选择【大批量导入】方式上传"
      //         return false;
      //     }
      // }

      // if (!isLt20M) {
      //   this.updateUploadStatus(6);
      //   this.updateResultMag = "上传文件大小超过10M，请检查文件后重新上传";
      //   return false;
      // }

      return (extension || extension2); //  && isLt20M
    },

    // 上传时
    handleProgress() {
      this.updateUploadStatus(5);

      let timer = setInterval(() => {
        if (this.percentage < 90) {
          this.percentage += 30;
        } else if (this.percentage < 99) {
          this.percentage += 1;
        } else {
          clearImmediate(timer);
        }
      }, 900);
    },
    // 上传成功
    handleSuccess(response) {
      this.percentage = 100;
      Object.assign(this.importResult, response);
      if (response.resultCode === 1) {
        this.updateUploadStatus(4);
        this.active = 2;
      } else if (response.resultCode === 0) {
        this.updateUploadStatus(6);
        this.updateResultMag = response.resultMsg;
      } else if (response.resultCode === 2) {
        this.updateUploadStatus(9);
        this.active2 = 2;
      } else if (response.resultCode === 3) {
        this.updateUploadStatus(6);
        this.updateResultMag = response.resultMsg;
      } else {
        this.updateUploadStatus(6);
        this.updateResultMag = "解析文件失败";
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
    },
    handleSuccessMuch(response) {},
    handleProgressMuch() {
      this.updateUploadStatus(9);
      this.active2 = 3;
    },
    handleErrorMuch(error) {
      // this.updateUploadStatus(1, this.getDefaultImportResult)
      // this.$message.error('上传失败')
    },
    beforeAvatarUploadMuch(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      // const isLt20M = file.size / 1024 / 1024 < 20;

      if (!extension && !extension2) {
        this.updateUploadStatus(11);
        this.updateResultMag = "当前上传文件格式不支持，请按照导入模板上传";
        return false;
      }

      // if (!isLt20M) {
      //   this.updateUploadStatus(11);
      //   this.updateResultMag = "上传文件大小超过20M，请检查文件后重新上传";
      //   return false;
      // }
      return (extension || extension2);//  && isLt20M
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

<style lang="scss" scoped>
$upload-box-height: 300px;

::v-deep .el-upload-dragger {
  width: 535px;
}

/*::v-deep .el-dialog__header{*/
/*     background:  #FFFFFF*/
/* }*/

.bigEnd {
  text-align: center;
  padding-bottom: 30px;
  padding-right: 30px;
  padding-top: 30px;
  height: 243px;

  .word {
    margin-top: 80px;
    text-align: center;
  }
  .closeBtn {
    margin-top: 20px;
  }
}

.end {
  text-align: center;
  padding-bottom: 30px;
  padding-right: 30px;
  padding-top: 30px;
  height: 243px;

  .word {
    margin-top: 80px;
    text-align: center;
  }

  .loadBtn {
    margin-top: 20px;
  }
}

.error {
  text-align: center;
  padding-bottom: 30px;
  padding-right: 30px;
  padding-top: 30px;
  height: 243px;

  .word {
    margin-top: 80px;
    text-align: center;
  }

  .loadBtn {
    margin-top: 20px;
  }
}

.showStart {
  text-align: center;
  padding: 30px;
  height: 243px;

  .showStart__title {
    text-align: left;
    font-size: 16px;
  }

  .showStart__main {
    font-size: 14px;
  }

  .leftButton {
    margin-top: 40px;
    width: 100px;
    height: 40px;
  }

  .rightButton {
    margin-top: 20px;
    width: 100px;
    height: 40px;
  }

  .leftBox {
    margin-top: 15px;
    width: 220px;
    text-align: center;
    height: 200px;
    border: 3px solid #f7f8f9;
  }

  .rightBox {
    margin-top: 15px;
    margin-right: 48px;
    width: 220px;
    text-align: center;
    height: 200px;
    border: 3px solid #f7f8f9;
  }

  .boxTitle {
    margin-top: 30px;
    font-weight: bold;
    font-size: 20px;
  }

  .boxMain {
    margin-top: 30px;
    font-size: 14px;
  }
}

.showLittleMould {
  text-align: left;
  padding-bottom: 30px;
  padding-right: 30px;
  padding-top: 30px;
  height: 243px;

  .title {
    font-weight: 500;
    font-size: 16px;
  }

  .explain {
    margin-top: 24px;
    width: 520px;
    font-size: 14px;
    color: #666666;
    padding-top: 20px;
    height: 110px;
    padding-left: 16px;
    border: 1px dashed rgba(0, 145, 255, 0.3);
    background-color: rgba(0, 145, 255, 0.005);
  }

  .middleButton {
    margin-top: 24px;
  }

  .leftButton {
    margin-top: 15px;
  }

  .rightButton {
    margin-top: 50px;
    margin-left: 25px;
  }
}

.showLittleInit {
  text-align: left;
  padding-bottom: 30px;
  padding-right: 30px;
  padding-top: 30px;
  height: 243px;

  .main {
    font-size: 14px;
  }

  .backButton {
    margin-top: 40px;
  }

  .leftButton {
    margin-top: 40px;
    width: 100px;
    height: 40px;
  }
}

.showLittlePending {
  text-align: center;
  padding: 30px;
  height: 243px;

  .main {
    margin-top: 50px;
    text-align: center;
  }
}

.showLittleEnd {
  text-align: center;
  padding: 30px;
  height: 243px;

  .word {
    margin-top: 80px;
    text-align: center;
  }

  .loadBtn {
    margin-top: 20px;
    text-align: center;
  }
}

.uploadBox {
  text-align: center;
  padding: 30px;
  height: 243px;
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
