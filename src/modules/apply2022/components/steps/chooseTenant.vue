<template>
  <div class="apply-2022-choose-tenant">
    <h1 class="apply-2022-choose-tenant-title no-select">
      <span>选择业务系统的所属租户<i></i></span>
    </h1>
    <div class="apply-2022-search-container">
      <el-select v-model="tenantId" filterable remote reserve-keyword placeholder="可输入租户名称、租户编码等关键词"
        :remote-method="getList" :popper-append-to-body="false" size="small" >
        <template slot="empty">
          <div class="apply-2022-choose-tenant-empty-message">
            搜索无结果
          </div>
        </template>
        <el-option-group label="以下为模糊搜索结果，点击可选择相应租户">
          <el-option v-for="item in options" :key="item.tenementCode" :label="item.tenementName"
            :value="item.tenementCode" @click.native="handleUpdateActiveTenantInfo(item.tenementCode)">
            <span v-html="item.title"></span>
          </el-option>
        </el-option-group>
      </el-select>
    </div>
    <!-- 常用租户 -->
    <div class="apply-2022-often-tenant">
      <p class="apply-2022-often-tenant-title no-select">快速选择</p>
      <div class="apply-2022-tenant-card-container">
        <div class="apply-2022-tenant-card" v-for="item in commonTenementList" :key="item.id">
          <div class="apply-2022-tenant-card-bgi"></div>
          <div class="apply-2022-tenant-card-main"
            @click="handleUpdateActiveTenantInfo(item.tenementCode, item.tenementExternalLink)">
            <h2 class="apply-2022-tenant-card-title text-overflow">
              {{ item.tenementName }}
            </h2>
            <p class="apply-2022-tenant-card-code">{{ item.tenementCode }}</p>
            <p class="apply-2022-tenant-card-name">{{ item.remark }}</p>
            <div class="apply-2022-tenant-card-buttons">
              <el-button type="text">确认选择<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="apply-2022-step-container">
      <el-button
        type="default"
        size="large"
        @click="() => $router.push({ path: '/apply/new' })"
        >上一步</el-button
      >
    </div>
  </div>
</template>

<script>
import { OptionGroup } from "element-ui";
import lodash from "lodash";
import store from "../../store/index.js";

export default {
  name: "ChooseTenant",
  components: {
    "el-option-group": OptionGroup,
  },
  data() {
    return {
      tenantId: "",
      keyword: "",
      loading: false,
      options: [],
      commonTenementList: [],
    };
  },
  computed: {
    curStep() {
      return store.state.stepState.currentName;
    },
    storeApplyType() {
      return store.state.applyType
    }
  },
  watch: {
    curStep: {
      handler(newVal) {
        if (newVal === "step1") {
          this.$nextTick(() => {
            this.getCommonTenementList();
          })
        }
      },
      immediate: true
    },
    storeApplyType: {
      immediate: true,
      handler(n, o) {
        if (o && o !== n) {
          this.getCommonTenementList()
        }
      }
    }
  },
  mounted() {},
  methods: {
    getCommonTenementList() {
      let request = api.apply2022.queryCommonTenementList
      if (this.storeApplyType === 'applyUser') {
        request = api.apply2022.queryCommonTenementListB
      }
      request()
        .then(({ code, data, msg }) => {
          if (code === 200) {
            this.commonTenementList = data
          } else {
            this.$message.error(msg)
          }
        })
    },
    getList(val) {
      this.keyword = val;
      if (!this.keyword) {
        this.options = [];
        return
      }
      let request = api.apply2022.queryTenementListByCondition
      if (this.storeApplyType === 'applyUser') {
        request = api.apply2022.queryTenementListByConditionB
      }
      request({ tenementNameLike: val })
        .then(response => {
          const { code, data, msg } = response || {};
          if (code === 200) {
            this.options = this.formatKeyword(data)
          } else {
            this.$message.error(msg)
          }
        })
    },
    formatKeyword(list = []) {
      if (!this.keyword) {
        return list;
      }
      const keyword = new RegExp(this.keyword, "g");
      list.forEach((item) => {
        item.title = lodash.replace(
          item.tenementName || "",
          keyword,
          `<span class="keyword">${this.keyword}</span>`
        ) + `(${item.tenementCode})`;
      });
      return list;
    },
    handleUpdateActiveTenantInfo(val, link) {
      let item
      if (this.options.length) {
        item = this.options.find(opt => opt.tenementCode == val)
      }
      if (link || (item && item.tenementExternalLink)) {
        window.open(link || item.tenementExternalLink,'_blank');
        return
      }
      this.tenantId = "";
      store.commit('updateForm', {
        key: "tenantId",
        value: val
      })
      let instance = this.findOrgInstance(this.options, val);
      if (!instance) {
        instance = this.findOrgInstance(this.commonTenementList, val);
      }
      this.options = [];
      store.commit('updateForm', {
        key: "tenantName",
        value: instance.tenementName
      })
      store.commit('updateActiveApplyStep', { step: 1 })
    },
    handleBlur() {
      this.options = [];
    },
    findOrgInstance(list = [], code) {
      return list.find(item => {
        return item.tenementCode === code
      })
    },
  },
};
</script>

<style>

</style>