<template>
  <basic-dialog
    :visible="visible"
    :title="buttonData('glysqfpcdjsglqx').name"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
  >
    <el-form
      ref="form"
      size="small"
      label-position="center"
      label-width="90px"
      :model="dto"
      :rules="rules"
      @submit.native.prevent
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="软件系统" prop="website">
                <el-select
                  v-model="query.appCode"
                  class="setLeft"
                  @change="handleClick()"
                >
                  <el-option
                    v-for="item in softSelect"
                    :key="item.appCode"
                    :value="item.appCode"
                    :label="item.appName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="角色名称" prop="website" class="setLeft">
                <el-input
                  v-model="query.roleNameLike"
                  :maxlength="30"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
              v-for="(item, index) in this.state.extList2"
              :key="index"
            >
              <el-form-item :label="item.name">
                <el-input
                  v-if="item.type === 'input'"
                  v-model.trim="query[item.key]"
                  placeholder="请输入关键词"
                  maxlength="{30}"
                  clearable
                />
                <el-select
                  v-if="item.type === 'select'"
                  v-model="query[item.key]"
                  placeholder="请输入关键词"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in item.options"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
              style="float: right; padding-left: 15%; margin-bottom: 18px"
            >
              <div class="marginSet">
                <el-button type="primary" size="small" @click="handleSearch"
                  >查询</el-button
                >
                <el-button size="small" @click="handleReset">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <basic-list
      ref="basicList"
      select-type="single"
      :show-select-col="true"
      :show-action-col="false"
      :fields="fields"
      :setClmnsFlg="false"
      :list="list"
      class="heightSet"
      :total="total"
      :page-index-change="pageIndexChange"
      :page-size-change="pageSizeChange"
      :selection-change="selectionChange"
      :page-index="pageIndex"
      :page-size="pageSize"
      selectType="multiple"
    />
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";
import { mapState } from "vuex";
const DEFAULTS = {
  query: {
    appCode: undefined,
    roleNameLike: undefined,
  },
  loading: false,
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  list: [],
  selRows: [],
};
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      topNum: 1,
      rules: {},
      fields: [
        { key: "roleName", name: "名称" },
        { key: "roleSource", name: "来源" },
        { key: "rootOrgName", name: "所属机构名称" },
        { key: "ext1", name: "", hidden: true },
        { key: "ext2", name: "", hidden: true },
        { key: "ext3", name: "", hidden: true },
        { key: "ext4", name: "", hidden: true },
        { key: "ext5", name: "", hidden: true },
        { key: "ext6", name: "", hidden: true },
        { key: "ext7", name: "", hidden: true },
        { key: "ext8", name: "", hidden: true },
        { key: "ext9", name: "", hidden: true },
        { key: "ext10", name: "", hidden: true },
      ],
      list: [],
      //软件系统下拉
      softSelect: [],
      query: {
        code: undefined,
        name: undefined,
      },
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      //用于存储多行的那个列
      pageDate: {},
      index: 0,
      indexApp: 0,
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    userCode: {
      type: String,
      default() {
        return undefined;
      },
    },
    updateVis: {
      type: Function,
      default: () => {},
    },
    handleSave: {
      type: Function,
      default: () => {},
    },
    state: {
      type: Object,
      default: {},
    },
    roleListId: {
      type: Number,
      default: 0,
    },
    roleCode: {
      type: String,
      default: undefined,
    },
    userId: {
      type: Number,
      default: 0,
    },
  },
  beforeCreate() {
    this.allFields = ["userName", "userCode", "userAlias", "id"];
    this.disFields = [];
  },
  created() {},
  mounted() {
    //this.dispatch("queryExtList");
  },
  computed: {
    ...mapState("app", ["tenementInfoObj"]),
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.query = { ...DEFAULTS.query, ..._.cloneDeep(this.params) };
        this.pageIndex = DEFAULTS.pageIndex - 1;
        api.administrators
          .hond({ tenementCode: this.tenementInfoObj.tenementCode })
          .then(({ code, data, message }) => {
            if (code == 200) {
              this.softSelect = data;
              this.query.appCode = this.softSelect[0].appCode;
              // this.queryList();
              this.queryExtendList();
            }
          });
      }
    },
    tenementInfoObj: {
      deep: true,
      immediate: false,
      handler: function (newVal) {
        //queryAppList  上来先获取软件系统的下来   并且传给seacher组件
        api.administrators
          .hond({ tenementCode: this.tenementInfoObj.tenementCode })
          .then(({ code, data, message }) => {
            if (code == 200) {
              this.softSelect = data;
              this.query.appCode = this.softSelect[0].appCode;
              this.handleSearch();
            }
          });
      },
    },
  },
  activated() {
    api.administrators
      .hond({ tenementCode: this.tenementInfoObj.tenementCode })
      .then(({ code, data, message }) => {
        if (code == 200) {
          this.softSelect = data;
          this.query.appCode = this.softSelect[0].appCode;
          this.handleSearch();
        }
      });
  },
  methods: {
    handleClick() {
      var obj = {};
      this.softSelect.forEach((item, index) => {
        obj[item.appCode] = item.id;
      });
      this.query.appId = obj[this.query.appCode];
      var arr = Object.keys(obj);
      this.indexApp = arr.indexOf(this.query.appCode) - 1;
      this.handleSearch();
      this.queryExtendList();
    },
    handleClose() {
      this.updateVis(false);
    },
    handleClosed() {
      const defaults = _.cloneDeep(_.get(DEFAULTS, ["selRows", "query"]));
      for (let key in defaults) {
        this[key] = defaults[key];
      }
      this.$refs.basicList.resetData();
    },
    handleOk() {
      //assignRoleManagementToUser
      //该页所有的code编码的数组
      let allArr = [];
      //该页点击的code编码数组
      let checkedArr = [];
      this.list.forEach((item, index) => {
        allArr.push(item.id);
      });
      this.selRows.forEach((item, index) => {
        checkedArr.push(item.id);
      });
      api.administrators
        .assignRoleManagementToUser({
          data: {
            id: this.userId,
            allMenuRoleIdList: allArr,
            menuRoleIdList: checkedArr,
          },
        })
        .then(({ code, data, msg }) => {
          if (code == "200") {
            this.handleSearch();
            return this.$message.success(msg);
          } else {
            return this.$message.error(msg);
          }
        });
    },
    pageIndexChange(index) {
      //这里很关键  是点击翻页的地方，我需要在这存储当前页 以及选中的那一行
      if (this.selRows.length) {
        this.pageDate[this.pageIndex] = this.selRows;
      }
      this.pageIndex = index - 1;
      this.queryList();
    },
    pageSizeChange(size) {
      // this.pageIndex = 1
      this.pageIndex = DEFAULTS.pageIndex - 1;
      this.pageSize = size;
      this.queryList();
    },
    selectionChange(rows) {
      this.selRows = rows;
    },
    handleSearch() {
      this.pageIndex = DEFAULTS.pageIndex - 1;
      this.queryList();
    },
    handleReset() {
      this.query = _.cloneDeep(DEFAULTS.query);
      this.query.appCode = this.softSelect[this.indexApp].appCode;
      this.pageIndex = DEFAULTS.pageIndex - 1;
      this.queryList();
    },
    queryList() {
      const query = _.cloneDeep(this.query);
      jt.object.removeEmptyAttr(query);
      //根据角色查弹窗用户的列表
      this.query.tenementCode = this.tenementInfoObj.tenementCode;
      api.administrators
        .Mlist({
          ...query,
          //roleListId     角色id
          data: { userId: this.userId, ...this.query },
          page: {
            pageIndex: this.pageIndex + 1,
            pageSize: this.pageSize,
          },
        })
        .then(({ code, data }) => {
          if (code == "200") {
            this.list = _.get(data, "rows") || [];
            this.total = _.get(data, "rowTotal") || 0;
            //处理默认选中
            this.$nextTick(() => {
              let arr = [];
              this.list.forEach((item, index) => {
                if (item.isOwnRole == 1) {
                  arr.push(item);
                }
              });
              arr.forEach((item) => {
                this.$refs.basicList.$refs.table.toggleRowSelection(item, true);
              });
            });
          }
        });
    },
    // 查询扩展字段列表
    async queryExtendList() {
      const params = {
        data: {
          tenementCode: this.tenementInfoObj.tenementCode,
          appCode: this.query.appCode,
        },
      };
      const { code, msg, data } = await api.rolePermissions.queryRoleExtList(
        params
      );
      if (code === 200) {
        if (!data || data.length === 0) {
          this.state.diaExtLists = [];
          this.queryList();
          return;
        }
        const extList = data
          ? data.filter((item) => item.isEffective === 1)
          : [];
        this.setListExtendFields(extList);
        const newExtList = this.handleSetExtendFields(extList);

        this.state.extList2 = [];
        if (newExtList.length > 0) {
          for (var i = 0; i < newExtList.length; i++) {
            if (newExtList[i].type !== "textarea") {
              this.state.extList2.push(newExtList[i]);
            }
          }
        }
      } else {
        this.queryList();
        this.$message.error(msg);
      }
    },
    //选中
    selectionChange(rows) {
      this.selRows = rows;
      this.handleSelectionChange && this.handleSelectionChange(rows);
    },
    // 设置添加、编辑弹窗内的扩展字段及规则
    handleSetExtendFields(data = []) {
      const fields = data.map((item) => {
        const elem = {
          key: `ext${item.extNo}`,
          name: item.extName,
          required: false,
          type: "input",
          placeholder: "请填写",
        };
        if (item.isRequired === 1) {
          elem.required = true;
          elem.placeholder = "必填";
        }
        if (item.isEnum === 1) {
          elem.type = "select";
          elem.options = jt.fn.generateEnums(item.enumValue, ",");
        }
        if (item.isBigField === 1) {
          elem.type = "textarea";
        }
        if (elem.type === "select" || elem.type === "textarea") {
          elem.rules = [
            {
              required: elem.required,
              trigger: "change",
              message: `请选择${elem.name}`,
            },
          ];
        } else if (elem.type === "input") {
          elem.rules = [
            {
              required: elem.required,
              trigger: ["blur", "chamge"],
              message: `请输入${elem.name}`,
            },
          ];
        }
        if (elem.type !== "select") {
          if (elem.rules) {
            elem.rules.push({
              validator: (rule, value, callback) => {
                if (value) {
                  if (/\n/.test(value)) {
                    callback(new Error("不允许使用换行符"));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              },
              trigger: "blur",
            });
          } else {
            elem.rules = [
              {
                validator: (rule, value, callback) => {
                  if (value) {
                    if (/\n/.test(value)) {
                      callback(new Error("不允许使用换行符"));
                    } else {
                      callback();
                    }
                  } else {
                    callback();
                  }
                },
                trigger: "blur",
              },
            ];
          }
        }
        return elem;
      });
      return fields;
    },
  },
};
</script>
<style  scoped>
.el-form-item__label {
  text-align: center !important;
}
</style>
