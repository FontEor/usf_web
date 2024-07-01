<template>
    <basic-dialog
        :visible="visible"
        title="编辑人员管理和账号联动配置"
        :width="720"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk"
        :okText="this.action=='add'?'确认':'保存'"
    >
     <div class="list">
       <span class="title">账号创建/删除/重置</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
       <span><el-switch
        v-model="model.createEtc"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="2"
        :inactive-value="1"
        >
      </el-switch></span>
       <p class="decs">开启后在【用户管理】中【添加用户】时，可输入登录名和密码，自动创建账号；【删除用户】时，会导致账号被删除，并且不可再恢复。开启后，还可在【用户管理】中重置账号的密码、手机号、邮箱</p>
      </div>
     <div class="list">
       <span class="title">账号锁定/解锁</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
       <span><el-switch
        v-model="model.lock"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="2"
        :inactive-value="1">
      </el-switch></span>
       <p class="decs">开启后在【用户管理】中【停用用户】时，会导致账号锁定，用户无法登录。【启用用户】后，恢复原样。</p>
      </div>
        <div class="list">
            <span class="title">手机号关联</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span><el-switch
                v-model="model.mobileRel"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="model.mobileRequire=model.mobileRel"
                :active-value="2"
                :inactive-value="1">
      </el-switch></span>
            <p class="decs">开启后在【用户管理】中【添加用户】时，填写的手机号会被关联到账号上，作为账号的认证和登录方式，在【用户管理-更多-重置】中可修改账号关联的手机号</p>
        </div>
        <div class="list">
            <span class="title">手机号必填</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span><el-switch
                v-model="model.mobileRequire"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="model.mobileRel=model.mobileRequire"
                :active-value="2"
                :inactive-value="1">
      </el-switch></span>
            <p class="decs">开启后在【用户管理】中【添加用户】时，用户必须填写有效手机号</p>
        </div>
        <div class="list">
            <span class="title">邮箱关联</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span><el-switch
                v-model="model.emailRel"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="model.emailRequire=model.emailRel"
                :active-value="2"
                :inactive-value="1">
      </el-switch></span>
            <p class="decs">开启后在【用户管理】中【添加用户】时，填写的邮箱会被关联到账号上，作为账号的认证和登录方式，在【用户管理-更多-重置】中可修改账号关联的邮箱</p>
        </div>

        <div class="list">
            <span class="title">邮箱必填</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span><el-switch
                v-model="model.emailRequire"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="model.emailRel=model.emailRequire"
                :active-value="2"
                :inactive-value="1">
      </el-switch></span>
            <p class="decs">开启后在【用户管理】中【添加用户】时，用户必须填写有效邮箱</p>
        </div>

    </basic-dialog>
</template>

<script>
    import EntityDialog from '@/mixins/entityDialog'
    export default {
        mixins: [EntityDialog],
        data () {
            return {
              model:{
                  createEtc: 1,
                  lock: 1,
                  mobileRel: 2,
                  mobileRequire: 2,
                  emailRel: 2,
                  emailRequire: 2,
                  tenementCode: null
              },
            }
        },
        watch: {
            visible(val) {
                if (val) {
                    api.tenement.findTenementMemphisCfg({tenementCode: this.row[0].tenementCode}).then(res => {
                        if (res.code == 200 && res.data != null) {
                            this.model.createEtc = res.data.createEtc,
                                this.model.lock = res.data.lock,
                                this.model.mobileRel = res.data.mobileRel,
                                this.model.mobileRequire = res.data.mobileRequire,
                                this.model.emailRel = res.data.emailRel,
                                this.model.emailRequire = res.data.emailRequire
                        }
                        this.model.tenementCode = this.row[0].tenementCode
                    })
                } else {
                    this.model.createEtc = 1,
                        this.model.lock = 1,
                        this.model.mobileRel = 2,
                        this.model.mobileRequire = 2,
                        this.model.emailRel = 2,
                        this.model.emailRequire = 2,
                        this.model.tenementCode = this.row[0].tenementCode
                }
            }
        },
        props:{
          row: {
              type: Array,
            }
        },
        methods: {
            handleClose() {
                this.updateVis(false)
                // this.$refs['form'].resetFields()
                // this.updateState('entity')

            },
            handleOk(){
              api.tenement.editTenementMemphisCfg(this.model).then(res =>{
                if(res.code == 200){
                  this.$message.success("保存成功")
                }
              })

            }
        }
    }
</script>

<style lang="scss" scoped>
.list{
  margin-bottom: 20px;
  .title{
    font-size: 16px;
    font-weight: 900;
  }
  .decs{
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>

