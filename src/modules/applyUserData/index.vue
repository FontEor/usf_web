<template>
  <div class="p-basic">
    <el-form
      ref="form"
      size="small"
      label-position="center"
      label-width="70px"
      :model="dto"
      class="parent"
      @submit.native.prevent
    >
      <el-row :gutter="24" type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="操作类型" prop="assignType">
            <el-select v-model="dto.assignType" placeholder="请选择">
              <el-option :label="'分配权限'" :value="'1'"></el-option>
              <!-- <el-option :label="'清除权限'" :value="'2'"></el-option> -->
              <!-- <el-option :label="'覆盖权限'" :value="'3'"></el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="onSubmit" size="small" :loading="flagBtn">提交申请</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="banner" v-if="dto.assignType==='1'">
      将右侧列表中的数据权限分配给左侧列表中的用户，提交申请后，可在京ME中查看进度
    </div>
    <div class="banner" v-if="dto.assignType==='2'">
      清除左侧列表中所有用户的所有数据权限，提交申请后，可在京ME中查看进度
    </div>
    <div class="banner" v-if="dto.assignType==='3'">
      清除左侧列表中所有用户的所有数据权限，然后将右侧列表中的数据权限分配给左侧列表用户，提交申请后，可在京ME中查看进度
    </div>

    <!-- 两个列表 -->
    <div class="widSet">
      <el-table
        :data="tableDataUser"
        stripe
        v-loading="flagLoding"
        style="width: 50%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        ref="handSelectTest_multipleTable"
        size="small"
        max-height="450"
      >
        <el-table-column>
          <template slot="header">
            <div class="btns">
              <el-button type="primary" size="mini" @click="addUser">添加用户</el-button>
              <el-button type="danger" size="mini" @click="delUser">删除</el-button>
            </div>
          </template>
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="(item, index) in fields"
            :key="index"
            :prop="item.key"
            :label="item.name"
            :width="item.width"
            align="center"
          />
        </el-table-column>
        <div slot="empty">
          <img src="@/imgs/empty.png" alt="" width="50" style="margin:210px auto;">    
        </div>
      </el-table>
      <div class="middle">
        <i class="el-icon-d-arrow-left"></i>
      </div>
      <el-table
        :data="tableData"
        stripe
        v-loading="flagLoding"
        style="width: 50%"
        @selection-change="handleSelectionChange2"
        @row-click="handleRowClick2"
        ref="handSelectTest_multipleTable2"
        size="small"
        max-height="450"
      >
        <el-table-column>
          <template slot="header">
            <div class="btns">
              <el-button type="primary" @click="addRoleMenu" size="mini">添加数据权限</el-button>
              <!-- <el-button  @click="view" size="mini">详情</el-button> -->
              <el-button type="danger" @click="delMenuRole" size="mini">删除</el-button>
            </div>
          </template>
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="(item, index) in fields2"
            :key="index"
            :prop="item.key"
            :label="item.name"
            :width="item.width"
            align="center"
          />
        </el-table-column>
        <div slot="empty">
          <img src="@/imgs/empty.png" alt="" width="50" style="margin:210px auto;">    
        </div>
      </el-table>
    </div>

    <entity-dialog
      :visible="entityDlgVis"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :list="state.listTree"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
      :dalog="dalog"
      @fund="getMsgDalog"
    />
    <entity-dialog-distribute
       module-name=""
      :visible="entityDlgVis2"
      :state="state"
      :action="entityDlgActn"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis2"
      :handle-save="handleSave"
      :winClose="winClose"
      @func="getMsgFormSon"
    />
     <entity-dialog-view
      :obj="obj"
      :visible="entityDlgVis3"
      :action="entityDlgActn3"
      :entity="state.entity"
      :state="state"
      :list="state.listTree"
      :ids="state.ids"
      :roleListId="roleListId"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
      :app-code='appCode'
      @funcl='close'
      :handle-allocate='[{"id":29,"roleCode":"order_zf","roleName":"查询订单数据","source":"usf","tenementId":1,"tenementCode":"yc-4PL","rootOrgId":1,"rootOrgCode":"yc-4PL","remark":null,"createTime":"2019-11-15T03:27:06.000+0000","updateTime":"2019-12-09T03:25:21.000+0000","createUser":"jianglongfei","updateUser":"leijiang","ts":"2019-12-09T03:25:21.000+0000","isDelete":0,"userId":null,"dataRoleResourceRels":null,"isOwnRole":0,"userDataRoleRels":null,"userIds":null,"dataResourceIds":null}]'
      :tenementCode='tenementInfoObj.tenementCode'
    />
  </div>
