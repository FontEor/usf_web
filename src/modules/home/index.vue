<template>
  <div class="p-basic p-home">
    <h1 class="title">使用手册</h1>
    <div class="chooseTenementBox">
      <ul>
        <li>
          <div class="label">机构与用户管理</div>
          <div class="contBox">
            <p>
              <span>机构管理-添加子机构：</span
              >您可以通过新建部门的方式，来管理您企业各部门员工的账号；当您新增了合作伙伴时，您应该直接在您的公司下新建【企业】类型的机构。您可以管理您合作伙伴的部门或账号，但是合作伙伴无法看到您公司/部门的信息。
            </p>
            <p>
              <span>机构管理-设置机构菜单角色：</span
              >当某个机构被设置了菜单角色时，该机构下的直属员工将获得菜单角色对应的菜单/按钮的操作权限，但该机构的下级部门不会获得该权限。
            </p>
            <p>
              <span>用户管理-添加用户：</span
              >如果一个人想要使用系统，那么他的账号必须被添加到用户列表中，否则当他登录系统时，会被提示‘无权限’或者‘用户不存在’。
            </p>
            <p>
              <span>用户管理-停用/启用：</span
              >如果某个用户被停用了，那么当他登录系统时，会被提示‘无权限’或者‘账号已停用’，重新启用后，则会恢复权限。
            </p>
            <p>
              <span>用户管理-分配菜单角色：</span
              >当用户被分配了某个菜单角色后，他会拥有这个菜单角色中菜单/按钮的使用权。
            </p>
            <p>
              <span>用户管理-分配数据角色：</span
              >当用户被分配了某个数据角色后，他会拥有这个菜单角色中数据的使用权。
            </p>
            <p>
              <span>用户管理-分配数据权限：</span
              >当用户被分配了某条数据权限后，他会拥有这条数据的使用权。
            </p>
          </div>
        </li>
        <li>
          <div class="label">分配系统操作权限</div>
          <div class="contBox">
            <p>
              <span>菜单资源管理：</span
              >系统的研发/产品同事可以在此管理各个系统的菜单/按钮资源，以便权限系统帮助您控制各个用户在系统中的权限。
            </p>
            <p>
              <span>菜单角色管理：</span
              >您可以将多个菜单/按钮打包放入一个角色中，然后将这个角色赋予员工，这样员工就能拥有角色内对应的菜单/按钮的权限。
            </p>
            <p>
              <span>数据类型管理：</span
              >用户会在不同的场景下用到不同类型的数据，如果您想控制这些数据的权限，您需要在此定义数据类型，在备注中详细说明用户在哪些场景下会用到这类数据。
            </p>
            <p>
              <span>数据资源管理：</span
              >将需要控制权限的数据添加到数据列表中，以便权限系统帮助您控制权限。您可将这些数据的权限分配员工。
            </p>
            <p>
              <span>数据角色管理：</span
              >您可以将多条数据打包放入一个角色中，然后将这个角色赋予员工，这样员工就能拥有角色内对应的数据的权限。
            </p>
          </div>
        </li>
      </ul>
      <ul>
        <li>
          <div class="label">分配管理权限</div>
          <div class="contBox">
            <p>
              <span>我的菜单管理权限：</span
              >在此，我们列出了您具有管理权限的菜单/按钮，您可以基于这些菜单/按钮，在【分配操作权限-菜单角色管理】中建立新的菜单角色；特别的，您拥有哪些菜单/按钮的管理权限，取决于上级领导在【分配管理权限-给管理员授权-分配菜单管理权限】中给您分配了哪些菜单/按钮的管理权限。
            </p>
            <p>
              <span>我的数据管理权限：</span
              >在此，列出了您具有管理权限的数据，您可以基于这些数据，在【分配操作权限-数据角色管理】中建立新的数据角色；特别的，您拥有哪些数据的管理权限，取决于上级领导在【分配管理权限-给管理员授权-分配数据管理权限】中给您分配了哪些数据的管理权限。
            </p>
            <p>
              <span>菜单角色管理权限：</span
              >在此，列出了您具有管理权限的菜单角色，在【分配操作权限-菜单角色管理】中将这些角色分配给其他人；特别的，您拥有哪些菜单角色的管理权限，取决于上级领导在【分配管理权限-给管理员授权-分配菜单角色管理权限】中给您分配了哪些菜单角色的管理权限。
            </p>
            <p>
              <span>数据角色管理权限：</span
              >在此，列出了您具有管理权限的数据角色，在【分配操作权限-数据角色管理】中将这些角色分配给其他人；特别的，您拥有哪些数据角色的管理权限，取决于上级领导在【分配管理权限-给管理员授权-分配数据角色管理权限】中给您分配了哪些数据角色的管理权限。
            </p>
            <p>
              <span>给管理员授权：</span
              >如果您想让其他人也能在某个机构下建立子机构，或者管理这个机构下的成员，为这个机构下的成员分配权限，那么您应该在【分配机构管理权限】中，将这个机构的管理权限分给他。如果您想让其他人也能为员工分配系统的各种操作权限，您应该将对应的菜单/数据资源或菜单/数据角色分配给他。
            </p>
            <p>
              <span>我的机构管理权限：</span
              >在此，列出了您具有管理权限的机构。特别的，当您为合作伙伴分配超级管理员账号时，您应该在【设置机构超级管理员】中，将该账号设置为合作伙伴对应机构的超级管理员。
            </p>
          </div>
        </li>
        <li>
          <div class="label">平台管理</div>
          <div class="contBox">
            <p>
              <span>应用管理：</span
              >如果您想控制软件系统的权限，您应该在此托管该软件系统
            </p>
            <p>
              <span>操作日志：</span
              >如果您想追溯权限分配的具体过程，您可以在此查看所有用户的操作日志
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div class="messageDialog">
      <el-dialog
        :visible.sync="messageVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="600px"
      >
        <div slot="title">
          <div class="messageBackGround">
            <span class="title">{{ messageTitle }}</span>
          </div>
        </div>
        <pre class="mainWord">
            {{ headerWord }}<span style="color:red">{{redText}}</span> {{ footerWord }}
        </pre>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="handleClickMessageDialogMinorButton"
            >了解详情</el-button
          > -->
          <el-button type="primary" @click="messageVisible = false"
            >我知道了</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      messageVisible: false,
      messageTitle: "重要通知！",
      //   mainWord: `各位USF的用户好：
      // 近期因七大区域架构撤销，为了保障系统的稳定性，假如您的租户里存放了大量七大区域的数据，并且您需要进行数据的大批量变更，包括但不限于通过接口或者本管理端进行操作，请提前联系产品：储钰昊（erp：chuyuhao1），研发：郑贵楠（erp：zhengguinan），我们一起评估系统风险，助力架构调整。`,
      redText: "封板期间USF所有的【导入】、【导出】功能将暂时下线",
      headerWord: `
USF的用户：
您好！
    为了确保双11大促期间系统正常运行，在`,
      footerWord: `，封板结束后恢复正常使用。期间如有紧急导数需要可以咚咚联系USF小妹（org.missusf）。为了避免因此引起的业务运转不便，请各位提前处理数据。

封板时间为：10月21日23:00-11月14日14:00

                                                                                            USF团队`,
    };
  },
  computed: {
    ...mapGetters([
      "userName",
      "tenementInfoArr",
      "tenementInfoObj",
      "tenementCode",
    ]),
    ...mapState("app", ["sdMenus"]),
  },
  methods: {
    ...mapActions("app", [
      "globalTenementCode",
      "logOut",
      "queryUsers",
      "queryUserMenu",
      "getAppList",
    ]),
    handleClickMessageDialogMinorButton() {
      window.open("//lcp.jdl.com/#/manaul/4pl-susf/53278", "_blank");
      this.messageVisible = false;
    },
  },
  mounted() {
    // 清楚旧的弹窗提示
    const messageShow = localStorage.getItem("messageShow");
    messageShow && localStorage.removeItem("messageShow");
    // 弹窗内容更新后，用户首次进入时显示弹窗
    const currentVersion = "3.2.5";
    const messageDialog =
      JSON.parse(localStorage.getItem("messageDialog")) || {};
    const { version, userName, time } = messageDialog;
    // 72000000
    if (
      // 时间戳存在
      time &&
      // 并且小于20小时
      Date.now() - time < 72000000 &&
      // 版本是否相同
      // version === currentVersion &&
      userName === this.$store.getters.userName
    ) {
      this.messageVisible = false;
    } else {
      // this.messageVisible = true;
      localStorage.setItem(
        "messageDialog",
        JSON.stringify({
          version: currentVersion,
          userName: this.$store.getters.userName,
          // 增加时间存储
          time: Date.now(),
        })
      );
    }
  },
};
</script>

