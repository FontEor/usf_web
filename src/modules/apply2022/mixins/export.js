import moment from "moment";
import store from "../store";
import { userSystemType } from "../mixins/filters"

const map = {
  '1': '在京东不存在',
  '2': '在租户中不存在',
  '3': '未拥有用户的管理权限',
  '4': '所属机构不一致',
}

const tableHeader = ['错误类型','账号类型','账号编码','账号名称','所属机构']

export default {
  computed: {
    storeForm() {
      return store.state.form;
    },
    usersList() {
      return store.state.usersList;
    },
  },
  methods: {
    generatorFilename(){
      return `${
        moment().format('YYYYMMDD')
      }-${
        this.storeForm.userCode
      }-异常账号.csv`
    },
    formatAccounts(list = [], usersList = []) {
      // 账号类型 userSystemType(this.storeForm.userSystemTypeForOther)
      // 账号编码 userCode
      // 账号名称 userName
      // 所属机构 orgFullName
      const type = userSystemType(this.storeForm.userSystemTypeForOther);
      return list.map(item => {
        const message = map[item.errorCode];
        // 如果是导入时产生的错误数据
        if(item.errorCode === -1) {
          return {
            message: item.message,
            type,
            userCode: item.userCode,
            userName: "",
            orgFullName: ""
          }
        } else 
        if(item.errorCode >= 3) {
          const instance = usersList.find(user => user.userCode === item.userCode);
          if(instance) {
            return {
              message,
              type,
              userCode: item.userCode || "",
              userName: instance.userName || "",
              orgFullName: instance.orgFullName || "",
            }
          } else {
            return {
              message: item.message || "在租户中不存在",
              type,
              userCode: item.userCode,
              userName: "",
              orgFullName: ""
            }
          }
        } else {
          return {
            message,
            type,
            userCode: item.userCode,
            userName: "",
            orgFullName: ""
          }
        }
      })
    },
    formatTable(list = []) {
      const table = [];
      table.push(tableHeader.join(','));
      list.forEach(item => {
        // ['错误类型','账号类型','账号编码','账号名称','所属机构']
        const row = [];
        row.push(item.message);
        row.push(item.type);
        row.push(item.userCode);
        row.push(item.userName);
        row.push(item.orgFullName);
        table.push(row.join(','))
      })
      return table.join('\n');
    },
    download() {
      const rows = this.formatAccounts(this.errors, this.usersList);
      const string = this.formatTable(rows);
      const urlObject = window.URL || window.webkitURL || window;
      const export_blob = new Blob(["\uFEFF" + string], {type: 'text/csv,charset=UTF-8'});
      const save_link = document.createElement("a")
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = this.generatorFilename();
      const ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(ev);
    }
  },
}
