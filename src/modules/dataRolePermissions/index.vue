<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :immediate="immediateQuery"
            :tenementCode="tenementCode"
            :update-state="updateState"
            :query-list="queryList"
            :search-height-change="calcHeight"/>
        <exact-list
            :state="state"
            :table-h="tableH1"
            :handle-add="handleAdd"
            :handle-allocate="handleAllocate"
            :handle-view="handleView"
            />
        <entity-dialog
            :title="entityDlgTitle"
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :handle-save="handleSave"
            :tenementCode="tenementCode"            
            />
        <allocate-dialog
            :title="allocateBtnName"
            :module-name="moduleName"
            :visible="entityDlgVis2"
            :tenementCode="tenementCode"
            :select-role="selectRole"
            :update-vis="updateEntityDlgVis2"
            />
    </div>
</template>

<script>
import PageList from '@/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import AllocateDialog from './components/allocateDialog'
import { mapState } from 'vuex'

export default {
    name: 'dataRolePermissions',
    mixins: [PageList],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        AllocateDialog
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'dataRolePermissions',
            // 模块名称
            moduleName: '数据角色管理权限',
            entityDlgVis2: false,
            selectRole: undefined,
            immediateQuery: false,
            allocateBtnName: undefined,
            entityDlgTitle: undefined
        }
    },
    created () {
        this.registStore(store)
    },
    methods: {
        // 分配菜单角色按钮事件
        handleAllocate(val, btnName){
            if(!val){
                this.$message.error("请选择角色")
                return
            }
            this.entityDlgVis2 = true
            this.selectRole = val
            this.allocateBtnName = btnName
        },
        updateEntityDlgVis2(bool){
            this.entityDlgVis2 = bool
        },
        handleView (params, btnName, flag) {
            if (_.isEmpty(params)) {
                this.$message.error('请选择角色')
                return
            }
            this.entityDlgActn = 'view'
            this.entityDlgVis = true
            this.entityDlgTitle = btnName
            if (flag) {
                this.dispatch('queryEntity', { params })
            } else {
                this.updateState({ entity: params })
            }
        }
    },
    computed: {
        ...mapState('app', {
            tenementCode: state => state.tenementCode
        })
    },
}
</script>

