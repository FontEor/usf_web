<template>
  <div id="app" v-show="winShow">
    <router-view v-if="$route.meta.isGlobal" />
    <layout v-else-if="computeUserName" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Layout from "@/modules/layout";
import "@/styles/index.scss";
import WaterMark from "watermark-dom";
import axios from "axios";
export default {
  name: "App",
  components: {
    Layout,
  },
  computed: {
    ...mapState("app", ["winShow"]),
    computeUserName() {
      return !this.$route.meta.isGlobal && auth.getCookie("usf_user");
    },
  },
  created() {
    if (window.location.host === "susf.jd.com") {
      this.$store.commit("app/update", { isSusf: true });
    } else {
      this.$store.commit("app/update", { isSusf: false });
    }
    this.$store.dispatch("app/getImageName");
    this.getErp();
    this.showExportButton();
  },
  mounted() {
    //每次刷新的时候清空
    //  this.$store.commit("app/delAllNavTabs");
  },
  methods: {
    showExportButton() {
      axios({
        method: "get",
        url: "/getDegradeSwitch",
        params: { tenementCode: this.$store.state.app.tenementCode },
      })
        .then((resolve) => {
          this.$store.commit("app/update", { showExportButton: resolve.data });
        })
        .catch((reject) => {
          console.log("开关的接口调取失败（原因）", reject);
        });
    },
    getErp() {
      api.users
        .getUserErpInfo({})
        .then((resolve) => {
          if (resolve.code === 200) {
            const { id, userCode, userName, fullPathOrgName, positionName } =
              resolve.data;
            this.addWaterMark(userCode);
            this.$store.commit("app/update", { userCode });
          } else {
            console.log("getUserErpInfoData 返回异常", resolve);
          }
        })
        .catch((reject) => {
          console.log("getUserErpInfoData 请求失败", reject);
        });
    },
    addWaterMark(txt) {
      WaterMark.load({
        watermark_fontsize: "15px",
        watermark_alpha: "0.06",
        watermark_angle: 30,
        watermark_txt: txt,
      });
    },
  },
};
</script>
