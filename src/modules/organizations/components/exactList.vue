<template>
  <!-- //multiple single-->
  <!-- :expand-row-keys="defalutArr" 默认展开-->
  <basic-list
    :show-select-col="true"
    :show-page="!!state.showPage"
    :show-action-col="false"
    :show-index-col="false"
    select-type="singleMult"
    :fields="fields"
    :loading="state.loading"
    :total="state.total"
    :list="state.list"
    :table-h="tableH"
    :table-code="tableCode"
    :lazy="true"
    :load="loadChilden"
    :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
    row-key="id"
    :page-index="state.pageIndex"
    :page-size="state.pageSize"
    :page-index-change="pageIndexChange"
    :page-size-change="pageSizeChange"
    :selection-change="selectionChange"
    :show-ext-set="buttonData('jgkz').has"
    :ext-dlg-vis="handleExtendDialog"
  >
    <template slot="hd-col--l">
      <el-button
        type="primary"
        size="mini"
        :clstag="clstag('organizations_1619350919893|1')"
        @click="handleAdd"
        v-if="buttonData('zjzjg').has"
        >{{ buttonData("zjzjg").name }}</el-button
      >
      <el-button
        type="primary"
        size="mini"
        :clstag="clstag('organizations_1619350919893|2')"
        @click="handleUers"
        v-if="buttonData('ckjgcy').has"
        >{{ buttonData("ckjgcy").name }}</el-button
      >
      <el-button
        type="primary"
        size="mini"
        :clstag="clstag('organizations_1619350919893|3')"
        @click="handleRoles"
        v-if="buttonData('gljgcdjs').has"
        >{{ buttonData("gljgcdjs").name }}</el-button
      >
      <!--分配数据权限-->
      <el-button
        type="primary"
        size="mini"
        :clstag="clstag('organizations_1619350919893|4')"
        @click="handleConfigAdmin(selRows[0] || {})"
        v-if="buttonData('JGFPSJQX').has"
        >{{ buttonData("JGFPSJQX").name }}</el-button
      >
      <!--分配数据角色-->
      <el-button
        type="primary"
        size="mini"
        @click="handleAssignDataRoles(selRows[0] || {})"
        v-if="buttonData('JGFPSJJS').has"
        >{{ buttonData("JGFPSJJS").name }}</el-button
      >
      <!--导入-->
      <el-button
        v-if="buttonData('JGDR').has"
        type="primary"
        size="mini"
        :clstag="clstag('organizations_1619350919893|5')"
        @click="importUser()"
        >{{ buttonData("JGDR").name }}</el-button
      >
      <!--导出-->
      <el-button
        type="primary"
        size="mini"
        :clstag="clstag('organizations_1619350919893|6')"
        @click="exportOrg"
        v-if="buttonData('JGZYDC').has"
        >{{ buttonData("JGZYDC").name }}</el-button
      >
      <el-button
        size="mini"
        :clstag="clstag('organizations_1619350919893|7')"
        @click="handleEdit"
        v-if="buttonData('bjjg').has"
        >{{ buttonData("bjjg").name }}</el-button
      >
      <el-button
        size="mini"
        :clstag="clstag('organizations_1619350919893|8')"
        @click="handleOrg"
        v-if="buttonData('bgfjg').has"
        >{{ buttonData("bgfjg").name }}</el-button
      >
      <el-button
        type="danger"
        size="mini"
        :clstag="clstag('organizations_1619350919893|9')"
        @click="handleDelete"
        v-if="buttonData('scjg').has"
        >{{ buttonData("scjg").name }}</el-button
      >
      <el-button
        size="mini"
        @click="handleRelatedJobs(selRows[0] || {})"
        v-if="relatedJobsButtonVisible"
        >机构关联岗位</el-button
      >
      <el-button
        type="primary"
        size="mini"
        :clstag="clstag('organizations_1619350919893|10')"
        @click="handleAllowApply"
        v-if="buttonData('JGPZKSQCD').has"
        >{{ buttonData("JGPZKSQCD").name }}</el-button
      >
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
import { clstagData } from "@/utils/req";
import { mapState } from "vuex";
export default {
  mixins: [ExactList],
  props: {
    handleAdd: Function,
    handleDelete: Function,
    handleEdit: Function,
    handleUers: Function,
    handleRoles: Function,
    handleConfigAdmin: Function,
    handleRelatedJobs: Function,
    handleAssignDataRoles: Function,
    importUser: Function,
    handleOrg: Function,
    checkSingleRow: Function,
    loadChilden: Function,
    exportOrg: Function,
    handleAllowApply: Function,
    expandKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    orgTypes: {
      type: Array,
      default() {
        return [];
      },
    },
    handleExtendDialog: Function,
  },
  data() {
    return {
      fields: [
        // 列表显示字段
        { key: "orgName", name: "机构名称", align: "left", minWidth: 280 },
        {
          key: "orgFullName",
          name: "机构全称",
          align: "left",
          render: (h, { index, row, col }) => {
            return <span>{row.orgFullName}</span>;
          },
          minWidth: 280,
        },
        {
          key: "isOwnOrg",
          name: "是否有管理权",
          width: 120,
          render: (h, { index, row, col }) => {
            if (row.isOwnOrg === 0) {
              return (
                <span class="cell-others-style cell-common">
                  {CNST.ENUMS.yesOrNo[row.isOwnOrg]}
                </span>
              );
            } else {
              return (
                <span class="cell-menu-style cell-common">
                  {CNST.ENUMS.yesOrNo[row.isOwnOrg]}
                </span>
              );
            }
          },
        },
        // {
        //     key: "isHide",
        //     name: "是否隐藏",
        //     width: 120,
        //     render: (h, { index, row, col }) => {
        //         if (row.isHide == null || row.isHide === 0) {
        //             return (
        //                 <span class='cell-menu-style cell-common'>{ CNST.ENUMS.yesOrNo[0]}</span>
        //             )
        //         } else {
        //             return (
        //                 <span class='cell-others-style cell-common'>{ CNST.ENUMS.yesOrNo[1]}</span>
        //             )
        //         }
        //     }
        // },
        { key: "orgCode", name: "机构编码", width: 160 },
        { key: "principal", name: "机构负责人", width: 160 },
        {
          key: "orgType",
          name: "类型",
          width: 120,
          render: (h, { index, row, col }) => {
            const currentRow = this.orgTypes.filter(function (item) {
              return item.key === row.orgType;
            });
            return <span>{currentRow.length ? currentRow[0].value : ""}</span>;
          },
        },
        { key: "orgSource", name: "来源", width: 160 },
        { key: "createTime", name: "创建时间", width: 160 },
        { key: "remark", name: "备注" },
      ],
      //默认展开的数组
      defalutArr: [],
      relatedJobsButtonVisible: false,
    };
  },
  computed: {
    ...mapState("app", ["tenementCode"]),
  },
  watch: {
    "state.list": {
      deep: true,
      immediate: false,
      handler: function (newVal) {
        if (newVal.length) {
          this.defalutArr = [newVal[0].id.toString()];
        }
      },
    },
  },
  methods: {
    clstag(data) {
      clstagData(data);
    },
    // 根据租户获取自动分配及审批流信息接口
    async getPositionAutoAssignInfo() {
      const tenementCode = this.tenementCode;
      const { code, data, msg } = await api.tenement.getPositionAutoAssignInfo({
        data: { tenementCode },
      });
      if (code === 200) {
        const { positionAutoSwitch } = data;
        this.relatedJobsButtonVisible = positionAutoSwitch;
      } else {
        msg && this.$message.error(msg);
        throw new Error(msg);
      }
    },
  },
  created() {
    this.getPositionAutoAssignInfo();
  },
};
</script>
