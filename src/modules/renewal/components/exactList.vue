<template>
    <basic-list
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :show-select-col="true"
        :select-type="'singleMult'"
        :show-index-col="false"
        :show-action-col="false"
        :table-h="tableH"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange">
    </basic-list>
</template>

<script>
import moment from 'moment';
import ExactList from '@/mixins/exactList'
export default {
    mixins: [ ExactList ],
    data () {
        return {
            selRows: [],
            fields: [
                { key: 'tenementCode', name: '租户' },
                { key: 'appCode', name: '应用' },
                { key: 'roleName', name: '菜单角色名称' },
                { key: 'roleCode', name: '菜单角色编码' },
                {
                    key: 'renewalType',
                    name: '审批状态',
                    render: (h, { row, col }) => <span>{ row.renewalType === 1 ? '不可申请（审批中）' : '可申请' }</span>
                },
                {
                    key: 'expireTime',
                    name: '到期时间',
                    render: (h, { row, col }) => <span>{
                        moment(row.expireTime).format('YYYY-MM-DD HH:mm:ss')
                    }</span>
                },
            ]
        }
    },
    methods: {
        selectionChange (rows) {
            this.selRows = rows
        },
    }
}
</script>

