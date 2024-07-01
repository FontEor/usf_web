<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :immediate="immediateQuery"
            :update-state="updateState"
            :query-list="queryList"
            :all-work-type="AllWorkType"
            :all-operate-type="AllOperateType"
            :search-height-change="calcHeight"/>
        <exact-list
            :state="state"
            :table-h="tableH1"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            />
    </div>
</template>


<script>
import { mapState } from 'vuex'
import PageList from '@/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
export default {
    name: 'operationLog',
    mixins: [PageList],
    components: {
        ExactSearch,
        ExactList,
    },
    data () {
        return {
            
            // store唯一标识
            storeKey: 'operationLog',
            // 模块名称
            moduleName: '',
            AllWorkType: [],
            AllOperateType: [],
            immediateQuery:false,
        }
    },
    computed: {
        ...mapState('app', ['tenementInfoObj'])
    },
    // watch: {
    //     'tenementInfoObj': {
    //         deep: true,
    //         immediate: false,
    //         handler: function (newVal) {
    //            newVal.isLoad && this.dispatch('queryList')
    //         }
    //     }
    // },
    beforeCreate () {
        this.allFields = ['id']
        this.disFields = []
    },
    created () {
        this.registStore(store)
        
    },
    mounted () {
        // 查询业务类型
        this.dispatch('queryAllWorkType').then((ev)=>{
            this.AllWorkType = ev
        })
        // 查询操作类型
        this.dispatch('queryAllOperateType').then((ev)=>{
            this.AllOperateType = ev
        })
    },
    activated () {
        this.dispatch('queryList')
    }

}
</script>

