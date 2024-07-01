<template>
  <basic-dialog
    :visible="visible"
    :title="applyType === 'applyAdmin' ? '添加用户组管理权限' : '添加用户组'"
    :width="1100"
    :okText="choosed.length ? '添加' : '保存'"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
  >
    <el-form
      ref="form"
      size="small"
      label-position="right"
      label-width="100px"
      :model="query"
      :inline="true"
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd formFix">
          <el-row :gutter="0">
            <el-form-item label="用户组名称">
              <el-input v-model="query.groupName" clearable />
            </el-form-item>
            <el-form-item label="用户组编码">
              <el-input v-model="query.groupCode" clearable />
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
        <vxe-column field="groupName" title="用户组名称"></vxe-column>
        <vxe-column field="groupCode" title="用户组编码"></vxe-column>
        <vxe-column v-if="formData.assignType==='1'" field="isOwnGroup" title="是否已分配" show-overflow>
          <template #default="{ row }">
            <span :style="{
                color: row.isOwnGroup ? '#12B35D' : '#FC3737'
            }">
              {{ row.isOwnGroup | booleanToYN }}
            </span>
          </template>
        </vxe-column>
      </vxe-table>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";

import tableMixins from "../../mixins/table";
import filterMixins from "../../mixins/filters";
import changeMixin from "../../mixins/change";
import requestMixins from "./request";
import store from "../../store";

const initQuery = () => {
  return {
    groupName: "",
    groupCode: ""
  };
};

export default {
  name: "UserGroupDialog",
  mixins: [EntityDialog, tableMixins, filterMixins, changeMixin, requestMixins],
  data() {
    return {
      query: initQuery(),
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
  },
  props: {
    choosed: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => ({})
    }
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
  mounted() {
  },
  methods: {
    tenantIdChange() {
      this.getList();
    },
    getList() {
      this.getUserGroupRequest().then((response) => {
        if(response.data.code === 200) {
          const data = response.data.data;
          const list = data.rows;
          const chooses = [];
          list.forEach((item) => {
            item.disabled = Boolean(item.isOwnGroup);
            if (item.disabled) {
              chooses.push(item);
            }
            item.choosed = item.disabled || this.choosedMap[item.id] || false;
          });
          this.assignListData({
            ...data,
            rows: list,
          });
        } else {
          this.$message.error(response.data.msg)
        }
      })
      .catch((reject) => {
        console.log("postBlurryQueryOrgData 请求失败", reject);
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
      this.query = initQuery();
      this.resetPage();
      this.getList();
    },
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
