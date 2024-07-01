<template>
    <el-drawer
      class="operation-log-drawer"
      title="操作内容"
      :visible="visible"
      direction="rtl"
      :before-close="() => $emit('close')"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :append-to-body="false"
      :modal="false"
      size="488px">
      <div class="operation-log-drawer-container">
        <div class="operation-log-drawer-container-header">
          <div class="cloumn-first">
            &nbsp;
          </div>
          <div class="cloumn-second">
            操作前
          </div>
          <div class="cloumn-third">
            操作后
          </div>
        </div>
        <div class="operation-log-drawer-scroll-container">
          <div
            v-for="(item, index) in list"
            :key="item.key + index"
            class="operation-log-drawer-container-content">
            <div class="cloumn-first" v-show="!!item.key">
              {{ item.key }}
            </div>
            <div :class="`cloumn-second ${item.className}`">
              <p>{{ item.oldValue }}</p>
            </div>
            <div :class="`cloumn-third ${item.className}`">
              <p>{{ item.newValue }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
</template>
<script>
const _ = require("lodash");
// import brower from "@/utils/browser"

export default {
  name: "OperationLogDrawer",
  props: {
    visible: Boolean,
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: []
    };
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(n) {
        if (n) {
          this.dataProxy(n);
        }
      }
    }
  },
  methods: {
    dataProxy(data) {
      const list = this.dataFormat(data.opBeforeValue, data.opAfterValue);
      this.list = list;
    },
    dataFormat(dataString = "", toDataString = "") {
      try {
        let befData = [];
        let aftData = [];
        if(dataString !== "-") {
          befData = JSON.parse(dataString);
        }
        if (toDataString !== "-") {
          aftData = JSON.parse(toDataString);
        }
        const maxLength = _.max([befData.length, aftData.length]);
        return new Array(maxLength).fill(1).map((v, index) => {
          // 获取key名称
          let key = "";
          let oldValue = "-";
          let newValue = "-";
          if (befData[index]) {
            key = befData[index][0] || "";
            oldValue = befData[index][1] || "-";
          }
          if (aftData[index]) {
            if (aftData[index][0] && key === "") {
              key = aftData[index][0] || "";
            }
            newValue = aftData[index][1] || "-";
          }
          // 替换null数据
          if (_.trim(oldValue) === "null") {
            oldValue = "-"
          }
          if (_.trim(newValue) === "null") {
            newValue = "-"
          }
          return {
            key,
            oldValue,
            newValue
          }
        })
      } catch (error) {
        console.log(error);
        return [{
          key: undefined,
          oldValue: dataString,
          newValue: toDataString,
          className: "pre"
        }]
      }
    }
  }
};
</script>

<style lang="scss">
.operation-log-drawer {
  left: auto !important;
  top: 60px !important;
  width: 488px !important;
  bottom: 1px !important;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  .el-dialog__close {
    color: #999999;
  }
  .el-drawer.rtl {
    height: auto;
  }
  .el-drawer__header {
    margin: 0;
    padding: 0 10px 0 16px;
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #eaeaea;
    font-size: 16px;
    font-weight: 450;
    color: #333333;
    @include font-family;
    span,
    .el-drawer__close-btn {
      margin-top: 3px;
    }
  }
  .operation-log-drawer-container {
    padding: 0 18px;
    .operation-log-drawer-container-header,
    .operation-log-drawer-container-content {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: flex-start;
      justify-content: space-between;
      align-items: flex-start;
      text-align: left;
      border-bottom: 1px solid #eaeaea;
      word-break: break-all;
    }
    .operation-log-drawer-container-header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #d9d9d9;
      @include font-family;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      .cloumn-first {
        width: 53px;
        color: #333333;
        font-size: 14px;
      }
      .cloumn-second {
        color: #333333;
        font-size: 14px;
      }
      .cloumn-third {
        color: #333333;
        font-size: 14px;
      }
    }
    .operation-log-drawer-scroll-container {
      height: calc(100vh - 155px);
      overflow-y: auto;
      overflow-x: hidden;
    }
    .operation-log-drawer-container-content {
      padding: 12px 0 10px 0;
      color: #666666;
      line-height: 17px;
      font-size: 12px;
      width: 100%;
      &.back {
        color: #333333;
      }
      &:last-child {
        border-bottom: none;
      }
    }
    .pre {
      white-space: pre !important;
    }
    .cloumn-first,
    .cloumn-second,
    .cloumn-third {
      font-size: 14px;
      word-break: break-all;
      p {
        margin-bottom: 10px;
        white-space: pre-wrap;
        word-break: break-all;
        overflow-wrap: break-word;
        overflow: hidden;
        &:first-child {
          padding-top: 3px;
        }
        &:last-child {
          margin-bottom: 3px;
        }
      }
    }
    // .safari-between {
    //   /* 兼容safari处理 */
    //   display: flex;
    //   justify-content: space-between;
    // }
    .cloumn-first {
      font-weight: 500;
      width: 56px;
      line-height: 20px;
      color: #333333;
      white-space: normal
      // /* safari 不兼容 但是好像没有要求一定要兼容 */
      // text-align-last: justify;
    }
    .cloumn-second {
      width: 175px;
      font-size: 12px;
      color: #666666;
    }
    .cloumn-third {
      width: 175px;
      font-size: 12px;
      color: #333333;
    }
  }
}
</style>

