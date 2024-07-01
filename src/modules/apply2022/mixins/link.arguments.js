import store from "../store/index.js";

export default {
  mounted() {
    this.$nextTick(() => {
      this.analyzeQueryArguments();
    })
  },
  methods: {
    // 分析参数数据
    analyzeQueryArguments() {
      const query = this.$route.query || {};
      const { tenantCode } = query;
      if(tenantCode) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        // 配置store数据
        // 不知道是否需要锁定一下界面 需要问一下 宁哥接口查询速度
        this.getTenantNameByCode(tenantCode).then(({ tenementName }) => {
          store.commit('updateForm', {
            key: "tenantId",
            value: tenantCode
          })
          store.commit('updateForm', {
            key: "tenantName",
            value: tenementName
          })
          this.$nextTick(() => {
            store.commit('updateActiveApplyStep', { step: 1 })
            loading.close();
          })
        }).catch(() => {
          loading.close();
        })
      }
    },
    // 获取租户名称
    getTenantNameByCode(code) {
      return new Promise((resolve, reject) => {
        // 如果不是是业务申请
        // 根据路由判断是否为业务申请
        const request = api.apply2022.queryCommonTenementNameByCode;
        request({
          tenementCode: code
        })
          .then(({ code, data, msg }) => {
            if (code === 200) {
              return resolve(data)
            } else {
              this.$message.error(msg)
              return reject()
            }
          })
      })
    }
  },
}
