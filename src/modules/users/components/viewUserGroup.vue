<template>
  <basic-dialog
    :visible="visible"
    :title="title"
    :width="1100"
    :showFt="false"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
  >
    <template>
      <basic-list
        :show-select-col="false"
        :show-action-col="false"
        :loading="false"
        ref="adminTB"
        :isActionRender="false"
        :fields="fields"
        :total="adminList ? adminList.total : 0"
        :list="adminList ? adminList.list : []"
        :selection-change="selectionChange"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :page-size="pageSize"
      >
      </basic-list>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";
import { mapState } from "vuex";
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      rules: {},
      pageSize: 10,
      typeItem: "",
      roleNameLike: "",
      dataType: [],
      typeList: [],
      dataExtInfoList: [],
      apiIdList: [],
      pickIdList: [],
      adminList: {},
      selCode: "", // 保存选择的数据类型code
      fields: [
        { key: "groupCode", name: "用户组编码" },
        { key: "groupName", name: "用户组名称" },
        { key: "createUser", name: "创建人" },
        {
          key: "createTime",
          name: "创建时间",
          width: 180,
          formatter: function (row, column, cellValue, index) {
            return jt.date.format(new Date(cellValue).getTime());
          },
        },
      ], //用户组编码、用户组名称、创建人、创建时间。
      searchList: {},
      typeId: null,
      extendFieldEnumMap: {},
      dataCodeArray: [],
    };
  },
  computed: {
    ...mapState("app", ["tenementCode"]),
  },
  props: {
    selectItem: {
      type: Object,
      default() {
        return {};
      },
    },
    winClose: {
      type: Function,
      default() {
        return () => {};
      },
    },
    commit: Function,
  },
  watch: {
    "state.adminList3": {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.adminList = newVal;
        // 默认值
        // this.giveCheck()
      },
    },
  },
  methods: {
    query() {
      this.dtTypeChange(this.selCode, true);
    },
    handleReset() {
      this.searchList = {};
      if (this.dataType.length) {
        this.typeItem = this.dataType[0].typeCode;
        this.dtTypeChange(this.typeItem);
      }
    },
    handleOk() {},
    // 类型选择回调

    // 关闭和取消按钮
    handleClose(ev) {
      this.winClose(ev);
    },
    // actionRender(h, { index, row, col }){
    //   return  <el-button type="primary" onClick={ (e,row) => this.watchData(e,row)} size="mini">查看</el-button>
    // },

    handleChange(ev) {},
    // 选择触发事件 获取当前行数据
    selectionChange(rows, ind) {
      this.pickIdList.length = 0;
      rows.forEach((item) => {
        this.pickIdList.push(item.id);
      });
      this.$parent.updateState({ pickIdList: this.pickIdList });
    },
    giveCheck() {
      // 设置数据勾选
      const self = this;
      this.$nextTick(() => {
        this.apiIdList.length = 0;
        const _table = self.$refs.adminTB && self.$refs.adminTB.$refs.table;
        this.adminList &&
          this.adminList.list &&
          this.adminList.list.forEach((item, ind) => {
            // 设置状态
            item && _table.toggleRowSelection(item, item.isOwnData === 1);
            // 存储id
            this.apiIdList.push(item.id);
          });
        if (this.apiIdList.length > 0) {
          this.$parent.updateState({ apiIdList: this.apiIdList });
        }
      });
    },
    // 切换页数
    pageIndexChange(_index) {
      let _ind = _index - 1;
      // 更新页面数据
      // this.pageSize = _ind
      this.$parent.updateState({ adminPageIndex: _ind });
      // 查询列表
      this.$parent.dispatch("queryUserGroup");
    },
    // 切换每页显示条数
    pageSizeChange(_size) {
      // 查询列表
      this.pageSize = _size;
      this.$parent.updateState({ adminPageSize: _size });
      // 查询列表
      this.$parent.dispatch("queryUserGroup");
    },
    handleSetSearch(array) {
      array = array || [];
      array = array.filter((item) => item.isEffective === 1);
      const result = [];
      this.extendFieldEnumMap = {};
      array.forEach((item) => {
        const row = {
          key: `ext${item.extNo}`,
          name: item.extName,
          value: undefined,
          type: "input",
        };
        if (item.isEnum == 1) {
          row.type = "enums";
          row.enums = jt.fn.generateEnums(item.enumValue, ",");
          this.extendFieldEnumMap[row.key] = _.cloneDeep(row.enums);
        }
        result.push(row);
      });
      return result;
    },
    async querySearchThink(value, cb, key) {
      const query = {
        ...this.searchList,
        typeId: this.typeId,
        tenementCode: this.tenementCode,
        userId: this.$store.state[this.$parent.storeKey].userId,
      };
      const params = { data: query, page: { pageIndex: 1, pageSize: 10 } };
      const { data, msg, code } = await api.users.queryUserBaseData(params);
      if (code === 200) {
        data.rows = data.rows || [];
        const array = Array.from(new Set(data.rows.map((item) => item[key])));
        const result = array.map((item) => ({ value: item }));
        cb(result);
      } else {
        cb();
      }
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
