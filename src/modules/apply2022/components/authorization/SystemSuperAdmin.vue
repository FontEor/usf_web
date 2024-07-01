<template>
  <div class="apply-2022-auth-choose-c">
    <div>
      <h3>
        选择USF系统超管
        <span v-if="usfAdministratorHint">
          <a :href="usfAdministratorHint" target="_blank">如何选择权限?</a>
        </span>
        <span v-else>
          <a href="javascript:void(0);">如何选择权限?</a>
        </span>
      </h3>
      <div class="apply-2022-auth-choose-add flex_style_usf">
        <span> 点击单选框进行勾选： </span>&nbsp;&nbsp;
        <el-checkbox v-model="isUsfAdministrator"></el-checkbox>
      </div>
    </div>
  </div>
</template>

  <script>
import { uniqBy } from "lodash";
import filterMixins from "../../mixins/filters";
import webPageMixins from "../../mixins/webPage";
import store from "../../store";

export default {
  name: "SystemSuperAdmin",
  mixins: [filterMixins, webPageMixins],
  components: {},
  data() {
    return {
      dialogVisible: false,
      isUsfAdministrator: 0,
    };
  },
  computed: {
    applyType() {
      return store.state.applyType;
    },
    usfAdministratorHint() {
      return (
        store.state.configInfo && store.state.configInfo.usfAdministratorHint
      );
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.flex_style_usf{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
