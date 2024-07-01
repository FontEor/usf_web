// 异步导出Mixins 
import axios from "axios";
import ExportProgress from "@/components/exportProgress";
import ExportDialog from "@/components/exportProgress/ResultDialog.vue";

export default {
  components: {
    ExportProgress,
    ExportDialog
  },
  data() {
    return {
      //进度条状态
      exportProgressStatus: null,
      //进度条百分比
      exportProgressPercentage: 0,
      exportProgressShow: false,
      // 
      exportResultShow: false,
      exportResultContent: "",
      exportResultTitle: ""
    }
  },
  methods: {
    exportRequestFun(options) {
      this.exportProgressShow = true;
      axios(options).then((res) => {
        if(res && res.data && res.data.resultCode == 2) {
          this.onExportSuccessFunc();
        } else {
          this.onExportFailFunc();
        }
      }).catch((error) => {
        this.onExportFailFunc();
      })
    },
    onCloseExportResultDialog() {
      this.exportResultShow = false;
    },
    onExportSuccessFunc() {
      this.exportProgressShow = false;
      this.exportResultShow = true;
      this.exportResultTitle = "导出成功";
      this.exportResultContent = "导出结果将于24小时内通过咚咚/邮件下发，请注意查收。";
    },
    onExportFailFunc() {
      this.exportProgressShow = false;
      this.exportResultShow = true;
      this.exportResultTitle = "导出失败";
      this.exportResultContent =
        "导出失败！请重新导出，若仍无结果，请联系USF小妹（org.missusf)";
    }
  },
}

