<template>
  <div :class="layoutCls">
    <div :class="[`g-sd-${edition}`]">
      <sidebar />
    </div>
    <div class="g-bd">
      <topbar />
      <div class="g-mn">
        <nav-tabs />
        <div class="g-mnc" v-resize:debounce="handleResize">
          <keep-alive :include="keepAliveInclude">
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Topbar from "./components/topbar";
import Sidebar from "./components/sidebar";
import NavTabs from "./components/navTabs";
import "./styles/index.scss";
export default {
  components: {
    Topbar,
    Sidebar,
    NavTabs,
  },
  computed: {
    ...mapState("app", ["fold", "navTabs", "routeMap", "appList", "edition"]),
    layoutCls() {
      const cls = ["layout"];
      if (this.fold) {
        cls.push("layout--fold");
      }
      if (this.$route.meta.showSd === false) {
        cls.push("layout-no-sd");
      }
      return cls;
    },
    keepAliveInclude() {
      const routeMap = this.routeMap;
      const navTabs = this.navTabs;
      const include = [];
      for (let i = 0, len = navTabs.length; i < len; i++) {
        include.push(routeMap[navTabs[i].code].path.substr(1).replace(/\//g, "_"));
      }
      return include;
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (newVal) {
        this.$store.commit("app/actNavTab", {
          ...newVal.meta,
          path: newVal.path,
          query: newVal.query,
        });
      },
    },
  },
  created() {
    // if (!this.appList || (this.appList && !this.appList.length)) {
    //     this.getAppList()
    // }
    // if (!this.allMenus || (this.allMenus && !this.allMenus.length)) {
    //     this.queryUserMenu()
    // }
    // if (this.edition === "old") {
    //   this.$store.dispatch("app/getSystemName");
    // }
  },
  methods: {
    // ...mapActions('app', ['queryUserMenu', 'getAppList']),
    handleResize(el) {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      this.$store.commit("app/update", { view: { width, height } });
    },
  },
};
</script>
