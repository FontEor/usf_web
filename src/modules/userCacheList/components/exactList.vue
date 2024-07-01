<template>
    <basic-list
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :table-h="tableH"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :show-action-col="false"
        :selection-change="selectionChange"
        row-key="id"
        :page-size-change="pageSizeChange"
        :showPage="false"
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
                {
                    key: 'userType',
                    name: '类型',
                    formatter: function (row, column, cellValue, index) {
                        return _params.users.userType[cellValue]
                    }
                },
                { key: 'userAlias', name: '账号别名' },
                { key: 'userName', name: '用户名字' },
                {
                    key: 'createTime',
                    name: '创建时间',
                    formatter: function (row, column, cellValue, index) {
                        return jt.date.format(new Date(cellValue).getTime())
                    }
                },
                { key: 'orgCodeList', name: '所属机构' },
                { key: 'userSource', name: '用户来源' },
                { key: 'remark', name: '备注' },
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
