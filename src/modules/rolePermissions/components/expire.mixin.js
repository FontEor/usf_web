import { mapState } from "vuex";

export default {
  data() {
    return {
      allowEditExpireSelect: false,
      needShowExpireSelect: false,
      isShowExpireSelect: false,
      isDisabledExpireSelect: true,
      expireShortDay: '(1-90天)',
      expireLongDay: '(91-365天)',
    }
  },
  computed: {
    ...mapState("app", [
      "tenementCode",
    ])
  },
  methods: {
    getShowExpireSelect () {
      api.expiration.roleExpireSwitch({
        data: {
          tenementCode: this.tenementCode,
          appCode: this.query.appCode,
        }
      }).then(response => {
        if(response.code === 200) {
          const data = response.data;
          this.needShowExpireSelect = data.showEditBox;
          this.allowEditExpireSelect = data.canEdit;
          if(data.applyPass) {
            this.expireLongDay = `(${data.longTerm}天)`
            this.expireShortDay = `(${data.shortTerm}天)`
          } else {
            this.expireLongDay = '(91-365天)';
            this.expireShortDay = '(1-90天)';
          }
          this.setShowExpireSelect();
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    setShowExpireSelect() {
      switch (this.action) {
        case 'add':
          this.isShowExpireSelect = this.needShowExpireSelect;
          this.isDisabledExpireSelect = false;
          break;
        case 'edit':
          this.isShowExpireSelect = this.needShowExpireSelect;
          this.isDisabledExpireSelect = !this.allowEditExpireSelect;
          break;
        case 'view':
          this.isShowExpireSelect = this.needShowExpireSelect;
          this.isDisabledExpireSelect = true;
          break;
      }
    }
  },
}
