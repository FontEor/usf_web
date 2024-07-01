<template>
  <div class="apply-2022-choose-type">
    <div class="apply-2022-choose-type-title">
      <h1>京东系统权限申请</h1>
    </div>
    <div class="apply-2022-choose-type-container">
      <div class="apply-2022-choose-type-content">
        <div class="apply-2022-choose-type-content-header">
          <h2>我要使用<strong>业务系统</strong></h2>
        </div>
        <p style="margin-top: 21px;">您可申请业务系统功能、数据等使用权限。</p>
        <p>审批完成后，您</p>
        <ul>
          <li>可以在业务系统中使用对应的功能或数据</li>
        </ul>
        <div class="apply-2022-choose-type-content-footer">
          <router-link class="el-button el-button--primary el-button--small" :to="{
            name: 'applyUser'
          }">
            去申请
          </router-link>
        </div>
      </div>
      <div class="apply-2022-choose-type-content">
        <div class="apply-2022-choose-type-content-header">
          <h2>我要使用<strong>权限管理系统</strong></h2>
        </div>
        <p style="margin-top: 21px;">您可申请业务系统人员、菜单、数据等管理权限。</p>
        <p>审批完成后，您</p>
        <ul>
          <li>可以创建、编辑业务系统的菜单、数据权限</li>
          <li>可以授予或解除用户在业务系统菜单、数据使用权限</li>
          <li>可以排查权限异常</li>
          <li>可以权限复核等</li>
        </ul>
        <div class="apply-2022-choose-type-content-footer">
          <router-link class="el-button el-button--primary el-button--small" :to="{
            name: 'applyAdmin'
          }">
            去申请
          </router-link>
        </div>
      </div>
    </div>
    <MyApply />
  </div>
</template>
<script>
import MyApply from "../MyApply.vue";
export default {
  name: "ChooseApplyType",
  components: {
    MyApply
  }
}
</script>
