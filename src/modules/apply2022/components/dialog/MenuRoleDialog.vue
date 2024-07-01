<template>
  <basic-dialog
    :visible="visible"
    :title="computedTitle"
    :width="1100"
    :okText="choosed.length ? '添加' : '保存'"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOkBefore"
  >
    <el-form
      ref="form"
      size="small"
      label-position="right"
      label-width="80px"
      :model="query"
      :inline="true"
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd formFix">
          <el-row :gutter="0">
            <el-form-item label="系统名称">
              <el-select
                :disabled="isUsfUse"
                v-model="query.appCodeLists"
                multiple
                filterable
                collapse-tags
                placeholder="请选择系统名称"
              >
                <el-option
                  v-for="item in systems"
                  :label="item.appName"
                  :value="item.appCode"
                  :key="item.appCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色名称">
              <el-input v-model="query.roleNameLike" clearable />
            </el-form-item>
            <el-form-item label="角色编码">
              <el-input v-model="query.roleCode" clearable />
            </el-form-item>
            <div class="col-r" style="width: 205px; margin-bottom: 20px">
              <el-button type="primary" size="small" @click="handleSearch"
                >查询</el-button
              >
              <el-button size="small" @click="handleReset">重置</el-button>
            </div>
          </el-row>
        </div>
      </div>
    </el-form>
    <template>
      <vxe-toolbar class-name="vxe-table-toolbar-pagination">
        <template #buttons>
          <el-pagination
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500]"
            :total="page.rowTotal"
            layout="total, sizes, prev, jumper, slot, next "
            @current-change="pageIndexChange"
            @size-change="pageSizeChange"
          >
            <span class="page-count"> / {{ page.pageTotal }}</span>
          </el-pagination>
        </template>
      </vxe-toolbar>
      <vxe-table
        border
        stripe
        class="disabled-checked-table"
        show-overflow
        ref="table"
        height="500"
        align="center"
        :data="list"
        :column-config="{resizable: true}"
        :row-config="{ isHover: true, keyField: 'id' }"
        :sort-config="{ trigger: 'cell' }"
        :checkbox-config="{
          labelField: '',
          checkMethod: onCheckMethod,
          reserve: true,
          trigger: 'row',
        }"
        :edit-config="{ enabled: false }"
      >
        <!--
          visibleMethod: onVisibleMethod,
          -->
        <vxe-column type="checkbox" width="50"></vxe-column>
        <vxe-column field="appName" title="系统名称"></vxe-column>
        <vxe-column field="roleName" title="菜单角色名称"></vxe-column>
        <vxe-column field="roleCode" title="菜单角色编码"></vxe-column>
        <vxe-column field="sensitiveMark" title="是否敏感" show-overflow>
          <template #default="{ row }">
            <span :style="{
                color: row.sensitiveMark ? '#12B35D' : '#FC3737'
            }">
              {{ row.sensitiveMark | booleanToYN }}
            </span>
          </template>
        </vxe-column>
        <vxe-column v-if="formData.assignType==='1'" field="isOwnRole" title="是否已分配" show-overflow>
          <template #default="{ row }">
            <span :style="{
                color: row.isOwnRole ? '#12B35D' : '#FC3737'
            }">
              {{ row.isOwnRole | booleanToYN }}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="illustration" title="菜单角色说明"></vxe-column>
      </vxe-table>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";
import { Notification } from 'element-ui';

import tableMixins from "../../mixins/table";
import filterMixins from "../../mixins/filters";
import changeMixin from "../../mixins/change";
import requestMixins from "./request";
import store from "../../store";

import axios from "axios";

const initQuery = () => {
  return {
    appCodeLists: ["usf"],
    roleCode: "",
    roleNameLike: "",
  };
};

