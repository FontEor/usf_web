<template>
    <basic-dialog
        :visible="visible"
        title="配置可申请菜单角色"
        :width="900"
        :show-ft="true"
        :handle-close="() => handleClosed()"
        :handle-ok="onSave">
        <div class="basic-search basic-search--small">
            <div class="basic-search__bd">
                <div class="col-l">
                    <el-form ref="search" size="small" label-width="auto">
                        <el-form-item label="软件系统">
                            <el-select v-model="query.appCode" @change="onAppChange" placeholder="请选择">
                                <el-option
                                    v-for="item in orgList"
                                    :key="item.appCode"
                                    :label="item.appName"
                                    :value="item.appCode">
                                <span>{{ `${item.appName}(${item.appCode})` }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="角色名称">
                            <el-input v-model.trim="query.roleNameLike" placeholder="角色名称" :maxlength="30" clearable/>
                        </el-form-item>
                        <el-form-item label="角色编码">
                            <el-input v-model.trim="query.roleCodeLike"
                                placeholder="角色编码"
                                :maxlength="30"
                                clearable />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="col-r">
                    <el-button type="primary" size="small" @click="getAllowApplyRoleList">查询</el-button>
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
            :loading="loading"
            :list="roleList"
            :total="total"
            :page-index="pages.pageIndex"
            :page-size="pages.pageSize"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :tableH="400"
            :selection-change="selectionChange">
        </basic-list>
    </basic-dialog>
</template>

<script>
import _ from "lodash";
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
        ...mapState('app', ['tenementCode']),
    },
    data () {
        return {
            // 机构列表
            orgList: [],
            // 当前选中角色
            selectRoles: [],
            // 当前列表数据
            roleList: [],
            // 总数据
            total: 0,
            loading: false,
            query: {
                orgId: "",
                appCode: "",
                roleNameLike: "",
                roleCodeLike: ""
            },
            pages: {
                pageIndex: 0,
                pageSize: 20
            },
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
                this.getOrgList()
            }
        }
    },
    methods: {
        ...mapActions('app', ['getAppList']),
        // 初始化查询条件数据
        initQueryPage() {
            this.query = {
                orgId: this.currentRow.id,
                appCode: _.get(this, "orgList[0].appCode", "") || "",
                roleNameLike: "",
                roleCodeLike: ""
            }
            this.pages.pageIndex = 0
            this.pages.pageSize = 20
        },
        // 清理table选择数据
        clearTableSelect(list) {
            const table = this.$refs.rolesList.$refs.table
            table.clearSelection()
            if(list) {
                this.$nextTick(() => {
                    list.forEach(item => {
                        table.toggleRowSelection(item, true)
                    })
                })
            }
        },
        // 获取机构列表
        getOrgList() {
            this.getAppList().then((data) => {
                if (data && data.length) {
                    this.orgList = data;
                    this.initQueryPage();
                    this.getAllowApplyRoleList ()
                }
            })
        },
        // 获取可配置角色列表数据
        getAllowApplyRoleList() {
            this.clearTableSelect();
            api.org.allowApplyRoleList({
                data: {
                    tenementCode: this.tenementCode,
                    ...this.query
                },
                page: this.pages,
            }).then(response => {
                const list =  _.get(response, 'data.rows', []);
                const selects = list.filter((item, index) => item.isOwnRole === 1)                            
                this.total = _.get(response, 'data.rowTotal')
                this.roleList = list
                this.clearTableSelect(selects);    
            })
        },
        // 响应点击index发生改变
        pageIndexChange (index) {
            this.pages.pageIndex = index - 1
            this.getAllowApplyRoleList()
        },
        // 响应分页尺寸发生改变
        pageSizeChange (size) {
            this.pages.pageIndex = 0
            this.pages.pageSize = size
            this.getAllowApplyRoleList();
        },
        // 重置搜索
        searchResetRoles () {
            this.initQueryPage();
            this.getAllowApplyRoleList()
        },
        // 选择角色
        selectionChange (rows = []) {
            this.selectRoles = rows
        },
        // 切换应用
        onAppChange () {
            this.getAllowApplyRoleList()
        },
        // 关闭弹框
        handleClosed (refresh = false) {
            this.pages.pageIndex = 0
            this.pages.pageSize = 10
            this.initQueryPage();
            this.$emit('close', refresh)
        },
        // 保存当前页数据
        onSave() {
            api.org.allowApplyRoleSave({
                data: {
                    orgId: this.currentRow.id,
                    select: this.selectRoles.map(item => item.id),
                    all: this.roleList.map(item => item.id),
                }
            }).then(response => {
                this.$message.success('保存成功');
                this.handleClosed()
            })
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
