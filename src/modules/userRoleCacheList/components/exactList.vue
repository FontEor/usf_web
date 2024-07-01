<template>
    <basic-list
        :fields="fields"
        :loading="state.loading"
        :list="state.list"
        :table-h="tableH"
        :show-action-col="false"
        row-key="id"
        :showPage="false"
        :page-size-change="pageSizeChange"
        class="removeTableHead"
    >
    </basic-list>
</template>

<script>
import ExactList from '@/mixins/exactList'
export default {
    mixins: [ExactList],
    data () {
        return {
            pageIndexChangeFlag: false,
            fields: [
                { key: 'userCodeCol', name: '用户' },
                { key: 'roleCodes', name: '角色' },
            ]
        }
    }
}
</script>

<style>
    .removeTableHead .basic-list__hd{
        padding: 0 10px !important;
        height: 28px;
        line-height: 28px;
        border: none;
        border-bottom: none;
        background: #fff;
    }
</style>

