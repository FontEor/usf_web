<template>
  <div class="expiration-container">
    <div class="expiration-scroll">
      <el-form ref="form" :rules="rules" :model="formData" label-width="0" :disabled="formData.applyState === 0">
        <div class="expiration-header">
          <img src="@/imgs/ic.png" alt="" />
          <h2>租户负责人设置</h2>
        </div>
        <el-form-item label="" prop="lifespanPrincipal">
          <el-input
            v-model="formData.lifespanPrincipal"
            placeholder="请录入ERP账号，该ERP将负责本租户内用户权限到期的异常问题"
            size="small"
          ></el-input>
        </el-form-item>
        <div class="expiration-header">
          <img src="@/imgs/ic.png" alt="" />
          <h2>续期引导文档</h2>
        </div>
        <el-form-item label="" prop="lifespanGuideDoc">
          <el-input
            v-model="formData.lifespanGuideDoc"
            placeholder="用户权限到期后，将通过该文档进行续期操作"
            size="small"
          ></el-input>
        </el-form-item>
        <div class="expiration-header">
          <img src="@/imgs/ic.png" alt="" />
          <h2>续期审批流配置</h2>
        </div>
        <el-form-item label="" prop="applyFlowCode">
          <el-input
            v-model="formData.applyFlowCode"
            placeholder="请录入BPM流程编码"
            size="small"
          ></el-input>
        </el-form-item>
        <div class="expiration-header">
          <img src="@/imgs/ic.png" alt="" />
          <h2>当前审批状态</h2>
        </div>
        <el-form-item label="" prop="tenementRelatedWord">
          <!-- <el-tag v-if="formData.applyState === 1" type="success">审批完成</el-tag>
          <el-tag v-else-if="formData.applyState === 0" type="warning">审批中</el-tag>
          <el-tag v-else-if="formData.applyState === -1" type="danger">驳回</el-tag> -->
          <el-tag v-if="formData.effectiveTime" type="success">生效中</el-tag>
          <el-tag v-else type="danger">未生效</el-tag>
        </el-form-item>
        <div class="expiration-header">
          <img src="@/imgs/ic.png" alt="" />
          <h2>菜单角色有效期配置</h2>
        </div>
        <div v-for="(item, index) in formData.appLifeSpanInfo" :key="item.appCode">
          <div class="expiration-header expiration-header-sub">
            <img src="@/imgs/ic.png" alt="" />
            <h2>{{ item.appName }}({{ item.appCode }})</h2>
          </div>
          <div :key="item.appCode">
            <el-form-item
              label="短期"
              :prop="`appLifeSpanInfo[${index}].shortTerm`"
              label-width="100px"
              label-position="left"
              :rules="shortRule">
              <el-input-number v-model="formData.appLifeSpanInfo[index].shortTerm" :min="1" :max="90" label="短期"></el-input-number>
              <span class="input-number-suffix">天</span>
            </el-form-item>
            <el-form-item
              label="长期"
              :prop="`appLifeSpanInfo[${index}].longTerm`"
              label-width="100px"
              label-position="left"
              :rules="longRule">
              <el-input-number v-model="formData.appLifeSpanInfo[index].longTerm" :min="91" :max="365" label="长期" aria-required="true"></el-input-number>
              <span class="input-number-suffix">天</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="expiration-button-container">
      <el-button type="primary" @click="onSave()" size="small">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store";
