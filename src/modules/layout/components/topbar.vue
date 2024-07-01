<template>
  <div :class="['topbar', 'f-cb', `topbar-${edition}`]">
    <div class="topbar__col--l f-fl">
      <a class="menu-popover__ref">
        <i class="el-icon-menu"></i>
        <top-menu-popover />
      </a>
      <top-menu />
    </div>

    <div class="topbar__col--r f-fr">
      <el-popover
        placement="top-start"
        width="auto"
        v-model="popoverVisible"
        trigger="click"
      >
        <div class="user-info">
          <ul>
            <li @click="handleChangeTenement" style="cursor: pointer">
              <!-- 切换租户 -->
              {{ TenementDialogTitle }}
            </li>
            <li @click="logOutHandler" style="cursor: pointer">注销登录</li>
          </ul>
        </div>
        <div slot="reference">
          <span
            v-if="tenementInfoObj && tenementInfoObj.tenementName"
            :class="[`tenementInfoObj-${edition}`]"
            >{{
              !!tenementInfoObj
                ? tenementInfoObj.tenementName +
                  "(" +
                  tenementInfoObj.tenementCode +
                  ")"
                : ""
            }}</span
          >&nbsp;&nbsp;
          <el-button v-if="userName">{{ userName }}</el-button>
        </div>
      </el-popover>
    </div>

    <!-- <div v-if="tenementInfoObj && tenementInfoObj.tenementName"> -->
    <div style="height: 62px; min-width: 800px;">
      <!--关闭提示之后的帮助中心 -->
      <div
        v-show="helper === true && edition === 'old'"
        class="topbar__col--r f-fr"
      >
        <el-popover
          placement="top-start"
          width="auto"
          v-model="helpVisible"
          trigger="click"
        >
          <div class="user-info">
            <ul>
              <li
                @click="link1"
                :clstag="clstag('public_1619351066497|4')"
                style="cursor: pointer"
              >
                使用手册
              </li>
              <li
                @click="link2"
                :clstag="clstag('public_1619351066497|5')"
                style="cursor: pointer"
              >
                接口文档
              </li>
              <li
                @click="link3"
                :clstag="clstag('public_1619351066497|6')"
                style="cursor: pointer"
              >
                常见问题
              </li>
            </ul>
          </div>
          <div slot="reference">
            <span style="cursor: pointer">
              <img
                class="help"
                src="../../../imgs/help.svg"
                height="13"
                width="25"
              />
              <span :class="[`helpWord-${edition}`]">帮助文档</span></span
            >
          </div>
        </el-popover>
      </div>

      <!-- 第一次进入时候显示的样子（帮助中心） -->
      <div v-show="helper === false" class="topbar__col--r f-fr popover">
        <el-popover
          placement="top-start"
          width="auto"
          v-model="help1Visible"
          trigger="click"
        >
          <div class="user-info">
            <p>产品使用手册，接口文档<br />今后可以在这里查看啦~</p>
            <div style="text-align: right; margin: 10px 0 0">
              <span class="iGet" @click="changeHelp">我知道了</span>
            </div>
          </div>
          <div slot="reference">
            <span style="cursor: pointer">
              <img
                class="help"
                src="../../../imgs/help.svg"
                height="13"
                width="25" />
              <span :class="[`helpWord-${edition}`]">帮助文档</span>
              <div class="badge"></div
            ></span>
          </div>
        </el-popover>
      </div>
      <div class="changeMenu">
        <el-button
          v-show="edition === 'old'"
          :clstag="clstag('public_1619351066497|1')"
          type="text"
          class="topbar__col--r f-fr toNewEdition"
          @click="changeEdition('new')"
        >
          <span
            ><img
              class="change"
              src="../../../imgs/changeMenu.png"
              height="13"
              width="20"
            />
            <span :class="[`helpWord-${edition}`]">切换新版</span></span
          ></el-button
        >
        <el-button
          v-show="edition === 'new'"
          type="text"
          class="topbar__col--r f-fr"
          @click="link1"
        >
          <span :class="[`helpWord-${edition}`, 'change']"
            >使用手册</span
          ></el-button
        >
        <el-button
          v-show="edition === 'new'"
          type="text"
          class="topbar__col--r f-fr"
          @click="link2"
        >
          <span :class="[`helpWord-${edition}`, 'change']">
            接口文档</span
          ></el-button
        >
        <el-button
          v-show="edition === 'new'"
          :clstag="clstag('public_1619351066497|2')"
          type="text"
          class="topbar__col--r f-fr toOldEdition"
          @click="changeEdition('old')"
        >
          <span>
            <span :class="[`helpWord-${edition}`]">切换旧版</span></span
          ></el-button
        >
        <el-input
          class="topbar__col--r f-fr"
          v-show="edition === 'new'"
          placeholder="输入关键字以搜索文档"
          :clstag="clstag('public_1619351066497|7')"
          prefix-icon="el-icon-search"
          v-model="questionWord"
          @keyup.enter.native="submitQuestion()"
        >
        </el-input>
      </div>
    </div>

    <!-- 切换租户对话框 -->
    <el-dialog
      :title="TenementDialogTitle"
      :visible.sync="changeTenementDialogVisible"
      width="1000px"
      top="10vh"
      custom-class="change-tenement-dialog"
      @close="$refs.changeTenementDialogForm.resetFields()"
    >
      <div v-loading="tableLoading" class="change-tenement-dialog__content">
        <!-- 租户编码/名称查询表单 -->
        <el-form
          ref="changeTenementDialogForm"
          :model="changeTenementDialogFormData"
          :inline="true"
          label-width="72px"
          class="change-tenement-dialog__form"
          @submit.native.prevent
        >
          <el-form-item label="租户编码" prop="tenementCode">
            <el-input
              v-model.trim="changeTenementDialogFormData.tenementCode"
              placeholder="请输入租户编码"
              size="small"
              style="width: 240px"
              :clearable="true"
              @keyup.enter.native="handleSearchTenement"
            ></el-input>
          </el-form-item>
          <el-form-item label="租户名称" prop="tenementNameLike">
            <el-input
              v-model.trim="changeTenementDialogFormData.tenementNameLike"
              placeholder="请输入租户名称"
              size="small"
              style="width: 240px"
              :clearable="true"
              @keyup.enter.native="handleSearchTenement"
            ></el-input>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" size="small" @click="handleSearchTenement"
              >查 询</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 租户列表 -->
        <div
          v-infinite-scroll="loadTenementInfoList"
          :infinite-scroll-distance="16"
          infinite-scroll-disabled="computeScrollDisabled"
          ref="changeTenementDialogTable"
          class="change-tenement-dialog__table"
        >
          <el-row>
            <el-col v-for="item in tenementInfoList" :key="item.id" :span="8">
              <el-card @click.native="toggleTenement(item)">
                <template slot="header">
                  <div class="table-header">
                    <p class="table-header__text">{{ item.tenementName }}</p>
                    <i class="el-icon-arrow-right" />
                  </div>
                </template>
                <div class="table-content">
                  <p class="table-content__text tenement-code">
                    编码：{{ item.tenementCode }}
                  </p>
                  <p class="table-content__text remark">
                    {{ item.remark ? `备注：${item.remark}` : "&nbsp;" }}
                  </p>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <p
            v-if="scrollLoading"
            style="padding: 8px; text-align: center; color: #666"
          >
            加载中...
          </p>
          <p
            v-if="computeNoMoreTenement"
            style="padding: 8px; text-align: center; color: #666"
          >
            没有更多租户了
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { clstagData } from "@/utils/req";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import TopMenu from "./topMenu";
import TopMenuPopover from "./topMenuPopover";
import { setTimeout } from "timers";
import axios from "axios";

