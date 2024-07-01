<script>
import { mapState } from "vuex";
import theme from "@/styles/theme/index.scss";
import applyManagementIcon from "../../../imgs/applyManagementIcon.png";
import businessPowerIcon from "../../../imgs/businessPowerIcon.png";
export default {
  computed: {
    ...mapState("app", [
      "fold",
      "allMenus",
      "sdMenus",
      "actTab",
      "routeMap",
      "edition",
      "menuExpandList",
    ]),
  },
  render() {
    if (this.edition === "new") {
      return (
        <div class={"new"}>
          <el-menu
            class="side-menu sideNew"
            unique-opened={false}
            router={false}
            collapse={this.fold}
            text-color={theme.sdMenuColorNew}
            active-text-color={theme.sdMenuActiveColor}
            default-active={this.actTab}
            background-color={theme.sdMenuBgNew}
            onSelect={this.onSelect}
            default-openeds={this.menuExpandList}
          >
            {this.getMenuItem(this.allMenus)}
          </el-menu>
        </div>
      );
    } else if (this.edition === "old") {
      return (
        <div class={"old"}>
          <el-menu
            class="side-menu sideOld"
            unique-opened={false}
            router={false}
            collapse={this.fold}
            text-color={theme.sdMenuColor}
            active-text-color={theme.sdMenuActiveColor}
            default-active={this.actTab}
            background-color={theme.sdMenuBg}
            onSelect={this.onSelect}
            default-openeds={this.menuExpandList}
          >
            {this.getMenuItem(this.sdMenus)}
          </el-menu>
        </div>
      );
    }
  },
  methods: {
    getMenuIcon(menu) {
      if (this.edition === "old") {
        if (menu.level === 2) {
          const icon = menu.icon || "el-icon-help";
          return <i class={icon}></i>;
          // return <img src={applyManagementIcon} height={"13"} width={"25"} />;
        }
      } else if (this.edition === "new") {
        if (menu.level === 1 && menu.code === "businessPower") {
          return (
            <img
              style={"margin-right:4px"}
              src={applyManagementIcon}
              height={"15"}
              width={"14"}
            />
          );
        } else if (menu.level === 1 && menu.code === "usfPower") {
          return <i class={"el-icon-menu"} style={"font-size:15px"}></i>;
        } else if (menu.level === 1 && menu.code === "systemManagement") {
          return <i class={"el-icon-s-operation"} style={"font-size:15px"}></i>;
        } else if (menu.level === 1 && menu.code === "applyManagement") {
          return (
            <img
              style={"margin-right:4px"}
              src={businessPowerIcon}
              height={"15"}
              width={"14"}
            />
          );
        } else {
          return <span class={"newMenuItem"}></span>;
        }
      }
    },
    getMenuItem(menus) {
      return menus.map((menu, index) => {
        return !menu.children || !menu.children.length ? (
          <el-menu-item index={menu.code}>
            {this.getMenuIcon(menu)}
            {/*
                                <b class="dotted_active"></b>
                            */}
            <span class="leaf-title" slot="title">
              {menu.moduleName}
            </span>
          </el-menu-item>
        ) : (
          <el-submenu index={menu.code}>
            <template slot="title">
              {this.getMenuIcon(menu)}
              <span slot="title">{menu.moduleName}</span>
            </template>
            {this.getMenuItem(menu.children)}
          </el-submenu>
        );
      });
    },
    onSelect(index) {
      this.$store.commit("app/actNavTab", { code: index });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: none;
}

.el-menu--collapse {
  width: $--sd-width-fold;

  > .el-menu-item,
  > .el-submenu {
    text-align: center;
  }
}
.new {
  .el-icon-menu {
    width: 13px;
  }
  .el-icon-s-operation {
    width: 13px;
  }
  .newMenuItem {
    margin-left: 15px;
  }
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    opacity: 0.85;
  }
  .el-submenu__title i {
    color: rgb(144, 147, 153);
  }
  /deep/.is-active {
    background-color: #fff !important;
  }

  /deep/ .el-submenu__title:hover {
    // background-color: #EBF0FD !important;
    background-color: #e6f4ff !important;
  }
  .el-menu-item:hover {
    // background-color: #EBF0FD !important;
    background-color: #e6f4ff !important;
  }
  .el-menu-item.is-active {
    // background-color: #EBF0FD !important;
    background-color: #e6f4ff !important;
  }
  /deep/ .el-submenu__title {
    height: 42px;
    line-height: 42px;
  }
}

.old {
  .el-menu:not(.el-menu--collapse) {
    .el-submenu {
      position: relative;
      &::after {
        position: absolute;
        top: 45px;
        bottom: 24px;
        left: 31px;
        content: "";
        border-left: 2px dotted #778ca2;
      }
      .el-menu-item {
        position: relative;
        &::after {
          position: absolute;
          top: 25px;
          left: 32px;
          width: 10px;
          content: "";
          border-bottom: 2px dotted #778ca2;
        }
      }
      .leaf-title {
        margin-left: 10px;
      }
    }
  }
}
</style>
