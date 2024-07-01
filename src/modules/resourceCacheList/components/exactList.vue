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
        :expand-row-keys="state.expandKey"
        :treeProps="{children: 'children', hasChildren: '!!children'}"
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
                { key: 'name', name: '资源名称' },
                { key: 'code', name: '资源编码' },
                { key: 'url', name: '资源url地址' },
                { key: 'level', name: '菜单序号' },
                { key: 'type', name: '类型',
                    render: (h, { index, row, col }) => {
                        if (row.type === 0) {
                            return (
                                <span class='cell-menu-style cell-common'>{ CNST.ENUMS.resourceType[row.type]}</span>
                        )
                        } else if (row.type==1){
                            return (
                                <span class='cell-button-style cell-common'>{ CNST.ENUMS.resourceType[row.type]}</span>
                        )
                        } else {
                            return (
                                <span class='cell-others-style cell-common'>{ CNST.ENUMS.resourceType[row.type]}</span>
                        )
                        }
                    },
                },
                { key: 'seq', name: '序列号' },
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
    .cell-common{
        display: inline-block;
        background-color: red;
        padding: 0 5px;
        border-radius: 4px;
        color: #fff;
    }
    .cell-menu-style{
        background-color: #67C23A
    }
    .cell-button-style{
        background-color: #E6A23C
    }
    .cell-others-style{
        background-color: #909399
    }
    .transition-style{
        transition:all .25s ease
    }
</style>

