<template>
    <!-- :selectType="'single'"-->
    <basic-list
        :showIndexCol="false"
        :show-select-col="true"
        :show-action-col="false"
        :table-h="tableH"
        :fields="fields"
        select-type="singleMult"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange"
        highlight-current
    >
        <template slot="hd-col--l">
            <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
            <el-button size="mini" @click="onDelete" type="danger">删除</el-button>
        </template>
    </basic-list>
</template>

<script>
    import ExactList from '@/mixins/exactList'

    export default {
        mixins: [ExactList],
        props:{
            handleDelete:Function,
        },
        data () {
            return {
                fields: [
                    { key: 'adminName', name: '姓名' },
                    { key: 'adminCode', name: '用户账号' },
                    { key: 'createTime', name: '创建时间' },
                    //{ key: 'updateTime', name: '更新时间' },
                  //  { key: 'createUser', name: '创建人' },
                    { key: 'remark', name: '备注' },
                ],
            }
        },
        methods:{
            onDelete() {
                const rows = this.selRows
                if (!rows.length) {
                    this.$message.error('请选择需要删除的数据！')
                    return
                }
                if (rows.length > 1) {
                    this.$message.error('只能选择一个数据进行删除！')
                    return
                }
                this.handleDelete(rows[0])
            },

        }
    }
</script>

