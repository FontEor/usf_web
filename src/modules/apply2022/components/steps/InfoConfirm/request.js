import axios from "axios";
import store from "../../../store/index.js";
import { get } from "lodash";

export default {
  methods: {
    async getUserErpInfo() {
      try {
        const { code, data, msg } = await api.apply2022.getUserErpInfo();
        if (code === 200) {
          this.userErpInfo = data || {};
          store.commit("updateForm", {
            key: "userCode",
            value: data.userCode,
          });
          store.commit("updateForm", {
            key: "usfOrgId",
            value: data.orgCode,
          });
        } else {
          this.$message.error(msg);
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async queryUsfUserInfo() {
      if (!this.tenantId) {
        return
      }
      axios({
        method: "get",
        url: "/adminApply/queryUsfUserInfo.do",// 这是同一个接口 不用区分
        data: {
          tenementCode: this.tenantId,
        },
        params: {
          tenementCode: this.tenantId,
        },
      })
        .then((response) => {
          if (response.data.code === 200) {
            const data = response.data.data;
            this.showUsfInfo = Boolean(data);
            store.commit("updateNextButtonDisabled", !this.showUsfInfo);
            this.userUsfInfo = data || {};
            store.commit("updateForm", {
              key: "usfOrgId",
              value: this.userUsfInfo.orgCode
            })
            store.commit("updateFakeUserData", false);
          } else {
            this.$message.error("获取用户信息失败");
          }
        })
        .catch((reject) => {
          this.$message.error("获取用户信息失败");
        });
    },
    async getOrgList({ root, data }, resolve) {
      try {
        // 如果请求的是根节点
        let response;
        if (root) {
          response = await axios({
            method: "post",
            url: "/apply/getOrgByTenementCode",
            data: {
              data: {
                tenementCode: this.tenantId,
              },
            },
            params: {
              tenementCode: this.tenantId,
            },
          });
          if (response.data.code === 200) {
            return resolve([response.data.data]);
          } else {
            return this.$message.error("获取机构数据失败");
          }
        }
        // 如果请求的是叶子节点
        else {
          response = await axios({
            method: "post",
            url: "/apply/getOrgListByParentOrgCode",
            data: {
              data: {
                parentOrgCode: data.orgCode,
                tenementCode: this.tenantId,
              },
            },
            params: {
              tenementCode: this.tenantId,
            },
          });
          if (response.data.code === 200) {
            return resolve(response.data.data);
          } else {
            return this.$message.error(msg);
          }
        }
      } catch (error) {
        console.log("####### error", error);
        this.$message.error(error.message);
      }
    },
    async validAccountErrorRequest(userSystemType, accounts) {
      return axios({
        method: "post",
        url: "/businessApply/batchCheckUserIsLegal.do",
        data: {
          "userSystemType" : userSystemType, //erp: 1 passport: 2
          "userCodes": accounts,
          "tenementCode": this.tenantId
        },
        params: {
          tenementCode: this.tenantId,
        },
      }).catch((reject) => {
        console.log("/businessApply/batchCheckUserIsLegal.do 请求失败", reject);
        throw new Error(reject);
      });
    },
    async validAccountExistRequest(userSystemType, accounts, skipCache = false) {
      return axios({
        method: "post",
        url: "/businessApply/batchCheckUserIsExist.do",
        data: {
          "userSystemType" : userSystemType, //erp: 1 passport: 2
          "userCodes": accounts,
          "tenementCode": this.tenantId
        },
        params: {
          tenementCode: this.tenantId,
        },
      }).then(response => {
        // 如果不跳过缓存 并且 是正常返回 那么缓存数据
        if(!skipCache && response.data.code === 200) {
          // 拥有的用户数据
          const existUser = get(response, 'data.data.existUser', []);
          store.commit('updateUsersList', existUser);
        }
        return response
      }).catch((reject) => {
        console.log("/businessApply/batchCheckUserIsExist.do 请求失败", reject);
        throw new Error(reject);
      });
    },
    // 验证是否有管理权限接口
    async validManageAuthRequest(userSystemType, accounts) {
      return axios({
        method: "post",
        url: "/businessApply/batchCheckUserAuth.do",
        data: {
          "userSystemType" : userSystemType, //erp: 1 passport: 2
          "userCodes": accounts,
          "tenementCode": this.tenantId
        },
        params: {
          tenementCode: this.tenantId,
        },
      }).catch((reject) => {
        console.log("/businessApply/batchCheckUserAuth.do 请求失败", reject);
        throw new Error(reject);
      });
    },
    // 扩展字段数据校验
    async validExtendFeildsRequest(accounts) {
      const orgId = get(accounts, '[0].orgId');
      return axios({
        method: "post",
        url: "/businessApply/batchCheckUserBySpi.do",
        data: {
          "orgCodeForOther" : orgId, // 不管是不是 代人申请 都把这个机构带过去 用户所属机构
          "userSystemType" : this.form.userSystemTypeForOther, //erp: 1 passport: 2
          "userCodes": accounts.map(item => item.userCode),
          "tenementCode": this.tenantId
        },
        params: {
          tenementCode: this.tenantId,
        },
      }).then(response => {
        if (response.data.code === 200) {
          return Promise.resolve(response);
        } else {
          this.$message.error(response.data.msg);
          return Promise.reject();
        }
      }).catch((reject) => {
        console.log("/businessApply/batchCheckUserBySpi.do 请求失败", reject);
        throw new Error(reject);
      });
    },
    // 获取租户扩展字段
    getTenentExtendsFeild() {
      return axios({
        method: "post",
        url: "/apply/user/list2",
        data: {
          data: {
            tenementCode: this.tenantId,
          },
        },
        params: {
          tenementCode: this.tenantId,
        },
      })
    }
  }
}
