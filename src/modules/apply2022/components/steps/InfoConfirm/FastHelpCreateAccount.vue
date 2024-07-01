<template>
  <basic-dialog
    class="apply2022-FHCA"
    :visible="visible"
    title="快速代人创建账号"
    :width="1000"
    :okText="'创建并继续'"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :isShowFooterAll="false"
  >
    <template>
      <el-alert
        title="以下账号在所选租户中尚不存在，无法继续申请。通过选择所属机构，可完成这些账号的快速创建"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <vxe-toolbar class-name="vxe-table-toolbar-pagination">
        <template #buttons>
          <el-pagination
            v-show="showPager"
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
        show-overflow
        ref="table"
        height="500"
        align="center"
        :data="list"
        :row-config="{ isHover: true, keyField: 'id' }"
        :sort-config="{ trigger: 'cell' }"
        :edit-config="{ enabled: false }"
        :expand-config="{ expandAll: expandAll }"
      >
      <!-- 默认展开全部 不然取不到 行内rowForm[index] -->
        <!--
          visibleMethod: onVisibleMethod,
          -->
        <vxe-column type="expand" width="80">
          <template #content="{ row, rowIndex }">
            <div class="expand-wrapper">
              <el-form :ref="`rowForm${rowIndex}`" :inline="true" :model="row" label-width="120px" class="demo-form-inline">
                <el-form-item :label="ext.label" v-for="ext in extList" :rules="ext.rules" :key="ext.field" :prop="ext.field">
                  <el-input v-if="ext.type === 'input'" v-model="row[ext.field]" placeholder=""></el-input>
                  <el-select v-else v-model="row[ext.field]" clearable>
                    <el-option v-for="option in ext.options" :key="option.key" :label="option.key" :value="option.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="roleName" title="账号类型">
          <template>
            {{ type | accountType}}
          </template>
        </vxe-column>
        <vxe-column field="userCode" title="账号"></vxe-column>
        <vxe-column field="id" title="操作">
          <template #default="{ row }">
            <el-tooltip class="item" effect="dark" content="系统将取消该账号本次申请，权限配置页可下载该账号明细" placement="top">
              <el-button type="text" @click="onDelete(row)">移除</el-button>
            </el-tooltip>
            <el-button type="text" @click="onExpand(row)">补充信息</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="apply2022-FHCA-form-container">
        <el-form
          ref="form"
          size="small"
          label-position="right"
          label-width="100px"
          :model="formOrg"
          :inline="true"
          :rules="rules"
        >
          <div class="entity-dlg__block">
            <div class="entity-dlg__block-bd">
              <el-row :gutter="0">
                <el-form-item label="所属机构" prop="orgId">
                  <el-select
                    class="w300"
                    v-model="formOrg.orgId"
                    :key="tenantId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入机构名称查询"
                    :remote-method="getOrgList"
                    :loading="loading">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="`${item.label}(${item.value})`"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                <span class="apply-2022-choose-hard">机构选择有困难，申请手册看一看</span>
                <el-button class="ei_button_manual" type="text" @click="handleManual">查看手册<i
                    class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-form-item>
              </el-row>
              <el-row :gutter="0">
                <div class="fr pb20">
                  <el-button size="small" @click="onDeleteAll">全部删除</el-button>
                  <el-button size="small" type="primary" @click="handleOk">创建并继续</el-button>
                </div>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";

import tableMixins from "../../../mixins/table";
import filterMixins from "../../../mixins/filters";
import changeMixin from "../../../mixins/change";
import webPageMixin from "../../../mixins/webPage";
import requestMixin from "./request";
import toolMixin from "./tool";

import axios from "axios";
import { get } from "lodash";
import store from "../../../store";

