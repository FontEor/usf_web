<template>
  <div class="apply-confit-container">
    <el-tabs v-model="active" type="card" :before-leave="handleBeforeLeave">
      <el-tab-pane label="业务权限配置" name="business">
        <el-container class="el_container_style">
          <div class="el_aside_style">
            <el-form
              ref="formBase1"
              :rules="rulesBase"
              :model="base"
              label-width="130px"
            >
              <div class="config_header_style">
                <img src="@/imgs/ic.png" class="img_style" alt="" />
                <h2>租户个性配置</h2>
              </div>
              <el-row>
                <el-col :span="12">
                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      margin-bottom: 1rem;
                      margin-top: 0.6rem;
                    "
                  >
                    <el-radio-group v-model="flowIdOrFlowCode">
                      <el-radio label="flowId">租户审批流</el-radio>
                      <el-radio label="flowCode">流程编码</el-radio>
                    </el-radio-group>
                  </div>
                  <div @click="handleFocus(1)">
                    <el-form-item v-if="flowIdOrFlowCode === 'flowId'">
                      <div slot="label">租户审批流</div>
                      <el-input
                        v-model.trim="base.flowId"
                        placeholder="请输入审批流ID"
                      />
                    </el-form-item>
                    <el-form-item v-else>
                      <div slot="label">流程编码</div>
                      <el-input
                        v-model.trim="base.flowCode"
                        placeholder="请输入流程编码"
                      />
                      <div slot="label" style="margin-top: 1rem">
                        版本ID(非必填)
                      </div>
                      <el-input
                        style="margin-top: 1rem"
                        v-model.trim="base.flowVersion"
                        placeholder="请输入版本ID"
                      />
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-form-item label="租户关键词" prop="tenementRelatedWord">
                <el-input
                  v-model="base.tenementRelatedWord"
                  placeholder="请输入能搜索到本租户的关键词，多个词汇以逗号分隔，最多10个"
                  @focus="handleFocus(2)"
                ></el-input>
              </el-form-item>
              <el-form-item label="自定义申请页" prop="tenementExternalLink">
                <el-input
                  v-model="base.tenementExternalLink"
                  placeholder="请输入跳转到租户自定义申请页的链接，链接以http开头"
                  @focus="handleFocus(3)"
                ></el-input>
              </el-form-item>
              <el-form-item label="所属机构引导" prop="orgSelectHint">
                <el-input
                  v-model="base.orgSelectHint"
                  placeholder="请输入新用户选择所属机构的引导文档链接，链接以http开头"
                  @focus="handleFocus(4)"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-form
              ref="formBase2"
              :rules="rulesBase"
              :model="base"
              label-width="130px"
            >
              <div class="config_header_style">
                <img src="@/imgs/ic.png" class="img_style" alt="" />
                <h2>填写助手信息配置</h2>
              </div>
              <el-form-item label="申请手册" prop="applyDoc">
                <el-input
                  v-model="base.applyDoc"
                  placeholder="请输入本租户权限申请手册文档链接，链接以http开头"
                  @focus="handleFocus(5)"
                ></el-input>
              </el-form-item>
              <el-form-item label="答疑咚咚群" prop="dongdongNo">
                <el-input
                  v-model="base.dongdongNo"
                  placeholder="请输入本租户权限答疑咚咚群，多个群号以逗号分隔，最多5个"
                  @focus="handleFocus(8)"
                ></el-input>
              </el-form-item>
              <el-form-item label="紧急联系人" prop="principalErpCode">
                <el-input
                  v-model="base.principalErpCode"
                  placeholder="请输入本租户权限答疑紧急联系人ERP，多个ERP以逗号分隔，最多10个"
                  @focus="handleFocus(7)"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-form
              ref="formBase3"
              :rules="rulesBase"
              :model="base"
              label-width="130px"
            >
              <div class="config_header_style">
                <img src="@/imgs/ic.png" class="img_style" alt="" />
                <h2>分栏展示及文档配置</h2>
              </div>
              <el-form-item label="用户组" prop="userGroupHint">
                <el-radio-group
                  v-model="base.userGroupSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="base.userGroupHint"
                  :class="{ el_input_config: !base.userGroupSwitch }"
                  placeholder="请输入用户选择申请用户组的文档链接，链接以http开头"
                  @focus="handleFocus(6, '用户组')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="菜单角色" prop="menuRoleHint">
                <el-radio-group
                  v-model="base.menuRoleSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="base.menuRoleHint"
                  :class="{ el_input_config: !base.menuRoleSwitch }"
                  placeholder="请输入用户选择申请菜单角色的文档链接，链接以http开头"
                  @focus="handleFocus(6, '菜单角色')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="数据角色" prop="dataRoleHint">
                <el-radio-group
                  v-model="base.dataRoleSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="base.dataRoleHint"
                  :class="{ el_input_config: !base.dataRoleSwitch }"
                  placeholder="请输入用户选择申请数据角色的文档链接，链接以http开头"
                  @focus="handleFocus(6, '数据角色')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="数据资源" prop="dataResourceHint">
                <el-radio-group
                  v-model="base.dataResourceSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="base.dataResourceHint"
                  :class="{ el_input_config: !base.dataResourceSwitch }"
                  placeholder="请输入用户选择申请数据资源的文档链接，链接以http开头"
                  @focus="handleFocus(6, '数据资源')"
                  @blur="handleBlur"
                ></el-input>
                <div>
                  <span> 是否按照机构过滤展示 </span>
                  <el-radio-group v-model="base.dataResourceFilterByOrgSwitch">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="el_main_style">
            <div class="div_style">
              <img src="@/imgs/ic.png" class="div_img_style" alt="" />
              <h2>配置项展示位置</h2>
            </div>
            <div class="div_contain_img">
              <div v-if="isShow == 0">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/config-empty.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 1">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/flow.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 2">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/keyword.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 3">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/customApp.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 4">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/guide.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 5">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/document.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 7">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/erp.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 8">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/dongdong.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 6">
                <div v-if="base.userGroupSwitch">
                  <img
                    v-if="isFocus == '用户组'"
                    class="div_contain_img_style"
                    src="@/imgs/userGroHight.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/userGroC.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
                <div v-if="base.menuRoleSwitch">
                  <img
                    v-if="isFocus == '菜单角色'"
                    class="div_contain_img_style"
                    src="@/imgs/menuRoleHight.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/menuRoleC.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
                <div v-if="base.dataRoleSwitch">
                  <img
                    v-if="isFocus == '数据角色'"
                    class="div_contain_img_style"
                    src="@/imgs/dataRoleHight.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/dataRoleC.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
                <div v-if="base.dataResourceSwitch">
                  <img
                    v-if="isFocus == '数据资源'"
                    class="div_contain_img_style"
                    src="@/imgs/dataResourceHight.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/dataResourceC.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-container>
      </el-tab-pane>

      <el-tab-pane label="USF系统配置" name="admin">
        <el-container>
          <div class="el_aside_style">
            <el-form
              ref="formBase4"
              :rules="rulesBase"
              :model="baseUSF"
              label-width="130px"
            >
              <div class="config_header_style">
                <img src="@/imgs/ic.png" class="img_style" alt="" />
                <h2>租户个性配置</h2>
              </div>
              <el-row>
                <el-col :span="12">
                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      margin-bottom: 1rem;
                      margin-top: 0.6rem;
                    "
                  >
                    <el-radio-group v-model="flowIdOrFlowCodeUSF">
                      <el-radio label="flowId">租户审批流</el-radio>
                      <el-radio label="flowCode">流程编码</el-radio>
                    </el-radio-group>
                  </div>
                  <div @click="handleFocus(1)">
                    <el-form-item v-if="flowIdOrFlowCodeUSF === 'flowId'">
                      <div slot="label">租户审批流</div>
                      <el-input
                        v-model.trim="baseUSF.flowId"
                        placeholder="请输入审批流ID"
                      />
                    </el-form-item>
                    <el-form-item v-else>
                      <div slot="label">流程编码</div>
                      <el-input
                        v-model.trim="baseUSF.flowCode"
                        placeholder="请输入流程编码"
                      />
                      <div slot="label" style="margin-top: 1rem">
                        版本ID(非必填)
                      </div>
                      <el-input
                        style="margin-top: 1rem"
                        v-model.trim="baseUSF.flowVersion"
                        placeholder="请输入版本ID"
                      />
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-form-item label="租户关键词" prop="tenementRelatedWord">
                <el-input
                  v-model="baseUSF.tenementRelatedWord"
                  placeholder="请输入能搜索到本租户的关键词，多个词汇以逗号分隔，最多10个"
                  @focus="handleFocus(2)"
                ></el-input>
              </el-form-item>
              <el-form-item label="自定义申请页" prop="tenementExternalLink">
                <el-input
                  v-model="baseUSF.tenementExternalLink"
                  placeholder="请输入跳转到租户自定义申请页的链接，链接以http开头"
                  @focus="handleFocus(3)"
                ></el-input>
              </el-form-item>
              <el-form-item label="所属机构引导" prop="orgSelectHint">
                <el-input
                  v-model="baseUSF.orgSelectHint"
                  placeholder="请输入新用户选择所属机构的引导文档链接，链接以http开头"
                  @focus="handleFocus(4)"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-form
              ref="formBase5"
              :rules="rulesBase"
              :model="baseUSF"
              label-width="130px"
            >
              <div class="config_header_style">
                <img src="@/imgs/ic.png" class="img_style" alt="" />
                <h2>填写助手信息配置</h2>
              </div>
              <el-form-item label="申请手册" prop="applyDoc">
                <el-input
                  v-model="baseUSF.applyDoc"
                  placeholder="请输入本租户权限申请手册文档链接，链接以http开头"
                  @focus="handleFocus(5)"
                ></el-input>
              </el-form-item>
              <el-form-item label="答疑咚咚群" prop="dongdongNo">
                <el-input
                  v-model="baseUSF.dongdongNo"
                  placeholder="请输入本租户权限答疑咚咚群，多个群号以逗号分隔，最多5个"
                  @focus="handleFocus(8)"
                ></el-input>
              </el-form-item>
              <el-form-item label="紧急联系人" prop="principalErpCode">
                <el-input
                  v-model="baseUSF.principalErpCode"
                  placeholder="请输入本租户权限答疑紧急联系人ERP，多个ERP以逗号分隔，最多10个"
                  @focus="handleFocus(7)"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-form
              ref="formBase6"
              :rules="rulesBase"
              :model="baseUSF"
              label-width="130px"
            >
              <div class="config_header_style">
                <img src="@/imgs/ic.png" class="img_style" alt="" />
                <h2>分栏展示及文档配置</h2>
              </div>
              <el-form-item label="USF菜单角色" prop="usfRoleHint">
                <el-radio-group
                  v-model="baseUSF.usfRoleSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="baseUSF.usfRoleHint"
                  :class="{ el_input_config: !baseUSF.usfRoleSwitch }"
                  placeholder="请输入用户选择申请USF菜单角色的文档链接，链接以http开头"
                  @focus="handleFocus(6, 'USF菜单角色')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构管理权限" prop="orgSelectHint">
                <el-radio-group
                  v-model="baseUSF.orgSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="baseUSF.orgSelectHint"
                  :class="{ el_input_config: !baseUSF.orgSwitch }"
                  placeholder="请输入用户选择申请机构管理权限的文档链接，链接以http开头"
                  @focus="handleFocus(6, '机构')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="用户组管理权限" prop="userGroupHint">
                <el-radio-group
                  v-model="baseUSF.userGroupSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="baseUSF.userGroupHint"
                  :class="{ el_input_config: !baseUSF.userGroupSwitch }"
                  placeholder="请输入用户选择申请用户组管理权限的文档链接，链接以http开头"
                  @focus="handleFocus(6, '用户组')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="菜单角色管理权限" prop="menuRoleHint">
                <el-radio-group
                  v-model="baseUSF.menuRoleSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="baseUSF.menuRoleHint"
                  :class="{ el_input_config: !baseUSF.menuRoleSwitch }"
                  placeholder="请输入用户选择申请菜单角色管理权限的文档链接，链接以http开头"
                  @focus="handleFocus(6, '菜单角色')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="数据角色管理权限" prop="dataRoleHint">
                <el-radio-group
                  v-model="baseUSF.dataRoleSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="baseUSF.dataRoleHint"
                  :class="{ el_input_config: !baseUSF.dataRoleSwitch }"
                  placeholder="请输入用户选择申请数据角色管理权限的文档链接，链接以http开头"
                  @focus="handleFocus(6, '数据角色')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="数据资源管理权限" prop="dataResourceHint">
                <el-radio-group
                  v-model="baseUSF.dataResourceSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="baseUSF.dataResourceHint"
                  :class="{ el_input_config: !baseUSF.dataResourceSwitch }"
                  placeholder="请输入用户选择申请数据资源管理权限的文档链接，链接以http开头"
                  @focus="handleFocus(6, '数据资源')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="USF系统超管" prop="usfAdministratorHint">
                <el-radio-group
                  v-model="baseUSF.usfAdministratorSwitch"
                  @click.native="handleFocus(6)"
                >
                  <el-radio :label="1">展示</el-radio>
                  <el-radio :label="0">不展示</el-radio>
                </el-radio-group>
                <el-input
                  v-model="baseUSF.usfAdministratorHint"
                  :class="{ el_input_config: !baseUSF.usfAdministratorSwitch }"
                  placeholder="请输入用户选择申请系统超管的文档链接，链接以http开头"
                  @focus="handleFocus(6, '系统超级管理')"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="el_main_style">
            <div class="div_style">
              <img src="@/imgs/ic.png" class="div_img_style" alt="" />
              <h2>配置项展示位置</h2>
            </div>
            <div class="div_contain_img">
              <div v-if="isShow == 0">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/config-empty.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 1">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/flow.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 2">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/keyword.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 3">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/customApp.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 4">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/guide.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 5">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/document.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 7">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/erp.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 8">
                <img
                  class="div_contain_img_style"
                  src="@/imgs/dongdong.png"
                  alt=""
                />
              </div>
              <div v-if="isShow == 6" class="is_show_container">
                <div v-if="baseUSF.usfRoleSwitch">
                  <img
                    v-if="isFocus == 'USF菜单角色'"
                    class="div_contain_img_style"
                    src="@/imgs/usfMenuH.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/usfMenu.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
                <div v-if="baseUSF.orgSwitch">
                  <img
                    v-if="isFocus == '机构'"
                    class="div_contain_img_style"
                    src="@/imgs/instManageH.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/instManage.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
                <div v-if="baseUSF.userGroupSwitch">
                  <img
                    v-if="isFocus == '用户组'"
                    class="div_contain_img_style"
                    src="@/imgs/userGroManaH.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/userGroMana.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
                <div v-if="baseUSF.menuRoleSwitch">
                  <img
                    v-if="isFocus == '菜单角色'"
                    class="div_contain_img_style"
                    src="@/imgs/menuRoleH.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/menuRole.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
                <div v-if="baseUSF.dataRoleSwitch">
                  <img
                    v-if="isFocus == '数据角色'"
                    class="div_contain_img_style"
                    src="@/imgs/dataRoleH.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/dataRole.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
                <div v-if="baseUSF.dataResourceSwitch">
                  <img
                    v-if="isFocus == '数据资源'"
                    class="div_contain_img_style"
                    src="@/imgs/dataResourceH.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/dataResource.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
                <div v-if="baseUSF.usfAdministratorSwitch">
                  <img
                    v-if="isFocus == '系统超级管理'"
                    class="div_contain_img_style"
                    src="@/imgs/systemsupAdmH.png"
                    alt=""
                  />
                  <div v-else class="columns_style">
                    <img
                      class="div_contain_img_style"
                      src="@/imgs/systemsupAdmC.png"
                      alt=""
                    />
                    <div class="columns_mask_style"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-container>
      </el-tab-pane>
    </el-tabs>
    <div class="el_button_style">
      <el-button
        type="primary"
        class="el_button_save"
        @click="onConfirmHelper()"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import { get } from "lodash";
