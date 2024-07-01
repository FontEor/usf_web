<template>
    <basic-list
        :fields="fields"
        select-type="singleMult"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :table-h="tableH"
        :showActionCol='false'
        :showSelectCol='true'
        :showIndexCol='false'
        :showPage='false'
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :selection-change="selectionChange"
        :page-size-change="pageSizeChange">
        <template slot="hd-col--l">
            <el-button type="primary" size="mini" @click="proxyActions({ action: 'onAdd', rows: selRows })"  v-if="buttonData('tjcdjs').has">{{buttonData('tjcdjs').name}}</el-button>
            <el-button type="primary" size="mini" @click="proxyActions({ action: 'distribute', rows: selRows })" v-if="buttonData('cdjefpcdjs').has">{{buttonData('cdjefpcdjs').name}}</el-button>
            <el-button  size="mini" @click="proxyActions({ action: 'edit', rows: selRows })" v-if="buttonData('bjcdjs').has">{{buttonData('bjcdjs').name}}</el-button>
            <el-button  size="mini" @click="proxyActions({ action: 'view', rows: selRows })" v-if="buttonData('cdjsxq').has">{{buttonData('cdjsxq').name}}</el-button>
            <el-button type="danger" size="mini" @click="proxyActions({ action: 'delet', rows: selRows })" v-if="buttonData('sccdjs').has">{{buttonData('sccdjs').name}}</el-button>

        </template>
    </basic-list>
</template>

<script>
import ExactList from '@/mixins/exactList'

export default {
    mixins: [ExactList],
    props: {
        proxyActions: Function,
    },
    data () {
        return {
            fields: [
                { key: 'roleName', name: '菜单角色名称' },
                { key: 'roleCode', name: '菜单角色编码'},
                { key: 'createUser', name: '创建人'},
                { key: 'createTime', name: '创建时间' ,width:200 },
                { key: 'roleSource', name: '来源' },
                { key: 'remark', name: '备注' }
            ],

        }
    }
}
</script>

