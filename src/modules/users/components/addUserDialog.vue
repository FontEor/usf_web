<template>
  <basic-dialog
    :visible="visible"
    :title="title"
    :width="800"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
  >
    <el-form
      ref="form"
      size="small"
      label-position="right"
      label-width="138px"
      :model="dto"
      :rules="rules"
      @submit.native.prevent
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item
                v-if="typeFlag"
                label="账号类型"
                prop="userSystemType"
              >
                <el-select
                  v-model="dto.userSystemType"
                  clearable
                  :disabled="!!dto.id"
                  @change="isShowType"
                >
                  <el-option
                    v-for="item in systype"
                    :key="item.systemType"
                    :value="item.systemType"
                    :label="item.systemName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="20" :offset="1" v-if="!this.isShowCreateMfsAccount">
              <el-form-item label="用户账号" prop="userCode">
                <el-input
                  v-model.trim="dto.userCode"
                  placeholder="账号"
                  :disabled="!!dto.id"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item
                v-if="addType"
                label="添加类型"
                prop="accountAddType"
              >
                <el-select
                  v-model="dto.accountAddType"
                  clearable
                  :disabled="!!dto.id"
                >
                  <el-option :value="1" :label="'新建账号'"></el-option>
                  <el-option :value="2" :label="'添加已有账号'"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="this.dto.userSystemType === 6 && userFlag === '0'"
                label="添加类型"
                prop="accountAddType"
              >
                <el-select
                  v-model="dto.accountAddType"
                  @change="isShow1"
                  clearable
                  :disabled="!!dto.id"
                >
                  <el-option :value="1" :label="'新建账号'"></el-option>
                  <el-option :value="2" :label="'添加已有账号'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="10" :offset="1">
              <el-form-item label="姓名" prop="userName">
                <el-input v-model.trim="dto.userName" placeholder="姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="账号别名" prop="userAlias">
                <el-input v-model.trim="dto.userAlias" placeholder="账号别名" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-row
            :gutter="24"
            v-if="isErpOrPassport || this.dto.userSystemType === 6"
          >
            <el-col :span="10" :offset="1">
              <el-form-item label="联系电话" prop="queryMobile">
                <el-input v-model.trim="dto.queryMobile" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="邮箱" prop="queryEmail">
                <el-input v-model.trim="dto.queryEmail" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row> -->

          <el-row :gutter="24" v-if="isErpOrPassport">
            <el-col :span="10" :offset="1">
              <el-form-item label="部门" prop="queryDept">
                <el-input v-model.trim="dto.queryDept" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="岗位" prop="queryPosition">
                <el-input v-model.trim="dto.queryPosition" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            :gutter="24"
            v-if="this.isShowCreateMfsAccount && userFlag === '0'"
          >
            <el-col :span="10" :offset="1">
              <el-form-item label="密码" prop="userPassWd">
                <el-input
                  v-model.trim="dto.userPassWd"
                  placeholder="密码"
                  :show-password="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="确认密码" prop="confirmUserPassWd">
                <el-input
                  v-model.trim="dto.confirmUserPassWd"
                  placeholder="请再次输入密码"
                  :show-password="true"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            :gutter="24"
            v-if="this.isShowCreateMfsAccount && userFlag === '0'"
          >
            <el-col :span="10" :offset="1">
              <el-form-item label="手机号" prop="userTel">
                <el-input v-model.trim="dto.userTel" placeholder="手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="邮箱" prop="userEmail">
                <el-input v-model.trim="dto.userEmail" placeholder="邮箱" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item v-if="isButtom" label=" " prop="">
                <el-radio-group
                  v-model="queryChannelNum"
                  @change="changeChannelNum"
                >
                  <el-radio :label="1">添加</el-radio>
                  <el-radio :label="2">搜索添加</el-radio>
                  <el-radio :label="3">村/居委会专用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="!isButtom && enableOrgSelect === true"
                label=" "
                prop=""
              >
                <el-radio-group
                  v-model="queryChannelNum"
                  @change="changeChannelNum"
                >
                  <el-radio :label="1">添加</el-radio>
                  <el-radio :label="2">搜索添加</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="10" :offset="1" v-if="visible">
              <el-form-item v-if="isButtom" label="所属机构" prop="orgCodeList">
                <el-cascader
                  class="cascader"
                  @change="changeOrgCodeList"
                  :placeholder="placeholder"
                  v-if="queryChannelNum === 1"
                  v-model="dto.orgCodeList"
                  :props="orgProps"
                  clearable
                >
                  <template slot-scope="{ data }">
                    <span>{{ data.orgName }}（{{ data.orgCode }}）</span>
                  </template>
                </el-cascader>
                <el-select
                  v-model="dto.orgCodeList"
                  filterable
                  remote
                  clearable
                  @change="changeOrgCodeList1"
                  v-if="queryChannelNum === 2 || queryChannelNum === 3"
                  reserve-keyword
                  placeholder="请输入机构名称"
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.orgFullName"
                    :label="item.orgFullName.replace(/ > /g, ' / ')"
                    :value="item.orgFullName"
                    style="height: 50px; line-height: normal !important"
                  >
                    <div
                      style="
                        margin-top: 8px;
                        font-size: 14px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                      "
                      :title="item.orgName"
                    >
                      {{ item.orgName }}（{{ item.orgCode }}）
                    </div>
                    <span
                      style="
                        font-size: 12px;
                        color: #b4b4b4;
                        text-overflow: ellipsis;
                        overflow: hidden;
                      "
                      :title="item.orgFullName"
                      >{{ item.orgFullName }}</span
                    >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="!isButtom"
                label="所属机构"
                prop="orgCodeList"
              >
                <el-cascader
                  class="cascader"
                  @change="changeOrgCodeList"
                  :placeholder="placeholder"
                  v-if="queryChannelNum === 1"
                  v-model="dto.orgCodeList"
                  :props="orgProps"
                  clearable
                >
                  <template slot-scope="{ data }">
                    <span>{{ data.orgName }}（{{ data.orgCode }}）</span>
                  </template>
                </el-cascader>
                <el-select
                  v-model="dto.orgCodeList"
                  filterable
                  remote
                  clearable
                  @change="changeOrgCodeList1"
                  v-if="queryChannelNum === 2"
                  reserve-keyword
                  placeholder="请输入机构名称"
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.orgFullName"
                    :label="item.orgFullName.replace(/ > /g, ' / ')"
                    :value="item.orgFullName"
                    style="height: 50px; line-height: normal !important"
                  >
                    <div
                      style="
                        margin-top: 8px;
                        font-size: 14px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                      "
                      :title="item.orgName"
                    >
                      {{ item.orgName }}（{{ item.orgCode }}）
                    </div>
                    <span
                      style="
                        font-size: 12px;
                        color: #b4b4b4;
                        text-overflow: ellipsis;
                        overflow: hidden;
                      "
                      :title="item.orgFullName"
                      >{{ item.orgFullName }}</span
                    >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="userType">
                <span slot="label"
                  >用户类型
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      用户类型仅做用户标识，无法为用户分配管理员权限。
                    </div>
                    <i class="el-icon-question"></i> </el-tooltip
                ></span>
                <el-select v-model="dto.userType">
                  <el-option :value="0" label="普通用户"></el-option>
                  <el-option v-if="action !== '添加用户'" :disabled="true" :value="1" label="管理员"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col
              :span="20"
              :offset="1"
              v-for="item in state.extList"
              :key="item.key"
            >
              <el-form-item
                :label="item.name"
                :prop="item.key"
                :rules="item.rules"
              >
                <el-input
                  v-if="item.type === 'input'"
                  v-model.trim="dto[item.key]"
                  :placeholder="item.placeholder"
                  clearable
                />
                <el-input
                  v-else-if="item.type === 'textarea'"
                  type="textarea"
                  v-model.trim="dto[item.key]"
                  :placeholder="item.placeholder"
                  clearable
                />
                <el-select
                  v-else-if="item.type === 'select'"
                  v-model.trim="dto[item.key]"
                  :placeholder="item.placeholder"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="subItem of item.options"
                    :key="subItem.code"
                    :label="subItem.label"
                    :value="subItem.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="dto.remark"
                  type="input"
                  placeholder="请填写备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";
