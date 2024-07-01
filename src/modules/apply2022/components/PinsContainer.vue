<template>
  <div class="apply-2022-auth-choose-c apply-2022-pin-container">
    <div class="apply-2022-info-toast" v-if="applyType==='other'">
      代人申请时，系统将为被代理人账号{{ title }}相同权限
    </div>
    <div class="apply-2022-info-toast" v-else>
      本人申请时，系统将为申请人账号{{ title }}相同权限
    </div>
    <div>
      <h3>
        <p v-if="applyType==='other'">被代理人账号</p>
        <p v-else>申请人账号</p>
        <el-tooltip v-if="applyType==='other'" class="apply-2022-pin-export-error" effect="dark" content="申请过程中所移除的异常账号清单" placement="top">
          <el-button type="text" :disabled="!errors.length" @click="onExport">导出错误账号</el-button>
        </el-tooltip>
      </h3>
    </div>
    <div :class="{
        'expand': expand
      }" class="apply-2022-pin-content">
      <div ref="content" class="apply-2022-pin-compute" v-if="applyType==='other'">
        <span v-for="(account,index) in accounts" :key="index">{{ account.userCode }}</span>
      </div>
      <div ref="content" class="apply-2022-pin-compute" v-else>
        <span>{{ userCode }}</span>
      </div>
      <div v-if="enableExpand" class="apply-2022-pin-expand" @click="onToggle">
        {{ expand ? '收起' : '展开' }}
        <i class="el-icon-arrow-down"></i>
      </div>
    </div>
  </div>
</template>
<script>
import exportMixins from "../mixins/export";

export default {
  mixins: [exportMixins],
  name: "PinsContainer",
  props: {
    accounts: {
      type: Array,
      default: () => []
    },
    errors: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "申请"
    },
    applyType: {
      type: String,
      default: "other"
    },
    userCode: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      expand: false,
      enableExpand: false
    }
  },
  mounted() {
    this.computeHeight();
  },
  methods: {
    onToggle() {
      this.expand = !this.expand
    },
    computeHeight() {
      const style = window.getComputedStyle(this.$refs.content);
      const height = parseInt(style.height);
      if(height > 105) {
        this.enableExpand = true;
      }
    },
    onExport() {
      this.download();
    }
  },
}
</script>
