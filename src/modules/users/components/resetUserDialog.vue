<template>
  <basic-dialog :visible="visible"
                :title="title"
                :width="600"
                :update-vis="updateVis"
                :handle-close="handleClose"
                :handle-closed="handleClosed"
                :handle-ok="handleOk">
    <el-form ref="dto"
             size="small"
             label-position="right"
             label-width="128px"
             :model="dto"
             :rules="rules"
             @submit.native.prevent>
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="20"
                    :offset="1">
              <el-form-item label=" 操作类型" prop="userSelectType">
                <el-radio-group v-model="dto.userSelectType" @change="changeSelectType">
                  <el-radio :label="1">重置密码</el-radio>
                  <el-radio :label="2">重置手机号</el-radio>
                  <el-radio :label="3">重置邮箱</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
            <!--重置密码-->
            <el-row v-if="PWD">
            <el-col :span="20"
                    :offset="1" style="margin-bottom:10px">
              <el-form-item label="密码"
                            prop="userPassWd">
                <el-input v-model.trim="dto.userPassWd"
                          placeholder="密码" type="password" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="20"
                    :offset="1">
              <el-form-item label="确认密码"
                            prop="confirmUserPassWd">
                <el-input v-model.trim="dto.confirmUserPassWd"
                          placeholder="请再次输入密码" type="password" autocomplete="off" />
              </el-form-item>
            </el-col>
            </el-row>
            <!--重置手机号-->
            <el-row v-if="TEL">
            <el-col :span="20"
                    :offset="1" style="margin-bottom:10px">
              <el-form-item label="手机号"
                            prop="userTel">
                <el-input v-model.trim="dto.userTel"
                          placeholder="手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="20"
                    :offset="1">
              <el-form-item label="确认手机号"
                            prop="confirmUserTel">
                <el-input v-model.trim="dto.confirmUserTel"
                          placeholder="请再次输入手机号" />
              </el-form-item>
            </el-col>
            </el-row>
            <!--重置邮箱-->
            <el-row v-if="EMAIL">
            <el-col :span="20"
                    :offset="1" style="margin-bottom:10px">
              <el-form-item label="邮箱"
                            prop="userEmail">
                <el-input v-model.trim="dto.userEmail"
                          placeholder="邮箱" />
              </el-form-item>
            </el-col>
            <el-col :span="20"
                    :offset="1">
              <el-form-item label="确认邮箱"
                            prop="confirmUserEmail">
                <el-input v-model.trim="dto.confirmUserEmail"
                          placeholder="请再次输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </basic-dialog>
</template>
<script>
// 重置密码
import EntityDialog from '@/mixins/entityDialog'
import { mapState } from 'vuex'
export default {
  mixins: [EntityDialog],
  props: {
    selectItem: {
      type: Object,
      default() {
        return {}
      }
    },
    winClose: {
      type: Function,
      default() {
        return () => { }
      }
    },
    handleSave: {
      type: Function,
      default() {
        return () => { }
      }
    },

  },
  data() {
     var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.dto.userPassWd) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      var validateTel = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入手机号'));
          } else if (value !== this.dto.userTel) {
              callback(new Error('两次输入手机号不一致'));
          } else {
              callback();
          }
      };
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入邮箱'));
        } else if (value !== this.dto.userEmail) {
          callback(new Error('两次输入邮箱不一致'));
        } else {
          callback();
        }
      };
    return {
      rules: {
        userPassWd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: CNST.REG_EXP.NORMALPWD, message: '包含字母、数字、字符中至少两种以上组合,且位数在8-20位之间' },
          { required: false, trigger: 'change'}
        ],
        confirmUserPassWd: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { pattern: CNST.REG_EXP.NORMALPWD, message: '包含字母、数字、字符中至少两种以上组合,且位数在8-20位之间' },
          { required: false, trigger: 'change'}
        ],
        userTel: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: CNST.REG_EXP.NORMALTEL, message: '手机号格式错误' },
          { required: false, trigger: 'change'}
        ],
        confirmUserTel: [
          { required: true, validator: validateTel, trigger: 'blur' },
          { pattern: CNST.REG_EXP.NORMALTEL, message: '手机号格式错误' },
          { required: false, trigger: 'change'}
        ],
        userEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: CNST.REG_EXP.EMAIL, message: '邮箱格式错误' },
          { required: false, trigger: 'change'}
        ],
        confirmUserEmail: [
          { required: true, validator: validateEmail, trigger: 'blur' },
          { pattern: CNST.REG_EXP.EMAIL, message: '邮箱格式错误' },
          { max: 49, message: "长度应小于 50 个字符", trigger: "blur" },
          { required: false, trigger: 'change'}
        ]
      },
      loading:false,
      options:[],
      dto:{
        userSelectType:1,
        userPassWd:null,
        confirmUserPassWd:null,
        userTel:null,
        confirmUserTel:null,
        userEmail:null,
        confirmUserEmail:null,
      },
      PWD:true,
      TEL:false,
      EMAIL:false,
      placeholder:""
    }
  },
  computed: {
      ...mapState('app', ['tenementCode'])
  },
  created(){
  },
  //单选操作类型触发事件
  methods: {
    changeSelectType(){
      if(this.dto.userSelectType == '1'){
        this.PWD=true
        this.TEL=false
        this.EMAIL=false
        this.$refs['dto'].resetFields()
        this.dto.userSelectType=1

      }else if(this.dto.userSelectType == '2'){
        this.PWD=false
        this.TEL=true
        this.EMAIL=false
        this.$refs['dto'].resetFields()
        this.dto.userSelectType=2

      }else if(this.dto.userSelectType == '3'){
        this.PWD=false
        this.TEL=false
        this.EMAIL=true
        this.$refs['dto'].resetFields()
        this.dto.userSelectType=3
      }
    },
    // 确定按钮
    handleOk(ev) {
      let selectType=this.dto.userSelectType
      let psd=this.dto.userPassWd
      let confirmPsd=this.dto.confirmUserPassWd
      if(selectType === 1){
        const encrypt = new window.JSEncrypt();
        encrypt.setPublicKey(CNST.PUBLICKEY);
        psd=encrypt.encrypt(psd);
        confirmPsd=encrypt.encrypt(confirmPsd)
        // psd=this.$md5(this.dto.userPassWd).toUpperCase()
        // confirmPsd=this.$md5(this.dto.confirmUserPassWd).toUpperCase()
      }
      if (!this.$refs.dto) {
                return
            }
            this.$refs.dto.validate(valid => {
                if (!valid) {
                    return
                }
                let params = {
                  userSelectType:this.dto.userSelectType,
                  userPassWd:psd,
                  confirmUserPassWd:confirmPsd,
                  userTel:this.dto.userTel,
                  confirmUserTel:this.dto.confirmUserTel,
                  userEmail:this.dto.userEmail,
                  confirmUserEmail:this.dto.confirmUserEmail
                }
                this.handleSave({ params, type: this.action})
                this.$refs['dto'].resetFields()
                this.PWD=true
                this.TEL=false
                this.EMAIL=false
            })
    },
    // 取消按钮
    handleClose(ev) {
      this.updateState('entity')
      if (this.$refs.dto) {
        this.$nextTick(() => {
          this.$refs.dto.clearValidate()
        })
      }
      this.winClose(ev)
      this.$refs['dto'].resetFields()
      this.PWD=true
      this.TEL=false
      this.EMAIL=false
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/ .cascader input::placeholder{
  color: #606266;
}
</style>

