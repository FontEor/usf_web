<template>
  <div class="p-basic">
    <exact-search ref="exactSearch" :state="state" />
    <exact-list
      ref="exactList"
      :state="state"
      :table-h="tableH1"
      :handle-add="handleAdd"
      :handle-edit="handleEdit"
      :handle-delete="handleDelete"
      :export-org="exportOrg"
      :export-resource-user="exportResourceUser"
    />
    <entity-dialog
      :state="state"
      :module-name="moduleName"
      :visible="entityDlgVis"
      :action="entityDlgActn"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
      :selectValue1="selectValue1"
      :cascaderValue1="cascaderValue1"
    />
  </div>
</template>

<script>
import axios from "axios";
import PageList from "@/mixins/pageList";
import store from "./store";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import { mapState } from "vuex";

export default {
  name: "dataResource",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
  },
  data() {
    return {
      // store唯一标识
      storeKey: "dataResource",
      // 模块名称
      moduleName: "数据资源",
      selectValue1: "",
      cascaderValue1: "",
    };
  },
  computed: {
    ...mapState('app', ['tenementInfoObj']),
    ...mapState('dataResource', {
      queryTypeId: 'typeId'
    })
  },
  created() {
    this.registStore(store);
    this.queryListDataType();
  },
  methods: {
    addChange() {
      this.selectValue1 = "";
      this.cascaderValue1 = [];
    },
    editChange(id) {
      axios({
        method: "post",
        url: `/data/get?tenementCode=${this.$store.state.app.tenementInfoObj.tenementCode}`,
        data: {
          data: {
            id: id,
          },
        },
      })
        .then((resolve) => {
          this.selectValue1 = resolve.data.data.orgName;
          this.cascaderValue1 = resolve.data.data.belongOrgId.reverse();
        })
        .catch((reject) => {
          console.log("getExtByTenementCodeData 请求失败", reject);
        });
    },
    queryListDataType(payload) {
      return this.dispatch("queryListDataType", payload);
    },
    changeType(payload) {
      return this.dispatch("changeType", payload);
    },
    queryOrgTreeList(payload) {
      return this.dispatch("queryOrgTreeList", payload);
    },
    queryOrgIdTreeList(payload, id) {
      return this.dispatch("queryOrgIdTreeList", payload, id);
    },
    exportOrg() {
      if (!this.showExportButton) {
        return this.$message({
          type: 'error',
          message: "为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）",
          showClose: true,
        })
      }
      //获取查询参数
      let param = this.$refs.exactSearch.queryParam();

      const _origin = window.location.origin;
      let url = `${_origin}${process.env.VUE_APP_API_PREFIX}/data/exportDataResource`;
      const tenementCode = this.$store.state.app.tenementInfoObj.tenementCode;
      axios
        .request({
          url,
          method: "post",
          responseType: "blob",
          params: { tenementCode },
          data: { data: param },
        })
        .then((resolve) => {
          const blob = resolve.data;
          const href = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          const filename = resolve.headers["content-disposition"];
          const filenameString = "filename=";
          const index = filename.indexOf(filenameString);
          if ("download" in anchor) {
            if (index !== -1) {
              anchor.download = filename.slice(index + filenameString.length);
            }
            anchor.href = href;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
          }
        })
        .catch((reject) => {
          this.$message({
            message: "导出请求异常,请联系USF运营人员(85257039)",
            type: "error",
            center: true,
          });
          console.log("导出按钮请求失败", reject);
        });
    },
    exportResourceUser(rows) {
      if (!this.showExportButton) {
        return this.$message({
          type: "error",
          message:
            "为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）",
          showClose: true,
        });
      }
      const loading = this.$loading({
        lock: true,
        text: '导出中, 请稍后....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const ids = rows.map(row => row.id);
      axios({
        method: 'post',
        url: `/export/exportUserDataResourceByData.do?tenementCode=${this.tenementInfoObj.tenementCode}`,
        data: {
          data: {
            typeId: this.queryTypeId,
            tenementCode: this.tenementInfoObj.tenementCode,
            dataIds: ids.join(',')
          }
        }
      }).then(response => {
        loading.close();
        if (response.data.resultCode === 1) {
          this.$message({
            message: '导出结果将于24小时内通过咚咚/邮件下发，请注意查收。',
            type: "success",
          });
        } else {
          this.$message({
            message: response.data.resultMsg,
            type: "error",
          });
        }
      }).catch((err) => {
        console.log('/export/exportUserDataResourceByData.do', err);
        loading.close();
        this.$message({
          message: "导出请求异常,请联系USF运营人员(85257039)",
          type: "error",
          center: true,
        });
      })
    },
  },
};
</script>
