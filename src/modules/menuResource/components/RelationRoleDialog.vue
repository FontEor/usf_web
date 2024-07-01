<template>
  <el-dialog
    class="basic-dialog relation-menu-role-dialog"
    title="增加关联菜单角色"
    :visible="visible"
    width="800px"
    :before-close="onClose"
  >
    <el-form class="search-form" size="small" label-width="80px" :model="query" @submit.native.prevent>
      <div class="col-l">
        <el-row>
          <!-- <el-col :span="6">
            <el-form-item label="软件系统">
              <el-select v-model="query.appCode" @change="handleAppCodeChange">
                <el-option
                  :key="item.appCode"
                  :label="item.appName + '(' + item.appCode + ')'"
                  v-for="item in appList"
                  :value="item.appCode"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="角色名称">
              <el-input v-model.trim="query.roleNameLike" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="角色编码">
              <el-input v-model.trim="query.roleCode" clearable />
            </el-form-item>
          </el-col> -->
          <div class="col-r" style="float: right">
            <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </div>
        </el-row>
      </div>
    </el-form>
    <vxe-table
      class="disabled-checked"
      size="mini"
      ref="uTable"
      :height="350"
      stripe
      resizable
      row-id="id"
      :data="tableData"
      :loading="loading"

      :column-config="{resizable: true}"
      :row-config="{ isHover: true, keyField: 'id' }"
      :sort-config="{ trigger: 'cell' }"
      :checkbox-config="{
        labelField: '',
        reserve: true,
        checkMethod: onCheckMethod,
        trigger: 'row',
      }"
      :edit-config="{ enabled: false }"
      :scroll-y="{ gt: 100, enabled: true, mode: 'wheel', oSize: 0 }"

    >
      <vxe-column
        type="checkbox"
        field="orgName"
        width="50px"
      ></vxe-column>
      <vxe-column field="roleName" title="角色名称"></vxe-column>
      <vxe-column field="roleCode" title="角色编码"></vxe-column>
      <vxe-column field="sensitiveMark" title="是否敏感">
        <template slot-scope="scope">{{ scope.row.sensitiveMark == 0 ? '否' : '是' }}</template>
      </vxe-column>
      <vxe-column field="rootOrgName" title="所属机构名称"></vxe-column>
    </vxe-table>
    <el-pagination
      background
      style="text-align: right;margin-top: 10px;"
      @size-change="handlePageSizeChange"
      @current-change="handlePageIndexChange"
      :current-page="page.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="onConfirm" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import lodash from "lodash";
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import 'xe-utils'
Vue.use(VXETable);

export default {
  name: "RelationRoleDialog",
  components: {},
  computed: {
    ...mapState("app", [
      "tenementCode",
    ])
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      query: {
        appCode: "",
        roleNameLike: "",
        roleCode: "",
      },
      page: {
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      appList: [],
      tableData: [],
      loading: false,
      checkedList: []
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(n) {
        if(n) {
          this.getRoleList()
        }
      }
    },
  },
  mounted() {
    // this.getAppList();
  },
  methods: {
    async onConfirm() {
      // 获取全部状态
      const reserveRows = this.$refs.uTable.getCheckboxReserveRecords(true);
      const rows = this.$refs.uTable.getCheckboxRecords(true);
      const chooses = [...reserveRows, ...rows];
      if(!chooses.length) {
        return this.$message.error('请至少选择一个菜单资源');
      }
      // const names = chooses.map(item => item.roleName);
      if(reserveRows.length) {
        await this.$confirm(`本次新增关联菜单角色${chooses.length}个`, "确认关联", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
      }
      api.menuResource.relationMenuRole({
          data:{
            tenementCode: this.tenementCode,
            roleIds: chooses.map(row => row.id),
            id: this.data.id,
          }
        }).then(response => {
          if(response.code === 200) {
            this.appList = response.data;
            // this.query.appCode = lodash.get(response, 'data[0].appCode')
            this.$message.success('关联菜单角色成功')
            this.onClose();
          } else {
            this.$message.error(response.msg || '关联菜单角色失败')
          }
        })
    },
    getAppList() {
      api.menuPermissions.queryAppList({
        tenementCode: this.tenementCode
      }).then(response => {
        if(response.code === 200) {
          this.appList = response.data;
          this.query.appCode = lodash.get(response, 'data[0].appCode')
          this.handleReset();
        } else {
          this.$message.error(response.msg || '应用列表获取失败 ')
        }
      })
    },
    getRoleList() {
      // if(!this.query.appCode) {
      //   this.getAppList();
      // }
      api.rolePermissions.listForResourceOne({
        data: {
          id: this.data.id,
          ...this.query,
        },
        page: this.page
      }).then(response => {
        if(response.code === 200) {
          this.tableData = lodash.get(response, 'data.rows', []);
          this.total = response.data.rowTotal;
          this.checkedRows();
        } else {
          this.$message.error(response.msg || '角色列表获取失败 ')
        }
      })
    },
    // 选中态添加
    checkedRows(list) {
      if(!list) {
        const checkList = [];
        this.tableData.forEach(item => {
          if(item.appId) {
            checkList.push(item);
          }
        });
        list = checkList;
      }
      this.$nextTick(() => {
        try {
          this.$refs.uTable.setCheckboxRow(list, true);
        } catch (error) {
          console.log('#######', error);
          if(this.visible) {
            this.$nextTick(() => {
              this.checkedRows(list, true);
            })
          }
        }
      })
    },
    onCheckMethod({ row }) {
      return !row.appId;
    },
    handleAppCodeChange() {
      this.page.pageIndex = 0;
    },
    handleSearch() {
      this.page.pageIndex = 0;
      this.page.pageSize = 10;
      this.getRoleList();
    },
    // 基础功能方法
    handleReset(refresh = true) {
      // const appCode = lodash.get(this, 'appList[0].appCode');
      // if(!appCode) {
      //   return this.getAppList();
      // }
      this.query = { roleNameLike: "", roleCode: "", appCode: "" };
      this.page.pageIndex = 0;
      this.page.pageSize = 10;
      refresh && this.getRoleList();
    },
    handlePageSizeChange(size) {
      this.page.pageIndex = 0;
      this.page.pageSize = size;
      this.getRoleList();
    },
    handlePageIndexChange(index) {
      this.page.pageIndex = index;
      this.page.pageSize = 10;
      this.getRoleList();
    },
    onClose(refresh = false) {
      // 清理之前选择过的数据
      try {
        this.$refs.uTable.clearCheckboxReserve();
      } catch (error) {}
      this.handleReset();
      this.$emit("close", refresh);
    },

  },
};
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.sort-list-dialog /deep/ .el-table .cell {
  white-space: normal !important;
}
</style>
