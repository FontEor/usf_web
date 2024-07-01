<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="dlgWidth"
        :show-ft="true"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <div class="basic-search basic-search--small">
            <div class="basic-search__bd">
                <div class="col-l">
                    <el-form size="small" label-width="auto">
                        <el-form-item label="软件系统">
                            <el-select v-model="state.rolesEntity.appCode" @change="onAppChange" placeholder="请选择">
                                <el-option
                                    v-for="item in state.rolesEntity.appList"
                                    :key="item.appCode"
                                    :label="item.appName"
                                    :value="item.appCode">
                                <span>{{ `${item.appName}(${item.appCode})` }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="角色名称">
                            <el-input v-model.trim="state.rolesEntity.roleNameLike" placeholder="角色名称" :maxlength="30" clearable/>
                        </el-form-item>
                        <el-form-item label="角色编码">
                            <el-input v-model.trim="state.rolesEntity.roleCodeLike"
                                placeholder="角色编码"
                                :maxlength="30"
                                clearable />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="col-r">
                    <el-button type="primary" size="small" @click="queryListRolesProxy">查询</el-button>
                    <el-button size="small" @click="searchResetRoles">重置</el-button>
                </div>
            </div>
        </div>
        <basic-list
            ref="rolesList"
            :lazy="true"
            :show-action-col="false"
            :show-select-col="true"
            :fields="fields"
            :loading="state.rolesEntity.loading"
            :list="state.rolesEntity.list"
            :total="state.rolesEntity.total"
            :page-index="state.rolesEntity.pageIndex"
            :page-size="state.rolesEntity.pageSize"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :selection-change="selectionChange">
        </basic-list>
    </basic-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import EntityDialog from './mixins/entityDialog'
import BasicList from '@/components/basicList'
import { setTimeout } from 'timers';
export default {
    components: {
        BasicList
    },
    mixins: [EntityDialog],
    props: {
        state: {
            type: Object,
             default () {
                return {}
            }
        },
        updateRoles: {
            type: Function,
            default: () => {}
        },
        queryListRoles: {
            type: Function,
            default: () => {}
        },
        currentRow: {
            type: Object,
             default () {
                return {}
            }
        }
    },
    computed: {
        ...mapState('app', ['appList', 'tenementCode']),
    },
    data () {
        return {
            fields: [
                { key: 'roleName', name: '角色名称' },
                { key: 'roleCode', name: '角色编码' },
                { key: 'sensitiveMark',name: '是否敏感',render: (h, { row }) => {
                        const status = { 0: '否', 1: '是' }
                        const value = status[row.sensitiveMark]
                        return <span>{value}</span>
                    }
                },
                { key: 'appName', name: '所属软件系统' },
                { key: 'roleSource', name: '来源' },
                { key: 'rootOrgName', name: '所属机构名称' },
            ]
        }
    },
    watch: {
        visible() {
            if (this.visible) {
                this.state.rolesEntity.list = []
                this.openDialog()
            }
        }
    },
    methods: {
        ...mapActions('app', ['getAppList']),
        getAppListOneAndSearch () {
            const appList = this.state.rolesEntity.appList
            if (!appList || (appList && !appList.length)) {
                this.state.rolesEntity.appList = this.appList || []
            }
            if (this.appList && this.appList[0]) {
                this.state.rolesEntity.appCode = this.appList[0].appCode
            }
            this.updateRolesState()
            this.queryListRolesProxy()
        },
        openDialog() {
            if (this.appList && !this.appList.length) {
                this.getAppList().then((data) => {
                    if (data && data.length) {
                        this.getAppListOneAndSearch ()
                    }
                })
            } else {
                this.getAppListOneAndSearch ()
            }
        },
        // 响应点击index发生改变
        pageIndexChange (index) {
            this.state.rolesEntity.pageIndex = index - 1
            this.updateRolesState()
            this.queryListRolesProxy()
        },
        // 响应分页尺寸发生改变
        pageSizeChange (size) {
            this.state.rolesEntity.pageIndex = 0
            this.state.rolesEntity.pageSize = size
            this.updateRolesState()
            this.queryListRolesProxy()
        },
        // 菜单角色通用的search
        queryListSearch () {
            const { orgId, appCode, roleNameLike, roleCodeLike, pageIndex, pageSize } = this.state.rolesEntity
            const data = { orgId, appCode, roleNameLike, roleCodeLike, tenementCode: this.tenementCode }
            const page = { pageIndex: pageIndex + 1, pageSize }
            const done = (checkedRows = []) => {
                const cloneRows = [...checkedRows]
                if (cloneRows.length) {
                    this.$nextTick(() => {
                        const table = this.$refs.rolesList.$refs.table
                        table.clearSelection()
                        setTimeout(() => {
                            cloneRows.forEach(item => {
                                table.toggleRowSelection(item, true)
                            });
                        })
                    })
                }
            }
            this.queryListRoles({ data, page, done })
        },
        // 搜索代理
        queryListRolesProxy () {
            const { id, orgCode } = this.currentRow
            this.state.rolesEntity.orgId = id
            this.state.rolesEntity.orgCode = orgCode // 后端统一之前的方案
            this.updateRolesState()
            this.queryListSearch()
        },
        // 重置搜索
        searchResetRoles () {
            this.state.rolesEntity.pageIndex = 0
            this.state.rolesEntity.pageSize = 10
            // this.state.rolesEntity.appCode = null
            this.state.rolesEntity.roleNameLike = null
            this.state.rolesEntity.roleCodeLike = null
            this.updateRolesState()
            this.queryListSearch()
        },
        // 机构菜单角色列表选择框切换事件
        selectionChange (rows) {
            this.state.rolesEntity.menuRoleIdList = tools.getJSONKeys(rows, 'id')
        },
        // applist change事件
        onAppChange (appCode) {
            this.queryListRolesProxy()
        },
        // 更新state rolesEntity
        updateRolesState () {
            const rolesEntity = { ...this.state.rolesEntity }
            this.updateState({ rolesEntity })
        },
        handleClosed () {
            this.state.rolesEntity.pageIndex = 0
            this.state.rolesEntity.pageSize = 10
            this.state.rolesEntity.appCode = null
            this.state.rolesEntity.roleNameLike = null
            this.state.rolesEntity.roleCodeLike = null
            this.updateRolesState()
        }
    }
}
</script>
<style lang="scss" scoped>
.basic-search {
    padding: 10px 0 0;
    .basic-search__bd {
        display: flex;
        .col-l {
            flex: 1;
            .el-form {
                display: flex;
                flex-wrap: wrap;
            }
            /deep/ .el-form-item {
                padding-right: 15px;
                box-sizing: border-box;
            }
        }
        .col-r {
            position: relative;
            padding: 0 0 0 25px;
            width: 162px;
            .el-button {
                width: 75px;
            }
        }
    }
}
.basic-search--small {
    /deep/ .el-form-item {
        width: 50%;
    }
    /deep/ .el-form-item__label {
        font-weight: 500;
    }
}
</style>
