<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :immediate="immediateQuery"
            :update-state="updateState"
            :query-list="queryList"
            :on-view-change="onViewChange"
            :show-query-btn="this.showQueryBtn"
            :show-reset-btn="this.showResetBtn"
            :search-height-change="calcHeight"/>
        <exact-list
            :state="state"
            :table-h="tableH1"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-uers="handleViewUsers"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :handle-org="handleOrgChange"
            :handle-selection-change="handleSelectionChange"
            :check-single-row="checkSingleRow"
            :org-types="ORGTYPES"/>
    </div>
</template>

<script>
import store from './store'
import PageList from './components/mixins/pageList'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'

export default {
    name: 'menuPermissions',
    mixins: [PageList],
    components: {
        ExactSearch,
        ExactList
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'menuPermissions',
            // 模块名称
            moduleName: '机构',
            // 是否打开页面初始化列表
            immediateQuery: false,
            // 是否显示查询
            showQueryBtn: false,
            // 是否显示重置
            showResetBtn: false,
        }
    },
    created () {
        this.registStore(store)
    },
    methods: {
    }
}
</script>