</template>

<script>
import PageList from "@/mixins/pageList";
import store from "./store";
// import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import EntityDialogDistribute from "./components/entityDialogDis";
import EntityDialogView from './components/entityDialogView'
import { mapState } from "vuex";

export default {
  name: "applyUserData",
  mixins: [PageList],
  components: {
    // ExactList,
    EntityDialog,
    EntityDialogDistribute,
    EntityDialogView
  },
  data() {
    return {
      // store唯一标识
      storeKey: 'applyUserData',
      // 模块名称
      moduleName: '申请数据权限',
      // 实体弹窗是否可见
      entityDlgVis2: false,
      entityDlgVis3: false,
      appCode: undefined,
      entityDlgActn3: 'view', 
      dto: {
        // 操作类型
        assignType: '1',
        // 角色列表
        dataIdList: [],
        // 用户列表
        userIdList: []
      },
      flagBtn: false,
      immediateQuery: false,
      fields: [
        {
          key: "userCode",
          name: "用户账号"
        },
        {
          key: "userName",
          name: "姓名"
        },
        {
          key: "parentFullName",
          name: "所属机构"
        }
      ],
      fields2: [
        {
          key: "typeName",
          name: "数据类型"
        },
        {
          key: "ext1",
          name: "数据字段1"
        },
        {
          key: "ext2",
          name: "数据字段2"
        },
        {
          key: "ext3",
          name: "数据字段3"
        },
        {
          key: "ext4",
          name: "数据字段4"
        },
        {
          key: "ext5",
          name: "数据字段5"
        },
        {
          key: "ext6",
          name: "数据字段6"
        },
      ],
      tableDataUser: [],
      tableData: [],
      multipleSelection: [],
      multipleSelection2: [],
      roleListId: 0,
      obj: {},
      appCode:undefined,
      flagLoding: false
    }
  },
  created() {
    this.registStore(store);
    /*
      在主组件中 上来发送请求 ，
      来获取当前登陆用户的 菜单权限
    */
  },
  methods: {
    // 传给子组件的函数
    dalog(pram) {},
    //删除用户
    delUser() {
      if(this.multipleSelection.length===0){
        this.$message.error('请选择要删除的用户')
        return
      }
      let _this = this;
      for (var j = 0; j < this.multipleSelection.length; j++) {
        this.tableDataUser = this.tableDataUser.filter(item => {
          return item.id !== _this.multipleSelection[j].id;
        });
      }
    },
    
    // 点击详情按钮
    view() {
      var rows = this.multipleSelection2
      if(!rows.length){
        return this.$message.error('请至少选择一项')
      }
      if(rows.length>1){
        return this.$message.error('只能选择一项')
      }
      this.updateState({ entity: rows[0] })
      this.entityDlgVis3 = true;
    },
    // 获取菜单

    handelMeun(appCode) {
      api.rolePermissions
        .findUserResource({
          page: { pageIndex: 1, pageSize: 10000 },
          data: {
            tenementCode: this.tenementInfoObj.tenementCode,
            appCode: appCode
          }
        })
        .then(({ code, data, message }) => {
          if (code == 200) {
            this.state.listTree = tools.dataToTree(data);

            //获取所有父节点
            let newArr = [];
            function toArr(arr) {
              arr.forEach((item, index) => {
                if (item.children && item.children.length > 0) {
                  newArr.push(item.id);
                  toArr(item.children);
                }
              });
            }
            toArr(this.state.listTree);
            this.pIds = newArr;
          }
        });
    },
    //删除菜单角色
    delMenuRole() {
        if(this.multipleSelection2.length===0){
           this.$message.error('请选择要删除的菜单角色')
            return
        }
      let _this = this;
      for (var j = 0; j < this.multipleSelection2.length; j++) {
        this.tableData = this.tableData.filter(item => {
          return item.id !== _this.multipleSelection2[j].id;
        });
      }
    },
    // 添加数据权限
    addRoleMenu() {
      this.entityDlgVis2 = true;
      this.entityDlgActn = '数据权限列表';
      this.dispatch("DataTypeList")
    },
    winClose(){
      this.entityDlgVis2 = false;
    },
    addUser() {
      this.handleAdd();
    },

    getMsgFormSon(data) {
      let list1 = []
      var dateList = this.tableData.map(function(item) {
        list1.push(item.id);
      });
      let list2 = []
      var dateList2 = data.map(function(item) {
        list2.push(item.id);
      });
      if (!_.intersection(list2, list1).length) {
        this.tableData = [...this.tableData, ...data]
        if(data.length!==0){
          this.entityDlgVis2 = false
          return this.$message.success("添加成功")
        }
      } else {
        return this.$message.error("列表中不能有重复的菜单角色！")
      }
    },
    getMsgDalog(pram) {
      let flag = [];
      flag = this.tableDataUser.filter(item => item.userCode === pram)
      if (!flag.length) {
        api.applyMenuPermission
          .findUserByErp({
            tenementCode: this.tenementInfoObj.tenementCode,
            userCode: pram
          })
          .then(({ code, msg, data }) => {
            if (code === 200) {
              this.tableDataUser.push(data)
              this.$message.success(msg)
              this.entityDlgVis = false
            } else {
              return this.$message.error(msg)
            }
          });
      } else {
        return this.$message.error(`用户编码为${pram}的用户已存在于列表！`)
      }
    },
    // 选中的
    handleRowClick(row, column, event) {
      this.$refs.handSelectTest_multipleTable.toggleRowSelection(row)
    },
    // 点击checkBOx
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 选中的
    handleRowClick2(row, column, event) {
      this.$refs.handSelectTest_multipleTable2.toggleRowSelection(row)
    },
    // 点击checkBOx
    handleSelectionChange2(val) {
      let dataIdList = []
      val.forEach(item => {
        item ? dataIdList.push(item.id) : undefined
      });
      // this.dto.dataIdList = dataIdList
      this.multipleSelection2 = val
    },
    // 提交申请
    onSubmit() {
      let userIdList = []
      this.tableDataUser.forEach(item => {
        item ? userIdList.push(item.id) : undefined
      });
      this.dto.userIdList = userIdList
      let dataIdList = []
      this.tableData.forEach(item => {
        item ? dataIdList.push(item.id) : undefined
      });
      this.dto.dataIdList = dataIdList
      if(!this.dto.userIdList.length) {
        return this.$message.error('请选择用户')
      }
      if(!this.dto.dataIdList.length&&this.dto.assignType!=='2') {
        return this.$message.error('请选择菜单角色')
      }
      this.flagBtn = true;
      this.flagLoding = true
      api.applyUserData
        .submit({
          ...this.dto,
          tenementCode: this.tenementInfoObj.tenementCode
          //   appCode: this.appCode
        })
        .then(({ code, msg }) => {
          this.flagLoding = false
          this.flagBtn = false;
          if (code === 200) {
            return this.$message.success(
              "申请成功，您可在流程中心查看申请进度"
            );
          } else {
            return this.$message.error("申请失败" + " " + msg)
          }
        })
    },
    // 更新实体弹框可见状态
    updateEntityDlgVis2(vis) {
      this.entityDlgVis2 = vis;
    },
    close() {
      this.entityDlgVis3 = false
    }
    //代理函数
  },
  computed: {
    ...mapState("app", ["tenementInfoObj"])
  }
}
</script>
<style lang="scss" scoped>
.fatherlist {
  display: flex;
  justify-content: space-between;
}
/deep/ .basic-list {
  width: 100%;
  display: inline-block;
}
.parent {
  padding: 20px 0 0 !important;
}
.widSet {
  display: flex;
}
.middle {
  width: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #807e7e;
}
.banner {
  height: 30px;
  padding-left: 15px;
  background-color: rgb(219, 238, 243);
  color: rgb(49, 46, 46);
  line-height: 30px;
  font-size: 12px;
  margin: 10px 0;
}
.el-table {
  min-height: 500px !important;
}
</style>
