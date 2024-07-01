<template>
    <basic-dialog
        class="goods-sel-dlg"
        :title="title"
        width="80%"
        :visible="visible"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk"
        close-text="关闭">
        <el-form class="search-form" size="small" label-width="80px" :model="query">
            <div class="col-l">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名">
                            <el-input v-model.trim="query.userName" :maxlength="30" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户账号">
                            <el-input v-model.trim="query.userCode" :maxlength="30" clearable/>
                        </el-form-item>
                    </el-col>
                     <el-col :span="8">
                        <el-form-item label="账号别名">
                            <el-input v-model.trim="query.userAlias" :maxlength="30" clearable/>
                        </el-form-item>
                    </el-col>
                </el-row>
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
            :selection-change="selectionChange"/>
    </basic-dialog>
</template>

<script>
import BasicDialog from '@/components/basicDialog'
import BasicList from '@/components/basicList'
import { mapActions } from 'vuex'
import { log } from 'util'

const DEFAULTS = {
    query: {
        userName: undefined,
        userCode: undefined,
        userAlias: undefined,
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
        title: {
            type: String,
            default: ""
        },
        tenementCode: [ String, Number ]
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
            ],
        }
    },
    watch: {
        visible (newVal) {
            if (newVal) {
                this.query = { ...DEFAULTS.query }
                this.pageIndex = 0
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
            const params = this.toEnd()
            this.handleSave(params)
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
            const query = _.cloneDeep(this.query)
            query.dataRoleId = this.selectRole.id
            jt.object.removeEmptyAttr(query)
            api.dataRole.queryUserList({
                data: { ...query, tenementCode: this.$store.state.app.tenementInfoObj.tenementCode },
                page: {
                    pageIndex: this.pageIndex + 1,
                    pageSize: this.pageSize
                }
            }).then( ({code, data}) => {
                if (code === 200) {
                    this.list = data.rows || []
                    this.total = data.rowTotal || 0
                    this.$nextTick(() => {
                        let arr = this.list.filter( item => item.tenementId )
                        arr.forEach( item => {
                            this.$refs.basicList.$refs.table.toggleRowSelection(item, true)
                        } )
                    })
                }
                // this.$refs.basicList.resetData('radioIndex')
            } )
        },
        toEnd () {
            // 选择的角色 this.selectRole  分配用户 this.selRows
            let { id } = this.selectRole || {}
            const userIds = []
            this.selRows.forEach( item => { userIds.push(item.id) } )
            const allUserIds = []
            this.list.forEach( item => { allUserIds.push(item.id) } )
            const params = { id, userIds, allUserIds, tenementCode: this.tenementCode }
            return params
        },
        // 分配数据角色
        handleSave () {
            const params = this.toEnd()
            api.dataRole.assignUserForDataRoles(params).then( ({ code, msg }) => {
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
        flex: 1;
        display: flex;
        .el-row {
            flex: 1;
            display: flex;
            flex-wrap:wrap;
            margin-right: 20px;
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


