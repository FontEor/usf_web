<template>
  <div class="">
    <div v-show="tenantName" class="apply2022-breadcrumb-right">
      <span>当前申请租户:</span>
      {{ tenantName }}
    </div>
    <el-breadcrumb class="apply2022-breadcrumb" separator=">">
      <el-breadcrumb-item v-for="breadcrumb in breadcrumbList" :key="breadcrumb">{{breadcrumb}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem } from "element-ui";
import { breadcrumbs } from "../store/steps";
import store from '../store';
export default {
  name: "ApplyBreadcrumb",
  components: {
    "el-breadcrumb": Breadcrumb,
    "el-breadcrumb-item": BreadcrumbItem,
  },
  props: {
    // 允许自由传入step步骤
    step: {
      type: String,
      default: undefined
    }
  },
  computed: {
    breadcrumbList() {
      return breadcrumbs[this.step || store.state.stepState.currentName] || []
    },
    tenantName() {
      return store.state.form.tenantName
    }
  },
  methods: {
  }
};
</script>

<style>
</style>