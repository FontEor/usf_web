<template>
    <!--:list="state.list"    :loading="state.loading"-->
    <basic-list
        :fields="fields"
        :showIndexCol="false"
        :show-select-col="true"
        :show-action-col="false"
        :total="state.total"
        :list="state.list"
        :loading="state.loading"
        :table-h="tableH"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange"
        select-type="singleMult"
        highlight-current
    >
        <template slot="hd-col--l">
            <el-button type="primary" size="mini" @click="handleAdd" v-if="buttonData('tjsjlx').has">{{buttonData('tjsjlx').name}}</el-button>
            <el-button  size="mini" @click="onView" v-if="buttonData('sjlxxq').has">{{buttonData('sjlxxq').name}}</el-button>
            <el-button  size="mini" @click="onEdit" v-if="buttonData('bjsjlx').has">{{buttonData('bjsjlx').name}}</el-button>
            <el-button type="danger" size="mini" @click="onDetele" >删除</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from '@/mixins/exactList'

export default {
    mixins: [ExactList],
    props:{
        handleView:Function,
    },
    data () {
        return {
            fields: [
                { key: 'typeCode', name: '类型编码' },
                { key: 'typeName', name: '类型名称'},
                { key: 'createTime', name: '创建时间' },
                { key: 'remark', name: '备注' },
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
        onDetele(){
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

        onView(){
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择要查看的数据！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一个数据进行查看！')
                return
            }
            this.handleView({id:rows[0].id},true)
        }
    }
}
</script>

