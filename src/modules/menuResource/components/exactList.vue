<template>
  <div>
    <UmyBasicList
      :showIndexCol="false"
      :show-select-col="true"
      :show-action-col="false"
      :showPage="false"
      :table-h="tableH"
      :fields="fields"
      :loading="state.loading"
      :total="state.total"
      :list="state.list"
      select-type="singleMult"
      :tree-config="treeConfig"
      :selection-change="selectionChange"
      class-name="menuResource"
      highlight-current
      row-key="id"
      :show-extend-set="buttonData('cdkzan').has"
      :extDlgVis="queryExtendList"
      :extend-list="extendList"
      :extend-fields="extendFields"
      :handle-save-extend-set="handleSaveExtendSet"
      :useRowClick="false"
    >
      <template slot="hd-col--l">
        <el-button
          type="primary"
          size="mini"
          :clstag="clstag('menuResource_1619350982488|1')"
          @click="onSonMenu"
          v-if="buttonData('tjzcd').has"
          >{{ buttonData("tjzcd").name }}</el-button
        >
        <!-- 导入 -->
        <el-button
          type="primary"
          size="mini"
          :clstag="clstag('menuResource_1619350982488|2')"
          @click="importData"
          v-if="buttonData('CDDR').has"
          >{{ buttonData("CDDR").name }}</el-button
        >
        <!-- 编辑 -->
        <el-button
          size="mini"
          :clstag="clstag('menuResource_1619350982488|4')"
          @click="onEdit"
          v-if="buttonData('bjcdzy').has"
          >{{ buttonData("bjcdzy").name }}</el-button
        >
        <!-- biangengfujiedian -->
        <el-button
          size="mini"
          :clstag="clstag('menuResource_1619350982488|5')"
          @click="onChangeParent"
          v-if="buttonData('BGZYFJG').has"
          >{{ buttonData("BGZYFJG").name }}</el-button
        >
        <!-- 删除 -->
        <el-button
          type="danger"
          size="mini"
          :clstag="clstag('menuResource_1619350982488|6')"
          @click="onDelete"
          v-if="buttonData('sccdzy').has"
          >{{ buttonData("sccdzy").name }}</el-button
        >
        <!-- 启用 -->
        <el-button
          v-if="buttonData('cdqy').has && isDisable"
          size="mini"
          :clstag="clstag('menuResource_1619350982488|7')"
          @click="handleEnableOrDisable"
          >{{ buttonData("cdqy").name }}</el-button
        >
        <!-- 停用 -->
        <el-button
          v-if="buttonData('cdty').has && isEnable"
          :clstag="clstag('menuResource_1619350982488|8')"
          size="mini"
          @click="handleEnableOrDisable"
          >{{ buttonData("cdty").name }}</el-button
        >
        <!-- 上移 -->
        <el-button
          v-if="isCanUp"
          :clstag="clstag('menuResource_1619350982488|9')"
          size="mini"
          @click="handleUp"
          >上移</el-button
        >
        <!-- 下移 -->
        <el-button
          v-if="isCanDown"
          size="mini"
          :clstag="clstag('menuResource_1619350982488|10')"
          @click="handleDown"
          >下移</el-button
        >
        <el-button
          v-if="selRows && selRows.length && selRows[0].children && selRows[0].children.length > 1"
          size="mini"
          :clstag="clstag('menuResource_1619350982488|10')"
          @click="handleSort"
          >子菜单排序</el-button
        >
        <!-- 关联菜单角色 -->
        <el-button
          v-if="buttonData('GLCDJS').has && selRows.length !== 0"
          size="mini"
          @click="handleConnectMenuRole(selRows[0])"
          >{{ buttonData("GLCDJS").name }}</el-button
        >
        <!-- 新增菜单关联角色 -->
        <el-button
          v-if="buttonData('ZJGLCDJS').has && selRows.length !== 0"
          size="mini"
          @click="handleRelationRole(selRows[0])"
          >{{ buttonData("ZJGLCDJS").name }}</el-button
        >
        <el-dropdown
          split-button
          type="primary"
          size="mini"
          @command="moreViewData"
          trigger="click"
        >
          导出
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="buttonData('DCCDZY').has"
              :clstag="clstag('menuResource_1619350982488|3')"
              divided
              :command="[0, '导出菜单资源', selRows[0] || {}]"
              >{{ buttonData("DCCDZY").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('DCCDZYGLYH').has"
              :clstag="clstag('menuResource_1619350982488|12')"
              divided
              :command="[1, '导出菜单资源关联用户', selRows[0] || {}]"
              >{{ buttonData("DCCDZYGLYH").name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </UmyBasicList>
    <SortListDialog
      :visible="sortDialogVisible"
      :data="selRows && selRows[0] ? selRows[0] : undefined"
      @close="onSortListDialogClose"
    />
    <RelationRoleDialog
      :visible="relationDialogVisible"
      :data="selRows && selRows[0] ? selRows[0] : undefined"
      @close="onRelationRoleDialogClose"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import ExactList from "@/mixins/exactList";
import { clstagData } from "@/utils/req";
import SortListDialog from "./SortListDialog.vue";
import RelationRoleDialog from "./RelationRoleDialog.vue";
export default {
  mixins: [ExactList],
  components: {
    SortListDialog,
    RelationRoleDialog,
  },
  props: {
    addSonMenu: Function,
    exchange: Function,
    queryObj: Object,
    queryList: Function,
    onSonMenuRole: Function,
    onSonMenuRoled: Function,
    importData: Function,
    exportMenuData: Function,
    changeParent: Function,
    handleConnectMenuRole: Function,
    moreViewData: Function,
  },
  data() {
    const self = this;
    return {
      maps: new Map(),
      treeConfig: {
        expandRowKeys: self.$store.state.menuResource.expandKey,
      },
      fields: [
        { key: "resourceName", name: "名称", align: "left", width: 300 },
        { key: "resourceCode", name: "编码" },
        { key: "resourceSeqRel", name: "菜单序号", width: 100 },
        {
          key: "resourceType",
          name: "类型",
          render: (h, { index, row, col }) => {
            if (row.resourceType === 0) {
              return (
                <span class="cell-menu-word-style cell-common-word">
                  {CNST.ENUMS.resourceType[row.resourceType]}
                </span>
              );
            } else if (row.resourceType == 1) {
              return (
                <span class="cell-button-word-style cell-common-word">
                  {CNST.ENUMS.resourceType[row.resourceType]}
                </span>
              );
            } else {
              return (
                <span class="cell-others-word-style cell-common-word">
                  {CNST.ENUMS.resourceType[row.resourceType]}
                </span>
              );
            }
          },
        },
        {
          key: "sensitiveMark",
          name: "是否敏感资源",
          render: (h, { row }) => {
            const status = { 0: "否", 1: "是" };
            const value = status[row.sensitiveMark];
            return <span>{value}</span>;
          },
        },
        { key: "resourceUrl", name: "URL" },
        {
          key: "isDisable",
          name: "状态",
          render: (h, { row }) => {
            const status = { 0: "启用", 1: "停用" };
            const value = status[row.isDisable];
            return <span>{value}</span>;
          },
        },
        { key: "createTime", name: "创建时间", width: 180 },
        { key: "remark", name: "备注" },
      ],
      extendFields: [
        { key: "extNo", name: "字段序号", width: 80 },
        {
          key: "isEffective",
          name: "是否启用",
          width: 80,
          render: (h, { row }) => (
            <el-checkbox
              v-model={row.isEffective}
              true-label={1}
              false-label={0}
            />
          ),
        },
        {
          key: "isRequired",
          name: "是否必填",
          width: 80,
          render: (h, { row }) => (
            <el-checkbox
              v-model={row.isRequired}
              true-label={1}
              false-label={0}
            />
          ),
        },
        {
          key: "extName",
          name: "字段名称",
          render: (h, { row }) => {
            return <el-input v-model_trim={row.extName} size="small" />;
          },
        },
        {
          key: "isEnum",
          name: "是否枚举类型",
          width: 120,
          render: (h, { row }) => (
            <el-checkbox v-model={row.isEnum} true-label={1} false-label={0} />
          ),
        },
        {
          key: "enumValue",
          name: "输入枚举值",
          render: (h, { row }) => (
            <el-input
              v-model_trim={row.enumValue}
              placeholder="请用英文逗号隔开"
              size="small"
            />
          ),
        },
      ],
      sortDialogVisible: false,
      relationDialogVisible: false,
    };
  },
  created() {
    this.queryExtendList(true);
  },
  methods: {
    clstag(data) {
      clstagData(data);
    },
    // load子节点
    loadChilden(row, treeNode, resolve) {
      const id = row.id;
      this.maps.set(id, {
        row,
        treeNode,
        resolve,
      });
      this.$parent
        .dispatch("load", {
          parentId: id,
        })
        .then((arr) => {
          if (arr && arr.length) {
            row.children = arr;
            resolve(arr);
          } else {
            row.hasChild = false;
            resolve([]);
          }
        });
    },
    async handleUp() {
      const params = {
        data: {
          tenementCode: this.selRows[0].tenementCode,
          moveFlag: 1,
          appId: this.selRows[0].appId,
          id: this.selRows[0].id,
        },
      };
      const { code, msg } = await api.menuResource.moveMenu(params);
      if (code === 200) {
        this.$message.success(msg);
        this.$emit("UPDATE_LIST");

        const { pid } = this.selRows[0].parentId; //取出当前删除行的pid
        const { row, treeNode, resolve } = this.maps.get(11271); //根据pid取出对应的节点数据
        // this.$set(this.state.lazyTreeNodeMap, pid, []); //将对应节点下的数据清空，从而实现数据的重新加载
        this.loadChilden(row, treeNode, resolve);
      } else {
        this.$message.error(msg);
      }
    },
    async handleDown() {
      const params = {
        data: {
          tenementCode: this.selRows[0].tenementCode,
          moveFlag: 0,
          appId: this.selRows[0].appId,
          id: this.selRows[0].id,
        },
      };
      const { code, msg } = await api.menuResource.moveMenu(params);
      if (code === 200) {
        this.$message.success(msg);
        this.$emit("UPDATE_LIST");
      } else {
        this.$message.error(msg);
      }
    },
    onDelete() {
      const rows = this.selRows;
      if (!rows.length) {
        this.$message.error("请选择需要删除的数据！");
        return false;
      }
      if (rows.length > 1) {
        this.$message.error("只能选择一个数据进行删除！");
        return false;
      }
      if (rows[0].parentId == null) {
        this.$message.error("根菜单不可删除！");
        return false;
      }
      this.handleDelete(rows[0]); //
    },
    onEdit() {
      const rows = this.selRows;
      if (!rows.length) {
        this.$message.error("请选择需要编辑的数据！");
        return;
      }
      if (rows.length > 1) {
        this.$message.error("只能选择一个数据进行编辑！");
        return;
      }
      if (rows[0].parentId == null) {
        this.$message.error("根菜单不可编辑！");
        return false;
      }
      this.handleEdit({ id: rows[0].id }, true);
    },
    onChangeParent() {
      const rows = this.selRows;
      if (!rows.length) {
        this.$message.error("请选择需要变更的数据！");
        return;
      }
      if (rows.length > 1) {
        this.$message.error("只能选择一个数据进行变更！");
        return;
      }
      if (rows[0].parentId == null) {
        this.$message.error("根菜单不可变更！");
        return false;
      }
      this.changeParent({ row: rows }, true);
    },
    //添加子菜单
    onSonMenu() {
      const rows = this.selRows;
      if (!rows.length) {
        this.$message.error("请选择需要添加的子菜单！");
        return;
      }
      if (rows.length > 1) {
        this.$message.error("只能选择一个子菜单编辑！");
        return;
      }
      this.addSonMenu(rows[0]);
    },
    // 禁用/启用菜单角色
    handleEnableOrDisable() {
      if (this.selRows.length === 0) return;
      // 0表示启用状态 1表示禁用状态
      const { isDisable, tenementCode, id } = this.selRows[0];
      const params = { data: { tenementCode, id } };
      if (isDisable === 0) {
        this.$confirm("此操作将停用所选菜单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.handleDisableResourceRole(params);
        });
      } else if (isDisable === 1) {
        this.handleEnableResourceRole(params);
      }
    },
    // 禁用
    async handleDisableResourceRole(params) {
      const { code, msg } = await api.menuResource.disableResource(params);
      if (code === 200) {
        this.$message.success(msg);
        this.$emit("UPDATE_LIST");
      } else {
        this.$message.error(msg);
      }
    },
    // 启用
    async handleEnableResourceRole(params) {
      const { code, msg } = await api.menuResource.enableResource(params);
      if (code === 200) {
        this.$message.success(msg);
        this.$emit("UPDATE_LIST");
      } else {
        this.$message.error(msg);
      }
    },
    // 扩展字段保存
    async handleSaveExtendSet({ done } = {}) {
      const flag = this.checkExtendFieldParams();
      if (flag) {
        const params = { data: _.cloneDeep(this.extendList) };
        const query = { appCode: this.state.query.appCode };
        const { code, msg } = await api.menuResource.extendFieldSet(
          params,
          query
        );
        if (code === 200) {
          this.$message.success(msg);
          this.setListExtendFields(this.extendList, undefined, true);
          done && done();
        } else {
          this.$message.error(msg);
        }
      }
    },
    // 请求扩展字段
    async queryExtendList(flag) {
      this.extendList = this.getDefaultExtendList(10);
      const params = {
        data: {
          tenementCode: this.tenementCode,
          appCode: this.state.query.appCode,
        },
      };
      const { code, msg, data } = await api.menuResource.queryExtendField(
        params
      );
      if (code === 200) {
        this.extendToFront(data || []);
        if (flag) {
          this.setListExtendFields(this.extendList, undefined, true);
        }
      } else {
        this.$message.error(msg);
      }
    },
    // 排序弹框
    handleSort() {
      this.sortDialogVisible = true;
    },
    onSortListDialogClose(refresh) {
      this.sortDialogVisible = false
      if(refresh) {
        this.queryList();
      }
    },
    // 关联角色
    handleRelationRole(data) {
      this.relationDialogVisible = true;
    },
    onRelationRoleDialogClose() {
      this.relationDialogVisible = false;
    }
  },
  computed: {
    ...mapState("app", ["tenementInfoObj"]),
    isEnable() {
      return this.selRows.length !== 0 && this.selRows[0].isDisable === 0
        ? true
        : false;
    },
    isDisable() {
      return this.selRows.length !== 0 && this.selRows[0].isDisable === 1
        ? true
        : false;
    },
    isCanUp() {
      return this.selRows.length !== 0 && this.selRows[0].resourceSeq !== 1
        ? true
        : false;
    },
    isCanDown() {
      return this.selRows.length !== 0 && this.selRows[0].isLevelLast !== true
        ? true
        : false;
    },
  },
  watch: {
    tenementInfoObj: {
      deep: true,
      immediate: false,
      handler: function (newVal) {
        if (newVal.tenementCode) {
          this.queryList();
        }
      },
    },
  },
};
</script>

<style lang="scss">
.el-table__header-wrapper {
  /deep/ .el-table__header {
    .is-left {
      text-align: center;
    }
  }
}
</style>
