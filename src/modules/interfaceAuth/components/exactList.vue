<template>
    <!-- :list="state.list"  :loading="state.loading"-->
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
            <el-button  size="mini" @click="onEdit">编辑</el-button>
            <el-button  size="mini" type="danger" @click="onDel">删除</el-button>
        </template>
    </basic-list>
</template>

<script>
    import ExactList from '@/mixins/exactList'
    export default {
        mixins: [ExactList],
        props: {

        },
        data () {
            return {
                fields: [
                    { key: 'userCode', name: '用户编号' },
                    { key: 'interfaceName', name: '接口名' },
                    { key: 'methodName', name: '方法名' },
                    { key: 'createUser', name: '创建人' },
                    { key: 'createTime', name: '创建时间' },
                ],
            }
        },
        methods:{
            onEdit () {
                const rows = this.selRows
                if (!rows.length) {
                    this.$message.error('请选择需要编辑的数据！')
                    return
                }
                if (rows.length > 1) {
                    this.$message.error('只能选择一个数据进行编辑！')
                    return
                }
               this.handleEdit({id:rows[0].id},true)
            },
            onDel () {
                const rows = this.selRows
                if (!rows.length) {
                    this.$message.error('请选择需要删除的数据！')
                    return
                }
                if (rows.length > 1) {
                    this.$message.error('只能选择一个数据进行删除！')
                    return
                }
               this.handleDelete({id:rows[0].id})
            }
        }
    }
</script>

