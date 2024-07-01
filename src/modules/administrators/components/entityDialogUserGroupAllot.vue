<template>
  <basic-dialog title="分配用户组管理权限"
                width="70%"
                :visible="visible"
                :handle-close="handleClose"
                :handle-ok="handleOk"
                :handle-open="handleOpen"
                :handle-closed="handleClosed">
    <dlg-search :query="query"
                :fields="searchFields"
                :handle-search="handleSearch"
                :handle-reset="handleRest"
                label-width="100px" />
    <basic-list ref="basicList"
                :tableH="tableH"
                select-type="multiple"
                :show-index-col="false"
                :show-select-col="true"
                :show-action-col="false"
                :fields="fields"
                :list="list"
                :selection-change="selectionChange"
                :page-index-change="pageIndexChange"
                :page-size-change="pageSizeChange"
                :page-index="pageIndex"
                :page-size="pageSize"
                :total="total"
                :loading="loading">
    </basic-list>
  </basic-dialog>
</template>

<script>
import exactDialog from '@/mixins/exactDialog'

export default {
  mixins: [exactDialog],
  props: {
    userInfo: Object
  },
  beforeCreate() {
    this.searchQueryFields = ['groupName', 'groupCode']
  },
  data() {
    return {
      searchFields: [
        { key: 'groupName', name: '用户组名称' },
        { key: 'groupCode', name: '用户组编码' }
      ],
      fields: [
        { key: 'groupName', name: '用户组名称' },
        { key: 'groupCode', name: '用户组编码' },
        { key: 'source', name: '来源' }
      ],
      list: []
    }
  },
  methods: {
    handleOpen() {
      this.handleSearch()
    },
    async handleOk() {
      const params = this.toEnd()
      const { code, data, msg } = await api.administrators.userGroupAllotSave(params)
      if (code === 200) {
        this.$message.success(msg)
        this.handleSearch()
      } else {
        this.$message.error(msg)
      }
    },
    toEnd() {
      const { id: userId } = this.userInfo
      const allGroupIdList = this.list.map(item => item.id)
      const groupIdList = this.selRows.map(item => item.id)
      const data = { userId, allGroupIdList, groupIdList }
      return { data }
    },
    // 用户组列表
    async queryList() {
      const params = this.queryToEnd()
      // const { code, data, msg } = await jt.mock.queryList(this.fields, params) // mock
      this.updateLoading(true)
      const { code, data, msg } = await api.administrators.queryUserGroupList(params)
      if (code === 200) {
        this.list = data.rows || []
        this.total = data.rowTotal || 0
        this.$nextTick(() => {
          this.list.forEach(item => {
            if (item.isOwnGroup === 1) {
              this.$refs.basicList.$refs.table.toggleRowSelection(item, true)
            }
          })
        })
      } else {
        this.$message.error(msg)
      }
      this.updateLoading(false)

    },
    // 处理查询的入参
    queryToEnd() {
      const { id: userId } = this.userInfo
      const query = _.pick(this.query, this.searchQueryFields)
      query.userId = userId
      jt.object.removeEmptyAttr(query)
      const params = { page: this.page, data: query }
      return params
    },
    handleRest(){
      this.query.groupName = ""
      this.query.groupCode = ""
      this.handleSearch()
    }
  }
}
</script>