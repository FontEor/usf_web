<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :immediate="immediateQuery"
            :update-state="updateState"
            :query-list="queryList"
            :query="state.query"
            :search-height-change="calcHeight"/>
        <exact-list
            :state="state"
            :table-h="tableH1"
            :query-list="queryList"
            :handle-add="handleAdd"
            :handleDelete="handleDelete"
        />
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :handle-save="handleSave"/>
    </div>
</template>

<script>
    import PageList from '@/mixins/pageList'
    import store from './store'
    import {mapActions} from 'vuex'
    import ExactSearch from './components/exactSearch'
    import ExactList from './components/exactList'
    import EntityDialog from './components/entityDialog'

    export default {
        name: 'usfAdmin',
        mixins: [PageList],
        components: {
            ExactSearch,
            ExactList,
            EntityDialog
        },
        data() {
            return {
                // store唯一标识
                storeKey: 'usfAdmin',
                // 模块名称
                moduleName: 'USF平台管理员'
            }
        },
        created() {
            this.registStore(store)
        },
        methods: {
            ...mapActions('usfAdmin', [
                'delete'
            ]),
            // 删除按钮响应事件
            handleDelete(params, msg) {
                msg = msg || `确定删除选中的${this.moduleName}吗`
                let delParma = params.adminCode
                let data = {
                    adminCode: delParma
                }
                let _this=this
                this.$confirm(msg, '操作提示').then(() => {
                    _this.delete({
                        params: data,
                        done:()=>{
                            this.queryList()
                        }
                    })
                }).catch((err) => {
                    console.log(err)
                })
            },
        },

    }
</script>

