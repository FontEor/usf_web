<template>
    <div class="p-basic">
         <exact-search
            :state="state"
            ref="exactSearch"
            :immediate="immediateQuery"
            :update-state="updateState"
            :query-list="queryList"
            :system-type="state.userSystemTypeData"
            :search-height-change="calcHeight"
            :show-reset-btn="this.showResetBtn"/>
        <exact-list
            :state="state"
            :table-h="tableH1"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"/>
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :level-data="state.levelData"
            :system-type="state.userSystemTypeData"
            :update-vis="updateEntityDlgVis"
            :handle-save="handleSave"/>
    </div>
</template>

<script>
    import PageList from '@/mixins/pageList'
    import store from './store'
    import {mapActions,mapState} from 'vuex'
    import ExactSearch from './components/exactSearch'
    import ExactList from './components/exactList'
    import EntityDialog from './components/entityDialog'
    export default {
        name: 'interfaceAuth',
        mixins: [PageList],
        components: {
            ExactSearch,
            ExactList,
            EntityDialog
        },
        data () {
            return {
                // store唯一标识
                storeKey: 'interfaceAuth',
                // 模块名称
                moduleName: '接口授权',
                immediateQuery: true,
                showResetBtn: false,
            }
        },
        created () {
            this.registStore(store)
        },
        mounted () {
            this.dispatch('queryUserSystemTypeData')
            this.dispatch('querySafetyLevelData')
        },
        methods: {
            handleSave ({ params, type }) {
                const done = () => {
                    this.updateEntityDlgVis(false)
                    this.queryList()
                }
                if (type === 'add') {
                    // params = Object.assign({}, params, {'tenementCode': this.$store.state.app.tenementCode})
                    this.dispatch('createEntity', { params, done })
                    this.updateState('entity')
                } else {
                    params = _.pick(params, 'appCode', 'id', 'userCode', 'interfaceName',  'methodName', 'safeGrade', 'tenementCode', 'userSystemType')
                    // 更新
                    this.dispatch('updateEntity', { params, done })
                }
            },
        },
        computed: {
            // ...mapState('app', ['tenementInfoObj'])
        }
    }
</script>
