<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :state="state"/>
        <exact-list
            ref="exactList"
            :state="state"
            :table-h="tableH1"/>
    </div>
</template>

<script>
import PageList from '@/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
export default {
    name: 'dataPermissions',
    mixins: [PageList],
    components: {
        ExactSearch,
        ExactList
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'dataPermissions',
            // 模块名称
            moduleName: '我的数据资源'
        }
    },
    activated () {
        this.queryListDataType()
    },
    created () {
        this.registStore(store)
    },
    methods: {
        queryListDataType (payload) {
            return this.dispatch('queryListDataType', payload)
        },
        changeType (payload) {
            return this.dispatch('changeType', payload)
        }
    }
}
</script>

