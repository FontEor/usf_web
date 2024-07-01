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
        <template slot="hd-col--l">
            <!-- 分配菜单角色管理权限 -->
            <el-button type="primary" v-if="buttonData('fpcdjsglqx').has" size="mini" @click="handleAllocate(selRows[0], buttonData('fpcdjsglqx').name)">{{buttonData('fpcdjsglqx').name}}</el-button>
            <!-- 详情 -->
            <el-button type="primary" v-if="buttonData('cdjsglqxxq').has" size="mini" @click="handleView(selRows[0], buttonData('cdjsglqxxq').name)">{{buttonData('cdjsglqxxq').name}}</el-button>
        </template>
    </basic-list>
</template>

<script>

import ExactList from '@/mixins/exactList'
// import PageList from '@/mixins/pageList'
export default {
    mixins: [ ExactList ],
    props: {
        handleAdd: Function,
        handleAllocate: Function,
        handleEdit: Function,
        handleView: Function,
        handleDelete: Function
    },
    data () {
        return {
            selRows: [],
            fields: [
                { key: 'roleName', name: '菜单角色名称' },
                { key: 'roleCode', name: '菜单角色编码' },
                {
                    key: 'createTime',
                    name: '创建时间',
                    render: (h, { row, col }) => <span>{this.format(new Date(row.createTime))}</span>
                },
                { key: 'roleSource', name: '来源' },
                { key: 'remark', name: '备注' },
                { key: 'rootOrgName', name: '所属机构编码' }
            ]
        }
    },
    methods: {
        selectionChange (rows) {
            this.selRows = rows
        },
        format (date) {
            const map = {
                'M': date.getMonth() + 1,
                'd': date.getDate(),
                'h': date.getHours(),
                'm': date.getMinutes(),
                's': date.getSeconds()
            }
            let Y = date.getFullYear()
            for (let key in map) {
                if (map[key] < 10) map[key] = '0'+map[key]
            }
            return `${Y}-${map.M}-${map.d} ${map.h}:${map.m}:${map.s}`
        }
    }
}
</script>

