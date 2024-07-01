<template>
  <header class="apply2022-header">
    <span class="apply2022-header-title">USF统一权限管理平台</span>
    <div class="apply-2022-header-login-box">
      <el-dropdown @command="onCommandHandler">
        <span class="el-dropdown-link">
          {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu class="apply2022-header-dropdown" slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ApplyHeader",
  mounted() {
    this.queryUsers();
  },
  computed: {
    ...mapGetters(['userName'])
  },
  methods: {
    ...mapActions("app", [
      "logOut",
      "queryUsers",
    ]),
    onCommandHandler(directive) {
      switch (directive) {
        case 'logout':
          this.logOutHandler();
          break;
        default:
          break;
      }
    },
    // 退出登录
    logOutHandler() {
      this.logOut()
        .then((str) => {
          if (str && str.indexOf("/logOut")) {
            // ERP登录
            str.length === 1 &&
              setTimeout(() => {
                window.location.href = str[0];
              });
            // 云仓登录
            str.length === 2 && this.outApi(str);
          } else {
            this.$router.push("/logout");
          }
        })
        .catch(function (error) {
          this.$router.push("/logout");
          console.log("logout error", error);
        });
    },
  },
}
</script>