import MainStore from "@/store";
import store from "../apply2022/store/index";
import { initUsfData, initBaseData } from "./data";
let dom;
export default {
  data() {
    return {
      isShow: 0,
      isFocus: "",
      active: "business",
      oldActiveName: "",
      switch: 0,
      erpArr: [
        "org.missusf",
        "zhengguinan",
        "wangning230",
        "wujilai",
        "chuyuhao1",
        "liangzhipeng5",
      ],
      base: initBaseData(),
      baseUSF: initUsfData(),
      rulesBase: {
        tenementRelatedWord: this.handlerValidate(10),
        tenementExternalLink: [{ type: "url", validator: this.validateHttp }],
        applyDoc: [{ type: "url", validator: this.validateHttp }],
        dongdongNo: this.handlerValidate(5),
        principalErpCode: [
          { validator: this.validateErpCode, trigger: "blur" },
        ],
        orgSelectHint: [{ type: "url", validator: this.validateHttp }],
        userGroupHint: [{ type: "url", validator: this.validateHttp }],
        menuRoleHint: [{ type: "url", validator: this.validateHttp }],
        dataRoleHint: [{ type: "url", validator: this.validateHttp }],
        dataResourceHint: [{ type: "url", validator: this.validateHttp }],
        usfRoleHint: [{ type: "url", validator: this.validateHttp }],
        usfAdministratorHint: [{ type: "url", validator: this.validateHttp }],
      },
      flowIdOrFlowCode: "flowCode",
      flowIdOrFlowCodeUSF: "flowCode",
    };
  },
  computed: {
    ...mapState("app", ["tenementCode"]),
  },
  watch: {
    //业务权限配置
    "base.userGroupSwitch": function (newVal, oldVal) {
      if (
        !(
          this.base.menuRoleSwitch ||
          this.base.dataRoleSwitch ||
          this.base.dataResourceSwitch ||
          newVal
        )
      ) {
        this.base.userGroupSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    "base.menuRoleSwitch": function (newVal, oldVal) {
      if (
        !(
          this.base.userGroupSwitch ||
          this.base.dataRoleSwitch ||
          this.base.dataResourceSwitch ||
          newVal
        )
      ) {
        this.base.menuRoleSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    "base.dataRoleSwitch": function (newVal, oldVal) {
      if (
        !(
          this.base.userGroupSwitch ||
          this.base.menuRoleSwitch ||
          this.base.dataResourceSwitch ||
          newVal
        )
      ) {
        this.base.dataRoleSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    "base.dataResourceSwitch": function (newVal, oldVal) {
      if (
        !(
          this.base.userGroupSwitch ||
          this.base.menuRoleSwitch ||
          this.base.dataRoleSwitch ||
          newVal
        )
      ) {
        this.base.dataResourceSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    //USF系统配置
    "baseUSF.usfRoleSwitch": function (newVal, oldVal) {
      if (
        !(
          this.baseUSF.menuRoleSwitch ||
          this.baseUSF.orgSwitch ||
          this.baseUSF.userGroupSwitch ||
          this.baseUSF.dataRoleSwitch ||
          this.baseUSF.dataResourceSwitch ||
          this.baseUSF.usfAdministratorSwitch ||
          newVal
        )
      ) {
        this.baseUSF.usfRoleSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    "baseUSF.orgSwitch": function (newVal, oldVal) {
      if (
        !(
          this.baseUSF.usfRoleSwitch ||
          this.baseUSF.userGroupSwitch ||
          this.baseUSF.menuRoleSwitch ||
          this.baseUSF.dataRoleSwitch ||
          this.baseUSF.dataResourceSwitch ||
          this.baseUSF.usfAdministratorSwitch ||
          newVal
        )
      ) {
        this.baseUSF.orgSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    "baseUSF.userGroupSwitch": function (newVal, oldVal) {
      if (
        !(
          this.baseUSF.usfRoleSwitch ||
          this.baseUSF.orgSwitch ||
          this.baseUSF.menuRoleSwitch ||
          this.baseUSF.dataRoleSwitch ||
          this.baseUSF.dataResourceSwitch ||
          this.baseUSF.usfAdministratorSwitch ||
          newVal
        )
      ) {
        this.baseUSF.userGroupSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    "baseUSF.menuRoleSwitch": function (newVal, oldVal) {
      if (
        !(
          this.baseUSF.usfRoleSwitch ||
          this.baseUSF.orgSwitch ||
          this.baseUSF.userGroupSwitch ||
          this.baseUSF.dataRoleSwitch ||
          this.baseUSF.dataResourceSwitch ||
          this.baseUSF.usfAdministratorSwitch ||
          newVal
        )
      ) {
        this.baseUSF.menuRoleSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    "baseUSF.dataRoleSwitch": function (newVal, oldVal) {
      if (
        !(
          this.baseUSF.usfRoleSwitch ||
          this.baseUSF.orgSwitch ||
          this.baseUSF.userGroupSwitch ||
          this.baseUSF.menuRoleSwitch ||
          this.baseUSF.dataResourceSwitch ||
          this.baseUSF.usfAdministratorSwitch ||
          newVal
        )
      ) {
        this.baseUSF.dataRoleSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    "baseUSF.dataResourceSwitch": function (newVal, oldVal) {
      if (
        !(
          this.baseUSF.usfRoleSwitch ||
          this.baseUSF.orgSwitch ||
          this.baseUSF.userGroupSwitch ||
          this.baseUSF.menuRoleSwitch ||
          this.baseUSF.dataRoleSwitch ||
          this.baseUSF.usfAdministratorSwitch ||
          newVal
        )
      ) {
        this.baseUSF.dataResourceSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
    "baseUSF.usfAdministratorSwitch": function (newVal, oldVal) {
      if (
        !(
          this.baseUSF.usfRoleSwitch ||
          this.baseUSF.orgSwitch ||
          this.baseUSF.userGroupSwitch ||
          this.baseUSF.menuRoleSwitch ||
          this.baseUSF.dataRoleSwitch ||
          this.baseUSF.dataResourceSwitch ||
          newVal
        )
      ) {
        this.baseUSF.usfAdministratorSwitch = 1;
        this.$message.error("请至少保留一项权限分栏");
      }
    },
  },
  async mounted() {
    await this.getHelper("0", this.base);
    await this.getHelper("1", this.baseUSF);
    if (!this.base.flowCode && this.base.flowId) {
      this.flowIdOrFlowCode = "flowId";
    }
    if (!this.baseUSF.flowCode && this.baseUSF.flowId) {
      this.flowIdOrFlowCodeUSF = "flowId";
    }
    dom = document.querySelector(".g-mnc");
    dom.style.overflow = "inherit";
    dom.style.backgroundColor = "#efefef";
  },
  beforeRouteEnter(to, from, next) {
    next(() => {
      let docmn = document.getElementsByClassName("g-mn")[0];
      if (docmn) {
        docmn.classList.add("g-mn-config");
      }
      let docmnc = document.getElementsByClassName("g-mnc")[0];
      if (docmn) {
        docmnc.classList.add("g-mnc-config");
      }
    });
  },
  async beforeRouteLeave(to, from, next) {
    await this.handleBeforeLeave(2, 1, next);
    let docmn = document.getElementsByClassName("g-mn")[0];
    if (docmn) {
      docmn.classList.remove("g-mn-config");
    }
    let docmnc = document.getElementsByClassName("g-mnc")[0];
    if (docmn) {
      docmnc.classList.remove("g-mnc-config");
      docmnc.classList.add("g-mnc-layout");
    }
  },
  beforeDestroy() {
    if (dom) {
      dom.style.overflow = "auto";
    }
  },
  methods: {
    async handleBeforeLeave(activeName, oldActiveName, next) {
      if (
        (activeName !== oldActiveName &&
          store.state.baseInfo &&
          JSON.stringify(this.base) !== store.state.baseInfo) ||
        (store.state.baseUSFInfo &&
          JSON.stringify(this.baseUSF) !== store.state.baseUSFInfo)
      ) {
        await this.$confirm(
          "系统监测到您编辑的内容尚未保存，是否保存",
          "提示",
          {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning",
            confirmButtonClass: "btnFalses",
          }
        ).then(
          async () => {
            await this.onConfirmHelper();
            this.isShow = 0;
            MainStore.commit("app/actNavTab", { code: "QXSQPZ" });
            return Promise.reject();
          },
          () => {
            this.getHelper("0", this.base);
            this.getHelper("1", this.baseUSF);
            this.isShow = 0;
            next && next();
            return Promise.resolve();
          }
        );
      } else {
        this.isShow = 0;
        if (this.active == "business") {
          this.getHelper("0", this.base);
        } else {
          this.getHelper("1", this.baseUSF);
        }
        next && next();
      }
    },
    //表单验证
    handlerValidate(len) {
      return [
        {
          type: "string",
          trigger: "blur",
          validator: (rule, value, callback) => {
            let arr;
            if (value) {
              arr = value.split(/，|,/);
            }
            if (arr && arr.length > len) {
              callback(new Error(`需以英文逗号分隔且不超过${len}个`));
              return;
            } else {
              callback();
            }
          },
        },
      ];
    },
    handleIndexOf(str, chart) {
      return str.indexOf(chart);
    },
    async validateErpCode(rule, value, callback) {
      let arr = [];
      if (value) {
        arr = value.split(/，|,/);
      }
      if (arr && arr.length > 10) {
        callback(new Error(`需以英文逗号分隔且不超过${len}个`));
        return;
      }
      if (arr.length) {
        await axios({
          method: "post",
          url: "businessApply/batchCheckUserIsLegal.do",
          data: {
            tenementCode: this.tenementCode,
            userSystemType: 1, //erp: 1 passport: 2
            userCodes: arr,
          },
        }).then((res) => {
          if (res.data.code === 200) {
            if (
              res.data.data.illegalUserCodes.length &&
              res.data.data.illegalUserCodes[0] !== ""
            ) {
              callback(new Error(`所录入ERP信息有误，请检查后录入`));
              return;
            }
          }
        });
      }
      for (let i = 0; i < this.erpArr.length; i++) {
        if (value.length && this.handleIndexOf(value, this.erpArr[i]) > -1) {
          callback(new Error(`所录入信息包含特殊ERP，请检查后录入`));
          return;
        }
      }
      callback();
    },
    validateHttp(rule, value, callback) {
      if (value) {
        let patt1 = /(http|https):\/\/([\w.]+\/?)\S*/;
        if (!patt1.test(value)) {
          callback(new Error("格式不通过，请检查输入内容"));
          return;
        } else {
          callback();
          return;
        }
      }
      callback();
    },
    //input框 聚焦和失焦
    handleFocus(event, type) {
      this.isShow = event;
      if (type) {
        this.isFocus = type;
      }
    },
    handleBlur() {
      this.isFocus = "";
    },
    //获取数据
    getHelper(type, base) {
      return axios({
        method: "post",
        url: "/applyHelper/getApplyHelpInfo.do",
        data: {
          tenementCode: this.tenementCode,
          applyType: type,
        },
        params: {
          tenementCode: this.tenementCode,
        },
      })
        .then((response) => {
          if (response.data.code === 200) {
            if (response.data.data) {
              Object.keys(base).forEach((i) => {
                base[i] = get(response, `data.data[${i}]`, "");
              });
            } else {
              if (type === "0") {
                this.base = initBaseData();
              } else {
                this.baseUSF = initUsfData();
              }
            }
            if (type === "0") {
              store.commit("updatabaseInfo", JSON.stringify(this.base));
            } else {
              store.commit("updatabaseUSFInfo", JSON.stringify(this.baseUSF));
            }
          } else {
            this.$message.error("获取信息失败");
          }
        })
        .catch((reject) => {
          console.log("####### reject", reject);
          this.$message.error("获取信息失败");
        });
    },
    //保存和验证数据
    checkForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    async saveData(type, base, flowIdOrFlowCode) {
      if (flowIdOrFlowCode === "flowCode") {
        base.flowId = null;
      } else {
        base.flowCode = null;
        base.flowVersion = null;
      }
      let result;
      await axios({
        method: "post",
        url: "/applyHelper/addOrUpdateApplyHelpInfo.do",
        data: {
          tenementCode: this.tenementCode,
          applyType: type,
          ...base,
        },
        params: {
          tenementCode: this.tenementCode,
        },
      }).then((response) => {
        if (response.data.code === 200) {
          result = true;
        } else {
          result = false;
        }
      });
      return result;
    },
    async onConfirmHelper() {
      let list = [];
      list.push(
        this.checkForm("formBase1"),
        this.checkForm("formBase2"),
        this.checkForm("formBase3"),
        this.checkForm("formBase4"),
        this.checkForm("formBase5"),
        this.checkForm("formBase6")
      );
      Promise.all(list)
        .then(async () => {
          let resBase = await this.saveData(
            "0",
            this.base,
            this.flowIdOrFlowCode
          );
          let resBaseUSF = await this.saveData(
            "1",
            this.baseUSF,
            this.flowIdOrFlowCodeUSF
          );
          if (resBase && resBaseUSF) {
            await this.getHelper("0", this.base);
            await this.getHelper("1", this.baseUSF);
            this.$message.success("保存成功");
          } else {
            this.$message.error("保存失败");
          }
        })
        .catch(() => {
          this.$message.error("数据未通过校验");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.apply-confit-container {
  height: 100%;
  background-color: #efefef !important;

  /deep/ .el-tabs {
    height: calc(100% - 89px);
    overflow: hidden;
  }

  /deep/.el-tabs__nav {
    border: none;

    /deep/.is-active {
      background: #fff;
      color: #3c6ef0;
    }
  }

  /deep/ .el-tabs__header {
    margin: 0;
  }

  /deep/ .el-tabs__item {
    margin-right: 4px;
    height: 40px;
    width: 124px;
    line-height: 40px;
    border: none;
    background: rgba(247, 247, 247, 1);
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: normal;
    padding: auto 20px;

    &.is-active {
      background-color: #fff;
      color: #3c6ef0;
    }
  }

  /deep/ .el-tabs__item:hover {
    color: #3c6ef0;
  }

  /deep/ .el-radio__input.is-checked .el-radio__inner {
    width: 14px;
    height: 14px;
    background-color: #3c6ef0;
    border: 1px solid #3c6ef0;
  }

  /deep/ .el-tabs__nav-scroll {
    background-color: #efefef !important;
  }

  /deep/ .el-radio__label {
    color: #333333;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: normal;
  }

  .el_button_style {
    display: flex;
    height: 72px;
    justify-content: flex-end;
    align-items: center;
    margin: 17px -20px auto -20px;
    background-color: #fff;
    background-origin: content-box;

    .el_button_save {
      height: 48px;
      width: 120px;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: normal;
      margin-right: 24px;
      background-color: #3c6ef0;
      border-radius: 4px;
      border-color: #3c6ef0;
    }
  }

  .el_container_style {
    height: auto;
  }

  .el_aside_style {
    height: calc(100vh - 255px);
    width: 556px;
    overflow: scroll;
    margin-right: 1rem;
    padding-right: 0.5rem;
    padding-left: 24px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;

    .el_input_config {
      opacity: 0;
    }

    .config_header_style {
      display: flex;
      align-items: center;
      height: 16px;
      margin: 24px auto;

      .img_style {
        width: 12px;
        height: 14px;
        background: linear-gradient(
          130.13deg,
          rgba(60, 110, 240, 1) 0%,
          rgba(88, 134, 255, 1) 100%
        );
      }
    }

    /deep/ .el-form-item {
      margin-bottom: 16px;
    }

    /deep/ .el-form-item.is-error .el-input__inner {
      color: red;
      border-color: red;
    }

    /deep/ .el-input__inner {
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 4px;
      width: 420px;
      height: 32px;
      line-height: 1;
    }

    /deep/ .el-form-item__label {
      height: 20px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: normal;
      color: rgba(51, 51, 51, 1);
      padding-right: 12px;
    }
  }

  .el_aside_style::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
  }

  .el_aside_style::-webkit-scrollbar-thumb {
    background-color: rgba(216, 216, 216, 1);
  }

  .el_main_style {
    flex: 1;
    background-color: #fff;
    height: calc(100vh - 255px);

    .div_style {
      display: flex;
      align-items: center;
      margin-top: 24px;
      margin-bottom: 53px;
      padding-left: 30px;

      .div_img_style {
        width: 12px;
        height: 14px;
        background: linear-gradient(
          130.13deg,
          rgba(60, 110, 240, 1) 0%,
          rgba(88, 134, 255, 1) 100%
        );
        border-radius: 2px;
      }
    }

    .div_contain_img {
      //position: relative;
      height: calc(100% - 196px); //39rem;
      overflow: auto;
      padding-left: 23px;
      padding-right: 23px;
      margin-bottom: 103px;

      .is_show_container {
        position: relative;
      }
      .isShow_style {
        position: relative;
      }

      .columns_style {
        position: relative;
      }

      .columns_mask_style {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.07);
      }

      .div_contain_img_style {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .div_contain_img::-webkit-scrollbar {
      width: 8px;
      height: 592px;
      border-radius: 4px;
    }

    .div_contain_img::-webkit-scrollbar-thumb {
      background-color: rgba(216, 216, 216, 1);
    }

    /deep/ .el-card__header {
      display: flex;
      justify-content: flex-start;
      padding: 10px 20px;

      .element6 {
        width: 15px;
        height: 15px;
        margin-right: 0.5rem;
        border-radius: 50%;
        background: rgb(232, 232, 232);
      }
    }
  }

  h2 {
    padding-left: 12px;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
  }
}
</style>
<style>
.g-mn-config {
  background-color: #efefef !important;
  padding-bottom: 0px !important;
}

.g-mnc-config {
  box-shadow: none !important;
  padding: 0 !important;
  background-color: #efefef !important;
}

.g-mnc-layout {
  background-color: #fff !important;
}

.btnFalses {
  background-color: #3c6ef0 !important;
  border-color: #3c6ef0 !important;
}
</style>
