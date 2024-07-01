<script>
import { mapState } from "vuex";
import { clstagData } from "@/utils/req";
export default {
  props: {
    searchRender: Function,
    handleSearch: Function,
    handleReset: Function,
    showQueryBtn: {
      type: Boolean,
      default: true,
    },
    showResetBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      closed: true,
      showMore: false,
      size: "small",
    };
  },
  computed: {
    ...mapState("app", ["view"]),
  },
  watch: {
    "view.width": {
      immediate: true,
      handler: function (newVal) {
        let size = "large";
        if (!newVal || newVal < 1360) {
          size = "small";
        } else if (newVal >= 1360 && newVal <= 1640) {
          size = "medium";
        }
        this.size = size;
        this.$nextTick(this.calcStatus);
      },
    },
  },
  //查新的按钮都在这一页
  render() {
    return (
      <div
        class={[
          "basic-search",
          `basic-search--${this.size}`,
          this.closed ? "basic-search--close" : "basic-search--open",
        ]}
      >
        <div class="basic-search__bd">
          <div class="col-l" ref="formCol">
            {this.searchRender()}
          </div>
          <div class="col-r">
            {this.showQueryBtn && (
              <el-button
                type="primary"
                size="small"
                clstag={this.clstag("public_1619351066497|3")}
                onClick={this.handleSearch}
              >
                查询
              </el-button>
            )}
            {this.showResetBtn && (
              <el-button size="small" onClick={this.handleReset}>
                重置
              </el-button>
            )}
            {this.showMore && (
              <a title="展开更多" class="toggle-more-btn" onClick={this.toggleMore}>
                {this.closed ? "展开查询" : "收起查询"}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  },
  methods: {
    clstag(data) {
      clstagData(data);
    },
    sumFormItem() {
      // console.log(
      //   this.$refs["formCol"].querySelectorAll(".el-form-item"),
      //   this.$refs["formCol"].querySelectorAll(".el-form-item").length,
      //   "formCol"
      // );
      const itemLength = this.$refs["formCol"].querySelectorAll(".el-form-item").length;
      if (itemLength > 6) {
        this.showMore = true;
      } else {
        this.showMore = false;
      }
    },
    calcStatus() {
      // if (formH > 49) {
      //   this.showMore = true;
      // } else {
      //   this.showMore = false;
      // }
      this.$emit("searchHeightChange", this.$el.offsetHeight);
    },
    toggleMore() {
      this.closed = !this.closed;
      this.$nextTick(function () {
        this.$emit("searchHeightChange", this.$el.offsetHeight);
      });
    },
  },
  mounted() {
    this.sumFormItem();
  },
};
</script>

<style lang="scss" scoped>
.basic-search {
  padding: 20px 0 0;
  .basic-search__hd {
    display: flex;
    padding: 16px 0;
    .col-l {
      flex: 1;
    }
    .col-r {
      width: 162px;
    }
  }
  .basic-search__bd {
    display: flex;
    .col-l {
      flex: 1;
      .el-form {
        display: flex;
        flex-wrap: wrap;
      }
      /deep/ .el-form-item {
        padding-right: 15px;
        box-sizing: border-box;
      }
    }
    .col-r {
      position: relative;
      padding: 0 0 0 25px;
      width: 162px;
      .el-button {
        width: 75px;
      }

      .toggle-more-btn {
        position: absolute;
        display: inline-block;
        left: 36px;
        bottom: 23px;
        width: 60px;
        font-size: 12px;
        color: #3998fc;
        background: no-repeat center right;
        background-size: auto 9px;
      }
    }
  }
}
.basic-search--close {
  .basic-search__bd {
    .col-l {
      max-height: 102px;
      overflow: hidden;
    }
    .toggle-more-btn {
      background-image: url("../../imgs/icon-open.png");
    }
  }
}
.basic-search--open {
  .basic-search__bd {
    .col-l {
      max-height: none;
    }
    .toggle-more-btn {
      background-image: url("../../imgs/icon-close.png");
    }
  }
}
.basic-search--small {
  /deep/ .el-form-item {
    width: 33.33%;
  }
  /deep/ .span-2 {
    width: 66.67%;
  }
}
.basic-search--medium {
  /deep/ .el-form-item {
    width: 25%;
  }
  /deep/ .span-2 {
    width: 50%;
  }
}
.basic-search--large {
  /deep/ .el-form-item {
    width: 20%;
  }
  /deep/ .span-2 {
    width: 40%;
  }
}
</style>