export default {
  name: "MenuRoleDialog",
  mixins: [EntityDialog, tableMixins, filterMixins, changeMixin, requestMixins],
  data() {
    return {
      query: initQuery(),
      systems: [
        {
          appCode: "usf",
          appName: "统一权限系统(USF)",
        },
      ],
    };
  },
  computed: {
    choosedMap() {
      const map = {};
      this.choosed.forEach(choose => {
        map[choose.id] = true
      })
      return map
    },
    applyType() {
      return store.state.applyType;
    },
    computedTitle() {
      if(this.isUsfUse) {
        return '添加USF菜单角色'
      }
      if(this.applyType === 'applyAdmin') {
        return '添加菜单角色管理权限'
      } else {
        return '添加菜单角色'
      }
    }
  },
  props: {
    choosed: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    // 是否为USF权限专用
    isUsfUse: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    visible: {
      handler(n) {
        if (n) {
          this.setChecked();
        }
      },
      immediate: true,
    },
  },
  methods: {
    tenantIdChange() {
      if(!this.isUsfUse) {
        this.getSystems();
      }
      this.getList();
    },
    getSystems() {
      let url = "/adminApply/queryAppList.do"
      if(this.applyType === 'applyUser') {
        url = '/businessApply/queryAppList.do'
      }
      axios({
        method: "post",
        url,
        data: {
          tenementCode: this.tenantId,
          appName: "",
        },
        params: {
          tenementCode: this.tenantId,
        },
      })
        .then((response) => {
          this.systems = response.data.data;
          this.$refs.table &&
            this.$refs.table.setCheckboxRow(this.choosed, true);
        })
        .catch((reject) => {
          console.log("postBlurryQueryOrgData 请求失败", reject);
        });
    },
    getList() {
      this.getMenuRoleRequest().then((response) => {
        if(response.data.code === 200) {
          const data = response.data.data;
          const list = data.rows;
          const chooses = [];
          list.forEach((item) => {
            item.disabled = Boolean(item.isOwnRole);
            if (item.disabled) {
              chooses.push(item);
            }
            item.choosed = item.disabled || this.choosedMap[item.id] || false;
          });
          this.assignListData({
            ...data,
            rows: list,
          });
        }
      })
      .catch((reject) => {
        console.log("getMenuRoleRequest 请求失败", reject);
      });
    },
    setChecked() {
      const table = this.$refs.table;
      if (table) {
        table.setCheckboxRow(this.choosed, true);
        table.$forceUpdate();
      }
    },
    handleReset() {
      const query = initQuery();
      // 如果是USF默认弹框
      if(this.isUsfUse) {
        this.systems = [
          {
            appCode: "usf",
            appName: "统一权限系统(USF)",
          },
        ]
      } else {
        query.appCodeLists = [];
        this.systems = [];
      }
      this.query = query
      this.resetPage();
      this.tenantIdChange();
    },
    handleOkBefore() {
      const reserveRows = this.$refs.table.getCheckboxReserveRecords(true);
      const rows = this.$refs.table.getCheckboxRecords(true);
      const chooses = [...reserveRows, ...rows];
      const sentitives = chooses.filter(item => item.sensitiveMark);
      if(sentitives && sentitives.length) {
        // const names = sentitives.map(item => item.roleName);
        // this.$message({
        //   type: 'warning',
        //   duration: 5000,
        //   message: '当前申请的权限涉及敏感权限，可能会触发特殊审批流，请确认。'
        // })
        const h = this.$createElement;
        Notification({
          customClass: "alway-top",
          type: "warning",
          title: '敏感权限提示',
          duration: 6000,
          message: h('i', { style: 'color: teal; font-style: normal;'}, '当前申请的权限涉及敏感权限，可能会触发特殊审批流，请确认。')
        });
      }
      this.handleOk();
    }
  },
};
</script>

<style lang="scss" scope>
/deep/ .el-form {
  width: 100%;
}
.entity-dlg__block-bd.formFix {
  input {
    width: 200px;
  }
  .col-r {
    float: right;
    position: relative;
    padding: 0 12px 0 25px;
    width: 162px;
    .el-button {
      width: 75px;
    }
  }
}
</style>