<style lang="scss" scoped>
.messageDialog {
  .messageBackGround {
    height: 170px;
    background-image: url(" ../../imgs/message.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-size: 100% 170px;
  }
  .title {
    color: white;
    font-size: 30px;
    font-weight: bold;
    position: relative;
    top: 53px;
    left: 8px;
  }
  .mainWord {
    font-size: 18px;
    //color: #f30213;
    white-space: pre-wrap;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
      Microsoft YaHei, "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  }
  /deep/ .el-dialog {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
    height: 600px;
  }
  /deep/ .el-dialog__header {
    padding: 0px;
  }
  /deep/ .el-dialog__body {
    padding: 0 24px;
    padding-top: 0;
    overflow: auto;
    min-height: 180px;
  }
  .dialog-footer {
    text-align: center;
    .el-button + .el-button {
      margin-left: 30px;
    }
  }
}

.title {
  padding: 20px 20px;
  font-weight: bold;
  font-size: 22px;
}
.chooseTenementBox {
  ul {
    display: block;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      width: 50%;
      .label {
        padding: 20px 20px 0;
      }
      .contBox {
        box-sizing: border-box;
        border: 2px solid rgba(204, 204, 204, 0.3);
        border-radius: 5px;
        box-shadow: 5px 5px 5px rgba(204, 204, 204, 0.3);
        margin: 20px;
        padding: 15px 20px;
        cursor: pointer;
        height: 180px;
        font-size: 14px;
        line-height: 1.8;
        overflow-y: scroll;

        span {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
