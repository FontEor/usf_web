<template>
  <div class="access-request">
    <div class="con-box">
      <!-- 增加跑马灯 -->
      <div class="marquee-container-div" style="background-color: antiquewhite;">
        <div style="animation-duration: 100s;">
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
          【通知】新版权限申请功能已上线，本页面计划于<strong style="color: red;">4月21日</strong>彻底关闭，4月20日前可正常使用。
          &emsp;&emsp;&emsp;&emsp;&emsp;
        </div>
      </div>
      <!--        第一页要显示的基本信息-->
      <div class="apply-label">
        <img src="../../imgs/header.png" height="66" width="1057" />
        <div v-show="step === '基础信息'">
          <h1 class="big-title">权限系统申请</h1>
          <!--            第一个模块是erp的基础信息-->
          <h3 class="apply-title">申请人信息</h3>
          <div class="form-erp">
            <el-form :model="formERP.data" ref="formERP" label-width="100px">
              <el-row>
                <el-col
                  :span="11"
                  v-for="(item, index) in formERP.itemList"
                  :key="index"
                >
                  <el-form-item :label="item.label">
                    <el-input
                      v-model="formERP.data[item.model]"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!--            第二个模块申请基本信息-->
          <h3 class="apply-title">申请权限基本信息</h3>
          <div class="form-basic">
            <el-form
              :model="formBasic.data"
              :rules="formBasic.rules"
              ref="formBasic"
              label-width="100px"
            >
              <!--         业务系统的级联选择-->
              <el-row :gutter="20">
                <el-col :span="5" style="width: 32%">
                  <el-form-item prop="system.id">
                    <span slot="label"
                      >业务系统
                      <el-tooltip class="item" effect="dark" placement="top">
                        <div slot="content">
                          所属应用：业务系统名称，如青龙系统；<br />
                          所属租户：业务系统会包含在某个租户下，通常一个应用隶属于一个租户；<br />
                          所属机构：业务系统在权限系统中配置的组织机构，根据实际业务场景选择您所属机构。<br />若您为首次申请权限，则会在该机构下创建您的账户。
                        </div>
                        <i class="el-icon-question"></i> </el-tooltip
                    ></span>
                    <el-select
                      style="width: 240px; height: 32px"
                      v-model="formBasic.data.system"
                      value-key="id"
                      placeholder="所属应用"
                      clearable
                      filterable
                      remote
                      :remote-method="getApplicationListByNameData"
                      :loading="loading"
                      @change="changeFormInfoSystem"
                    >
                      <el-option
                        v-for="item in formBasic.systemOptions"
                        :key="item.id"
                        :label="item.appName"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5" style="width: 22%">
                  <el-form-item prop="tenement" label-width="0px">
                    <el-select
                      style="width: 240px; height: 32px"
                      v-model="formBasic.data.tenement"
                      placeholder="所属租户"
                      clearable
                      filterable
                      @input.native="
                        ($event) => {
                          $event.target.value = $event.target.value.trim();
                        }
                      "
                      @change="changeFormInfoTenement"
                    >
                      <el-option
                        v-for="(item, index) in formBasic.tenementOptions"
                        :key="index"
                        :label="item.tenementName"
                        :value="item.tenementCode"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" style="width: 30%">
                  <el-form-item
                    ref="propInstitution"
                    :prop="propInstitution"
                    label-width="10px"
                    style="position: relative"
                  >
                    <!-- 级联选择-->
                    <el-cascader
                      style="width: 240px; height: 32px"
                      v-show="!formBasic.data.switch"
                      v-model="formBasic.data.institution"
                      placeholder="所属机构"
                      clearable
                      filterable
                      :options="formBasic.parentInstitutionOptions"
                      :props="formBasic.props"
                      @input.native="
                        ($event) => {
                          $event.target.value = $event.target.value.trim();
                        }
                      "
                      @change="changeFormInfoInstitution"
                    ></el-cascader>
                    <!-- 模糊搜索 -->
                    <el-select
                      style="width: 240px; height: 32px"
                      v-show="formBasic.data.switch"
                      v-model="formBasic.data.institution2"
                      placeholder="所属机构"
                      clearable
                      filterable
                      remote
                      :remote-method="postBlurryQueryOrgData"
                      :loading="loading"
                      @change="changeFormInfoInstitution2"
                    >
                      <el-option
                        v-for="(item, index) in formBasic.institutionOptions2"
                        :key="index"
                        :label="item.orgName"
                        :value="item.orgCode"
                      >
                        <span style="float: left">{{ item.orgName }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >({{ item.orgCode }})</span
                        >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="margin-left: -70px; width: 20%">
                  <el-form-item
                    v-if="showSearchSwitch === true"
                    label-width="0px"
                    ><el-switch
                      v-model="formBasic.data.switch"
                      active-text="模糊搜索"
                      :validate-event="false"
                      @change="switchChange"
                    ></el-switch>

                    <el-tooltip
                      style="margin-left: 5px; width: 10%"
                      effect="dark"
                      placement="top"
                    >
                      <div slot="content">
                        所属机构数据量大时，可以启用该功能，实现按照名称搜索机构信息。
                      </div>
                      <i
                        class="el-icon-question"
                      ></i> </el-tooltip></el-form-item
                ></el-col>
              </el-row>
              <el-form-item label="申请方式" prop="radio">
                <el-radio-group
                  v-model="formBasic.data.radio"
                  @change="changeformBaicRadio"
                >
                  <el-radio label="self" size="medium">本人权限申请</el-radio>
                  <el-radio label="other" size="medium">代人权限申请</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-show="formBasic.data.radio === 'other'"
                label="添加方式"
                prop="radio"
                style="margin-top: 1px"
              >
                <el-radio-group
                  v-model="formBasic.data.typeRadio"
                  @change="changeformBaicRadio"
                >
                  <el-radio label="single" size="medium">逐个添加</el-radio>
                  <el-radio label="large" size="medium">批量上传</el-radio>
                </el-radio-group>
              </el-form-item>
              <!--                代人申请的时候逐个的,上传时的各种状态-->
              <el-form-item
                v-show="
                  formBasic.data.radio === 'other' &&
                  formBasic.data.typeRadio === 'single'
                "
                label=""
                style="margin-top: 1px; margin-left: 0px; margin-bottom: 10px"
                label-width="140px"
              >
                <el-tag
                  :key="item.userCode"
                  v-for="item in formAddErp.userList"
                  closable
                  :disable-transitions="true"
                  @close="handleClose(item.userCode)"
                >
                  {{ item.userLabel }}
                </el-tag>
                <div
                  style="display: inline"
                  v-show="formPower.showButton === 'showBlue'"
                >
                  <el-button size="small" type="primary" plain @click="addErp"
                    >添加用户</el-button
                  >
                </div>
                <div
                  style="display: inline"
                  v-show="formPower.showButton === 'showNormal'"
                >
                  <el-button class="button-new-tag" size="small" @click="addErp"
                    >添加用户</el-button
                  >
                </div>
              </el-form-item>
              <!-- 添加erp的弹窗 -->
              <div class="adderp">
                <el-dialog
                  width="675px"
                  title="添加用户"
                  :visible.sync="addUserVisible"
                >
                  <el-form
                    :model="formAddErp"
                    class="addUserVisible"
                    ref="formAddErp"
                  >
                    <el-form-item label="账号类型" label-width="100px">
                      <el-select
                        v-model="formAddErp.userSystemType"
                        placeholder="请选择账号类型"
                        @change="changeuserSystemType"
                      >
                        <el-option
                          label="京东员工ERP账号"
                          value="1"
                        ></el-option>
                        <el-option label="京东PIN账号" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      prop="userCode"
                      label="用户账号"
                      label-width="100px"
                      :rules="[{ required: true, message: `请输入用户账号` }]"
                    >
                      <el-select
                        v-model="formAddErp.userCode"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入用户账号"
                        :remote-method="remoteMethod"
                        :loading="formAddErp.loading"
                      >
                        <el-option
                          v-for="item in formAddErp.options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <div
                      v-for="(item, index) in formAddErp.extDataLabel"
                      :key="index"
                    >
                      <el-form-item
                        v-if="
                          item.isEffective === 1 &&
                          item.isEnum === 0 &&
                          item.isRequired === 1
                        "
                        label-width="100px"
                        :prop="`extData.ext${item.extNo}`"
                        :label="item.extName"
                        :rules="[
                          { required: true, message: `请输入${item.extName}` },
                        ]"
                      >
                        <el-input
                          v-model.trim="formAddErp.extData[`ext${item.extNo}`]"
                          :placeholder="'请输入' + item.extName"
                          :maxlength="30"
                          clearable
                        />
                      </el-form-item>
                      <el-form-item
                        v-if="
                          item.isEffective === 1 &&
                          item.isEnum === 0 &&
                          item.isRequired === 0
                        "
                        label-width="100px"
                        :label="item.extName"
                      >
                        <el-input
                          v-model.trim="formAddErp.extData[`ext${item.extNo}`]"
                          :placeholder="'请输入' + item.extName"
                          clearable
                        />
                      </el-form-item>
                      <el-form-item
                        v-if="
                          item.isEffective === 1 &&
                          item.isEnum === 1 &&
                          item.isRequired === 1
                        "
                        label-width="100px"
                        :label="item.extName"
                        :prop="`extData.ext${item.extNo}`"
                        :rules="[
                          { required: true, message: `请选择${item.extName}` },
                        ]"
                      >
                        <el-select
                          v-model="formAddErp.extData[`ext${item.extNo}`]"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(item, index) in item.enumValue"
                            :key="index"
                            :label="item.key"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        v-if="
                          item.isEffective === 1 &&
                          item.isEnum === 1 &&
                          item.isRequired === 0
                        "
                        label-width="100px"
                        :label="item.extName"
                      >
                        <el-select
                          v-model="formAddErp.extData[`ext${item.extNo}`]"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(item, index) in item.enumValue"
                            :key="index"
                            :label="item.key"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="addUserVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addformAddErp"
                      >确 定</el-button
                    >
                  </div>
                </el-dialog>
              </div>
              <!--                代人申请的时候大量的,上传时的各种状态-->
              <el-form-item
                v-show="
                  formBasic.data.radio === 'other' &&
                  formBasic.data.typeRadio === 'large'
                "
                label=""
                v-model="formBasic.erp"
                prop="erp"
                style="margin-top: 1px; margin-left: 0px"
                label-width="134px"
              >
                <!-- 点击upload的时候先判断租户机构等是否为空 -->
                <el-button
                  size="small"
                  class="button-new-tag"
                  type="primary"
                  plain
                  @click="uploradConditions"
                  ><i class="el-icon-upload2"></i>点击上传</el-button
                >
                <el-upload
                  ref="upload"
                  class="upload-erp"
                  name="erpFile"
                  accept=".xls, .xlsx"
                  :action="formBasic.erpURL"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :before-remove="beforeRemove"
                  :on-remove="handleRemove"
                >
                  <!-- <el-button size="small" type="primary" plain
                    ><i class="el-icon-upload2"></i>点击上传</el-button
                  > -->
                  <div slot="tip" class="el-upload__tip" ref="tip">
                    点击
                    <span
                      class="downLoad"
                      type="primary"
                      @click="downloadExcel"
                    >
                      <i class="el-icon-download"></i>下载导入模板
                    </span>
                    Excel文件，填写Excel中的字段，保存后上传Excel文件，Excel中的一行数据代表一个用户。
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item style="margin-top: 1px">
                <span slot="label"
                  >申请权限
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      申请权限 则是开通已经选择的权限
                      <br />
                      <!-- 关闭权限 则是关闭已经选择的权限 -->
                    </div>
                    <i class="el-icon-question"></i> </el-tooltip
                ></span>
                <el-radio-group v-model="formBasic.data.applyRadio">
                  <el-radio :label="1">申请开启权限</el-radio>
                  <el-radio :label="2">申请关闭权限</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-show="formBasic.data.applyRadio === 2"
                style="margin-top: 1px"
              >
                <span slot="label">关闭范围 </span>
                <el-radio-group v-model="formBasic.data.closeLimits">
                  <el-radio label="whole">关闭所有权限</el-radio>
                  <!-- <el-radio label="part">关闭部分权限</el-radio> -->
                </el-radio-group>
              </el-form-item>
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="jobType" style="margin-top: 1px">
                    <span slot="label"
                      >岗位类型
                      <el-tooltip class="item" effect="dark" placement="top">
                        <div slot="content">
                          主岗：员工所在的本岗位，即人资系统展示的用户岗位；
                          <br />
                          挂编：实际工作内容超出人资岗位，需要申请挂编岗位的权限；<br />
                          轮岗：轮岗后，在本岗位工作需要的权限； <br />
                          其他：非以上场景。
                        </div>
                        <i class="el-icon-question"></i> </el-tooltip
                    ></span>
                    <el-select
                      v-model="formBasic.data.jobType"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in formBasic.jobTypeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="reason" style="margin-top: 1px">
                    <span slot="label"
                      >申请原因
                      <el-tooltip class="item" effect="dark" placement="top">
                        <div slot="content">
                          若当前的申请原因不包含您的申请诉求，可以在输入框内手动输入。
                        </div>
                        <i class="el-icon-question"></i> </el-tooltip
                    ></span>
                    <el-select
                      v-model="formBasic.data.reason"
                      placeholder="请选择"
                      :filterable="true"
                      @input.native="
                        ($event) => {
                          $event.target.value = $event.target.value.trim();
                        }
                      "
                      :allow-create="true"
                    >
                      <el-option
                        v-for="(item, index) in formBasic.reasonOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item
                label="备注"
                class="beizhu"
                style="margin-bottom: 100px"
              >
                <el-input
                  v-model.trim="formBasic.data.applyRemark"
                  placeholder="请输入备注"
                  maxlength="50"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 上传文件成功时弹出对话框 -->
          <el-dialog
            :visible.sync="formBasic.centerDialogVisible"
            width="30%"
            center
          >
            <div class="dialogContent">
              <p class="status">
                <i class="el-icon-success"></i><span>用户导入完成</span>
              </p>
              <p class="detail">
                <strong class="successCounts">{{
                  formBasic.successCounts
                }}</strong>
                条数据导入成功，
                <strong class="failureCounts">{{
                  formBasic.failureCounts
                }}</strong>
                条数据导入失败
              </p>
            </div>
            <div slot="footer">
              <a :href="formBasic.resultDownload" download>
                <el-button type="primary">下载导入结果</el-button>
              </a>
            </div>
          </el-dialog>
          <!-- 提交按钮 -->
          <div class="footer">
            <el-button class="smallButton" @click="closeApply"
              ><span class="smallButtonFont">关闭</span></el-button
            >
            <el-button type="primary" @click="nextStep" :disabled="showPZQX"
              >配置权限</el-button
            >
          </div>
        </div>
        <div v-show="step === '配置菜单角色'">
          <h1 class="big-title">配置权限</h1>
          <div class="page2">
            <el-steps :active="this.active">
              <el-step
                v-for="(item, index) in this.ConfigurationStep"
                :key="index"
                :title="item"
              ></el-step>
            </el-steps>
            <div class="roles">
              <el-transfer
                filterable
                target-order="push"
                :titles="['可选菜单角色', '已选菜单角色']"
                filter-placeholder="搜索菜单角色名称"
                v-model="formBasic.data.permissionRole"
                :data="formBasic.permissionRoleOptions"
                :render-content="renderFunc"
                class="menu-role-transfer"
                @change="onMenuRoleChange"
                @left-check-change="onMenuRoleCheckChange"
              >
                <!-- <span slot-scope="{ option }">
                  {{ option.label }}111

                  <span
                    v-if="option.illustration"
                    style="
                      color: #c0c4cc;
                      font-size: 13px;
                      padding-left: 10px;
                      padding-right: 15px;
                    "
                    >({{
                      option.illustration
                    }})aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span
                  >
                </span> -->
              </el-transfer>
            </div>
          </div>
          <div class="footer">
            <el-button class="smallButton" @click="closeApply"
              ><span class="smallButtonFont">关闭</span></el-button
            >
            <el-button class="smallButton" @click="lastStep"
              ><span class="smallButtonFont">上一步</span></el-button
            >
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </div>
        </div>
        <div v-show="step === '配置数据角色'">
          <h1 class="big-title">配置权限</h1>
          <div class="page2">
            <el-steps :active="this.active">
              <el-step
                v-for="(item, index) in this.ConfigurationStep"
                :key="index"
                :title="item"
              ></el-step>
            </el-steps>
            <div class="roles">
              <el-transfer
                filterable
                target-order="push"
                :titles="['可选数据角色', '已选数据角色']"
                filter-placeholder="搜索数据角色名称"
                v-model="formBasic.data.dataRole"
                :data="formBasic.dataRoleOptions"
                :render-content="renderFunc"
                class="data-role-transfer"
                @change="onDataRoleChange"
                @left-check-change="onDataRoleCheckChange"
              >
              </el-transfer>
            </div>
          </div>
          <div class="footer">
            <el-button class="smallButton" @click="closeApply"
              ><span class="smallButtonFont">关闭</span></el-button
            >
            <el-button class="smallButton" @click="lastStep"
              ><span class="smallButtonFont">上一步</span></el-button
            >
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </div>
        </div>
        <div v-show="step === '配置数据资源'">
          <!-- 一个可以变动的问题表单，一个table，一个弹窗可删除所选 -->
          <h1 class="big-title">配置权限</h1>
          <div class="quanXian">
            <el-steps :active="this.active">
              <el-step
                v-for="(item, index) in this.ConfigurationStep"
                :key="index"
                :title="item"
              ></el-step>
            </el-steps>
            <div class="formQuestions">
              <el-form
                size="small"
                :inline="true"
                ref="searchForm"
                label-width="115px"
              >
                <el-form-item label="数据类型">
                  <el-select
                    v-model="formPower.typeId"
                    @change="onDataTypeChange"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in formPower.dataTypeOptions"
                      :key="index"
                      :label="`${item.typeName} (${item.typeCode})`"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <!-- 根据选择的id弄出来扩展字段的问题 -->
                <el-form-item
                  v-for="(item, index) in this.formPower.currentCoFiles"
                  :key="index"
                  ><span v-if="item.isEffective === 1" slot="label">{{
                    item.extName
                  }}</span>
                  <!-- v-model 的值是拼出来的 -->
                  <el-input
                    v-if="item.isEffective === 1"
                    v-model="formPower.extData[`ext${item.extNo}`]"
                    :placeholder="'请输入' + item.extName"
                    :maxlength="30"
                    clearable
                  />
                </el-form-item>
                <el-form-item class="anNiu">
                  <el-button class="smallButton" @click="resetForm"
                    ><span class="smallButtonFont">重置</span></el-button
                  >
                  <el-button type="primary" @click="searchData">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!-- 根据查询条件得到数据 -->
            <div style="margin-top: 50px">
              <el-button
                type="primary"
                style="margin-left: 20px"
                @click="saveData"
                >保存当页已选</el-button
              >
              <el-button class="smallButton" @click="seeSaveData"
                ><span class="smallButtonFont">查看已选</span></el-button
              >
            </div>
            <div style="margin-top: 5px">
              <el-table
                ref="multipleTable"
                :data="formPower.tableData"
                tooltip-effect="dark"
                style="width: 95%; margin-left: 20px"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="45"> </el-table-column>
                <el-table-column type="index" width="50" label="序号">
                </el-table-column>
                <el-table-column
                  v-for="(item, index) in this.formPower.tableColumns"
                  :key="index"
                  :prop="item.key"
                  :label="item.label"
                  :formatter="item.formatter"
                >
                </el-table-column>
                <el-table-column
                  label="数据资源编码"
                  prop="dataCode"
                  width="120"
                ></el-table-column>
              </el-table>

              <el-pagination
                style="text-align: right; margin-right: 20px"
                small
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="formPower.page.currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="formPower.page.pageSize"
                layout="total, sizes, prev, pager, next"
                :total="formPower.page.total"
              >
              </el-pagination>
            </div>
            <!-- 已选择数据保存之后的弹窗可以进行删除操作 -->
            <el-dialog
              title="查看已选数据资源"
              :visible.sync="formPower.centerDialogVisible"
              width="60%"
            >
              <el-tabs v-model="formPower.activeName" @tab-click="handleClick">
                <el-tab-pane
                  v-for="(item, index) in this.formPower.showChooseDataList"
                  :key="index"
                  :label="`${item.title} (${item.tableData.length})`"
                  :name="item.key"
                >
                  <el-table
                    ref="chooseDate"
                    :data="item.tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                  >
                    <el-table-column type="index" width="50" label="序号">
                    </el-table-column>
                    <el-table-column
                      v-for="(item, index) in item.headers"
                      :key="index"
                      :prop="item.key"
                      :label="item.label"
                      :formatter="item.formatter"
                    >
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                      <template slot-scope="scope">
                        <el-button
                          @click.native.prevent="
                            deleteRow(scope.$index, item.tableData)
                          "
                          type="text"
                        >
                          移除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table></el-tab-pane
                >
              </el-tabs>
            </el-dialog>
          </div>
          <div class="footer">
            <el-button class="smallButton" @click="closeApply"
              ><span class="smallButtonFont">关闭</span></el-button
            >
            <el-button class="smallButton" @click="lastStep"
              ><span class="smallButtonFont">上一步</span></el-button
            >
            <el-button type="primary" :loading="submitLoading" @click="nextStep"
              >提交</el-button
            >
          </div>
        </div>

        <div v-show="step === '提交'">
          <h1 class="big-title">配置权限</h1>
          <div class="tiJiao">
            <el-steps :active="this.active">
              <el-step
                v-for="(item, index) in this.ConfigurationStep"
                :key="index"
                :title="item"
              ></el-step>
            </el-steps>
            <div v-show="result === '成功'">
              <div class="pic">
                <img src="../../imgs/sucess.png" height="140" width="200" />
              </div>
              <h1 class="row1">提交成功!</h1>
              <h1 class="row2">
                当前正在审批中，可在京ME或OA流程中心中查询审批进度
              </h1>
              <div class="footer">
                <el-button class="smallButton" @click="closeApplyNoConfirm"
                  ><span class="smallButtonFont">关闭</span></el-button
                >
                <el-button type="primary" @click="refreshRouter"
                  >继续提交</el-button
                >
              </div>
            </div>
            <div v-show="result === '失败'">
              <div class="pic">
                <img src="../../imgs/fail.png" height="140" width="200" />
              </div>
              <h1 class="row1">提交失败!</h1>
              <h1 class="row2">
                提交失败，{{ this.failMessage }}，您可以点击上一步重新提交
              </h1>
              <div class="footer">
                <el-button class="smallButton" @click="closeApplyNoConfirm"
                  ><span class="smallButtonFont">关闭</span></el-button
                >
                <el-button class="smallButton" @click="refreshRouter"
                  ><span class="smallButtonFont">重新填写</span></el-button
                >
                <el-button @click="lastStep" type="primary">上一步</el-button>
              </div>
            </div>
          </div>
        </div>
        <div v-show="step === '删除全部提交成功'">
          <h1 class="big-title">配置权限</h1>
          <div class="tiJiao">
            <div class="pic">
              <img src="../../imgs/sucess.png" height="140" width="200" />
            </div>
            <h1 class="row1">提交成功!</h1>
            <h1 class="row2">
              当前正在审批中，可在京ME或OA流程中心中中查询审批进度
            </h1>
            <div class="footer">
              <el-button class="smallButton" @click="closeApplyNoConfirm"
                ><span class="smallButtonFont">关闭</span></el-button
              >
              <el-button type="primary" @click="refreshRouter"
                >继续删除</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import lodash from "lodash";
