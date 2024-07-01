<template>
    <div>
        <basic-list
            :show-select-col="false"
            :show-action-col="false"
            :show-index-col="true"
            :show-col-set="false"
            :fields="listFields"
            :loading="state.loading"
            :total="state.total"
            :list="state.list"
            :table-h="tableH"
            :page-index="state.pageIndex"
            :page-size="state.pageSize"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :selection-change="selectionChange">
        </basic-list>
    </div>
</template>

<script>
import ExactList from '@/mixins/exactList'
// 默认字段
const DEFAULTFIELDS = [
    {
        key: 'ext1',
        name: '暂无字段',
        hidden: true
    }
]
const CREATETIME = [
    {
        key: 'createTime',
        name: '创建时间',
        formatter: function (row, column, cellValue, index) {
            return jt.date.format(new Date(cellValue).getTime())
        }
    },
    {
        key: 'dataCode',
        name: '数据资源编码'
    }
]
export default {
    mixins: [ExactList],
    data () {
        return {
            currentRow: {},
            DEFAULTFIELDS: DEFAULTFIELDS
        }
    },
    computed: {
        listFields () {
            const currentFiles = this.state.currentFiles.length ? [..._.cloneDeep(this.state.currentFiles), ...CREATETIME] : this.DEFAULTFIELDS
            return currentFiles
        }
    },
    methods: {
        message (msg = '请先选择数据') {
            this.$message.error(msg)
        },
        selectionChange (rows) {
            this.selRows = rows
            this.currentRow = rows.length ? rows[0] : {}
            this.handleSelectionChange && this.handleSelectionChange(rows)
        }
    }
}
</script>