export default {
  name: "FastHelpCreateAccount",
  mixins: [EntityDialog, tableMixins, filterMixins, changeMixin, webPageMixin, requestMixin, toolMixin],
  data() {
    return {
      loading: false,
      options: [],
      formOrg: {
        orgId: undefined
      },
      rules: {
        orgId: [
          {
            required: true,
            message: "请选择机构"
          }
        ]
      },
      extList: [],
      expandAll: false
    };
  },
  props: {
    choosed: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      require: true
    },
    accounts: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    visible: {
      handler(n) {
        if (n) {
          this.handleReset()
        }
      },
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    handleManual() {
      if(store.state.configInfo&&store.state.configInfo.orgSelectHint){
        window.open(store.state.configInfo.orgSelectHint,"_blank")
      }
     },
    async getOrgList(query) {
      if(query){
        axios({
            method: "post",
            url: "/org/blurryQueryOrg",
            data: {
              "data": {
                "orgNameKeyWord": query,
                "queryChannelNum": 2 //固定值
              },
              "page": {
                "pageIndex": 1,
                "pageSize": 1000000000
              }
            },
            params: {
              tenementCode: this.tenantId,
            },
          }).then(response => {
            if (response.data.code === 200) {
              const rows = response.data.data.rows;
              this.options = rows.map(row => {
                return {
                  label: row.orgFullName,
                  value: row.orgCode
                }
              })
            } else {
              return this.$message.error("获取机构数据失败");
            }
          })
      } else {
        this.options = [];
      }
    },
    handleReset() {
      // 获取扩展字段
      this.getTenentExtendsFeild().then((response) => {
        // 格式化数据
        const extList = this.formatExtendsFeild(
          get(response, 'data.data')
        );
        this.extList = extList;
        // 格式化账号数据
        // 查询之前是否缓存了 导入数据
        this.tableData = this.pickUserData(
          this.accounts.map(account => {
            const instance = this.storeForm.usersForOther.find(user => user.userCode === account);
            if(instance) {
              return instance
            } else {
              return {
                userCode: account
              }
            }
          })
        );
        // 默认行为
        this.formOrg.orgId = undefined;
        this.options = [];
        this.getList();
      })
    },
    formatExtendsFeild(list = []) {
      let expandAll = false;
      this.expandAll = expandAll;
      const fields = list
        // 过滤无效值
        .filter(item => item.isEffective === 1)
        .map(item => {
          let rules = [{ max: 50, message: "长度不能超过50个字符" }];
          if(item.isRequired === 1) {
            expandAll = true;
            rules = [{ required: true, message: `${item.extName}，为必填项` }]
          }
          let result = {
            label: item.extName,
            field: `ext${item.extNo}`,
            type: 'input',
            options: [],
            rules: rules
          }
          if (item.isEnum === 1) {
            result.type = 'select';
            result.options = item.enumValue;
          }
          return result;
      })
      this.expandAll = expandAll;
      return fields;
    },
    onDelete(row) {
      this.tableData = this.tableData.filter((item) => {
        if(item.userCode !== row.userCode) {
          return true;
        } else {
          this.$emit('delete', [item.userCode]);
          return false;
        }
      });
      this.getList();
      this.$message({
        type: "success",
        message: "删除成功!",
      });
    },
    async handleOk() {
      if(this.tableData.length) {
        // 验证扩展字段
        let boolean = true;
        for (let index = 0; index < this.tableData.length; index++) {
          const row = this.tableData[index];
          try {
            if(this.$refs['rowForm' + index]) {
              boolean = await this.$refs['rowForm' + index].validate();
            }
          } catch (error) {
            boolean = false;
          }
          if(!boolean) {
            return this.$message.error(`账号${row.userCode}, 扩展字段验证失败`)
          }
        }
        // 验证机构选择
        this.$refs.form.validate(valid => {
          if (!valid) {
            return;
          } else {
            const id = this.formOrg.orgId;
            const orgInstance = this.options.find(org => org.value === id);
            const list = this.pickUserData(this.tableData);
            list.forEach(element => {
              element.orgCode = id;
              element.orgName = orgInstance.label;
            });
            this.$emit("confirm", {
              orgId: id,
              list: list,
              orgName: orgInstance.label
            });
          }
        });
      } else {
        this.onDeleteAll()
      }
    },
    onDeleteAll() {
      this.handleClose()
      this.$emit("confirm", {
        orgId: this.formOrg.orgId,
        list: []
      });
    },
    onExpand(row) {
      this.$refs.table.toggleRowExpand(row)
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

.ei_button_manual{
  margin-left: 6px;
}
</style>
