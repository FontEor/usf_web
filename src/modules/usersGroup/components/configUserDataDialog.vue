<template>
  <basic-dialog :visible="visible"
                :title="title"
                :width="1000"
                :update-vis="updateVis"
                :showFt='showSelect'
                :handle-close="handleClose"
                :handle-closed="handleClosed"
                :handle-ok="handleOk">
    <el-form ref="form"
             size="small"
             label-position="right"
             label-width="100px"
             :model="dto"
             :rules="rules"
             @submit.native.prevent>
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item label="数据角色编码"
                            style="display:inline-block;">
                <el-input v-model="roleCodeLike"
                          placeholder="角色编码"
                          clearable />
              </el-form-item>
              <el-form-item label="数据角色名称"
                            style="display:inline-block;">
                <el-input v-model="roleNameLike"
                          placeholder="角色名称"
                          clearable />
              </el-form-item>
            </el-col>
            <el-button type="primary"
                       size="small"
                       @click="query">查询</el-button>
            <el-button v-if="action==='分配数据角色'"
                       size="small"
                       @click="reset">重置</el-button>
          </el-row>
        </div>
      </div>
    </el-form>
    <template>
      <basic-list ref="userTB"
                  :show-select-col="showSelect"
                  :show-action-col="false"
                  :loading="false"
                  :fields="fields"
                  :key="keys"
                  :total="userList ? userList.total : 0"
                  :list="userList ? userList.list : []"
                  :selection-change="selectionChange"
                  :page-index-change="pageIndexChange"
                  :page-size-change="pageSizeChange"
                  :page-size="pageSize">
      </basic-list>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from '@/mixins/entityDialog'
import ExactList from '@/mixins/exactList'
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      rules: {},
      pageSize: 10,
      roleNameLike: '',
      roleCodeLike: '',
      userList: null,
      apiName: 'viewDataRoleListByGroup',
      cascaderVal: '',
      apiIdList: [],
      pickIdList: [],
      fields: [
        { key: 'roleCode', name: '数据角色编码' },
        { key: 'roleName', name: '数据角色名称' },
        { key: 'source', name: '来源' },
      ],
      showSelect: true,
      keys: 0
    }
  },
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
    }
  },
  watch: {
    'state.userList': {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        // newVal.list = this.changeTime(newVal.list)
        this.userList = newVal
        this.giveCheck()
      }
    },
    "action": {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.showSelect = newVal === '查看数据角色' ? false : true
        this.fields = newVal.indexOf('数据角色') > -1 ? [
          { key: "roleCode", name: "数据角色编码" },
          { key: "roleName", name: "数据角色名称" },
          { key: "source", name: "来源" },
          { key: "createUser", name: "添加人" },
          {            key: "createTime",
            name: "添加时间",
            formatter: function (row, column, cellValue, index) {
              return jt.date.format(new Date(cellValue).getTime());
            }
          }
        ] : [
          { key: "roleCode", name: "菜单角色编码" },
          { key: "roleName", name: "菜单角色名称" },
          { key: "source", name: "来源" },
        ]
        this.keys++
      }
    }
  },
  methods: {
    // 查询
    query(ev) {
      this.$parent.updateState({ roleNameLike: this.roleNameLike, roleCodeLike: this.roleCodeLike, dataPageIndex: 0 })
      // 查询 设置菜单角色列表
      if (this.action === '查看数据角色') {
        this.$parent.dispatch('viewDataRoleListByGroup')
      } else {
        this.$parent.dispatch('DataRoleListByGroup')
      }
    },
    // 重置
    reset() {
      this.roleNameLike = ''
      this.roleCodeLike = ''
      this.$parent.updateState({ roleNameLike: this.roleNameLike, roleCodeLike: this.roleCodeLike })
      // 查询 设置菜单角色列表
      this.$parent.dispatch('DataRoleListByGroup')
    },
    handleOk() {
      if (!this.$refs.form) {
        return
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        let params = this.toEnd()
        this.handleSave({ params, type: this.action })
        this.keys++
      })
    },
    // 关闭和取消按钮
    handleClose(ev) {
      this.roleNameLike = ''
      this.roleCodeLike = ''
      this.pageSize = 10
      this.$parent.updateState({ roleNameLike: this.roleNameLike, roleCodeLike: this.roleCodeLike, dataPageIndex: 0, dataPageSize: 10 })
      this.keys++
      this.winClose(ev)
    },
    handleChange(ev) {
    },
    // 选择触发事件 获取当前行数据
    selectionChange(rows, ind) {
      this.pickIdList.length = 0
      rows.forEach((item) => {
        this.pickIdList.push(item.id)
      })
      this.$parent.updateState({ pickIdList: this.pickIdList })
    },
    giveCheck() {
      // 设置数据勾选
      setTimeout(() => {
        this.apiIdList.length = 0
        this.userList && this.userList.list && this.userList.list.forEach((item, ind) => {
          const _table = this.$refs.userTB.$refs.table
          // 设置状态
          item && _table.toggleRowSelection(item, item.isOwnRole !== 0)
          // 存储id
          this.apiIdList.push(item.id)
        })
        if (this.apiIdList.length > 0) {
          this.$parent.updateState({ apiIdList: this.apiIdList })
        }
      })

    },
    // 切换页数
    pageIndexChange(_index) {
      let _ind = _index - 1
      // 更新页面数据
      this.$parent.updateState({ dataPageIndex: _ind })
      if (this.action === '查看数据角色') {
        this.apiName = 'viewDataRoleListByGroup'
      } else {
        this.apiName = 'DataRoleListByGroup'
      }
      // 查询列表
      this.$parent.dispatch(this.apiName || 'queryList')
    },
    // 切换每页显示条数
    pageSizeChange(_size) {
      // 查询列表
      this.pageSize = _size
      this.$parent.updateState({ dataPageSize: _size })
      if (this.action === '查看数据角色') {
        this.apiName = 'viewDataRoleListByGroup'
      } else {
        this.apiName = 'DataRoleListByGroup'
      }
      // 查询列表
      this.$parent.dispatch(this.apiName || 'queryList')
    },
    //处理时间
    changeTime(arr) {
      if (!arr) {
        return
      }
      arr.map((item) => {
        if (item.createTime) {
          item.createTime = item.createTime.split('.')[0]
          item.createTime = item.createTime.replace(/T/g, " ");
        }
      })
      return arr
    }
  }
}
</script>

