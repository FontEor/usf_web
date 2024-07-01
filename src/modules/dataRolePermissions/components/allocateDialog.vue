<template>
    <basic-dialog
        class="goods-sel-dlg"
        :title="title"
        :width="1000"
        :visible="visible"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk"
        closeText="关闭"
        >
        <el-form class="search-form" size="small" label-width="80px" :model="query">
            <div class="col-l">
                <el-form-item label="姓名">
                    <el-input v-model.trim="query.userNameLike" :maxlength="30" clearable/>
                </el-form-item>
                <el-form-item label="用户账号">
                    <el-input v-model.trim="query.userCodeLike" :maxlength="30" clearable/>
                </el-form-item>
                 <el-form-item label="账号别名">
                    <el-input v-model.trim="query.userAliasLike" :maxlength="30" clearable/>
                </el-form-item>
            </div>
            <div class="col-r">
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
            </div>
        </el-form>
        <basic-list
            ref="basicList"
            select-type="multiple"
            :show-select-col="true"
            :show-action-col="false"
            :show-index-col="false"
            :fields="fields"
            :setClmnsFlg="false"
            :list="list"
            :loading="loading"
            :total="total"
            :page-index="pageIndex"
            :page-size="pageSize"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :selection-change="selectionChange"
            />
    </basic-dialog>
</template>

<script>
import BasicDialog from '@/components/basicDialog'
import BasicList from '@/components/basicList'
import { mapActions } from 'vuex'

const DEFAULTS = {
    query: {
        userNameLike: undefined,
        userCodeLike: undefined,
        userAliasLike: undefined,
    },
    loading: false,
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    list: [],
    selRows: []
}

export default {
    components: {
        BasicDialog,
        BasicList
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        updateVis: {
            type: Function,
            default: () => {}
        },
        selectRole: Object,
        tenementCode: {
            type: [ Number, String, undefined ],
            default: undefined
        },
        title: {
            type: String,
            default: ""
        }
    },
    data () {
        return {
            ..._.cloneDeep(DEFAULTS),
            fields: [
                { key: 'userName', name: '姓名' },
                { key: 'userCode', name: '用户账号' },
                { key: 'userAlias', name: '账号别名' },
                {
                    key: 'userSystemType', name: '账号类型', formatter: function (row, column, cellValue, index) {
                        return _params.users.userSystemType[cellValue]
                    }
                },
            ]
        }
    },
    watch: {
        visible (newVal) {
            if (newVal) {
                this.query = { ...DEFAULTS.query}
                this.queryList()
            }
        }
    },
    methods: {
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            const defaults = _.cloneDeep(_.get(DEFAULTS, ['selRows', 'query']))
            for (let key in defaults) {
                this[key] = defaults[key]
            }
            this.$refs.basicList.resetData()
        },
        handleOk () {
            // 选择的角色 this.selectRole  分配用户 this.selRows
            this.handleSave()
            // this.updateVis(false)
        },
        pageIndexChange (index) {
            this.pageIndex = index - 1
            this.queryList()
        },
        pageSizeChange (size) {
            this.pageIndex = 0
            this.pageSize = size
            this.queryList()
        },
        selectionChange (rows) {
            this.selRows = rows
        },
        handleSearch () {
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        handleReset () {
            this.query = _.cloneDeep(DEFAULTS.query)
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        queryList () {
            const params = this.queryToEnd()
            api.dataRolePermissions.queryAdminDataRoleUserListByPage(params).then( ({code, data}) => {
                if (code === 200) {
                    this.list = data.rows || []
                    this.total = data.rowTotal || 0
                    this.$nextTick(() => {
                        let arr = this.list.filter( item => item.isOwn == 1 )
                        arr.forEach( item => {
                            this.$refs.basicList.$refs.table.toggleRowSelection(item, true)
                        } )
                    })
                }
                // this.$refs.basicList.resetData('radioIndex')
            } )
        },
        queryToEnd () {
            const data = _.cloneDeep(this.query)
            data.roleCode = this.selectRole.roleCode
            data.tenementCode = this.tenementCode
            jt.object.removeEmptyAttr(data)
            const page = {
                pageIndex: this.pageIndex + 1,
                pageSize: this.pageSize
            }
            return { data, page }
        },
        toEnd () {
            // 选择的角色 this.selectRole  分配用户 this.selRows
            let { roleCode } = this.selectRole || {}
            const select = [], all = []
            this.selRows.forEach( item => { select.push(item.id) } )
            this.list.forEach( item => { all.push(item.id) } )
            const params = { data: { roleCode, all, select, tenementCode: this.tenementCode } }
            return params
        },
        // 分配数据角色管理权限
        handleSave () {
            const params = this.toEnd()
            api.dataRolePermissions.assginDataRoleManagementRights(params).then( ({code, data, msg}) => {
                if (code === 200) {
                    this.$message.success(msg)
                    this.queryList()
                } else {
                    this.$message.error(msg)
                }
            } )
        }
    }
}
</script>

<style lang="scss" scoped>
.search-form {
    display: flex;
    .col-l {
        display: flex;
        flex: 1;
        .el-form-item {
            width: 220px;
            padding-right: 20px;
        }
    }
    .col-r {
        width: 140px;
    }
}
.basic-list {
    padding-top: 0;
}
</style>


