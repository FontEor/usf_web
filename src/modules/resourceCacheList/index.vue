<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :immediate="immediateQuery"
            :update-state="updateState"
            :query-list="queryList"
            :search-height-change="calcHeight"
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
import { mapState } from 'vuex'
import PageList from '@/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
export default {
    name: 'resourceCacheList',
    mixins: [PageList],
    components: {
        ExactSearch,
        ExactList,
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'resourceCacheList',
            immediateQuery:false,
        }
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
    created () {
        this.registStore(store)
    },
    //methods:{},
    }
</script>
<style>
    .moveSearchBtn .col-r{
        width: auto !important;
    }
</style>

