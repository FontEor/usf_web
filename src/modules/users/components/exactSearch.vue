<template>
  <div :class="['basic-search', `basic-search--${this.size}`]">
    <div class="basic-search__bd">
      <div class="col-l">
        <el-form size="small" ref="searchForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input
              v-model.trim="query.userName"
              placeholder="请输入关键词"
              maxlength="{30}"
              clearable
            />
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input
              v-model.trim="query.userCode"
              placeholder="请输入关键词"
              maxlength="{30}"
              clearable
            />
          </el-form-item>
          <el-form-item label="账号别名">
            <el-input
              v-model.trim="query.userAlias"
              placeholder="请输入关键词"
              maxlength="{30}"
              clearable
            />
          </el-form-item>
          <el-form-item label="用户状态">
            <el-select
              v-model="query.userStatus"
              placeholder="请输入关键词"
              clearable
            >
              <el-option key="1" label="启用" value="1"></el-option>
              <el-option key="0" label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属机构" prop="orgCodeList">
            <el-select
              v-model="query.orgCode"
              filterable
              remote
              clearable
              @change="changeOrgCodeList1"
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.orgCode"
                :label="item.orgName.replace(/ > /g, ' / ')"
                :value="item.orgCode"
                style="height: 50px; line-height: normal !important"
              >
                <div
                  style="
                    margin-top: 8px;
                    font-size: 14px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  "
                  :title="item.orgName"
                >
                  {{ item.orgName }} ({{ item.orgCode }})
                </div>
                <span
                  style="
                    font-size: 12px;
                    color: #b4b4b4;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  "
                  :title="item.orgFullName"
                  >{{ item.orgFullName }}</span
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号类型">
            <el-select
              v-model="query.userSystemType"
              placeholder="请输入关键词"
              clearable
            >
              <el-option
                v-for="(item, index) in userSystemTypeOptionList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建来源">
            <el-input
              v-model.trim="query.userSource"
              placeholder="请输入关键词"
              maxlength="{30}"
              clearable
            />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input
              v-model.trim="query.createUser"
              placeholder="请输入关键词"
              clearable
            />
          </el-form-item>
          <el-form-item
            v-for="(item, index) in this.state.extList2.slice(0, topNum)"
            :key="index"
            :label="item.name"
          >
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
        </el-form>
        <el-form v-if="show" size="small" ref="searchForm" label-width="80px">
          <el-form-item
            v-for="(item, index) in this.state.extList2.slice(topNum)"
            :key="index"
            :label="item.name"
          >
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
        </el-form>
      </div>
      <div class="col-r">
        <el-button type="primary" size="small" @click="handleSearch"
          >查询</el-button
        >
        <el-button size="small" @click="handleReset">重置</el-button>
        <div
          v-if="
            (this.size === 'small' && this.state.extList2.length > 2) ||
            (this.size === 'medium' && this.state.extList2.length > 1) ||
            (this.size === 'large' && this.state.extList2.length > 3)
          "
          class="toggle-more-btn"
          @click="showMoreQuestions"
        >
          {{ computedText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    state: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      topNum: 1,
      size: "small",
      showWord: "展开查询",
      show: false,
      // 查询数据模型
      closed: true,
      showMore: false,
      size: "small",
      orgName: "",
      orgCode: "",
      addressNo: "",
      typeFlag: false,
      addType: true,
      systype: [],
      loading: false,
      options: [],
      placeholder: "",
      isButtom: true,
      isShowCreateMfsAccount: false,
      queryMobile: "",
      queryEmail: "",
      queryDept: "",
      queryPosition: "",
      isErpOrPassport: false,
      query: {},
      //表单标签长度
      formLabelWidth: "80px",
      queryChannelNum: 1,
      orgProps: {
        lazy: true,
        lazyLoad: this.queryOrgList,
        label: "orgName",
        value: "orgCode",
        checkStrictly: true,
      },
      userSystemTypeOptionList: (() => {
        const valueList = Object.keys(_params.users.userSystemType);
        const labelList = Object.values(_params.users.userSystemType);
        return valueList.reduce((acc, item, index) => {
          const value = parseInt(item);
          const label = labelList[index];
          return acc.concat({ value, label });
        }, []);
      })(),
    };
  },
  computed: {
    ...mapState("app", ["view"]),
    computedText() {
      if (this.show) {
        this.showMore = "收起查询";
      } else {
        this.showMore = "展开查询";
      }
      return this.showMore;
    },
  },
  watch: {
    "state.visible": {
      handler(newVal) {
        if (newVal) {
          this.handleSearch();
        }
      },
      immediate: true,
    },
    "view.width": {
      immediate: true,
      handler: function (newVal) {
        let size = "";
        this.topList = [];
        this.bottomList = [];
        if (!newVal || newVal < 1360) {
          size = "small";
          this.topNum = 1;
        } else if (newVal >= 1360 && newVal <= 1640) {
          size = "medium";
          this.topNum = 0;
        } else {
          size = "large";
          this.topNum = 2;
        }
        this.size = size;
      },
    },
  },
  methods: {
    showMoreQuestions() {
      this.show = !this.show;
    },
    async queryOrgList({ root, data: obj }, resolve) {
      const params = { data: { tenementCode: this.tenementCode } };
      if (!root) {
        params.data.parentId = obj.id;
      }
      const { code, data, msg } = await api.users.queryOrgList(params);
      if (code === 200) {
        //去掉需要隐藏的机构
        resolve(
          data.filter((item) => item.isHide == null || item.isHide === 0) || []
        );
      } else {
        this.$message.error(msg);
      }
    },
    remoteMethod(queryString, cb) {
      queryString = queryString.trim();
      this.loading = true;
      api.users
        .blurryQueryOrg({
          data: {
            orgNameKeyWord: queryString, //机构模糊搜索关键字，可为空，空字符串查所有
            queryChannelNum: this.queryChannelNum, //2本地搜索 3远程获取
          },
          page: {
            pageIndex: 1,
            pageSize: 1000000000,
          },
        })
        .then((res) => {
          this.loading = false;
          this.options =
            res.data.rows.filter(
              (item) => item.isHide == null || item.isHide === 0
            ) || [];
        });
    },
    changeOrgCodeList1(val) {
      this.remote = true;
      if (val) {
        let options = this.options.find((f) => f.orgFullName === val);
        this.orgName = options.orgName;
        this.orgCode = options.orgCode;
        this.query.orgCode = options.orgCode;
        this.addressNo = options.addressNo;
      }
    },
    changeOrgCodeList() {
      this.placeholder = "";
      this.query.orgCode =
        this.query.orgCodeList[this.query.orgCodeList.length - 1];
    },
    getDefaultQuery(exclude) {
      const fields = this.state.currentFiles.filter((field) => !field.hidden);
      const query = {
        ...DEFAULTFIELDS,
      };
      for (let i = 0; i < fields.length; i++) {
        if (_.isObject(fields[i])) {
          if (exclude && fields[i].exclude) {
            continue;
          }
          query[fields[i].key] = fields[i].default;
        } else {
          query[fields[i]] = undefined;
        }
      }
      return query;
    },
    onDataTypeChange(val) {
      this.query = {};
      this.$parent.queryListDataType({
        done: this.handleSearch,
      });
    },
    toEnd() {
      this.query.typeId = this.state.typeId;
      this.query.tenementCode = this.$store.getters.tenementCode;
      const query = _.cloneDeep(this.query);
      jt.object.removeEmptyAttr(query);
      return query;
    },
    handleReset() {
      this.query = {};
      this.handleSearch();
    },
    handleSearch() {
      this.query.tenementCode = this.$store.getters.tenementCode;
      let query = this.query;
      //子组件将查询参数传值给父组件
      this.$emit("queryParams", this.query);
      this.$parent.updateState({ query, pageIndex: 0 });
      this.$parent.queryList();
    },
    async querySearchThink(value, cb, key) {
      const query = this.toEnd();
      const params = { data: query, page: { pageIndex: 1, pageSize: 10 } };
      if (code === 200) {
        data.rows = data.rows || [];
        const array = Array.from(new Set(data.rows.map((item) => item[key])));
        const result = array.map((item) => ({ value: item }));
        cb(result);
      } else {
        cb();
      }
    },
    queryParam() {
      //获取查询参数
      return this.toEnd();
    },
  },
};
</script>
<style lang="scss" scoped>
.basic-search {
  padding: 20px 0 0;
  .basic-search__hd {
    display: flex;
    padding: 16px 0;
    .col-l {
      flex: 1;
    }
    .col-r {
      width: 162px;
    }
  }
  .basic-search__bd {
    display: flex;
    .col-l {
      flex: 1;
      .el-form {
        display: flex;
        flex-wrap: wrap;
      }
      /deep/ .el-form-item {
        padding-right: 15px;
        margin-right: 0;
        box-sizing: border-box;
      }
    }
    .col-r {
      position: relative;
      padding: 0 0 0 25px;
      width: 162px;
      .el-button {
        width: 75px;
      }

      .toggle-more-btn {
        position: absolute;
        display: inline-block;
        left: 36px;
        bottom: 23px;
        width: 60px;
        font-size: 12px;
        color: #3998fc;
        background: no-repeat center right;
        background-size: auto 9px;
      }
    }
  }
}
.basic-search--close {
  .basic-search__bd {
    .col-l {
      max-height: 102px;
      overflow: hidden;
    }
  }
}
.basic-search--open {
  .basic-search__bd {
    .col-l {
      max-height: none;
    }
  }
}
.basic-search--small {
  /deep/ .el-form-item {
    width: 33.33%;
  }
  /deep/ .span-2 {
    width: 66.67%;
  }
}
.basic-search--medium {
  /deep/ .el-form-item {
    width: 25%;
  }
  /deep/ .span-2 {
    width: 50%;
  }
}
.basic-search--large {
  /deep/ .el-form-item {
    width: 20%;
  }
  /deep/ .span-2 {
    width: 40%;
  }
}
</style>