export default {
  data() {
    return {
      formData: {
        lifespanPrincipal: '',
        lifespanGuideDoc: '',
        applyFlowCode: '',
        applyState: undefined,
        appLifeSpanInfo: [],
        effectiveTime: '',
      },
      rules: {
        lifespanPrincipal: [{
          required: true,
          message: '请填写租户负责人ERP账号',
        }, {
          validator: (rule, value, callback) => {
            if([
              "org.missusf",
              "zhengguinan",
              "wangning230",
              "wujilai",
              "chuyuhao1",
              "liangzhipeng5"].includes(value)) {
              return callback(new Error('非法ERP'))
            }
            return callback();
          }
        }],
        lifespanGuideDoc: [{
          required: true,
          message: '请填写续期引导文档',
        }],
        applyFlowCode: [{
          required: true,
          message: '请填写BPM审批流编码',
        }]
      },
      shortRule: [
        {
          required: true,
          message: '请填写短期时间1~90天',
        }, {
          type: 'number',
          min: 1,
          max: 90,
          message: '短期时间1~90天',
        }
      ],
      longRule: [
        {
          required: true,
          message: '请填写长期时间91~365天',
        }, {
          type: 'number',
          min: 91,
          max: 365,
          message: '长期时间91~365天',
        }
      ],
      cacheApps: []
    }
  },
  mounted() {
    this.getExpire();
  },
  methods: {
    getExpire() {
      api.expiration.getExpireInfo({
        tenementCode: store.state.app.tenementCode
      }).then(response => {
        if(response.code === 200) {
          this.setFormData(response.data);
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    setFormData(data = {}) {
      this.formData.lifespanPrincipal = data.principal || "";
      this.formData.lifespanGuideDoc = data.guideDoc || "";
      this.formData.applyState = data.applyState;
      this.formData.applyFlowCode = data.applyFlowCode || "";
      this.formData.tenementCode = data.tenementCode;
      this.formData.effectiveTime = data.effectiveTime || "";
      const apps = data.appLifeSpanInfo ? data.appLifeSpanInfo : [];
      const cache = [];
      apps.forEach(item => {
        item.longTerm = item.longTerm || '180';
        item.shortTerm = item.shortTerm || '90';
        cache.push({
          longTerm: item.longTerm || '180',
          shortTerm: item.shortTerm || '90',
        });
      });
      this.cacheApps = cache;
      this.formData.appLifeSpanInfo = apps;
    },
    diffrenceApp(data) {
      let changed = false;
      this.cacheApps.forEach((item, index) => {
        if(item.shortTerm != data[index].shortTerm) {
          changed = true;
        }
        if(item.longTerm != data[index].longTerm) {
          changed = true;
        }
      })
      return changed;
    },
    validAccountErrorRequest(userSystemType, accounts) {
      // 不管通过不通过 都使用后台的接口数据校验 返回的提示语
      const tenementCode = store.getters.tenementCode;
      return axios({
        method: "post",
        url: "/businessApply/batchCheckUserIsLegal.do",
        data: {
          "userSystemType" : 1,
          "userCodes": [this.formData.lifespanPrincipal],
          "tenementCode": this.formData.tenementCode || tenementCode,
        },
        params: {
          tenementCode: this.tenantId,
        },
      }).then(response => {
        if(response.data.code === 200) {
          const errorAccount = response.data.data.illegalUserCodes;
          // 如果有错误数据
          if(errorAccount.length) {
            this.$message.error('租户负责人验证失败, 请检查。');
            throw new Error('ERP验证失败')
          }
        }
      }).catch((reject) => {
        console.log("/businessApply/batchCheckUserIsLegal.do 请求失败", reject);
        throw new Error(reject);
      });
    },
    onSave() {
      if (!this.$refs.form) {
        return;
      }
      this.$refs.form.validate(async (valid, errors) => {
        // 不管通过不通过 都使用后台的接口数据校验 返回的提示语
        const tenementCode = store.getters.tenementCode;
        const changed = this.diffrenceApp(this.formData.appLifeSpanInfo);
        console.log('changed changed', changed)
        // 验证ERP账号
        await this.validAccountErrorRequest();
        if(changed) {
          await this.$confirm('您好，继续提交最高将交由二级负责人进行审批，审批通过后，有效期将立刻生效，请确认是否继续', '操作提示', {
            confirmButtonText: '提交'
          })
        }
        api.expiration.expireSwitch({
          data: {
            ...this.formData,
            tenementCode: this.formData.tenementCode || tenementCode,
          }
        }).then((response) => {
          if(response.code === 200) {
            this.getExpire();
            this.$message.success('保存成功')
          } else {
            this.$message.error(response.msg);
          }
        })
      })
    },
  },
}
</script>
<style lang="scss">
.expiration-container {
  height: 100%;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .expiration-scroll {
    height: calc(100% - 35px);
    overflow-y: auto;
  }
  .expiration-header {
    display: flex;
    align-items: center;
    height: 16px;
    margin: 24px 0 12px 0;
    h2 {
      padding-left: 12px;
      font-size: 16px;
      height: 20px;
      line-height: 20px;
    }
    img {
      width: 12px;
      height: 14px;
      background: linear-gradient(130.13deg, #3c6ef0 0%, #5886ff 100%);
    }
  }
  .expiration-header-sub {
    padding-left: 24px;
    h2 {
      font-size: 14px;
    }
    img {
      width: 10px;
      height: 12px;
    }
  }
  .el-input .el-input__inner {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    width: 420px;
    line-height: 1;
  }
  .el-input-number {
    width: 200px;
    .el-input {
      .el-input__inner {
        width: 200px;
      }
    }
  }
  .el-form-item__label,
  .input-number-suffix {
    font-size: 16px;
    line-height: 40px;
    height: 42px;
    transform: translateY(1px);
  }
  .input-number-suffix {
    display: inline-block;
    margin-left: 12px;
  }

  .expiration-button-container {
    background-color: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 72px;
    min-height: 72px;
    margin: 0 -20px 0 -20px;
    border-top: 1px solid #e5e5e5;
    .el-button {
      margin-right: 24px;
      border-radius: 4px;
      font-size: 14px;
      width: 120px;
      height: 48px;
      font-size: 18px;
    }
  }
}
</style>