import transferMixins from "./transfer";

export default {
  name: "accessRequest2",
  mixins: [transferMixins],
  computed: {
    firstStep() {
      return this.step === 1;
    },
    secondStep() {
      return this.step === 2;
    },
  },
  created() {
    this.getUserErpInfoData();
  },
  data() {
    const _this = this;
    return {
      submitLoading: false,
      // 如果erp为空的时候不能点击配置权限
      showPZQX: false,
      hh: window.location.origin,
      showSearchSwitch: true,
      addUserVisible: false,
      propInstitution: "institution",
      result: "",
      failMessage: "",
      loading: false,
      step: "基础信息",
      ConfigurationStep: [],
      active: 0,
      formERP: {
        itemList: [
          { model: "userCode", label: "申请人账号" },
          { model: "userName", label: "申请人姓名" },
          { model: "fullPathOrgName", label: "所属部门" },
          { model: "positionName", label: "岗位名称" },
        ],
        data: {
          userId: null,
          userCode: "",
          userName: "",
          fullPathOrgName: "",
          positionName: "",
        },
      },
      formBasic: {
        rules: {
          radio: [{ required: true, message: "请选择申请方式" }],
          jobType: [{ required: true, message: "请选择岗位类型" }],
          reason: [{ required: true, message: "请选择申请原因" }],
          "system.id": [{ required: true, message: "请输入业务系统" }],
          tenement: [{ required: true, message: "请选择所属租户" }],
          institution2: [{ required: true, message: "请选择所属机构" }],
          institution: [{ required: true, message: "请选择所属机构" }],
        },
        data: {
          typeRadio: "single",
          reason: "",
          radio: "self",
          resultData: "",
          illegalListJfsKey: "",
          applyRadio: 1,
          jobType: "",
          system: {},
          institution: [],
          tenement: null,
          switch: false,
          institution2: null,
          permissionRole: [],
          dataRole: [],
          permissionRoleExist: [],
          dataRoleExist: [],
          parentInstitution: null,
          dataRoleOptions: [],
          applyRemark: "",
          closeLimits: "whole",
        },
        props: {
          lazy: true,
          checkStrictly: true,
          lazyLoad(node, resolve) {
            if (node && node.data) {
              _this.getOrgListByParentOrgCodeData(node, resolve);
            }
          },
        },

        dataRoleOptions: [],
        systemOptions: [],
        tenementOptions: [],
        parentInstitutionOptions: [],
        permissionRoleOptions: [],
        institutionOptions2: [],
        jobTypeOptions: [
          { label: "主岗", value: "主岗" },
          { label: "挂编", value: "挂编" },
          { label: "轮岗", value: "轮岗" },
          { label: "其他", value: "其他" },
        ],
        reasonOptions: [
          { label: "新员工入职", value: "新员工入职" },
          { label: "转岗", value: "转岗" },
          { label: "工作内容调整", value: "工作内容调整" },
          { label: "新签商家", value: "新签商家" },
          { label: "其他", value: "其他" },
        ],
        erpURL: `${location.origin}${process.env.VUE_APP_API_PREFIX}/apply/importErp`,
        erpDownload: "",
        centerDialogVisible: false,
        successCounts: 0,
        failureCounts: 0,
        resultDownload: "",
      },
      menuRoleLeftCheckList: [],
      dataRoleLeftCheckList: [],
      formPower: {
        showButton: "showBlue",
        centerDialogVisible: false,
        activeName: "",
        dataTypeOptions: [],
        currentCoFiles: [],
        tableColumns: [],
        typeTitle: "",
        tableData: [],
        chooseData: [],
        showChooseData: {},
        showChooseDataList: [],
        typeId: "",
        page: { currentPage4: 1, pageSize: 10, total: 0 },
        extData: {
          ext1: "",
          ext2: "",
          ext3: "",
          ext4: "",
          ext5: "",
          ext6: "",
          ext7: "",
          ext8: "",
          ext9: "",
          ext10: "",
          ext11: "",
          ext12: "",
          ext13: "",
          ext14: "",
          ext15: "",
          ext16: "",
          ext17: "",
          ext18: "",
          ext19: "",
        },
      },
      formAddErp: {
        options: [],
        loading: false,
        userList: [],
        userCode: "",
        userSystemType: "1",
        extDataLabel: [],
        extData: {
          ext1: "",
          ext2: "",
          ext3: "",
          ext4: "",
          ext5: "",
          ext6: "",
          ext7: "",
          ext8: "",
          ext9: "",
          ext10: "",
          ext11: "",
          ext12: "",
          ext13: "",
          ext14: "",
          ext15: "",
          ext16: "",
          ext17: "",
          ext18: "",
          ext19: "",
        },
      },
    };
  },
  watch: {
    "formBasic.data.institution": {
      handler(newVal, oldVal) {
        let length = this.formBasic.data.institution.length;
        if (newVal.length > 2) {
          this.formBasic.data.parentInstitution =
            this.formBasic.data.institution[length - 2];
        } else {
          this.formBasic.data.parentInstitution =
            this.formBasic.data.institution[0];
        }
      },
      deep: true,
    },
    "formBasic.data.switch": {
      handler(newVal, oldVal) {
        if (newVal === true) {
          this.propInstitution = "institution2";
        } else {
          this.propInstitution = "institution";
        }
      },
      deep: true,
    },
    "formAddErp.userList": {
      handler(newVal, oldVal) {
        if (newVal.length >= 5) {
          this.formPower.showButton = false;
        } else if (newVal.length === 0) {
          this.formPower.showButton = "showBlue";
        } else {
          this.formPower.showButton = "showNormal";
        }
      },
      deep: true,
    },
    "formBasic.data.parentInstitution": {
      handler(newVal, oldVal) {
        console.log("watch parentInstitution", newVal, oldVal);
      },
      deep: true,
    },
  },

  methods: {
    // 当菜单角色穿梭框提交列表改变时
    onMenuRoleChange(_, direction) {
      if (direction === "right") {
        this.menuRoleLeftCheckList = [];
      }
    },
    // 当数据角色穿梭框提交列表改变时
    onDataRoleChange(_, direction) {
      if (direction === "right") {
        this.dataRoleLeftCheckList = [];
      }
    },
    // 当菜单角色穿梭框左侧勾选列表改变时
    onMenuRoleCheckChange(valueList) {
      this.menuRoleLeftCheckList = valueList;
    },
    // 当数据角色穿梭框左侧勾选列表改变时
    onDataRoleCheckChange(valueList) {
      this.dataRoleLeftCheckList = valueList;
    },
    // 根据租户去配置下载的excel
    downloadExcel() {
      let orgCode = "";
      if (this.formBasic.data.switch) {
        orgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        if (length > 0) {
          orgCode = this.formBasic.data.institution[length - 1];
        }
      }
      // 进行判断是否可以下载，不可以提示补全
      if (orgCode !== "" && orgCode !== null) {
        // const _origin = window.location.origin;
        // let a = document.createElement("a");
        // a.href = `${_origin}${this.VUE_APP_API_PREFIX}/common/downloadUserApplyTemplate.do?tenementCode=${this.formBasic.data.tenement}`;
        // a.click();
        const _origin = window.location.origin;
        let _form = document.createElement("form");
        _form.action = `${_origin}/api/common/downloadUserApplyTemplate.do?tenementCode=${this.formBasic.data.tenement}`;
        _form.method = "post";
        document.body.appendChild(_form);
        _form.submit();
        _form.remove();
      } else {
        this.$message({
          message: "该先填写所属应用，所属租户，所属机构",
          type: "error",
          center: true,
        });
      }
    },
    renderFunc(h, option) {
      if (option.illustration) {
        return (
          <el-tooltip
            class="item"
            open-delay={300}
            effect="dark"
            placement="top-start"
          >
            <div slot="content">
              {option.label}({option.illustration})
            </div>
            <span>
              {" "}
              {option.label}{" "}
              <span style="color: #c0c4cc">({option.illustration})</span>{" "}
            </span>
          </el-tooltip>
        );
      } else {
        return (
          <el-tooltip
            class="item"
            open-delay={300}
            effect="dark"
            placement="top-start"
          >
            <div slot="content"> {option.label}</div>
            <span> {option.label} </span>
          </el-tooltip>
        );
      }
    },

    addErp() {
      let orgCode = "";
      if (this.formBasic.data.switch) {
        orgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        if (length > 0) {
          orgCode = this.formBasic.data.institution[length - 1];
        }
      }
      // 进行判断是否可以下载，不可以提示补全
      if (orgCode !== "" && orgCode !== null) {
        this.formAddErp.userSystemType = "1";
        this.formAddErp.userCode = "";
        this.formAddErp.options = [];
        this.formAddErp.extData.ext1 = "";
        this.formAddErp.extData.ext2 = "";
        this.formAddErp.extData.ext3 = "";
        this.formAddErp.extData.ext4 = "";
        this.formAddErp.extData.ext5 = "";
        this.formAddErp.extData.ext6 = "";
        this.formAddErp.extData.ext7 = "";
        this.formAddErp.extData.ext8 = "";
        this.formAddErp.extData.ext9 = "";
        this.formAddErp.extData.ext10 = "";
        this.formAddErp.extData.ext11 = "";
        this.formAddErp.extData.ext12 = "";
        this.formAddErp.extData.ext13 = "";
        this.formAddErp.extData.ext14 = "";
        this.formAddErp.extData.ext15 = "";
        this.formAddErp.extData.ext16 = "";
        this.formAddErp.extData.ext17 = "";
        this.formAddErp.extData.ext18 = "";
        this.formAddErp.extData.ext19 = "";
        if (this.formAddErp.extDataLabel.length > 0) {
          for (let i = 0; i < this.formAddErp.extDataLabel.length; i++) {
            if (
              this.formAddErp.extDataLabel[i].isEffective === 1 &&
              this.formAddErp.extDataLabel[i].isEnum === 1 &&
              this.formAddErp.extDataLabel[i].isRequired
            ) {
              this.formAddErp.extData[
                `ext${this.formAddErp.extDataLabel[i].extNo}`
              ] = this.formAddErp.extDataLabel[i].enumValue[0].value;
            }
          }
        }
        this.addUserVisible = true;
      } else {
        this.$message({
          message: "该先填写所属应用，所属租户，所属机构",
          type: "error",
          center: true,
        });
      }
    },

    debounce(func, wait = 1000) {
      //可以放入项目中的公共方法中进行调用（鹅只是省事）
      let timeout;
      return function (event) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.call(this, event);
        }, wait);
      };
    },
    remoteMethod(query) {
      query = query.trim();
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          // this.debounce(() => {
          axios({
            method: "post",
            url: "/apply/findUserInfo.do",
            data: {
              userCode: query,
              userSystemType: this.formAddErp.userSystemType,
            },
          })
            .then((resolve) => {
              if (resolve.data.data.userCode && resolve.data.data.userName) {
                this.formAddErp.options = [
                  {
                    value: resolve.data.data.userCode,
                    label: `${resolve.data.data.userName} (${resolve.data.data.userCode})`,
                  },
                ];
              } else {
                this.formAddErp.options = [];
              }
            })
            .catch((reject) => {
              console.log("getExtByTenementCodeData 请求失败", reject);
            });
          // });

          // this.options = this.list.filter(item => {
          //   return item.label.toLowerCase()
          //     .indexOf(query.toLowerCase()) > -1;
          // });
        }, 100);
      } else {
        this.formAddErp.options = [];
      }
    },
    addformAddErp() {
      this.$refs.formAddErp.validate((valid) => {
        let orgCode = "";
        if (this.formBasic.data.switch) {
          orgCode = this.formBasic.data.institution2;
        } else {
          let length = this.formBasic.data.institution.length;
          if (length > 0) {
            orgCode = this.formBasic.data.institution[length - 1];
          }
        }
        if (valid) {
          let isNew = true;
          if (this.formAddErp.userList.length > 0) {
            for (let i = 0; i < this.formAddErp.userList.length; i++) {
              if (
                this.formAddErp.userList[i].userCode ===
                this.formAddErp.userCode
              ) {
                isNew = false;
              }
            }
          }
          if (isNew === false) {
            this.$message({
              message: "该用户已添加",
              type: "error",
              center: true,
            });
          } else {
            //在这里加一个跨域的校验
            axios({
              method: "post",
              url: "/apply/validateUserByAddOneByOne",
              data: {
                data: {
                  orgCode,
                  userSystemType: this.formAddErp.userSystemType,
                  tenementCode: this.formBasic.data.tenement,
                  userCode: this.formAddErp.userCode,
                },
              },
              params: { tenementCode: this.formBasic.data.tenement },
            })
              .then((resolve) => {
                if (resolve.data.code === 200) {
                  const user = {
                    userLabel: this.formAddErp.options[0].label,
                    userSystemType: this.formAddErp.userSystemType,
                    userCode: this.formAddErp.userCode,
                    ext1: this.formAddErp.extData.ext1,
                    ext2: this.formAddErp.extData.ext2,
                    ext3: this.formAddErp.extData.ext3,
                    ext4: this.formAddErp.extData.ext4,
                    ext5: this.formAddErp.extData.ext5,
                    ext6: this.formAddErp.extData.ext6,
                    ext7: this.formAddErp.extData.ext7,
                    ext8: this.formAddErp.extData.ext8,
                    ext9: this.formAddErp.extData.ext9,
                    ext10: this.formAddErp.extData.ext10,
                    ext11: this.formAddErp.extData.ext11,
                    ext12: this.formAddErp.extData.ext12,
                    ext13: this.formAddErp.extData.ext13,
                    ext14: this.formAddErp.extData.ext14,
                    ext15: this.formAddErp.extData.ext15,
                    ext16: this.formAddErp.extData.ext16,
                    ext17: this.formAddErp.extData.ext17,
                    ext18: this.formAddErp.extData.ext18,
                    ext19: this.formAddErp.extData.ext19,
                  };
                  this.formAddErp.userList.push(user);
                  this.addUserVisible = false;
                } else {
                  this.$message({
                    message: resolve.data.msg,
                    duration: 5000,
                    type: "error",
                    center: true,
                  });
                }
              })
              .catch((reject) => {
                console.log("postBlurryQueryOrgData 请求失败", reject);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeuserSystemType() {
      this.formAddErp.options = [];
      this.formAddErp.userCode = "";
    },
    handleClose(userCode) {
      for (let i = 0; i <= this.formAddErp.userList.length - 1; i++) {
        if (this.formAddErp.userList[i].userCode === userCode) {
          this.formAddErp.userList.splice(i, 1);
        }
      }
    },
    refreshRouter() {
      location.reload();
    },
    changeformBaicRadio(value) {
      // if (value === "self") {
      //   this.formBasic.data.switch = false;
      // } else if (value === "other") {
      //   this.formBasic.data.switch = true;
      // }
    },
    resetForm() {
      this.formPower.extData.ext1 = "";
      this.formPower.extData.ext2 = "";
      this.formPower.extData.ext3 = "";
      this.formPower.extData.ext4 = "";
      this.formPower.extData.ext5 = "";
      this.formPower.extData.ext6 = "";
      this.formPower.extData.ext7 = "";
      this.formPower.extData.ext8 = "";
      this.formPower.extData.ext9 = "";
      this.formPower.extData.ext10 = "";
      this.formPower.extData.ext11 = "";
      this.formPower.extData.ext12 = "";
      this.formPower.extData.ext13 = "";
      this.formPower.extData.ext14 = "";
      this.formPower.extData.ext15 = "";
      this.formPower.extData.ext16 = "";
      this.formPower.extData.ext17 = "";
      this.formPower.extData.ext18 = "";
    },
    // 点击搜素之后表格的表头改变，且数据更新
    searchData() {
      this.formPower.page.currentPage4 = 1;
      this.formPower.page.pageSize = 10;

      if (this.formPower.chooseData.length > 0) {
        this.$confirm("当前页已选数据还未保存，是否保存", "", {
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          type: "warning",
        })
          .then(async () => {
            await this.saveData();
            let orgCode = "";
            if (this.formBasic.data.switch) {
              orgCode = this.formBasic.data.institution2;
            } else {
              let length = this.formBasic.data.institution.length;
              orgCode = this.formBasic.data.institution[length - 1];
            }
            axios({
              method: "post",
              url: "/apply/applyDatalist",
              data: {
                data: {
                  orgCode,
                  typeId: this.formPower.typeId,
                  tenementCode: this.formBasic.data.tenement,
                  ext1: this.formPower.extData.ext1,
                  ext2: this.formPower.extData.ext2,
                  ext3: this.formPower.extData.ext3,
                  ext4: this.formPower.extData.ext4,
                  ext5: this.formPower.extData.ext5,
                  ext6: this.formPower.extData.ext6,
                  ext7: this.formPower.extData.ext7,
                  ext8: this.formPower.extData.ext8,
                  ext9: this.formPower.extData.ext9,
                  ext10: this.formPower.extData.ext10,
                  ext11: this.formPower.extData.ext11,
                  ext12: this.formPower.extData.ext12,
                  ext13: this.formPower.extData.ext13,
                  ext14: this.formPower.extData.ext14,
                  ext15: this.formPower.extData.ext15,
                  ext16: this.formPower.extData.ext16,
                  ext17: this.formPower.extData.ext17,
                  ext18: this.formPower.extData.ext18,
                },
                page: {
                  pageIndex: this.formPower.page.currentPage4,
                  pageSize: this.formPower.page.pageSize,
                },
              },
              params: {
                tenementCode: this.formBasic.data.tenement,
              },
            })
              .then((resolve) => {
                if (resolve.data.code === 200) {
                  this.formPower.page.total = resolve.data.data.rowTotal;
                  this.formPower.tableData = resolve.data.data.rows;
                } else {
                  console.log("getUserErpInfoData 返回异常", resolve);
                }
              })
              .catch((reject) => {
                console.log("postBlurryQueryOrgData 请求失败", reject);
              });
          })
          .catch(() => {});
      } else {
        let orgCode = "";
        if (this.formBasic.data.switch) {
          orgCode = this.formBasic.data.institution2;
        } else {
          let length = this.formBasic.data.institution.length;
          orgCode = this.formBasic.data.institution[length - 1];
        }
        axios({
          method: "post",
          url: "/apply/applyDatalist",
          data: {
            data: {
              orgCode,
              typeId: this.formPower.typeId,
              tenementCode: this.formBasic.data.tenement,
              ext1: this.formPower.extData.ext1,
              ext2: this.formPower.extData.ext2,
              ext3: this.formPower.extData.ext3,
              ext4: this.formPower.extData.ext4,
              ext5: this.formPower.extData.ext5,
              ext6: this.formPower.extData.ext6,
              ext7: this.formPower.extData.ext7,
              ext8: this.formPower.extData.ext8,
              ext9: this.formPower.extData.ext9,
              ext10: this.formPower.extData.ext10,
              ext11: this.formPower.extData.ext11,
              ext12: this.formPower.extData.ext12,
              ext13: this.formPower.extData.ext13,
              ext14: this.formPower.extData.ext14,
              ext15: this.formPower.extData.ext15,
              ext16: this.formPower.extData.ext16,
              ext17: this.formPower.extData.ext17,
              ext18: this.formPower.extData.ext18,
            },
            page: {
              pageIndex: this.formPower.page.currentPage4,
              pageSize: this.formPower.page.pageSize,
            },
          },
          params: {
            tenementCode: this.formBasic.data.tenement,
          },
        })
          .then((resolve) => {
            if (resolve.data.code === 200) {
              this.formPower.page.total = resolve.data.data.rowTotal;
              this.formPower.tableData = resolve.data.data.rows;
            } else {
              console.log("getUserErpInfoData 返回异常", resolve);
            }
          })
          .catch((reject) => {
            console.log("postBlurryQueryOrgData 请求失败", reject);
          });
      }
    },
    onDataTypeChange() {
      if (this.formPower.chooseData.length > 0) {
        this.$confirm("当前页已选数据还未保存，是否保存", "", {
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          type: "warning",
        })
          .then(async () => {
            await this.saveData();
            this.formPower.extData.ext1 = "";
            this.formPower.extData.ext2 = "";
            this.formPower.extData.ext3 = "";
            this.formPower.extData.ext4 = "";
            this.formPower.extData.ext5 = "";
            this.formPower.extData.ext6 = "";
            this.formPower.extData.ext7 = "";
            this.formPower.extData.ext8 = "";
            this.formPower.extData.ext9 = "";
            this.formPower.extData.ext10 = "";
            this.formPower.extData.ext11 = "";
            this.formPower.extData.ext12 = "";
            this.formPower.extData.ext13 = "";
            this.formPower.extData.ext14 = "";
            this.formPower.extData.ext15 = "";
            this.formPower.extData.ext16 = "";
            this.formPower.extData.ext17 = "";
            this.formPower.extData.ext18 = "";
            this.formPower.tableColumns = [];
            for (let i = 0; i < this.formPower.dataTypeOptions.length; i++) {
              if (
                this.formPower.dataTypeOptions[i].id === this.formPower.typeId
              ) {
                this.formPower.currentCoFiles =
                  this.formPower.dataTypeOptions[i].dataExtInfoList;
                this.formPower.typeTitle =
                  this.formPower.dataTypeOptions[i].typeName;
              }
            }

            for (let a = 0; a < this.formPower.currentCoFiles.length; a++) {
              if (this.formPower.currentCoFiles[a].isEffective === 1) {
                let key = `ext${this.formPower.currentCoFiles[a].extNo}`;
                let label = this.formPower.currentCoFiles[a].extName;
                // 为启用枚举值的扩展字段添加映射
                if (this.formPower.currentCoFiles[a].isEnum === 1) {
                  const { enumValue } = this.formPower.currentCoFiles[a];
                  const formatter = (_, __, cellValue) => {
                    const hashMap = lodash.fromPairs(
                      enumValue
                        .split(",")
                        .map((item) => item.split(":").reverse())
                    );
                    return hashMap[cellValue] || "";
                  };
                  this.formPower.tableColumns.push({ key, label, formatter });
                } else {
                  this.formPower.tableColumns.push({ key, label });
                }
              }
            }
            this.formPower.page.currentPage4 = 1;
            this.formPower.page.pageSize = 10;
            let orgCode = "";
            if (this.formBasic.data.switch) {
              orgCode = this.formBasic.data.institution2;
            } else {
              let length = this.formBasic.data.institution.length;
              orgCode = this.formBasic.data.institution[length - 1];
            }
            axios({
              method: "post",
              url: "/apply/applyDatalist",
              data: {
                data: {
                  orgCode,
                  typeId: this.formPower.typeId,
                  tenementCode: this.formBasic.data.tenement,
                  ext1: this.formPower.extData.ext1,
                  ext2: this.formPower.extData.ext2,
                  ext3: this.formPower.extData.ext3,
                  ext4: this.formPower.extData.ext4,
                  ext5: this.formPower.extData.ext5,
                  ext6: this.formPower.extData.ext6,
                  ext7: this.formPower.extData.ext7,
                  ext8: this.formPower.extData.ext8,
                  ext9: this.formPower.extData.ext9,
                  ext10: this.formPower.extData.ext10,
                  ext11: this.formPower.extData.ext11,
                  ext12: this.formPower.extData.ext12,
                  ext13: this.formPower.extData.ext13,
                  ext14: this.formPower.extData.ext14,
                  ext15: this.formPower.extData.ext15,
                  ext16: this.formPower.extData.ext16,
                  ext17: this.formPower.extData.ext17,
                  ext18: this.formPower.extData.ext18,
                },
                page: {
                  pageIndex: this.formPower.page.currentPage4,
                  pageSize: this.formPower.page.pageSize,
                },
              },
              params: {
                tenementCode: this.formBasic.data.tenement,
              },
            })
              .then((resolve) => {
                if (resolve.data.code === 200) {
                  this.formPower.page.total = resolve.data.data.rowTotal;
                  this.formPower.tableData = resolve.data.data.rows;
                } else {
                  console.log("getUserErpInfoData 返回异常", resolve);
                }
              })
              .catch((reject) => {
                console.log("postBlurryQueryOrgData 请求失败", reject);
              });
          })
          .catch(() => {});
      } else {
        this.formPower.extData.ext1 = "";
        this.formPower.extData.ext2 = "";
        this.formPower.extData.ext3 = "";
        this.formPower.extData.ext4 = "";
        this.formPower.extData.ext5 = "";
        this.formPower.extData.ext6 = "";
        this.formPower.extData.ext7 = "";
        this.formPower.extData.ext8 = "";
        this.formPower.extData.ext9 = "";
        this.formPower.extData.ext10 = "";
        this.formPower.extData.ext11 = "";
        this.formPower.extData.ext12 = "";
        this.formPower.extData.ext13 = "";
        this.formPower.extData.ext14 = "";
        this.formPower.extData.ext15 = "";
        this.formPower.extData.ext16 = "";
        this.formPower.extData.ext17 = "";
        this.formPower.extData.ext18 = "";
        this.formPower.tableColumns = [];
        for (let i = 0; i < this.formPower.dataTypeOptions.length; i++) {
          if (this.formPower.dataTypeOptions[i].id === this.formPower.typeId) {
            this.formPower.currentCoFiles =
              this.formPower.dataTypeOptions[i].dataExtInfoList;
            this.formPower.typeTitle =
              this.formPower.dataTypeOptions[i].typeName;
          }
        }

        for (let a = 0; a < this.formPower.currentCoFiles.length; a++) {
          if (this.formPower.currentCoFiles[a].isEffective === 1) {
            let key = `ext${this.formPower.currentCoFiles[a].extNo}`;
            let label = this.formPower.currentCoFiles[a].extName;
            // 为启用枚举值的扩展字段添加映射
            if (this.formPower.currentCoFiles[a].isEnum === 1) {
              const { enumValue } = this.formPower.currentCoFiles[a];
              const formatter = (_, __, cellValue) => {
                const hashMap = lodash.fromPairs(
                  enumValue.split(",").map((item) => item.split(":").reverse())
                );
                return hashMap[cellValue] || "";
              };
              this.formPower.tableColumns.push({ key, label, formatter });
            } else {
              this.formPower.tableColumns.push({ key, label });
            }
          }
        }
        this.formPower.page.currentPage4 = 1;
        this.formPower.page.pageSize = 10;
        let orgCode = "";
        if (this.formBasic.data.switch) {
          orgCode = this.formBasic.data.institution2;
        } else {
          let length = this.formBasic.data.institution.length;
          orgCode = this.formBasic.data.institution[length - 1];
        }
        axios({
          method: "post",
          url: "/apply/applyDatalist",
          data: {
            data: {
              orgCode,
              typeId: this.formPower.typeId,
              tenementCode: this.formBasic.data.tenement,
              ext1: this.formPower.extData.ext1,
              ext2: this.formPower.extData.ext2,
              ext3: this.formPower.extData.ext3,
              ext4: this.formPower.extData.ext4,
              ext5: this.formPower.extData.ext5,
              ext6: this.formPower.extData.ext6,
              ext7: this.formPower.extData.ext7,
              ext8: this.formPower.extData.ext8,
              ext9: this.formPower.extData.ext9,
              ext10: this.formPower.extData.ext10,
              ext11: this.formPower.extData.ext11,
              ext12: this.formPower.extData.ext12,
              ext13: this.formPower.extData.ext13,
              ext14: this.formPower.extData.ext14,
              ext15: this.formPower.extData.ext15,
              ext16: this.formPower.extData.ext16,
              ext17: this.formPower.extData.ext17,
              ext18: this.formPower.extData.ext18,
            },
            page: {
              pageIndex: this.formPower.page.currentPage4,
              pageSize: this.formPower.page.pageSize,
            },
          },
          params: {
            tenementCode: this.formBasic.data.tenement,
          },
        })
          .then((resolve) => {
            if (resolve.data.code === 200) {
              this.formPower.page.total = resolve.data.data.rowTotal;
              this.formPower.tableData = resolve.data.data.rows;
            } else {
              console.log("getUserErpInfoData 返回异常", resolve);
            }
          })
          .catch((reject) => {
            console.log("postBlurryQueryOrgData 请求失败", reject);
          });
      }
    },
    handleSizeChange(val) {
      this.formPower.page.pageSize = val;
      if (this.formPower.chooseData.length > 0) {
        this.$confirm("当前页已选数据还未保存，是否保存", "", {
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          type: "warning",
        })
          .then(async () => {
            await this.saveData();
            let orgCode = "";
            if (this.formBasic.data.switch) {
              orgCode = this.formBasic.data.institution2;
            } else {
              let length = this.formBasic.data.institution.length;
              orgCode = this.formBasic.data.institution[length - 1];
            }
            axios({
              method: "post",
              url: "/apply/applyDatalist",
              data: {
                data: {
                  orgCode,
                  typeId: this.formPower.typeId,
                  tenementCode: this.formBasic.data.tenement,
                  ext1: this.formPower.extData.ext1,
                  ext2: this.formPower.extData.ext2,
                  ext3: this.formPower.extData.ext3,
                  ext4: this.formPower.extData.ext4,
                  ext5: this.formPower.extData.ext5,
                  ext6: this.formPower.extData.ext6,
                  ext7: this.formPower.extData.ext7,
                  ext8: this.formPower.extData.ext8,
                  ext9: this.formPower.extData.ext9,
                  ext10: this.formPower.extData.ext10,
                  ext11: this.formPower.extData.ext11,
                  ext12: this.formPower.extData.ext12,
                  ext13: this.formPower.extData.ext13,
                  ext14: this.formPower.extData.ext14,
                  ext15: this.formPower.extData.ext15,
                  ext16: this.formPower.extData.ext16,
                  ext17: this.formPower.extData.ext17,
                  ext18: this.formPower.extData.ext18,
                },
                page: {
                  pageIndex: this.formPower.page.currentPage4,
                  pageSize: this.formPower.page.pageSize,
                },
              },
              params: {
                tenementCode: this.formBasic.data.tenement,
              },
            })
              .then((resolve) => {
                if (resolve.data.code === 200) {
                  this.formPower.page.total = resolve.data.data.rowTotal;
                  this.formPower.tableData = resolve.data.data.rows;
                } else {
                  console.log("getUserErpInfoData 返回异常", resolve);
                }
              })
              .catch((reject) => {
                console.log("postBlurryQueryOrgData 请求失败", reject);
              });
          })
          .catch(() => {});
      } else {
        let orgCode = "";
        if (this.formBasic.data.switch) {
          orgCode = this.formBasic.data.institution2;
        } else {
          let length = this.formBasic.data.institution.length;
          orgCode = this.formBasic.data.institution[length - 1];
        }
        axios({
          method: "post",
          url: "/apply/applyDatalist",
          data: {
            data: {
              orgCode,
              typeId: this.formPower.typeId,
              tenementCode: this.formBasic.data.tenement,
              ext1: this.formPower.extData.ext1,
              ext2: this.formPower.extData.ext2,
              ext3: this.formPower.extData.ext3,
              ext4: this.formPower.extData.ext4,
              ext5: this.formPower.extData.ext5,
              ext6: this.formPower.extData.ext6,
              ext7: this.formPower.extData.ext7,
              ext8: this.formPower.extData.ext8,
              ext9: this.formPower.extData.ext9,
              ext10: this.formPower.extData.ext10,
              ext11: this.formPower.extData.ext11,
              ext12: this.formPower.extData.ext12,
              ext13: this.formPower.extData.ext13,
              ext14: this.formPower.extData.ext14,
              ext15: this.formPower.extData.ext15,
              ext16: this.formPower.extData.ext16,
              ext17: this.formPower.extData.ext17,
              ext18: this.formPower.extData.ext18,
            },
            page: {
              pageIndex: this.formPower.page.currentPage4,
              pageSize: this.formPower.page.pageSize,
            },
          },
          params: {
            tenementCode: this.formBasic.data.tenement,
          },
        })
          .then((resolve) => {
            if (resolve.data.code === 200) {
              this.formPower.page.total = resolve.data.data.rowTotal;
              this.formPower.tableData = resolve.data.data.rows;
            } else {
              console.log("getUserErpInfoData 返回异常", resolve);
            }
          })
          .catch((reject) => {
            console.log("postBlurryQueryOrgData 请求失败", reject);
          });
      }
    },
    handleCurrentChange(val) {
      this.formPower.page.currentPage4 = val;
      if (this.formPower.chooseData.length > 0) {
        this.$confirm("当前页已选数据还未保存，是否保存", "", {
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          type: "warning",
        })
          .then(async () => {
            await this.saveData();
            let orgCode = "";
            if (this.formBasic.data.switch) {
              orgCode = this.formBasic.data.institution2;
            } else {
              let length = this.formBasic.data.institution.length;
              orgCode = this.formBasic.data.institution[length - 1];
            }
            axios({
              method: "post",
              url: "/apply/applyDatalist",
              data: {
                data: {
                  orgCode,
                  typeId: this.formPower.typeId,
                  tenementCode: this.formBasic.data.tenement,
                  ext1: this.formPower.extData.ext1,
                  ext2: this.formPower.extData.ext2,
                  ext3: this.formPower.extData.ext3,
                  ext4: this.formPower.extData.ext4,
                  ext5: this.formPower.extData.ext5,
                  ext6: this.formPower.extData.ext6,
                  ext7: this.formPower.extData.ext7,
                  ext8: this.formPower.extData.ext8,
                  ext9: this.formPower.extData.ext9,
                  ext10: this.formPower.extData.ext10,
                  ext11: this.formPower.extData.ext11,
                  ext12: this.formPower.extData.ext12,
                  ext13: this.formPower.extData.ext13,
                  ext14: this.formPower.extData.ext14,
                  ext15: this.formPower.extData.ext15,
                  ext16: this.formPower.extData.ext16,
                  ext17: this.formPower.extData.ext17,
                  ext18: this.formPower.extData.ext18,
                },
                page: {
                  pageIndex: this.formPower.page.currentPage4,
                  pageSize: this.formPower.page.pageSize,
                },
              },
              params: {
                tenementCode: this.formBasic.data.tenement,
              },
            })
              .then((resolve) => {
                if (resolve.data.code === 200) {
                  this.formPower.page.total = resolve.data.data.rowTotal;
                  this.formPower.tableData = resolve.data.data.rows;
                } else {
                  console.log("getUserErpInfoData 返回异常", resolve);
                }
              })
              .catch((reject) => {
                console.log("postBlurryQueryOrgData 请求失败", reject);
              });
          })
          .catch(() => {});
      } else {
        let orgCode = "";
        if (this.formBasic.data.switch) {
          orgCode = this.formBasic.data.institution2;
        } else {
          let length = this.formBasic.data.institution.length;
          orgCode = this.formBasic.data.institution[length - 1];
        }
        axios({
          method: "post",
          url: "/apply/applyDatalist",
          data: {
            data: {
              orgCode,
              typeId: this.formPower.typeId,
              tenementCode: this.formBasic.data.tenement,
              ext1: this.formPower.extData.ext1,
              ext2: this.formPower.extData.ext2,
              ext3: this.formPower.extData.ext3,
              ext4: this.formPower.extData.ext4,
              ext5: this.formPower.extData.ext5,
              ext6: this.formPower.extData.ext6,
              ext7: this.formPower.extData.ext7,
              ext8: this.formPower.extData.ext8,
              ext9: this.formPower.extData.ext9,
              ext10: this.formPower.extData.ext10,
              ext11: this.formPower.extData.ext11,
              ext12: this.formPower.extData.ext12,
              ext13: this.formPower.extData.ext13,
              ext14: this.formPower.extData.ext14,
              ext15: this.formPower.extData.ext15,
              ext16: this.formPower.extData.ext16,
              ext17: this.formPower.extData.ext17,
              ext18: this.formPower.extData.ext18,
            },
            page: {
              pageIndex: this.formPower.page.currentPage4,
              pageSize: this.formPower.page.pageSize,
            },
          },
          params: {
            tenementCode: this.formBasic.data.tenement,
          },
        })
          .then((resolve) => {
            if (resolve.data.code === 200) {
              this.formPower.page.total = resolve.data.data.rowTotal;
              this.formPower.tableData = resolve.data.data.rows;
            } else {
              console.log("getUserErpInfoData 返回异常", resolve);
            }
          })
          .catch((reject) => {
            console.log("postBlurryQueryOrgData 请求失败", reject);
          });
      }
    },
    handleSelectionChange(val) {
      this.formPower.chooseData = val;
    },
    async saveData() {
      if (
        !this.formPower.chooseData ||
        (this.formPower.chooseData && this.formPower.chooseData.length === 0)
      ) {
        return;
      }
      await this.checkDataResource().catch(() => {
        throw new Error("saveData checkDataResource");
      });
      if (this.formPower.showChooseData[this.formPower.typeId]) {
        if (
          this.formPower.showChooseData[this.formPower.typeId].tableData &&
          this.formPower.showChooseData[this.formPower.typeId].tableData
            .length > 0
        ) {
          for (let i = 0; i < this.formPower.chooseData.length; i++) {
            this.formPower.showChooseData[this.formPower.typeId].tableData.push(
              this.formPower.chooseData[i]
            );
          }
          for (
            var i = 0;
            i <
            this.formPower.showChooseData[this.formPower.typeId].tableData
              .length;
            i++
          ) {
            for (
              var j = i + 1;
              j <
              this.formPower.showChooseData[this.formPower.typeId].tableData
                .length;
              j++
            ) {
              if (
                this.formPower.showChooseData[this.formPower.typeId].tableData[
                  i
                ].dataCode ===
                this.formPower.showChooseData[this.formPower.typeId].tableData[
                  j
                ].dataCode
              ) {
                //第一个等同于第二个，splice方法删除第二个
                this.formPower.showChooseData[
                  this.formPower.typeId
                ].tableData.splice(j, 1);
                j--;
              }
            }
          }
        } else {
          this.formPower.showChooseData[this.formPower.typeId].tableData =
            this.formPower.chooseData;
        }
      } else {
        this.formPower.showChooseData[this.formPower.typeId] = {};
        this.formPower.showChooseData[this.formPower.typeId].title =
          this.formPower.typeTitle;
        this.formPower.showChooseData[this.formPower.typeId].headers =
          this.formPower.tableColumns;

        this.formPower.showChooseData[this.formPower.typeId].tableData =
          this.formPower.chooseData;
      }
      this.$message({
        message: "保存成功！",
        type: "success",
        center: true,
      });
      this.$refs.multipleTable.clearSelection();
    },
    // 用户分配数据资源扩展点校验接口
    async validUserAuthorizeDataResource() {
      const tenementCode = this.formBasic.data.tenement;
      const appCode = this.formBasic.data.system.appCode;
      const userCode = this.formERP.data.userCode;
      const applyType = this.formBasic.data.radio;
      const orgCode = this.formBasic.data.switch
        ? this.formBasic.data.institution2
        : this.formBasic.data.institution.length > 0
        ? this.formBasic.data.institution[
            this.formBasic.data.institution.length - 1
          ]
        : "";
      const illegalListJfsKey = this.formBasic.data.illegalListJfsKey;
      const userList = this.formAddErp.userList;
      let dataCodeMap = {};
      dataCodeMap[this.formPower.typeId] =
        this.formPower.chooseData.map((item) => item.dataCode) || [];
      const data = {
        tenementCode,
        appCode,
        userCode,
        applyType,
        orgCode,
        illegalListJfsKey,
        userList,
        dataCodeMap,
      };
      const params = {tenementCode}
      return await axios({
        method: "post",
        url: "/apply/validUserAuthorizeDataResource",
        data,
        params
      }).catch((error) => {
        const { msg } = error.data;
        msg && this.$message.error(msg);
        throw new Error("validUserAuthorizeDataResource");
      });
    },
    // 用户分配数据资源扩展点校验操作
    async checkDataResource() {
      const response = await this.validUserAuthorizeDataResource().catch(() => {
        throw new Error("checkDataResource validUserAuthorizeDataResource");
      });
      const { code, msg, data } = response.data;
      if (code === 200) {
        if (data && data.length > 0) {
          const h = this.$createElement;
          const failResultList = data.map((item) =>
            h(
              "p",
              null,
              `数据资源编码：${item.dataCode}，分配失败原因：${item.mark}`
            )
          );
          this.$message.error({
            message: h(
              "section",
              { style: "color:#E1251B;" },
              [h("p", null, "用户分配数据资源失败")].concat(failResultList)
            ),
            duration: 5000,
            showClose: true,
            customClass: "data-resource-message",
          });
          throw new Error("checkDataResource 未通过校验");
        }
      } else {
        msg && this.$message.error(msg);
        throw new Error("checkDataResource");
      }
    },
    seeSaveData() {
      var keys = [];
      keys = Object.keys(this.formPower.showChooseData);
      this.formPower.showChooseDataList = [];

      if (keys && keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let title = this.formPower.showChooseData[keys[i]].title;
          let headers = this.formPower.showChooseData[keys[i]].headers;
          let tableData = this.formPower.showChooseData[keys[i]].tableData;
          if (tableData.length > 0) {
            this.formPower.showChooseDataList.push({
              key,
              title,
              headers,
              tableData,
            });
          }
        }
      }

      if (this.formPower.showChooseDataList.length > 0) {
        this.formPower.activeName =
          this.formPower.showChooseDataList[
            this.formPower.showChooseDataList.length - 1
          ].key;
        this.formPower.centerDialogVisible = true;
      } else {
        this.$message({
          message: "当前暂无已选数据",
          type: "error",
          center: true,
        });
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    handleClick(tab, event) {},
    // 从首页跳转到菜单配置页面，需要判断开关,第一步判断rules（还没写）
    nextStep() {
      if (this.step === "基础信息") {
        // 在这里调接口，看list，并判断是否为空
        let errorNumber = 0;
        this.$refs.formBasic.validate((valid) => {
          if (!valid) {
            errorNumber += 1;
          }
        });

        if (errorNumber) {
          return false;
        } else if (
          this.formBasic.data.radio === "other" &&
          this.formBasic.data.typeRadio === "single" &&
          this.formAddErp.userList.length === 0
        ) {
          this.$message({
            message: "请先添加用户",
            type: "error",
            center: true,
          });
        } else if (
          this.formBasic.data.radio === "other" &&
          this.formBasic.data.typeRadio === "large" &&
          this.formBasic.data.resultData === ""
        ) {
          this.$message({
            message: "请先上传用户文件",
            type: "error",
            center: true,
          });
        }
        // 当是删除还是全部删除时候不需要获取步骤条直接提交
        else if (
          this.formBasic.data.applyRadio === 2 &&
          this.formBasic.data.closeLimits === "whole"
        ) {
          this.submitCloseAll();
        } else {
          // 当是提交的时候
          this.getConfigurationStep();
          this.formBasic.data.permissionRole = [];
          this.formBasic.permissionRoleOptions = [];
          this.formBasic.data.dataRole = [];
          this.formBasic.dataRoleOptions = [];
          this.formBasic.data.permissionRoleExist = [];
          this.formBasic.data.dataRoleExist = [];
          this.postMenuRoleListForUserData();
          this.postApplyQueryDataRoleByUserCodeData();
          this.getFormPowerData();
        }
      } else {
        const type = "warning";
        const h = this.$createElement;
        const message = h("div", null, [
          h("p", null, "您的勾选项尚未生效。"),
          h("p", null, "点击保存按钮，系统将进行保存并上传。"),
          h("p", null, "如需修改勾选项，请点击取消按钮。"),
        ]);
        const options = { type };
        if (
          this.step === "配置菜单角色" &&
          this.menuRoleLeftCheckList.length > 0
        ) {
          return this.$confirm(message, "", options)
            .then(() => {
              document
                .querySelector(".menu-role-transfer .el-icon-arrow-right")
                .click();
            })
            .catch(() => {});
        } else if (
          this.step === "配置数据角色" &&
          this.dataRoleLeftCheckList.length > 0
        ) {
          return this.$confirm(message, "", options)
            .then(() => {
              document
                .querySelector(".data-role-transfer .el-icon-arrow-right")
                .click();
            })
            .catch(() => {});
        }
        this.active++;
        if (this.active === this.ConfigurationStep.length - 1) {
          if (this.formPower.chooseData.length > 0) {
            this.$confirm("当前页已选数据还未保存，是否保存", "", {
              confirmButtonText: "保存",
              cancelButtonText: "不保存",
              type: "warning",
            })
              .then(async () => {
                this.submitLoading = true;
                await this.saveData().catch(() => {
                  this.submitLoading = false;
                  throw new Error("nextStep saveData");
                });
                await this.submitApply();
                this.submitLoading = true;
              })
              .catch(() => {});
          } else {
            this.submitApply();
          }
        } else {
          this.step = this.ConfigurationStep[this.active];
        }
      }
    },
    submitCloseAll() {
      if (this.formBasic.data.radio === "self") {
        this.formBasic.data.resultData = "";
        this.formBasic.data.illegalListJfsKey = "";
        this.formAddErp.userList = [];
      }
      if (
        this.formBasic.data.radio === "other" &&
        this.formBasic.data.typeRadio === "large"
      ) {
        this.formAddErp.userList = [];
      }

      let orgCode = "";
      if (this.formBasic.data.switch) {
        orgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        orgCode = this.formBasic.data.institution[length - 1];
      }
      let dataCodeMap = {};
      var keys = Object.keys(this.formPower.showChooseData);
      if (keys && keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          dataCodeMap[keys[i]] = [];
          for (
            let j = 0;
            j < this.formPower.showChooseData[keys[i]].tableData.length;
            j++
          )
            dataCodeMap[keys[i]].push(
              this.formPower.showChooseData[keys[i]].tableData[j].dataCode
            );
        }
      }
      api.users
        .submitUserRoleAndDataApply({
          id: this.formERP.data.userId,
          userList: this.formAddErp.userList,
          applyType: this.formBasic.data.radio,
          applyUserCodeList: [this.formERP.data.userCode],
          userCode: this.formERP.data.userCode,
          userName: this.formERP.data.userName,
          remark: `${this.formBasic.data.jobType} ${this.formBasic.data.reason}`,
          applyRemark: this.formBasic.data.applyRemark,
          appId: this.formBasic.data.system.id,
          appCode: this.formBasic.data.system.appCode,
          appName: this.formBasic.data.system.appName,
          tenementCode: this.formBasic.data.tenement,
          orgCode,
          dataCodeMap,
          assignType: this.formBasic.data.applyRadio,
          menuRoleCodeList: this.formBasic.data.permissionRole,
          dataRoleCodeList: this.formBasic.data.dataRole,
          userCodesUrl: this.formBasic.data.resultData,
          illegalListJfsKey: this.formBasic.data.illegalListJfsKey,
        })
        .then((resolve) => {
          if (resolve.code === 200) {
            // 转变页面到提交页面
            this.step = "删除全部提交成功";
          } else {
            this.$message({
              message: resolve.msg,
              type: "error",
              center: true,
            });
          }
        })
        .catch((reject) => {
          console.log("postBlurryQueryOrgData 请求失败", reject);
        });
    },
    async submitApply() {
      if (this.formBasic.data.radio === "self") {
        this.formBasic.data.resultData = "";
        this.formBasic.data.illegalListJfsKey = "";
        this.formAddErp.userList = [];
      }
      if (
        this.formBasic.data.radio === "other" &&
        this.formBasic.data.typeRadio === "large"
      ) {
        this.formAddErp.userList = [];
      }
      let orgCode = "";
      if (this.formBasic.data.switch) {
        orgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        orgCode = this.formBasic.data.institution[length - 1];
      }
      let dataCodeMap = {};
      var keys = Object.keys(this.formPower.showChooseData);
      if (keys && keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          dataCodeMap[keys[i]] = [];
          for (
            let j = 0;
            j < this.formPower.showChooseData[keys[i]].tableData.length;
            j++
          )
            dataCodeMap[keys[i]].push(
              this.formPower.showChooseData[keys[i]].tableData[j].dataCode
            );
        }
      }
      // dataRoleCodeList,menuRoleCodeList,
      // this.formBasic.data.permissionRole,this.formBasic.data.permissionRoleExist
      //  this.formBasic.data.dataRole, this.formBasic.data.dataRoleExist
      let dataRoleCodeList = this.formBasic.data.dataRole.filter(
        (item) => !this.formBasic.data.dataRoleExist.includes(item)
      );
      let menuRoleCodeList = this.formBasic.data.permissionRole.filter(
        (item) => !this.formBasic.data.permissionRoleExist.includes(item)
      );
      await api.users
        .submitUserRoleAndDataApply({
          id: this.formERP.data.userId,
          userList: this.formAddErp.userList,
          applyType: this.formBasic.data.radio,
          applyUserCodeList: [this.formERP.data.userCode],
          userCode: this.formERP.data.userCode,
          userName: this.formERP.data.userName,
          remark: `${this.formBasic.data.jobType} ${this.formBasic.data.reason}`,
          applyRemark: this.formBasic.data.applyRemark,
          appId: this.formBasic.data.system.id,
          appCode: this.formBasic.data.system.appCode,
          appName: this.formBasic.data.system.appName,
          tenementCode: this.formBasic.data.tenement,
          orgCode,
          dataCodeMap,
          assignType: this.formBasic.data.applyRadio,
          menuRoleCodeList: menuRoleCodeList,
          dataRoleCodeList: dataRoleCodeList,
          userCodesUrl: this.formBasic.data.resultData,
          illegalListJfsKey: this.formBasic.data.illegalListJfsKey,
        })
        .then((resolve) => {
          if (resolve.code === 200) {
            // 转变页面到提交页面
            this.step = this.ConfigurationStep[this.active];
            this.result = "成功";
          } else {
            this.step = this.ConfigurationStep[this.active];
            this.result = "失败";
            this.failMessage = resolve.msg;
          }
        })
        .catch((reject) => {
          console.log("postBlurryQueryOrgData 请求失败", reject);
        });
    },
    // 申请方式
    getConfigurationStep() {
      let orgCode = "";
      if (this.formBasic.data.switch) {
        orgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        orgCode = this.formBasic.data.institution[length - 1];
      }
      let applyType = this.formBasic.data.radio;
      axios({
        method: "post",
        url: "apply/showNavigateFlag",
        data: {
          data: {
            applyType,
            orgCode,
            appCode: this.formBasic.data.system.appCode,
            tenementCode: this.formBasic.data.tenement,
          },
        },
        params: {
          tenementCode: this.formBasic.data.tenement,
        },
      })
        .then((resolve) => {
          if (resolve.data.code === 200) {
            this.ConfigurationStep = resolve.data.data;
            if (this.ConfigurationStep.length === 0) {
              this.$confirm("没有可配置项，是否提交", "", {
                distinguishCancelAndClose: true,
                confirmButtonText: "继续填写",
                cancelButtonText: "提交",
                type: "warning",
              })
                .then(() => {})
                .catch((action) => {
                  if (action === "cancel") {
                    alert("这一步该提交了");
                    this.step = "提交";
                  }
                });
            } else {
              this.step = this.ConfigurationStep[this.active];
            }
          } else {
            this.$message({
              message: resolve.data.msg,
              type: "error",
              center: true,
            });
          }
        })
        .catch((reject) => {
          console.log("postBlurryQueryOrgData 请求失败", reject);
        });
    },

    lastStep() {
      if (this.active === 0) {
        this.step = "基础信息";
      } else {
        this.active--;
        this.step = this.ConfigurationStep[this.active];
      }
    },

    closeApplyNoConfirm() {
      this.$router.back();
    },

    // 关闭当前表格
    closeApply() {
      this.$confirm("是否放弃当前修改的内容？", "", {
        distinguishCancelAndClose: true,
        confirmButtonText: "继续填写",
        cancelButtonText: "放弃",
        type: "warning",
      })
        .then(() => {})
        .catch((action) => {
          if (action === "cancel") {
            this.$router.back();
          }
        });
    },
    getUserErpInfoData() {
      api.users
        .getUserErpInfo({})
        .then((resolve) => {
          if (resolve.code === 200) {
            const { id, userCode, userName, fullPathOrgName, positionName } =
              resolve.data;
            this.formERP.data.userId = id;
            this.formERP.data.userCode = userCode;
            this.formERP.data.userName = userName;
            this.formERP.data.fullPathOrgName = fullPathOrgName;
            this.formERP.data.positionName = positionName;
            this.showPZQX = false;
          } else {
            // 当erp传回值得为空时 禁用按钮
            this.$message({
              message: "系统未检测到您的登录信息，请先登录http://usf3.jdl.com/再进入物流权限申请界面",
              type: "error",
              duration: 8000,
              center: true,
            });
            this.showPZQX = true;
            console.log("getUserErpInfoData 返回异常", resolve);
          }
        })
        .catch((reject) => {
          console.log("getUserErpInfoData 请求失败", reject);
        });
    },
    // 点击上传的文件的时候先判断
    uploradConditions() {
      let orgCode = "";
      if (this.formBasic.data.switch) {
        orgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        if (length > 0) {
          orgCode = this.formBasic.data.institution[length - 1];
        }
      }
      // 进行判断是否可以下载，不可以提示补全
      if (orgCode !== "" && orgCode !== null) {
        this.$refs["upload"].$refs["upload-inner"].handleClick();
      } else {
        this.$message({
          message: "该先填写所属应用，所属租户，所属机构",
          type: "error",
          center: true,
        });
      }
    },
    beforeUpload(file, fileList) {
      // 如果文件名不是.xls或.xlsx后缀结尾，就停止上传并执行beforeRemove
      if (file.name.search(/\.xlsx?$/) === -1) {
        return false;
      }
    },
    handleSuccess(response, file, fileList) {
      this.formBasic.data.resultData = "";
      this.formBasic.data.illegalListJfsKey = "";
      this.formBasic.resultDownload = "";
      if (fileList.length > 1) {
        fileList.shift();
      }
      if (response.resultCode === 1) {
        this.formBasic.data.resultData = response.resultData;
        this.formBasic.data.illegalListJfsKey = response.illegalListJfsKey;

        this.formBasic.resultDownload = response.resultData1;
        this.formBasic.successCounts = response.successCounts;
        this.formBasic.failureCounts = response.failureCounts;
        this.formBasic.centerDialogVisible = true;
      } else if (response.resultCode === 0) {
        this.$message({
          message: response.resultMsg,
          type: "warning",
          center: true,
        });
        fileList.pop();
      } else {
        // 将一张图片的文件名后缀改为.xls或.xlsx会执行这里
        this.$message({
          message: "上传文件格式错误，请按照导入模板修改后重新上传",
          type: "error",
          center: true,
        });
        fileList.pop();
      }
    },

    beforeRemove(file, fileList) {
      // 如果文件名不是.xls或.xlsx后缀结尾，就提示信息并移除文件
      if (file.name.search(/\.xlsx?$/) === -1) {
        this.$message({
          message: "上传失败 请上传Excel文件",
          type: "error",
          center: true,
        });
        return true;
      }
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, fileList) {
      this.$refs.upload.clearFiles();
      this.formBasic.data.resultData = "";
      this.formBasic.data.illegalListJfsKey = "";
      this.formBasic.resultDownload = "";
    },
    getApplicationListByNameData(query) {
      query = query.trim();
      if (query !== "") {
        this.loading = true;
        api.users
          .getApplicationListByName({
            appName: query,
          })
          .then((resolve) => {
            this.loading = false;
            if (resolve.code === 200) {
              this.formBasic.systemOptions = resolve.data;
            } else {
              console.log("getApplicationListByNameData 返回异常", resolve);
            }
          })
          .catch((reject) => {
            console.log("getApplicationListByNameData 请求失败", reject);
            this.loading = false;
          });
      }
    },
    changeFormInfoSystem(value) {
      value && this.getDataByAppId();
      // 再切换上面的机构，系统，租户后清空逻辑
      this.$refs.upload.clearFiles();
      this.formBasic.data.resultData = "";
      this.formBasic.data.illegalListJfsKey = "";
      this.formBasic.resultDownload = "";
      this.formAddErp.userList = [];
      this.formBasic.data.tenement = null;
      this.formBasic.tenementOptions = [];
      this.formBasic.data.institution = [];
      this.formBasic.data.institution2 = null;
      this.formBasic.parentInstitutionOptions = [];
      this.formBasic.institutionOptions2 = [];
      this.formBasic.data.permissionRole = [];
      this.formBasic.permissionRoleOptions = [];
      this.formBasic.data.dataRole = [];
      this.formBasic.dataRoleOptions = [];
      this.formBasic.data.permissionRoleExist = [];
      this.formBasic.data.dataRoleExist = [];
    },
    getDataByAppId() {
      this.getTenementListByAppIdData();
    },

    // 获取模糊搜索还是级联
    getSearchByAppId() {
      axios({
        method: "post",
        url: "/tenement/getTenementById.do",
        data: {
          tenementCode: this.formBasic.data.tenement,
        },
        params: {
          tenementCode: this.formBasic.data.tenement,
        },
      })
        .then((resolve) => {
          if (resolve.data.data.orgSelectStyle === 1) {
            this.formBasic.data.switch = false;
          } else {
            this.formBasic.data.switch = true;
          }
          this.showSearchSwitch = resolve.data.data.enableOrgSelect;
        })
        .catch((reject) => {
          console.log("getExtByTenementCodeData 请求失败", reject);
        });
    },
    // 根据业务系统id查找租户
    getTenementListByAppIdData() {
      api.users
        .getTenementListByAppId({
          tenementCode: this.formBasic.data.system.tenementCode,
          appId: this.formBasic.data.system.id,
        })
        .then((resolve) => {
          if (resolve.code === 200) {
            this.formBasic.tenementOptions = resolve.data || [];
          } else {
            console.log("getTenementListByAppIdData 返回异常", resolve);
          }
        })
        .catch((reject) => {
          console.log("getTenementListByAppIdData 请求失败", reject);
        });
    },
    changeFormInfoTenement(value) {
      value && this.getDataByTenement();
      // 再切换上面的机构，系统，租户后清空逻辑
      this.$refs.upload.clearFiles();
      this.formBasic.data.resultData = "";
      this.formBasic.data.illegalListJfsKey = "";
      this.formBasic.resultDownload = "";
      this.formAddErp.userList = [];
      this.formBasic.data.institution = [];
      this.formBasic.data.institution2 = null;
      this.formBasic.parentInstitutionOptions = [];
      this.formBasic.institutionOptions2 = [];
      this.formBasic.data.permissionRole = [];
      this.formBasic.permissionRoleOptions = [];
      this.formBasic.data.dataRole = [];
      this.formBasic.dataRoleOptions = [];
      this.formBasic.data.permissionRoleExist = [];
      this.formBasic.data.dataRoleExist = [];
    },
    getDataByTenement() {
      this.getOrgByTenementCodeData(),
        this.getExtByTenementCodeData(),
        this.getSearchByAppId();
      // this.setUpUrl();
    },

    setUpUrl() {
      let rootOrgCode = "";
      if (this.formBasic.data.switch) {
        rootOrgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        rootOrgCode = this.formBasic.data.institution[length - 1];
      }
      this.formBasic.erpURL = `${location.origin}${process.env.VUE_APP_API_PREFIX}/apply/importErpV2?tenementCode=${this.formBasic.data.tenement}&OrgCode=${rootOrgCode}`;
    },
    // 根据租户获取扩展字段
    getExtByTenementCodeData() {
      axios({
        method: "post",
        url: "/apply/user/list2",
        data: {
          data: {
            tenementCode: this.formBasic.data.tenement,
          },
        },
        params: {
          tenementCode: this.formBasic.data.tenement,
        },
      })
        .then((resolve) => {
          this.formAddErp.extDataLabel = resolve.data.data;
          this.formAddErp.userList = [];
        })
        .catch((reject) => {
          console.log("getExtByTenementCodeData 请求失败", reject);
        });
    },

    // 根据根机构id查找下一级机构列表
    getOrgListByParentOrgCodeData(node, callback) {
      const { level } = node;
      let nodes = [];
      this.formBasic.data.parentInstitution = node.data.value;
      api.users
        .getOrgListByParentOrgCode({
          data: {
            tenementCode: this.formBasic.data.tenement,
            parentOrgCode: this.formBasic.data.parentInstitution,
          },
        })
        .then((resolve) => {
          if (resolve.code === 200) {
            nodes = resolve.data.map((item) => {
              let { id, orgName, orgCode, hasChild } = item;
              return {
                value: orgCode,
                label: orgName,
                leaf: !Boolean(hasChild),
              };
            });
          } else {
            console.log("getOrgListByParentOrgCodeData 返回异常", resolve);
          }
          callback(nodes);
        })
        .catch((reject) => {
          console.log("getOrgListByParentOrgCodeData 请求失败", reject);
          callback(nodes);
        });
    },
    // 根据租户id查找根机构
    getOrgByTenementCodeData() {
      api.users
        .getOrgByTenementCode({
          data: { tenementCode: this.formBasic.data.tenement },
        })
        .then((resolve) => {
          if (resolve.code === 200) {
            let { id, orgCode, orgName } = resolve.data;
            this.formBasic.parentInstitutionOptions = [
              { value: orgCode, label: orgName, children: [] },
            ];
          } else {
            console.log("getOrgByTenementCodeData 返回异常", resolve);
          }
        })
        .catch((reject) => {
          console.log("getOrgByTenementCodeData 请求失败", reject);
        });
    },
    // 级联模糊搜索
    postBlurryQueryOrgData(query) {
      query = query.trim();
      if (query !== "") {
        this.loading = true;
        axios({
          method: "post",
          url: "/apply/blurryQueryOrg",
          data: {
            data: {
              orgNameKeyWord: query,
              queryChannelNum: 2,
              tenementCode: this.formBasic.data.tenement,
            },
            page: { pageIndex: 1, pageSize: 100 },
          },
          params: {
            tenementCode: this.formBasic.data.tenement,
          },
        })
          .then((resolve) => {
            this.loading = false;
            if (resolve.status === 200) {
              this.formBasic.institutionOptions2 =
                (resolve.data.data && resolve.data.data.rows) || [];
            } else {
              console.log("postBlurryQueryOrgData 返回异常", resolve);
            }
          })
          .catch((reject) => {
            console.log("postBlurryQueryOrgData 请求失败", reject);
            this.loading = false;
            this.formBasic.institutionOptions2 = resolve.data.rows;
          });
      }
    },
    changeFormInfoInstitution2(value) {
      // 再切换上面的机构，系统，租户后清空逻辑
      this.$refs.upload.clearFiles();
      this.formBasic.data.resultData = "";
      this.formBasic.data.illegalListJfsKey = "";
      this.formBasic.resultDownload = "";
      this.formAddErp.userList = [];
      if (value) {
        this.setUpUrl();
      } else {
        this.formBasic.data.permissionRole = [];
        this.formBasic.permissionRoleOptions = [];
        this.formBasic.data.dataRole = [];
        this.formBasic.data.dataRoleExist = [];
        this.formBasic.data.permissionRoleExist = [];
        this.formBasic.dataRoleOptions = [];
      }
      // 清楚cascader数据
      this.clearCascader(value);
    },
    // 查询数据角色列表
    postApplyQueryDataRoleByUserCodeData(pageIndex = 1) {
      let rootOrgCode = "";
      if (this.formBasic.data.switch) {
        rootOrgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        rootOrgCode = this.formBasic.data.institution[length - 1];
      }
      api.users
        .applyQueryDataRoleByUserCode({
          data: {
            tenementCode: this.formBasic.data.tenement,
            userCode: this.formERP.data.userCode,
            rootOrgCode,
          },
          page: {
            pageIndex,
            pageSize: 10,
          },
        })
        .then((resolve) => {
          if (resolve.code === 200) {
            resolve.data &&
              resolve.data.forEach((item) => {
                if (item.tenementId) {
                  this.formBasic.data.dataRole.push(item.roleCode);
                  this.formBasic.data.dataRoleExist.push(item.roleCode);
                }
              });
          } else {
            console.log(
              "postApplyQueryDataRoleByUserCodeData 返回异常",
              resolve
            );
          }
          this.getDataRoleListByTenementCodeData();
        })
        .catch((reject) => {
          console.log("postApplyQueryDataRoleByUserCodeData 请求失败", reject);
          this.getDataRoleListByTenementCodeData();
        });
    },
    // 根据租户id查找数据角色列表
    getDataRoleListByTenementCodeData() {
      if (this.formBasic.data.radio === "other") {
        this.formBasic.data.dataRole = [];
        this.formBasic.data.dataRoleExist = [];
      }
      let orgCode = "";
      if (this.formBasic.data.switch) {
        orgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        orgCode = this.formBasic.data.institution[length - 1];
      }
      this.dataRoleLeftCheckList = [];
      api.users
        .getDataRoleListByTenementCode({
          data: {
            tenementCode: this.formBasic.data.tenement,
            orgCode,
          },
        })
        .then((resolve) => {
          if (resolve.code === 200) {
            this.formBasic.dataRoleOptions = resolve.data.map((item) => {
              let { id, roleName, roleCode, illustration } = item;
              if (this.formBasic.data.applyRadio === 1) {
                return {
                  key: roleCode,
                  label: roleName,
                  illustration: illustration,
                  disabled: this.formBasic.data.dataRole.includes(roleCode),
                };
              } else if (this.formBasic.data.applyRadio === 2) {
                return {
                  key: roleCode,
                  label: roleName,
                  illustration: illustration,
                  disabled: !this.formBasic.data.dataRole.includes(roleCode),
                };
              }
            });
          } else {
            console.log("getDataRoleListByTenementCodeData 返回异常", resolve);
          }
        })
        .catch((reject) => {
          console.log("getDataRoleListByTenementCodeData 请求失败", reject);
        });
    },
    // 查询菜单角色列表
    postMenuRoleListForUserData(pageIndex = 1) {
      let orgCode = "";
      if (this.formBasic.data.switch) {
        orgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        orgCode = this.formBasic.data.institution[length - 1];
      }
      api.users
        .menuRolelistForUser({
          data: {
            appCode: this.formBasic.data.system.appCode,
            userCode: this.formERP.data.userCode,
            tenementCode: this.formBasic.data.tenement,
            orgCode,
            roleNameLike: "",
          },
          page: {
            pageIndex,
            pageSize: 10,
          },
        })
        .then((resolve) => {
          if (resolve.code === 200) {
            resolve.data &&
              resolve.data.forEach((item) => {
                if (item.tenementId) {
                  this.formBasic.data.permissionRole.push(item.roleCode);
                  this.formBasic.data.permissionRoleExist.push(item.roleCode);
                }
              });
          } else {
            console.log("postMenuRoleListForUserData 返回异常", resolve);
          }
          this.getPermissionRoleListByAppCodeAndorgCodeData();
        })
        .catch((reject) => {
          console.log("postMenuRoleListForUserData 请求失败", reject);
          this.getPermissionRoleListByAppCodeAndorgCodeData();
        });
    },
    // 根据业务系统id和根机构id查询菜单角色列表
    getPermissionRoleListByAppCodeAndorgCodeData() {
      if (this.formBasic.data.radio === "other") {
        this.formBasic.data.permissionRole = [];
        this.formBasic.data.permissionRoleExist = [];
      }
      let orgCode = "";

      if (this.formBasic.data.switch) {
        orgCode = this.formBasic.data.institution2;
      } else {
        let length = this.formBasic.data.institution.length;
        orgCode = this.formBasic.data.institution[length - 1];
      }
      // 清空菜单角色穿梭框左侧勾选列表
      this.menuRoleLeftCheckList = [];
      api.users
        .getPermissionRoleListByAppCodeAndorgCode({
          data: {
            appCode: this.formBasic.data.system.appCode,
            orgCode,
            tenementCode: this.formBasic.data.tenement,
            applyType: this.formBasic.data.radio
          },
        })
        .then((resolve) => {
          if (resolve.code === 200) {
            this.formBasic.permissionRoleOptions = resolve.data.map((item) => {
              let { id, roleName, roleCode, illustration } = item;
              if (this.formBasic.data.applyRadio === 1) {
                return {
                  key: roleCode,
                  label: roleName,
                  illustration: illustration,
                  disabled:
                    this.formBasic.data.permissionRole.includes(roleCode),
                };
              } else if (this.formBasic.data.applyRadio === 2) {
                return {
                  key: roleCode,
                  label: roleName,
                  illustration: illustration,
                  disabled:
                    !this.formBasic.data.permissionRole.includes(roleCode),
                };
              }
            });
          } else {
            console.log(
              "getPermissionRoleListByAppCodeAndorgCodeData 返回异常",
              resolve
            );
          }
        })
        .catch((reject) => {
          console.log(
            "getPermissionRoleListByAppCodeAndorgCodeData 请求失败",
            reject
          );
        });
    },
    changeFormInfoInstitution(value) {
      // 再切换上面的机构，系统，租户后清空逻辑
      this.$refs.upload.clearFiles();
      this.formBasic.data.resultData = "";
      this.formBasic.data.illegalListJfsKey = "";
      this.formBasic.resultDownload = "";
      this.formAddErp.userList = [];
      if (value.length) {
        this.setUpUrl();
      } else {
        this.formBasic.data.permissionRole = [];
        this.formBasic.permissionRoleOptions = [];
        this.formBasic.data.dataRole = [];
        this.formBasic.dataRoleOptions = [];
      }
      // 模糊搜索清空
      this.clearFuzzysearch(value);
    },
    getFormPowerData(pageIndex = 1) {
      this.formPower.showChooseData = [];
      this.formPower.showChooseDataList = [];
      this.formPower.extData.ext1 = "";
      this.formPower.extData.ext2 = "";
      this.formPower.extData.ext3 = "";
      this.formPower.extData.ext4 = "";
      this.formPower.extData.ext5 = "";
      this.formPower.extData.ext6 = "";
      this.formPower.extData.ext7 = "";
      this.formPower.extData.ext8 = "";
      this.formPower.extData.ext9 = "";
      this.formPower.extData.ext10 = "";
      this.formPower.extData.ext11 = "";
      this.formPower.extData.ext12 = "";
      this.formPower.extData.ext13 = "";
      this.formPower.extData.ext14 = "";
      this.formPower.extData.ext15 = "";
      this.formPower.extData.ext16 = "";
      this.formPower.extData.ext17 = "";
      this.formPower.extData.ext18 = "";
      axios({
        method: "post",
        url: "/apply/dataType/list",
        data: {
          data: {
            tenementCode: this.formBasic.data.tenement,
          },
          page: { pageIndex: 1, pageSize: 10000 },
        },
        params: {
          tenementCode: this.formBasic.data.tenement,
        },
      })
        .then((resolve) => {
          if (resolve.data.code === 200) {
            this.formPower.dataTypeOptions = resolve.data.data.rows;
            this.formPower.typeId = this.formPower.dataTypeOptions[0].id;
            for (let i = 0; i < this.formPower.dataTypeOptions.length; i++) {
              if (
                this.formPower.dataTypeOptions[i].id === this.formPower.typeId
              ) {
                this.formPower.currentCoFiles =
                  this.formPower.dataTypeOptions[i].dataExtInfoList;
                this.formPower.typeTitle =
                  this.formPower.dataTypeOptions[i].typeName;
                break;
              }
            }
            this.formPower.tableColumns = [];
            for (let a = 0; a < this.formPower.currentCoFiles.length; a++) {
              if (this.formPower.currentCoFiles[a].isEffective === 1) {
                let key = `ext${this.formPower.currentCoFiles[a].extNo}`;
                let label = this.formPower.currentCoFiles[a].extName;
                // 为启用枚举值的扩展字段添加映射
                if (this.formPower.currentCoFiles[a].isEnum === 1) {
                  const { enumValue } = this.formPower.currentCoFiles[a];
                  const formatter = (_, __, cellValue) => {
                    const hashMap = lodash.fromPairs(
                      enumValue
                        .split(",")
                        .map((item) => item.split(":").reverse())
                    );
                    return hashMap[cellValue] || "";
                  };
                  this.formPower.tableColumns.push({ key, label, formatter });
                } else {
                  this.formPower.tableColumns.push({ key, label });
                }
              }
            }
          } else {
            console.log("getUserErpInfoData 返回异常", resolve);
          }
        })
        .then((resolve) => {
          this.formPower.page.currentPage4 = 1;
          this.formPower.page.pageSize = 10;
          let orgCode = "";
          if (this.formBasic.data.switch) {
            orgCode = this.formBasic.data.institution2;
          } else {
            let length = this.formBasic.data.institution.length;
            orgCode = this.formBasic.data.institution[length - 1];
          }
          axios({
            method: "post",
            url: "/apply/applyDatalist",
            data: {
              data: {
                orgCode,
                typeId: this.formPower.typeId,
                tenementCode: this.formBasic.data.tenement,
              },
              page: {
                pageIndex: this.formPower.page.currentPage4,
                pageSize: this.formPower.page.pageSize,
              },
            },
            params: {
              tenementCode: this.formBasic.data.tenement,
            },
          })
            .then((resolve) => {
              if (resolve.data.code === 200) {
                this.formPower.page.total = resolve.data.data.rowTotal;
                this.formPower.tableData = resolve.data.data.rows;
              } else {
                console.log("getUserErpInfoData 返回异常", resolve);
              }
            })
            .catch((reject) => {
              console.log("postBlurryQueryOrgData 请求失败", reject);
            });
        })
        .catch((reject) => {
          console.log("postBlurryQueryOrgData 请求失败", reject);
        });
    },
  },
};
</script>

<style lang="scss">
.el-cascader-panel {
  min-height: 40px;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #3c6ef0;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #3c6ef0;
  background: #3c6ef0;
}
.el-button--primary.is-plain {
  color: #3c6ef0;
  background: #e6f4ff;
  border-color: #99d3ff;
}
.el-switch.is-checked .el-switch__core {
  border-color: #3c6ef0;
  background-color: #3c6ef0;
}
.el-switch__label.is-active {
  color: #3c6ef0;
}
.el-button--primary {
  color: #ffffff;
  background-color: #3c6ef0;
  border-color: #3c6ef0;
}
.el-step__title.is-finish {
  color: #3c6ef0;
}
.el-step__head.is-finish {
  color: #3c6ef0;
  border-color: #3c6ef0;
}
.el-step__title {
  font-size: 14px;
  line-height: 38px;
}
// .el-step__head.is-success {
//   color: #fff;
//   border-color: #fff;
// }
// .el-message-box {
//   .el-message-box__btns {
//     .el-button {
//       color: #f56c6c;
//       background-color: #fef0f0;
//       border-color: #fbc4c4;
//       &:hover {
//         color: #ffffff;
//         background-color: #f56c6c;
//         border-color: #f56c6c;
//       }
//       &.el-button--primary {
//         color: #ffffff;
//         background-color: #f56c6c;
//         border-color: #f56c6c;
//         &:hover {
//           background-color: #f78989;
//         }
//       }
//     }
//   }
// }
// .el-cascader-panel {
//   .el-cascader-node.in-active-path,
//   .el-cascader-node.is-selectable.in-checked-path,
//   .el-cascader-node.is-active {
//     color: red;
//   }
//   .el-radio__input.is-checked .el-radio__inner {
//     border-color: red;
//     background: red;
//   }
// }
// .el-input__inner {
//   border-radius: 4px;
// }
// .el-dialog__wrapper {
//   .el-tabs__nav-scroll {
//     background-color: #fff !important;
//   }
// }
.access-request {
  height: 100%;
  height: 100vh;
  overflow-y: auto;
  .el-transfer {
    display: flex;
    flex: 1px;

    align-items: center;
    justify-content: space-between;
    .el-transfer__button {
      border-radius: 0%;
    }
    .el-transfer-panel {
      width: 380px;
      height: 400px;
      border-radius: 4px;

      .el-checkbox {
        display: block;
      }
    }

    .el-transfer-panel__list.is-filterable {
      height: 276px;
      padding-top: 0;
    }
    .el-transfer-panel__body {
      .el-checkbox__label {
        overflow: hidden;
        height: 30px;
      }
    }
    .el-tooltip.item {
      white-space: pre-wrap;
    }
  }
}

.data-resource-message {
  .el-message__closeBtn.el-icon-close {
    top: 16px;
  }
}
</style>

<style lang="scss" scoped>
.adderp {
  /deep/ .el-dialog {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
    max-height: 550px;
  }
  /deep/ .el-dialog__body {
    padding: 20px 30px 12px;
    overflow: auto;
  }
}
.dialog-footer {
  text-align: center;
  .el-button + .el-button {
    margin-left: 30px;
  }
}
.el-button {
  border-radius: 4px;
  font-size: 14px;
}
.access-request .apply-label {
  min-height: 758px;
}
body {
  &::-webkit-scrollbar-thumb,
  .el-transfer-panel__list::-webkit-scrollbar-thumb {
    background-color: #b5b5b5;
  }

  .el-transfer-panel__list::-webkit-scrollbar {
    width: 4px;
  }
}
.el-select-dropdown.el-popper {
  .el-select-dropdown__item.selected {
    // color: rgba(230, 81, 73, 1);
    font-weight: bold;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.access-request {
  padding-top: 20px;
  min-height: 100%;
  background-color: #f5f5f5;

  .dialogContent {
    display: flex;
    flex-direction: column;
    align-items: center;

    .status {
      display: flex;
      align-items: center;

      .el-icon-success {
        margin-right: 8px;
        margin-bottom: 8px;
        color: #67c23a;
        font-size: 32px;
      }
    }

    .detail {
      .successCounts {
        color: #67c23a;
      }
    }
  }
  .con-box {
    position: relative;
    padding-bottom: 100px;
    margin: 0 auto;

    min-width: 1000px;
    max-width: 1057px;
  }

  .big-title {
    text-align: center;
    margin-top: 24px;
    font-size: 24px;
    color: rgba(51, 51, 51, 1);
    font-weight: bolder;
  }

  .apply-title {
    position: relative;
    margin-top: 24px;
    margin-left: 30px;
    padding-left: 12px;
    font-size: 16px;

    &:after {
      position: absolute;
      left: 0;
      top: 50%;
      content: "";
      margin-top: -10px;
      width: 4px;
      height: 20px;
      background: rgba(60, 110, 240, 1);
      border-radius: 2px;
    }
  }
  // 第一页erp的四个input的样式
  .form-erp {
    .el-form-item {
      margin-top: 16px;
      margin-left: 40px;
    }
    .el-input {
      width: 382px;
      height: 32px;
      border-radius: 4px;
    }
  }
  // 第一页下半部分的样式
  .addUserVisible {
    .el-input {
      width: 382px;
      height: 32px;
    }
  }
  .addformAddErpfooter2 {
    margin-left: 40px;
    margin-top: 80px;
  }
  .addformAddErpfooter1 {
    margin-left: 220px;
    margin-top: 80px;
  }
  .form-basic {
    .el-form-item {
      margin-top: 20px;
      margin-left: 40px;
    }
    // ::v-deep .el-radio__input.is-checked + .el-radio__label {
    //   color: rgba(225, 37, 27, 1);
    // }
    // ::v-deep .is-checked .el-radio__inner {
    //   background: rgba(225, 37, 27, 1);
    //   border-color: rgba(225, 37, 27, 1);
    // }
    .el-select {
      width: 382px;
      height: 32px;
    }
    /*上传erp*/
    .upload-erp {
      position: relative;
      padding-left: 10px;
      ::v-deep .el-upload-list {
        position: absolute;
        left: 120px;
        top: -40px;
        width: 400px;
      }
      /deep/.el-upload--text {
        display: inline;
      }
      // ::v-deep .el-upload-list__item.is-success .el-upload-list__item-name:hover,
      // .el-upload-list__item.is-success .el-upload-list__item-name:focus {
      //   color: red;
      // }

      // .el-icon-download {
      //   font-size: 14px;
      //   color: rgba(225, 37, 27, 1);
      // }

      .el-upload__tip {
        margin-top: 0;

        .downLoad {
          color: #3c6ef0;
        }
      }
    }
    // ::v-deep .el-switch__label.is-active {
    //   color: rgba(225, 37, 27, 1);
    // }
    // ::v-deep .el-switch.is-checked .el-switch__core {
    //   border-color: rgba(225, 37, 27, 1);
    //   background-color: rgba(225, 37, 27, 1);
    // }
    .beizhu {
      .el-input {
        width: 382px;
        height: 32px;
      }
    }
  }

  .page2 {
    .el-steps {
      margin-top: 20px;
      width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .roles {
      display: flex;
      margin-top: 40px;
      margin-left: 80px;
      margin-right: 80px;
    }
  }
  .tiJiao {
    .el-steps {
      margin-top: 20px;
      width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .pic {
      margin-top: 80px;
      margin-left: 420px;
    }
    .row1 {
      margin-top: 30px;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: rgba(51, 51, 51, 1);
    }
    .row2 {
      margin-bottom: 100px;
      margin-top: 10px;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(102, 102, 102, 1);
    }
  }

  .quanXian {
    .smallButton {
      text-align: center;
      border: 1px solid rgba(60, 110, 240, 1);
      border-radius: 4px;
    }
    .smallButtonFont {
      font-family: PingFangSC-Regular;

      color: rgba(60, 110, 240, 1);
    }
    .el-steps {
      margin-top: 20px;
      width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .formQuestions {
      margin-top: 20px;
      margin-left: 20px;
    }
    .el-select {
      width: 136px;
      height: 32px;
    }
    .el-input {
      width: 136px;
      height: 32px;
    }
    .el-form-item {
      margin-top: 10px;
      // margin-left: 5px;
    }
    .el-form--inline .el-form-item {
      margin-right: 0px;
    }
    .anNiu.el-form-item {
      display: inline;
      float: right;
      margin-right: 30px;
    }
    .el-pagination {
      margin-top: 10px;
      margin-left: 350px;
    }
  }

  /*申请方式*/
  .apply-label {
    padding: 0px 0;
    font-size: 14px;
    background-color: #fff;
    border-radius: 4px;

    .el-form-item__label,
    .el-radio__label {
      font-size: 14px;
    }

    .el-form-item {
      margin-bottom: 0;
    }
  }

  /*基础信息*/
  .basic-info {
    padding: 20px;
    margin: 20px 0;
    background-color: #fff;
  }

  .el-input__inner,
  .is-bordered {
    border-radius: 4px;
  }

  /*配置权限*/
  .authority {
    padding: 20px;
    font-size: 14px;
    background-color: #fff;
    border-radius: 4px;

    .authority-title {
      padding: 10px 20px 0 40px;
    }

    .authority-radio {
      .el-icon-question {
        margin: 0 20px 0 -10px;
        color: #ccc;
        font-size: 14px;
      }

      .el-form-item__label,
      .el-radio__label {
        color: #333;
        font-size: 14px;
      }

      .el-radio {
        margin-top: -2px;
      }
    }

    /*上传erp*/
    .upload-erp {
      position: relative;
      padding-left: 10px;
      /deep/.el-upload--text {
        display: inline;
      }

      .el-upload-list {
        position: absolute;
        left: 120px;
        top: 0;
        width: 400px;
      }

      .el-icon-download {
        font-size: 14px;
        color: #3c6ef0;
      }

      .el-upload__tip {
        margin-top: 0;

        a {
          color: #3c6ef0;
        }
      }
    }

    /*配置菜单角色*/
    .roles {
      display: flex;
      margin-bottom: 20px;

      .el-transfer {
        display: flex;
        flex: 1px;
        align-items: center;
        justify-content: space-between;

        .el-transfer-panel {
          width: 40%;
          height: 320px;
          border-radius: 4px;

          .el-checkbox {
            display: block;
          }
        }
      }

      .el-button {
        border-radius: 4px;
      }

      .el-button.is-disabled {
        color: #fff;
        border: none;
        background: rgba(60, 110, 240, 0.6);
      }
    }
  }

  /*提交按钮*/
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    padding: 14px 0;
    text-align: center;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);

    .el-button {
      border-radius: 4px;
      font-size: 14px;
    }
    .smallButton {
      text-align: center;
      border: 1px solid rgba(60, 110, 240, 1);
      border-radius: 4px;
    }
    .smallButtonFont {
      font-family: PingFangSC-Regular;

      color: rgba(60, 110, 240, 1);
    }
  }
}
</style>
