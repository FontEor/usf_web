<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="dlgWidth"
        :show-ft="false"
        :close-text="closeText"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed">
        <div class="basic-search basic-search--small">
            <div class="basic-search__bd">
                <div class="col-l">
                    <el-form size="small" label-width="auto">
                        <el-form-item label="账号">
                            <el-input v-model.trim="state.userEntity.searchUserName" placeholder="请输入账号/别名/名称" :maxlength="30" clearable/>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="col-r">
                    <el-button type="primary" size="small" @click="queryListUserProxy">查询</el-button>
                    <el-button size="small" @click="searchResetUsers">重置</el-button>
                </div>
            </div>
        </div>
        <basic-list
            :lazy="true"
            :show-action-col="false"
            :fields="fields"
            :loading="state.userEntity.loading"
            :list="state.userEntity.list"
            :total="state.userEntity.total"
            :page-index="state.userEntity.pageIndex"
            :page-size="state.userEntity.pageSize"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange">
        </basic-list>
    </basic-dialog>
</template>

<script>
import EntityDialog from './mixins/entityDialog'
import BasicList from '@/components/basicList'
export default {
    components: {
        BasicList
    },
    mixins: [EntityDialog],
    props: {
        closeText: {
            type: String,
            default: '关闭'
        },
        state: {
            type: Object,
             default () {
                return {}
            }
        },
        queryListUser: {
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
    data () {
        return {
            fields: [
                { key: 'userCode', name: '账号' },
                { key: 'userAlias', name: '别名' },
                { key: 'userName', name: '名称' },
                { key: 'userSource', name: '来源', width: 160 }
            ]
        }
    },
    watch: {
        visible() {
            if (this.visible) {
                this.queryListUserProxy()
            }
        }
    },
    methods: {
        // 响应点击index发生改变
        pageIndexChange (index) {
            this.state.userEntity.pageIndex = index - 1
            this.updateUserState()
            this.queryListUserProxy()
        },
        // 响应分页尺寸发生改变
        pageSizeChange (size) {
            this.state.userEntity.pageIndex = 0
            this.state.userEntity.pageSize = size
            this.updateUserState()
            this.queryListUserProxy()
        },
        // 搜索代理
        queryListUserProxy () {
            const { id } = this.currentRow
            this.state.userEntity.orgId = id
            this.updateUserState()
            const { orgId, searchUserName, pageIndex, pageSize } = this.state.userEntity
            const data = { orgId, searchUserName }
            const page = { pageIndex: pageIndex + 1, pageSize }
            this.queryListUser({ data, page })
        },
        // 重置搜索
        searchResetUsers () {
            this.state.userEntity.pageIndex = 0
            this.state.userEntity.pageSize = 10
            this.state.userEntity.searchUserName = ''
            this.updateUserState()
            const { orgId, searchUserName, pageIndex, pageSize } = this.state.userEntity
            const data = { orgId, searchUserName }
            const page = { pageIndex: pageIndex + 1, pageSize }
            this.queryListUser({ data, page })
        },
        // 更新state userEntity
        updateUserState () {
            const userEntity = { ...this.state.userEntity }
            this.updateState({ userEntity })
        },
        handleClosed () {
            this.state.userEntity.pageIndex = 0
            this.state.userEntity.pageSize = 10
            this.state.userEntity.searchUserName = ''
            this.updateUserState()
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
    /deep/ .el-form-item__label {
        font-weight: 500;
    }
}
</style>
