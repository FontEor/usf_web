<template>
  <div class="apply-2022-info-bg-gray">
    <div class="apply-2022-info-container">
      <div class="apply-2022-info-data-container mb30">
        <h2>提交人ERP信息</h2>
        <div class="apply-2022-info-data-content">
          <el-row>
            <el-col :span="8" class="apply-2022-info-data">
              <span>账号：</span>
              {{ userErpInfo.userCode }}
            </el-col>
            <el-col :span="8" class="apply-2022-info-data">
              <span>姓名：</span>
              {{ userErpInfo.userName }}
            </el-col>
            <el-col :span="8" class="apply-2022-info-data">
              <span>职位：</span>
              {{ userErpInfo.positionName }}
            </el-col>
            <el-col :span="24" class="apply-2022-info-data">
              <span>部门：</span>
              {{ userErpInfo.fullPathOrgName }}
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="!showUsfInfo" class="apply-2022-info-data-container">
        <h2>提交人USF信息</h2>
        <div>
          <div class="apply-2022-info-toast">
            当前登录账号暂无USF信息，需选择USF所属机构后继续后续流程
          </div>
          <div>
            <el-form :inline="true" :model="form" :rules="rules">
              <el-form-item label="所属机构">
                <el-cascader ref="orgCascader" v-if="storeForm.tenantId" :key="tenantId" v-model="form.orgId"
                  :props="orgOptions" clearable @change="onOrgChange"></el-cascader>
              </el-form-item>
              <el-form-item>
                <span class="apply-2022-choose-hard">机构选择有困难，申请手册看一看</span>
                <el-button type="text" @click="handleManual">查看手册<i
                    class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-form-item>
              <div class="apply-2022-info-buttons">
                <!-- <el-button size="small" @click="handlerChangeStep(-1)">上一步</el-button> -->
                <el-button size="small" @click="onCreateUsfUser" v-show="storeForm.usfOrgId"
                  type="primary">确认并继续</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="showUsfInfo" class="apply-2022-info-data-container">
        <h2>提交人USF信息</h2>
        <div class="apply-2022-info-data-content">
          <el-row>
            <el-col :span="8" class="apply-2022-info-data">
              <span>账号：</span>
              {{ userUsfInfo.userCode }}
            </el-col>
            <el-col :span="8" class="apply-2022-info-data">
              <span>姓名：</span>
              {{ userUsfInfo.userName }}
            </el-col>
            <el-col :span="8" class="apply-2022-info-data">
              <span>账号类型：</span>
              {{ userUsfInfo.userSystemType | userSystemType }}
            </el-col>
            <!-- 第二行 -->
            <el-col :span="16" class="apply-2022-info-data">
              <span>所属机构：</span>
              {{ userUsfInfo.orgFullName }}
            </el-col>
            <el-col v-show="userUsfInfo.userGroups && userUsfInfo.userGroups.length" :span="24"
              class="apply-2022-info-data">
              <span>所属用户组：</span>
              <div>
                {{ (userUsfInfo.userGroups || []).join(", ") }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div v-if="showUsfInfo" class="apply-2022-info-container">
      <div class="apply-2022-info-data-container">
        <h2>申请类别及方式</h2>
        <div>
          <div>
            <el-form :inline="true" :model="form" :rules="rules" label-width="128px" label-position="left">
              <div>
                <el-form-item label="申请类别">
                  <el-radio-group class="apply-type" @change="onValueChange('assignType')" v-model="form.assignType"
                    size="large">
                    <el-radio label="1" border>开通权限
                      <p>开通申请人所申权限</p>
                      <span class="apply-2022-self-apply-badge"><span>开启权限</span></span>
                    </el-radio>
                    <!-- 判定 是否 为业务系统 还是管理员 -->
                    <el-radio label="2" border v-show="applyType !== 'applyAdmin'">关闭所有权限
                      <p>关闭申请人所有权限，删除账号</p>
                      <span class="apply-2022-self-apply-badge"><span>全部关闭</span></span>
                    </el-radio>
                    <el-radio label="4" border v-show="applyType !== 'applyAdmin'">关闭部分权限
                      <p>关闭申请人所申权限，保留账号</p>
                      <span class="apply-2022-self-apply-badge"><span>部分关闭</span></span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <el-form-item label="申请方式">
                <el-radio-group class="apply-method" @change="onValueChange('applyType')" v-model="form.applyType"
                  size="small">
                  <el-radio label="self" border>本人申请
                  </el-radio>
                  <el-radio v-show="applyType === 'applyUser'" label="other" border>代人申请
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 代人申请情况下才需要显示 -->
              <div v-show="form.applyType === 'other'">
                <el-form-item label="被代理人账号类型">
                  <el-radio-group class="apply-method" @change="onValueChange('userSystemTypeForOther')"
                    v-model="form.userSystemTypeForOther" size="small">
                    <el-radio :label="1" border>ERP
                    </el-radio>
                    <el-radio :label="2" border>PIN
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div v-show="form.applyType === 'other'">
                <el-form-item label="录入方式">
                  <el-radio-group class="apply-method" @change="onValueChange('entryMethod')"
                    v-model="form.entryMethod" size="small">
                    <el-radio :label="0" border>直接录入
                    </el-radio>
                    <el-radio :label="1" border>批量上传
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div v-show="form.applyType === 'other' && form.entryMethod === 1">
                <el-form-item label="  ">
                  <el-alert type="warning" class="import-warning-message" :closable="false">
                    <template slot="title">
                      请先点击下载模板，录入信息后，点击上传文件。<br>
                      注：单次录入需小于1000个，且所录入被代理人账号需申请相同操作权限
                    </template>
                  </el-alert>
                </el-form-item>
                <div></div>
                <el-form-item class="template-buttons" label="  ">
                  <el-button @click="onDownloadExcel" size="small" icon="el-icon-download" plain>下载模板</el-button>
                  <el-upload
                    ref="upload"
                    class="template-buttons-upload"
                    name="userFile"
                    :action="'/businessApply/batchCheckUserByImportFile.do?tenementCode=' + storeForm.tenantId"
                    :multiple="false"
                    :show-file-list="false"
                    :limit="1"
                    :http-request="onUploadExcel">
                    <el-button :loading="uploading" size="small" icon="el-icon-upload2" plain>上传文件</el-button>
                  </el-upload>
                </el-form-item>
              </div>
              <div v-show="form.applyType === 'other' && form.entryMethod === 0">
                <el-form-item label="被代理人账号">
                  <TagTextarea ref="accounts" :value="storeForm.userCodesForOther" :errors="illegalUserCodes" />
                  <p class="apply-clew-alert">所录入被代理人账号将会被申请相同操作权限</p>
                </el-form-item>
              </div>
              <div>
                <el-form-item class="apply-2022-info-apply-reason" label="申请原因">
                  <el-input
                    v-model="form.applyRemark"
                    type="textarea"
                    :rows="4"
                    maxlength="200"
                    show-word-limit
                    placeholder="非必填项,可输入申请原因"
                    @change="onValueChange('applyRemark')">
                  </el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <FastHelpCreateAccountVue :visible="fastHelpVisible" :type="storeForm.userSystemTypeForOther"
      :accounts="errorAccountList" :updateVis="(visible) => (fastHelpVisible = visible)"
      @confirm="onFastHelpAccountOver" @delete="(rows) => { onDelete(rows, 2) }" />
    <FastCreateChooseOrgVue :visible="fastHelpChooseVisible" :type="storeForm.userSystemTypeForOther"
      :accounts="orgAccountList" :updateVis="(visible) => (fastHelpChooseVisible = visible)"
      @confirm="onFastHelpChooseOrgOver" @delete="(rows) => { onDelete(rows, 4) }" />
    <FastRemoveAccount :visible="fastRemoveAccountVisible" :type="storeForm.userSystemTypeForOther"
      :accounts="errorAccountList" :updateVis="(visible) => (fastRemoveAccountVisible = visible)"
      @confirm="onFastRemoveAccountOver" @delete="(rows) => { onDelete(rows, fastRemoveStatus) }"
      :status="fastRemoveStatus" />
    <WriteHelper />
  </div>
</template>

<script>
import { get } from "lodash";
import WriteHelper from "../../WriteHelper.vue";
import store from "../../../store/index.js";
import changeMixin from "../../../mixins/change";
import TagTextarea from '../../TagTextarea.vue'
import Bus from "../../../mixins/bus";
import filterMixin from "../../../mixins/filters";

// 请求相关逻辑位置
import requestMixins from "./request";
// 下一步之前的弹框验证逻辑位置
import nextValidMixins from "./nextValid";
import Axios from "axios";

export default {
  mixins: [requestMixins, nextValidMixins, changeMixin, filterMixin],
  name: "InfoConfirm",
  components: {
    WriteHelper,
    TagTextarea,
  },
  computed: {
    curStep() {
      return store.state.stepState.currentName;
    },
    storeForm() {
      return store.state.form;
    },
    // 申请方式
    applyType() {
      return store.state.applyType;
    },
    // 错误标色账号数据缓存
    illegalUserCodes() {
      return store.state.illegalUserCodes
    }
  },
  mounted() {
    // 获取用户ERP信息
    this.getUserErpInfo();
    Bus.$on('step2Valid', this.validAccount)
    Bus.$on('againChooseOrg', this.tenantIdChange)
  },
  beforeDestroy() {
    Bus.$off('step2Valid', this.validAccount)
  },
  watch: {
    curStep: {
      handler(newVal) {
        // 如果退回到第一步那么 清理掉机构选择数据
        if (newVal === "step1") {
          this.tenantIdChange();
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      form: {
        orgId: [],
        assignType: "1",
        userSystemTypeForOther: 1,
        applyType: 'self',
        applyRemark: '',
        entryMethod: 0
      },
      orgOptions: {
        lazy: true,
        lazyLoad: this.getOrgList,
        label: "orgName",
        value: "orgCode",
        checkStrictly: true,
        multiple: false,
        checkStrictly: true,
        emitPath: false,
      },
      rules: {
        orgId: [
          {
            required: true,
            message: "请选择机构",
          },
        ],
      },
      userErpInfo: {},
      userUsfInfo: {},
      applyerUsfInfo: {},
      showUsfInfo: false,
      // 上传状态
      uploading: false,
      importSuccess: [],
    };
  },
  methods: {
    handleManual() {
      if(store.state.configInfo&&store.state.configInfo.orgSelectHint){
        window.open(store.state.configInfo.orgSelectHint,"_blank")
      }
     },
    tenantIdChange() {
      // this.$refs.orgCascader.$forceUpdate()
      this.form.orgId = undefined;
      this.onOrgChange(undefined);
      this.queryUsfUserInfo();
      // 清理账号信息
      if (this.$refs.accounts) {
        this.$refs.accounts.clearValues();
      }
    },
    handlerChangeStep(targetStep) {
      store.commit("updateActiveApplyStep", { step: targetStep });
    },
    onValueChange(key) {
      // 如果key是开通权限
    //   if (key === 'assignType') {
    //     // 判定是否为关闭
    //     // 如果是关闭的话 那么禁止本人申请，只允许代人申请
    //     if (this.form.assignType != '1') {
    //       this.form.applyType = 'other';
    //       store.commit("updateForm", {
    //         key: 'applyType',
    //         value: 'other',
    //       });
    //     }
    //   }
      store.commit("updateForm", {
        key: key,
        value: this.form[key],
      });
    },
    onCreateUsfUser() {
      // 当前机构信息 获取机构中文路径名称
      const nodes = this.$refs.orgCascader.getCheckedNodes();
      const pathNodes = get(nodes, "[0].pathNodes", []);
      const labels = pathNodes.map((item) => {
        return item.label;
      });
      // 拷贝用户信息数据
      const data = {
        userName: this.userErpInfo.userName,
        userCode: this.userErpInfo.userCode,
        userSystemType: this.form.userSystemTypeForOther, // 1 ERP 2 PASSPORT
        userGroups: [],
        orgFullName: labels.join(" > "),
        isFakeData: true,
      };
      this.userUsfInfo = data;
      store.commit("updateForm", {
        key: "userCode",
        value: data.userCode,
      });
      store.commit("updateFakeUserData", true);
      store.commit("updateNextButtonDisabled", false);
      this.showUsfInfo = true;
    },
    // 机构变化更新 store
    onOrgChange(orgIds) {
      store.commit("updateForm", {
        key: "usfOrgId",
        value: orgIds,
      });
    },
    onDelete(rows, errorCode) {
      store.commit("updateErrorUserExportList", {
        list: rows,
        errorCode
      })
    },
    // 无验证直接进入下一步
    onNext() {
      store.commit('updateForm', {
        key: "assignType",
        value: this.form.assignType
      })
      store.commit('updateForm', {
        key: "userSystemTypeForOther",
        value: this.form.userSystemTypeForOther
      })
      store.commit('updateForm', {
        key: "applyType",
        value: this.form.applyType
      })
      store.commit('updateActiveApplyStepNoInterceptor', { step: 1 })
    },
    onDownloadExcel() {
      const url = `${location.origin}/api/common/downloadUserApplyTemplate.do?tenementCode=${this.storeForm.tenantId}`;
      const save_link = document.createElement("a")
      save_link.href = url;
      save_link.target = '_blank';
      const ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(ev);
    },
    onUploadExcel(config) {
      this.importSuccess = [];
      const form = new FormData();
      form.append(config.filename, config.file);
      this.uploading = true;
      Axios({
        method: 'post',
        url: config.action,
        data: form,
        headers: {
          'content-type': 'multipart/form-data'
        }
      }).then(response => {
        this.uploading = false;
        this.$refs.upload.clearFiles();
        const { errorUser = [], successUser = [] } = get(response, 'data.data', {});
        if(successUser.length === 0) {
          this.$message.error('账号格式均不合法,已全部剔除，请重新填写。');
        } else {
          if(errorUser.length) {
            this.$message.warning('部分账号录入格式异常已自动剔除，所剔除账号可在权限申请页查看');
            // 缓存到导出列表中
            store.commit('updateErrorUserExportListExcel', {
              list: errorUser
            })
          } else {
            this.$message.success('上传成功，请点击下一步');
          }
        }
        store.commit("updateForm", {
          key: 'usersForOther',
          value: successUser,
        });
        // 缓存数据
        this.importSuccess = successUser.map(item => item.userCode);
      }).catch((err) => {
        this.uploading = false;
        this.$refs.upload.clearFiles();
        this.$message.error('上传失败');
      })
    },
  },
};
</script>

<style>

</style>
