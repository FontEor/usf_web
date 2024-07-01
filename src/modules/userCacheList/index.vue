<!--方法调用模块-->
<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :immediate="immediateQuery"
            :update-state="updateState"
            :query-list="queryList"
            :search-height-change="calcHeight"
            :tenement-select-arr="tenementSelectArr"
            :user-system-select-arr="userSystemSelectArr"
            :showResetBtn="false"
            class="moveSearchBtn"
        />
        <exact-list
            :state="state"
            :table-h="tableH1"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            />
    </div>
</template>


<script>
import { mapState ,mapActions} from 'vuex'
import PageList from '@/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
export default {
    name: 'userCacheList',
    mixins: [PageList],
    components: {
        ExactSearch,
        ExactList,
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'userCacheList',
            // 模块名称
            moduleName: '',
            immediateQuery:false,
            tenementSelectArr:[],//租户枚举
            userSystemSelectArr:[],//账户体系枚举
        }
    },
    //computed: {},
    // watch: {
    //     'tenementInfoObj': {
    //         deep: true,
    //         immediate: false,
    //         handler: function (newVal) {
    //            newVal.isLoad && this.dispatch('queryList')
    //         }
    //     }
    // },
    created () {
        this.registStore(store)
    },
   // methods:{},
   // activated () {}
}
</script>
<style>
    .moveSearchBtn .col-r{
        width: auto !important;
    }
</style>