import { mapState } from "vuex";
import axios from "axios";
export default {
  mixins: [EntityDialog],
  props: {
    state: {
      type: Object,
      default() {
        return {};
      },
    },
    userFlag: String,
    selectItem: {
      type: Object,
      default() {
        return {};
      },
    },
    treeOrgList: {
      type: Array,
      default() {
        return [];
      },
    },
    winClose: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.dto.userPassWd) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        userCode: [
          { required: true, message: "请输入用户账号", trigger: "blur" },
          { pattern: CNST.REG_EXP.ENGNUMLINEREDUCEZHPOINT, message: "用户账号仅支持中文、英文、数字、_、-、."},
          { max: 50, message: "用户账号长度不能超过50个字符" },
          {
            validator: (rule, value, callBack) => {
              if (this.isErpOrPassport) {
                this.findUserInfo(this.dto.userCode, this.dto.userSystemType);
              }
              return callBack();
            },
            trigger: "blur",
          },
        ],
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 80, message: "姓名长度不能超过80个字符" },
        ],
        userPassWd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: CNST.REG_EXP.NORMALPWD,
            message: "包含字母、数字、字符中至少两种以上组合,长度在8-20位",
          },
        ],
        confirmUserPassWd: [
          { required: true, validator: validatePass, trigger: "blur" },
          {
            pattern: CNST.REG_EXP.NORMALPWD,
            message: "包含字母、数字、字符中至少两种以上组合,长度在8-20位",
          },
        ],
        userTel: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          { pattern: CNST.REG_EXP.NORMALTEL, message: "手机号格式错误" },
        ],
        userEmail: [
          { required: false, message: "请输入邮箱", trigger: "blur" },
          { pattern: CNST.REG_EXP.EMAIL, message: "邮箱格式错误" },
          { max: 49, message: "长度应小于 50 个字符", trigger: "blur" },
        ],
        orgCodeList: [
          { required: true, message: "请选择所属部门", trigger: "change" },
        ],
        userType: [
          { required: true, message: "请选择用户类型", trigger: "change" },
        ],
        userSystemType: [
          { required: true, message: "请选择账号类型", trigger: "change" },
        ],
        remark: [
          { max: 120, message: "备注最多120个字符" },
        ],
      },
      queryChannelNum: 1,
      orgName: "",
      orgCode: "",
      addressNo: "",
      typeFlag: false,
      addType: true,
      systype: [],
      loading: false,
      options: [],
      placeholder: "",
      isButtom: true,
      enableOrgSelect: true,
      isShowCreateMfsAccount: false,
      orgProps: {
        lazy: true,
        lazyLoad: this.queryOrgList,
        label: "orgName",
        value: "orgCode",
        checkStrictly: true,
      },
      queryMobile: "",
      queryEmail: "",
      queryDept: "",
      queryPosition: "",
      isErpOrPassport: false,
    };
  },
  computed: {
    ...mapState("app", ["tenementCode"]),
  },
  beforeCreate() {
    this.allFields = [
      "id",
      "userCode",
      "userAlias",
      "userName",
      "orgCodeList",
      "orgCode",
      {
        key: "userType",
        default: 0
      },
      "system",
      "remark",
      "userSystemType",
      "accountAddType",
      "ext1",
      "ext2",
      "ext3",
      "ext4",
      "ext5",
      "ext6",
      "ext7",
      "ext8",
      "ext9",
      "ext10",
      "ext11",
      "ext12",
      "ext13",
      "ext14",
      "ext15",
      "ext16",
      "ext17",
      "ext18",
      "ext19",
      "ext20",
      "userPassWd",
      "userEmail",
      "userTel",
    ];
    this.disFields = ["userCode"];
  },
  watch: {
    visible: {
      handler() {
      if (this.visible) {
        this.dto.userSystemType = "";
        this.isShowType();
        api.users.erptype({}).then(({ erpType = "" }) => {
          if (erpType) {
            this.typeFlag = true;
            api.users.systype({}).then(({ data = "", code = "", msg = "" }) => {
              if (code === 200) {
                this.systype = data;
                if (this.action === "添加用户") {
                  this.dto.userSystemType = 1;
                  this.dto.accountAddType = 2;
                }
              }
            });
          } else {
            return (this.typeFlag = false);
          }
        });

        api.users.isShowCreateMfsAccountOption({}).then((res) => {
          if (res.code === 200 && res.data != null && res.data === true) {
            this.isShowCreateMfsAccount = res.data;
            this.dto.userSystemType = 6;
            this.dto.accountAddType = 1;
            this.loadSwitch();
          }
        });

        api.users.getLoginType({}).then((res) => {
          if (res.code === 200 && res.data != null) {
            if (res.data === 1 || res.data === 2) {
              this.isErpOrPassport = true;
            }
          } else {
            this.isErpOrPassport = false;
          }
        });
      } else {
        this.placeholder = "";
      }
      },
    }
  },
  created() {
    api.users.judgeShowChangeButton({}).then((res) => {
      this.isButtom = res.success;
      if (this.isButtom === false) {
        this.getSearchByAppId();
      }
    });

    const { operation, userCode, userName } = this.$route.query;
    if (operation === "tjyh") {
      this.dto.userName = userName;
      this.dto.userCode = userCode;
      this.$parent.dialogBool.addUserWinShow = true;
    }
  },
  methods: {
    getSearchByAppId() {
      axios({
        method: "post",
        url: "/tenement/getTenementById.do",
        data: {
          tenementCode: this.tenementCode,
        },
        params: {
          tenementCode: this.tenementCode,
        },
      })
        .then((resolve) => {
          if (resolve.data.data.enableOrgSelect === null) {
            this.enableOrgSelect === true;
          } else {
            this.enableOrgSelect = resolve.data.data.enableOrgSelect;
          }
          if (resolve.data.data.enableOrgSelect === null) {
            this.enableOrgSelect === 1;
          } else {
            this.queryChannelNum = resolve.data.data.orgSelectStyle;
          }

          // if (resolve.data.data.orgSelectStyle === 1) {
          //   this.formBasic.data.switch = false;
          // } else {
          //   this.formBasic.data.switch = true;
          // }
          // this.showSearchSwitch = resolve.data.data.enableOrgSelect;
        })
        .catch((reject) => {
          console.log("getExtByTenementCodeData 请求失败", reject);
        });
    },
    hh() {
      console.log("hhh");
    },
    findUserInfo(userCode, userSystemType) {
      api.users
        .findUserInfo({
          userCode: userCode,
          userSystemType: userSystemType,
        })
        .then((res) => {
          if (res.code === 200 && res.data != null) {
            this.dto.userName = res.data.userName;
            this.dto.queryMobile = res.data.mobile;
            this.dto.queryDept = res.data.fullPathOrgName;
            this.dto.queryPosition = res.data.positionName;
            this.dto.queryEmail = res.data.email;
          } else {
            this.dto.userName = "";
            this.dto.queryMobile = "";
            this.dto.queryDept = "";
            this.dto.queryPosition = "";
            this.dto.queryEmail = "";
          }
        });
    },
    setChannelNum() {
      api.users.judgeShowChangeButton({}).then((res) => {
        this.isButtom = res.success;
        if (!this.isButtom) {
          this.queryChannelNum = 2;
        }
      });
    },

    changeChannelNum() {
      if (this.userFlag === "0") {
        this.dto.orgCodeList = this.queryChannelNum === 1 ? [] : "";
        this.options = [];
      } else {
        this.options = [];
        if (this.queryChannelNum === 1) {
          this.dto.orgCodeList = [];
          this.dto.orgCode = "";
          this.placeholder = "";
          // this.dto.orgCodeList.replace(/ > /g,' / ')
        } else if (this.queryChannelNum === 2) {
          this.dto.orgCodeList = "";
          this.dto.orgCode = "";
          // this.remoteMethod()
        } else if (this.queryChannelNum === 3) {
          this.dto.orgCodeList = "";
          this.dto.orgCode = "";
        }
      }
    },
    changeOrgCodeList1(val) {
      this.remote = true;
      if (val) {
        let options = this.options.find((f) => f.orgFullName === val);
        this.orgName = options.orgName;
        this.orgCode = options.orgCode;
        this.dto.orgCode = options.orgCode;
        this.addressNo = options.addressNo;
      }
    },
    changeOrgCodeList() {
      this.placeholder = "";
      this.dto.orgCode =
        (this.dto.orgCodeList &&
          this.dto.orgCodeList.length > 0 &&
          this.dto.orgCodeList[this.dto.orgCodeList.length - 1]) ||
        "";
    },
    isShowType() {
      api.users
        .showAddAccountType({ userSystemType: this.dto.userSystemType })
        .then((res) => {
          this.addType = res.success;
        });

      // 如果是erp或者passport则清空和设置标识
      if (this.dto.userSystemType === 1 || this.dto.userSystemType === 2) {
        this.isErpOrPassport = true;

        this.dto.userName = "";
        this.dto.queryMobile = "";
        this.dto.queryDept = "";
        this.dto.queryPosition = "";
        this.dto.queryEmail = "";
      } else {
        this.isErpOrPassport = false;
      }
    },

    // 控制是否显示 密码 确认密码 手机号 邮箱
    isShow1() {
      if (this.dto.accountAddType === 1) {
        this.isShowCreateMfsAccount = true;
        this.loadSwitch();
      } else if (this.dto.accountAddType === 2) {
        this.isShowCreateMfsAccount = false;
      }
    },

    loadSwitch() {
      api.tenement
        .findTenementMemphisCfg({ tenementCode: this.tenementCode })
        .then((res) => {
          if (res.code === 200 && res.data != null) {
            this.rules.userTel.forEach(function (item, index) {
              //item 就是当日按循环到的对象
              //index是循环的索引，从0开始
              item.required = res.data.mobileRequire === 2;
            });
            this.rules.userEmail.forEach(function (item, index) {
              //item 就是当日按循环到的对象
              //index是循环的索引，从0开始
              item.required = res.data.emailRequire === 2;
            });
          }
        });
    },

    // 确定按钮
    handleOk() {
      this.$parent.selectItem && (this.dto.id = this.$parent.selectItem.id);
      if (this.dto.accountAddType === 2 || this.dto.accountAddType === 6) {
        api.users
          .account({
            userCode: this.dto.userCode,
            userSystemType: this.dto.userSystemType,
          })
          .then(({ data = "", code = "", msg = "" }) => {
            if (code === 200) {
              if (!data.accoutExsit) {
                this.$message.error("账号不存在");
              } else {
                if (!this.$refs.form) {
                  return;
                }
                this.$refs.form.validate((valid) => {
                  if (!valid) {
                    return;
                  }
                  let params = this.toEnd();
                  if (this.queryChannelNum === 3) {
                    this.findSave();
                  } else {
                    this.handleSave({ params });
                  }
                });
              }
            } else {
              this.$message.error(msg);
            }
          });
      } else {
        if (!this.$refs.form) {
          return;
        }
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return;
          }
          let params = this.toEnd();
          if (this.queryChannelNum === 3) {
            this.findSave();
          } else {
            this.handleSave({ params });
          }
        });
      }
    },
    toEnd() {
      const params = _.pick(this.dto, this.allFields.map(field => {
        if(typeof field === 'object') {
          return field.key
        }
        return field
      }));
      let str = this.dto.orgCodeList;
      typeof this.dto.orgCodeList == "string"
        ? (params.orgCodeList = str.split(" > "))
        : null;
      // const encrypt = new window.JSEncrypt();
      // encrypt.setPublicKey(CNST.PUBLICKEY);
      // let userPassWdRSA = encrypt.encrypt(this.dto.userPassWd);
      // params.userPassWd = userPassWdRSA;
      return params;
    },
    // 远程搜索保存
    findSave() {
      let params = {
        accountAddType: this.dto.accountAddType,
        addressNo: this.addressNo,
        orgName: this.orgName,
        userAlias: this.dto.userAlias,
        userCode: this.dto.userCode,
        userName: this.dto.userName,
        userSystemType: this.dto.userSystemType,
        userType: this.dto.userType,
        remark: this.dto.remark,
        userPassWd: this.dto.userPassWd,
        userEmail: this.dto.userEmail,
        userTel: this.dto.userTel,
      };
      let i = 1;
      while (i < 21) {
        params["ext" + i] = this.dto["ext" + i];
        i++;
      }
      api.users.addUserByRpcOrg(params).then((res) => {
        if (res.code === 200) {
          this.$message({ message: res.msg, type: "success" });
          this.handleClose();
          this.$parent.dispatch("queryList");
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    //校验用户是否存在
    jugeAccountExist(rule, value, callback) {
      setTimeout(() => {
        api.users
          .account({ userCode: value, userSystemType: this.dto.userSystemType })
          .then(({ data = "", code = "", msg = "" }) => {
            if (code === 200) {
              if (!data.accoutExsit) {
                callback(new Error("账号不存在"));
              } else {
                callback();
              }
            } else {
              this.$message.error(msg);
            }
          });
      });
    },
    // 关闭和取消按钮
    handleClose(ev) {
      this.updateState("entity");
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
      this.winClose(ev);
    },
    // 级联选框事件
    handleChange(ev) {
      if (ev) {
        let _orgIdShow = JSON.parse(JSON.stringify(ev));
        this.dto.orgCode = _orgIdShow.pop();
      }
    },
    // 获取扩展字段key
    getExtKey(value) {
      if (typeof value === "string") {
        return value.replace(/_/, "");
      }
      return value;
    },
    // 所属部门级联懒加载
    async queryOrgList({ root, data: obj }, resolve) {
      const params = { data: { tenementCode: this.tenementCode } };
      if (!root) {
        params.data.parentId = obj.id;
      }
      const { code, data, msg } = await api.users.queryOrgList(params);
      if (code === 200) {
        //去掉需要隐藏的机构
        resolve(
          data.filter((item) => item.isHide == null || item.isHide === 0) || []
        );
      } else {
        this.$message.error(msg);
      }
    },
    // 部门搜索
    remoteMethod(queryString, cb) {
      this.loading = true;
      api.users
        .blurryQueryOrg({
          data: {
            orgNameKeyWord: queryString, //机构模糊搜索关键字，可为空，空字符串查所有
            queryChannelNum: this.queryChannelNum, //2本地搜索 3远程获取
          },
          page: {
            pageIndex: 1,
            pageSize: 1000000000,
          },
        })
        .then((res) => {
          this.loading = false;
          this.options =
            res.data.rows.filter(
              (item) => item.isHide == null || item.isHide === 0
            ) || [];
        });
    },
    handleSelect(item) {
    },
  },
};
</script>

<style lang="scss" scoped>
//  /deep/ .orgName.el-select-dropdown__item{
//   line-height: normal!important;
// }
/deep/ .cascader input::placeholder {
  color: #606266;
}
</style>
