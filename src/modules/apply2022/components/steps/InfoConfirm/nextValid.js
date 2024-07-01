import axios from "axios";
import { difference, pullAllBy, groupBy, forIn, get, uniq, pick } from "lodash";
import { Loading } from 'element-ui';

import store from "../../../store/index.js";
import FastHelpCreateAccountVue from "./FastHelpCreateAccount.vue";
import FastCreateChooseOrgVue from "./FastCreateChooseOrg.vue";
import FastRemoveAccount from "./FastRemoveAccount.vue";

import toolMixin from "./tool";

export default {
  mixins: [toolMixin],
  data() {
    return {
      // 正确账号数据缓存
      successAccountList: [],
      // 错误账号数据
      errorAccountList: [],
      // 选择机构创建账户弹框
      fastHelpVisible: false,
      // 包含机构的账号数据
      orgAccountList: [],
      // 多个机构选择其中一个弹框
      fastHelpChooseVisible: false,
      // 删除账号确认弹框
      fastRemoveAccountVisible: false,
      // 删除弹框显示状态
      fastRemoveStatus: 2, // 第二步状态 2 第三部状态 3
    }
  },
  components: {
    FastHelpCreateAccountVue,
    FastCreateChooseOrgVue,
    FastRemoveAccount
  },
  methods: {
    // 验证数据
    validAccount() {
      if (this.$refs.accounts) {
        // 判定是否为导入数据
        if(
          // 如果是代人申请 并且
          this.form.applyType === 'other' &&
          // 如果是批量导入
          this.form.entryMethod === 1
        ) {
          // 如果有正确数据存在
          if(this.importSuccess.length) {
            // 直接进入第二部验证
            this.secondValidProxy(this.importSuccess);
            return this.importSuccess = []
          } else {
            return this.$message.error('请先导入用户数据');
          }
        }
        // 清楚标记错误数据
        store.commit('updateIllegalUserCodes', []);
        // 清除被申请人数据
        store.commit('updateUsersList', [])
        // 清除错误账号数据
        store.commit('clearErrorUserExportList');
        // 还原弹框状态
        this.fastRemoveStatus = 2;
        const accounts = this.$refs.accounts.getValues();
        if(!accounts || !accounts.length) {
          return this.$message.error('请输入申请账号');
        }
        // 判定用户在系统中是否合法
        this.validAccountErrorRequest(this.form.userSystemTypeForOther, accounts).then(response => {
          if(response.data.code === 200) {
            const errorAccount = response.data.data.illegalUserCodes;
            // 如果有错误数据
            if(errorAccount.length) {
              const successAccount = difference(accounts, errorAccount);
              // 打开确认移除弹出框
              this.onConfirm({
                error: errorAccount,
                success: successAccount,
              })
            }
            // 如果没有错误数据
            else {
              // 第二步验证代理函数
              this.secondValidProxy(accounts);
            }
          } else {
            this.$message.error(response.data.msg)
          }
        })
      } else {
        console.log('验证数据中没有账号Ref')
      }
    },
    // 第二步验证处理程序
    secondValidProxy(accounts) {
      // 判定权限申请类型
      switch (+this.form.assignType) {
          // 如果是申请权限
        case 1:
          // 更新选择账号数据
          store.commit('updateForm', {
            key: "userCodesForOther",
            value: accounts
          })
          // 进入第二步
          this.onFastHelpAccount(accounts);
          break;
          // 如果是关闭全部权限
        case 2:
          // 如果是关闭部分权限
        case 4:
          // 进入第二步
          this.onFastRemoveAccountEnter(accounts);
          break;
        default:
          console.log('### 未知的申请类型', this.form.assignType)
          break;
      }
    },
    // 跳转前回调
    onConfirm(data) {
      this.$confirm(
        "<div class='apply-2022-confirm-content2'><p><i class='el-icon-warning'></i><span><strong>录入的被代理人账号存在异常</strong><br/>部分录入账号格式不正确，剔除后可继续</span></p></div>",
        "",
        {
          confirmButtonText: "剔除并继续",
          cancelButtonText: "返回编辑",
          dangerouslyUseHTMLString: true,
        }
      ).then(() => {
        if(data.success.length) {
          // 缓存到导出列表中
          store.commit('updateErrorUserExportList', {
            list: data.error,
            errorCode: 1
          })
          // 进入下一步代理处理函数
          this.secondValidProxy(data.success)
        } else {
          this.$message.error('3:所有输入用户都被剔除,请检查录入账号信息')
        }
      }).catch(() => {
        store.commit('updateIllegalUserCodes', data.error);
      })
    },
    // 快速代人创建账号
    onFastHelpAccount(data) {
      // 判定这些用户之前是否存在
      // errorAccountList 这个字段可能没用了
      this.validAccountExistRequest(
        this.form.userSystemTypeForOther,
        data
      ).then(response => {
        if(response.data.code === 200) {
          this.successAccountList = this.pickUserData(
            get(response, 'data.data.existUser', [])
          )
          const notExistUserCodes = get(response, 'data.data.notExistUserCodes', []);
          if(notExistUserCodes.length) {
            this.errorAccountList = notExistUserCodes;
            this.fastHelpVisible = true;
          } else {
            // 直接进入下一步验证
            this.onFastHelpAccountOver({
              orgId: undefined,
              orgName: undefined,
              list: []
            })
          }
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    // 创建账号并选择机构后的数据回调
    onFastHelpAccountOver(data) {
      const orgId = data.orgId;
      const orgName = data.orgName;
      const accounts = (data.list || []).map(item => item.userCode);
      // 缓存带有扩展字段的用户数据
      store.commit('updateForm', {
        key: "usersForOther",
        value: data.list
      })
      const successes = (this.successAccountList || []).map(item => item.userCode);
      this.fastHelpVisible = false;
      if(successes.length || accounts.length) {
        this.validAccountExistRequest(
          this.form.userSystemTypeForOther,
          [...accounts, ...successes],
          true
        ).then(response => {
          if(response.data.code === 200) {
            const existUser = response.data.data.existUser || [];
            const notExistUserCodes = response.data.data.notExistUserCodes || [];
            // 处理添加扩展数据
            const hasExtDataExitstUser = notExistUserCodes.map(code => {
              return data.list.find(item => item.userCode === code);
            })
            // 格式化机构账号信息数据
            this.formarOrgAccountData({ existUser, notExistUserCodes: hasExtDataExitstUser, orgId, orgName });
          } else {
            this.$message.error(response.data.msg)
          }
        })
      } else {
        // 清空之前的所有账号
        store.commit('updateForm', {
          key: "userCodesForOther",
          value: []
        })
        store.commit('updateForm', {
          key: "usersForOther",
          value: []
        })
        this.$message.error('请至少填写一个账号');
        return
      }
    },
    // 格式化机构账号信息数据
    formarOrgAccountData({ existUser, notExistUserCodes, orgId, orgName }) {
      const accounts = [
        ...existUser.map(user => {
          return {
            id: user.userCode,
            userCode: user.userCode,
            orgId: user.orgCode,
            orgName: user.orgFullName,
            ext1:user.ext1,
            ext2:user.ext2,
            ext3:user.ext3,
            ext4:user.ext4,
            ext5:user.ext5,
            ext6:user.ext6,
            ext7:user.ext7,
            ext8:user.ext8,
            ext9:user.ext9,
            ext10:user.ext10,
            ext11:user.ext11,
            ext12:user.ext12,
            ext13:user.ext13,
            ext14:user.ext14,
            ext15:user.ext15,
            ext16:user.ext16,
            ext17:user.ext17,
            ext18:user.ext18,
            ext19:user.ext19,
            ext20:user.ext20,
          }
        }),
        ...this.pickUserData(notExistUserCodes).map(item => {
          item.orgId = orgId;
          item.orgName = orgName;
          return item
        })
      ];
      const map = groupBy(accounts, 'orgId');
      const keys = Object.keys(map);
      // 如果所有账号都隶属于一个机构 那么直接下一步
      if(keys.length === 1) {
        // 更新选择账号数据
        store.commit('updateForm', {
          key: "orgCodeForOther",
          value: orgId
        })
        // 进入第四部验证
        this.validExtendFeilds(accounts);
      }
      // 否则整理数据 弹出第三个弹框
      else {
        this.orgAccountList = accounts
        this.fastHelpChooseVisible = true
      }
    },
    // 选择某一个机构树下的数据 完成
    onFastHelpChooseOrgOver(data) {
      this.fastHelpChooseVisible = false
      this.validExtendFeilds(data.children);
    },
    // 判定用户是否在系统中存在
    onFastRemoveAccountEnter(data) {
      this.validAccountExistRequest(
        this.form.userSystemTypeForOther,
        data
      ).then(response => {
        if(response.data.code === 200) {
          this.successAccountList = this.pickUserData(
            get(response, 'data.data.existUser', [])
          )
          const notExistUserCodes = get(response, 'data.data.notExistUserCodes', []);
          this.errorAccountList = notExistUserCodes;
          // 如果有错误账号数据
          if(notExistUserCodes.length) {
            this.fastRemoveAccountVisible = true;
          } else {
            // 没有错误账号数据跳过这一步 继续下一步
            this.onFastRemoveAccountOver([])
          }
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    // 快速删除回调
    onFastRemoveAccountOver(errors) {
      // 缓存剔除数据
      store.commit("updateErrorUserExportList", {
        list: (errors || []).map(item => item.userCode),
        errorCode: this.fastRemoveStatus
      })
      if(this.fastRemoveStatus === 2) {
        // 租户不存在
        const accounts = this.successAccountList.map(item => item.userCode);
        if(accounts.length) {
          // 验证是否有管理权限
          this.validManageAuthRequest(
            this.form.userSystemTypeForOther,
            accounts
          ).then(response => {
            if(response.data.code === 200) {
              const errorAccount = get(response, 'data.data.noAuthUser', []);
              const successAccount = pullAllBy(this.successAccountList, errorAccount, (suc, err) => {
                return suc.userCode === err
              });
              this.errorAccountList = errorAccount;
              this.successAccountList = successAccount;
              // 如果有错误账号
              if(errorAccount.length) {
                this.fastRemoveStatus = 3;
                this.fastRemoveAccountVisible = true;
              }
              // 没有错误账号
              else {
                this.fastRemoveAccountVisible = false;
                // 如果有正常账号
                if(successAccount.length) {
                  // 验证第三步
                  this.fastRemoveStatus = 3;
                  this.onFastRemoveAccountOver([])
                }
                // 如果没有正常账号
                else {
                  this.$message.error('1:所有输入用户都被剔除,请检查录入账号信息')
                }
              }
            } else {
              this.$message.error(response.data.msg)
            }
          })
        } else {
          this.$message.error('2:所有输入用户都被剔除,请检查录入账号信息')
        }
      } else {
        // 没有管理权限
        if(this.successAccountList.length) {
          store.commit('updateForm', {
            key: "usersForOther",
            value: this.successAccountList
          })
          this.onNext();
        } else {
          this.fastRemoveAccountVisible = false;
          this.$message.error('4:所有输入用户都被剔除,请检查录入账号信息')
        }
      }
    },
    // 第四步验证
    validExtendFeilds (accounts) {
      let loading = Loading.service({
        lock: true,
        text: "账号在业务系统验证中"
      })
      this.validExtendFeildsRequest(accounts).then(response => {
        loading.close();
        const errorAccounts = get(response, 'data.data.illegalUserCodes', []);
        if(errorAccounts.length) {
          this.$message.error(`账号:${errorAccounts.length},业务系统验证不通过，拒绝申请`);
        } else {
          // 更新选择账号数据
          store.commit('updateForm', {
            key: "usersForOther",
            value: accounts
          })
          this.onNext();
        }
      }).catch((error) => {
        loading.close();
      })
    },
  }
}