export default {
  components: {
    TopMenu,
    TopMenuPopover,
  },
  data() {
    return {
      questionWord: "",
      popoverVisible: false,
      helpVisible: false,
      helper: true,
      help1Visible: true,

      // 切换租户对话框
      changeTenementDialogVisible: false,
      changeTenementDialogFormData: { tenementCode: "", tenementNameLike: "" },
      tenementInfoList: [],
      tenementInfoTotalList: [],
      changeTenementDialogPage: 1,
      changeTenementDialogPageSize: 36,
      scrollLoading: false,
      tableLoading: false,
      TenementDialogTitle: "选择租户",
    };
  },
  computed: {
    ...mapGetters([
      "userName",
      "tenementInfoArr",
      "tenementInfoObj",
      "tenementCode",
    ]),
    ...mapState("app", ["edition", "logoText", "userCode"]),
    // 计算没有更多租户的显示
    computeNoMoreTenement() {
      return this.tenementInfoList.length >= this.tenementInfoTotalList.length;
    },
    // 计算滚动加载是否禁用
    computeScrollDisabled() {
      return this.scrollLoading || this.computeNoMoreTenement;
    },
  },
  watch: {
    changeTenementDialogVisible: {
      async handler(newValue) {
        // 切换租户对话框初始化
        if (newValue) {
          this.tableLoading = true;
          await this.globalTenementCode().catch(() => {
            throw new Error("changeTenementDialogVisible globalTenementCode");
          });
          this.tableLoading = false;
          this.tenementInfoTotalList = this.tenementInfoArr || [];
          this.tenementInfoList = this.tenementInfoTotalList.slice(
            0,
            this.changeTenementDialogPageSize
          );
        } else {
          this.tenementInfoList = [];
          this.changeTenementDialogPage = 1;
          this.changeTenementDialogPageSize = 36;
        }
      },
    },
  },
  methods: {
    ...mapActions("app", [
      "globalTenementCode",
      "logOut",
      "queryUsers",
      "queryUserMenu",
      "queryUserMenuNew",
      "getAppList",
      "getSystemName",
      "logSwitchMenuEdition",
    ]),
    // 根据租户编码或租户名称查询租户信息
    async findTenementCode() {
      let { tenementCode, tenementNameLike } =
        this.changeTenementDialogFormData;
      tenementCode = tenementCode || undefined;
      tenementNameLike = tenementNameLike || undefined;
      const data = { tenementCode, tenementNameLike };
      return await api.tenement.findTenementCode(data);
    },

    clstag(data) {
      clstagData(data);
    },
    changeEdition(edition) {
      this.$store.commit("app/update", { edition });
      edition === "new" &&
        this.$store.commit("app/update", { logoText: "USF3权限系统" });
      this.$store.commit("app/update", { allMenus: [] });
      this.$store.commit("app/delAllNavTabs");
      this.getAppList();
      if (this.tenementCode) {
        // 切换租户后更新菜单
        edition === "old" && this.queryUserMenu();
        edition === "new" && this.queryUserMenuNew();
      }
      localStorage.setItem("edition", JSON.stringify(edition));
      this.logSwitchMenuEdition();
    },
    // 退出登录
    logOutHandler() {
      this.popoverVisible = false;
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
    async outApi(_str) {
      // 保存当前域名
      const _href = window.location.origin;
      // 请求第一个api
      await axios({
        method: "get",
        url: _str[0],
        withCredentials: true,
      });
      // 请求第二个api
      await axios({
        method: "get",
        url: _str[1],
        withCredentials: true,
      })
        .then((ev) => {
          console.log("then:", ev);
        })
        .catch((ev) => {
          console.log("catch:", ev);
        });
      // 重载当前页面
      window.location.href = _href;
    },
    getActiveClass(item = {}) {
      return this.tenementInfoObj.tenementCode === item.tenementCode
        ? "active"
        : "";
    },
    // 点击对话框中切换租户
    toggleTenement(tenementInfoObj) {
      const { id, tenementCode, tenementName } = tenementInfoObj;
      // 切换租户时，需要更新租户cookie、调用getAppList和菜单等
      if (!id) return;
      this.$store.commit("app/delAllNavTabs");
      this.changeTenementDialogVisible = false;
      if (tenementCode) {
        const payload = {
          userName: this.$store.getters.userName,
          tenementInfoObj,
          tenementCode,
        };
        this.$store.commit("app/update", payload);
        this.$store.commit("app/setTenementCookie", payload);
        this.$message({
          showClose: true,
          message: "租户已切换至：" + tenementName,
          type: "success",
          duration: 2000,
          offset: 60,
        });
        this.$store.commit("app/update", { logoText: "USF3权限系统" });
        this.$store.commit("app/update", { allMenus: [] });
        this.$store.commit("app/delAllNavTabs");
        const edition = JSON.parse(localStorage.getItem("edition")) || "new";
        this.$store.commit("app/update", { edition });
        this.getAppList();
        // 切换租户后更新菜单
        edition === "old" && this.queryUserMenu();
        edition === "new" && this.queryUserMenuNew();
      }
    },
    // 点击切换租户
    handleChangeTenement() {
      // const { tenementInfoArr } = this;
      // if (tenementInfoArr && tenementInfoArr.length > 0) {
      this.changeTenementDialogVisible = true;
      this.TenementDialogTitle = this.tenementCode ? "切换租户" : "选择租户";
      // } else {
      //   this.$message.error("当前账户没有租户!");
      // }
    },
    // 滚动加载租户列表
    loadTenementInfoList() {
      this.scrollLoading = true;
      setTimeout(() => {
        this.changeTenementDialogPage += 1;
        const endIndex =
          this.changeTenementDialogPage * this.changeTenementDialogPageSize;
        this.tenementInfoList = this.tenementInfoTotalList.slice(0, endIndex);
        this.scrollLoading = false;
      }, 1000);
    },
    // 点击查询租户 根据租户编码或租户名称
    async handleSearchTenement() {
      this.tableLoading = true;
      this.changeTenementDialogPage = 1;
      this.changeTenementDialogPageSize = 36;
      const { code, msg, data } = await this.findTenementCode();
      if (code === 200) {
        if (data && data.length > 0) {
          this.$refs.changeTenementDialogTable.scrollTop = 0;
          this.tenementInfoTotalList = data || [];
          this.tenementInfoList = this.tenementInfoTotalList.slice(
            0,
            this.changeTenementDialogPageSize
          );
        } else {
          this.tenementInfoList = [];
        }
      } else {
        this.$message.error(msg);
      }
      setTimeout(() => {
        this.tableLoading = false;
      }, 300);
    },
    link1() {
      window.open("http://lcp.jdl.com/#/manaul/4pl-susf/39601", "_blank");
      // window.location.href = "http://lcp.jdl.com/#/docSoftwareSystem/24/40411";
    },
    link2() {
      window.open("http://lcp.jdl.com/#/apidoc/4pl-susf/26", "_blank");
      // window.location.href = "https://git.jd.com/usf-demo/susf-demo/tree/master";
    },
    link3() {
      window.open("http://lcp.jdl.com/#/docSoftwareSystem/24/52849", "_blank");
      // window.location.href = "http://lcp.jdl.com/#/docSoftwareSystem/24/52849";
    },
    changeHelp() {
      this.help1Visible = false;
      this.helper = true;
    },

    submitQuestion() {
      if (this.questionWord !== "") {
        window.open(
          `http://lcp.jdl.com/#/searchResult?q=${this.questionWord}&productId=24&activeName=fifth`,
          "_blank"
        );
      }
    },
  },
  created() {
    this.changeTenementDialogVisible = !this.tenementCode;
    this.TenementDialogTitle = this.tenementCode ? "切换租户" : "选择租户";
  },
  mounted() {
    // 清除旧的帮助文档提示
    const topBarHelp = localStorage.getItem("topBarHelp") || "";
    topBarHelp && localStorage.removeItem("topBarHelp");
    // // 默认显示用户上次选择的导航栏版本
    const edition = JSON.parse(localStorage.getItem("edition")) || "new";
    this.$store.commit("app/update", { edition });
  },
};
</script>

<style lang="scss" scoped>
.tenementInfoObj-old {
  color: #000;
}
.tenementInfoObj-new {
  color: #ffff;
}
.changeMenu {
  height: 62px;
  .el-button {
    margin-top: 8.5px;
    margin-right: -7px;
    color: #888888;
    font-size: 14px;
  }
  .change {
    position: relative;
    left: -2px;
    top: 1px;
  }
  .el-input {
    border-radius: 14px;
    height: 8px;
    width: 210px;
  }
  /deep/ .el-input__inner {
    border-radius: 14px;
    height: 28px;
    border: 0px solid #0091ff;
  }
}
.iGet {
  color: #409eff;
  margin-right: 10px;
}
.badge {
  border-radius: 50%;
  margin-top: 10px;
  background-color: #e1251b;
  position: absolute;
  top: 0;
  color: #fff;
  display: inline-block;
  height: 8px;
  width: 8px;
  padding: 0 px;
  white-space: nowrap;
  border: 1px solid #fff;
}
.firstHelper {
  .el-popover {
    margin-top: 50px;
    margin-left: -40px;
  }
}
.topbar-new {
  position: relative;
  height: $--tb-height;
  line-height: $--tb-height;
  background-color: $--tb-bg-new;
  box-shadow: 0px 2px 40px 0px rgba(65, 70, 76, 0.07);
  font-size: 14px;
  border-bottom: 2px solid #e8ecef;
}
.topbar-old {
  position: relative;
  height: $--tb-height;
  line-height: $--tb-height;
  background-color: $--tb-bg;
  box-shadow: 0px 2px 40px 0px rgba(65, 70, 76, 0.07);
  font-size: 14px;
  border-bottom: 2px solid #e8ecef;
}
.help {
  position: relative;
  left: 5px;
  top: 1px;
}
.helpWord-old {
  color: #888888;
}
.helpWord-new {
  color: #fff;
}
.topbar__col--l {
  margin-left: 15px;
  .menu-popover__ref {
    display: inline-block;
    display: none; // 暂时隐藏
    padding: 0 18px;
    font-size: 24px;
    vertical-align: middle;
    box-shadow: 3px 0px 10px -4px rgba(0, 0, 0, 0.16);

    &:hover {
      .top-menu-popover {
        opacity: 1;
        z-index: 10000;
      }
    }
  }

  /deep/ .top-menu-popover {
    position: absolute;
    left: 0;
    right: 0;
    opacity: 0;
    z-index: -1;
    border-radius: 4px;
    border: 1px solid #dfdfdf;
    background: #fafafa;
    box-shadow: 0px 3px 11px 0px rgba(56, 62, 68, 0.09);
    transition: all 0.3s;
  }

  /deep/ .top-menu {
    display: inline-block;
  }
}

.topbar__col--r {
  padding-right: 20px;
}

//wanghl  租户临时
$blue: rgba(64, 158, 255, 0.3);
$light_blue: rgba(64, 158, 255, 0.05);
.active {
  background: $light_blue;
  border: 2px solid $blue !important;
}
.user-info {
  li {
    height: 40px;
    line-height: 40px;
  }
}
.popover /deep/.el-popover {
  top: 60px;
  margin-left: -30px;
}

.topbar {
  .el-dialog__wrapper {
    // 切换租户对话框
    line-height: normal;
    /deep/ .change-tenement-dialog {
      .el-dialog__header {
        padding: 8px 24px;
        border-bottom: 1px solid #eaeaea;
        .el-dialog__headerbtn {
          top: 14px;
          right: 24px;
        }
      }

      .el-dialog__body {
        padding: 4px 16px;
        .change-tenement-dialog__content {
          .change-tenement-dialog__form {
            .el-form-item {
              margin-bottom: 8px;
              .el-form-item__label {
                vertical-align: top;
              }
              .el-form-item__content {
                .el-input__inner {
                  border-radius: 4px;
                }
                .el-button--small {
                  border-radius: 4px;
                }
              }
            }
          }
          .change-tenement-dialog__table {
            overflow: auto;
            height: 64vh;
            .el-card {
              margin: 8px;
              cursor: pointer;
              &:hover {
                border: 1px solid #3c6ef0;
              }
              .el-card__header {
                padding: 10px 16px;
                line-height: 1em;
                .table-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-weight: 600;
                  .table-header__text {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #333;
                  }
                  .el-icon-arrow-right {
                    color: #999;
                  }
                }
              }
              .el-card__body {
                padding: 8px 16px;
                .table-content__text {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  &.tenement-code {
                    color: #999;
                    line-height: 1.5em;
                  }
                  &.remark {
                    color: #999;
                    line-height: 1.5em;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
