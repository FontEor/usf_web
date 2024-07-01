<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="1100"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk"
        >
        <el-form
            ref="form"
            size="small"
            label-position="right"
            label-width="80px"
            :model="dto"
            :rules="rules"
            :inline="true"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd formFix">
                    <el-row :gutter="0">
                        <el-form-item label="数据类型">
                            <el-select v-model="typeItem" placeholder="数据类型"  @change="dtTypeChange">
                                <el-option v-for="(item,ind) in dataType" :label="item.typeName" :value="item.typeCode" :key="ind"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="item.name" v-for="(item, index) in dataExtInfoList" :key="index">
                            <!-- <el-input v-if="item.type === 'input'" v-model="searchList[item.key]" clearable /> -->
                            <el-autocomplete
                                v-if="item.type === 'input'"
                                v-model.trim="searchList[item.key]"
                                :debounce="500"
                                :fetch-suggestions="(value, cb) => querySearchThink(value, cb, item.key)"
                                :placeholder="'请输入' + item.name"
                                :maxlength="30"
                                clearable >
                            </el-autocomplete>
                            <el-select v-else-if="item.type === 'enums'" v-model="searchList[item.key]" placeholder="请选择" clearable filterable>
                                <el-option
                                    v-for="subItem in item.enums"
                                    :key="subItem.code"
                                    :label="subItem.label"
                                    :value="subItem.value"
                                    />
                            </el-select>
                        </el-form-item>
                        <div class="col-r">
                            <el-button type="primary" size="small" @click="query">查询</el-button>
                            <el-button size="small" @click="handleReset">重置</el-button>
                        </div>
                    </el-row>
                </div>
            </div>
        </el-form>
        <template>
            <basic-list
                :show-select-col="true"
                :show-action-col="false"
                :loading="false"
                ref="adminTB"
                :fields="fields"
                :total="adminList ? adminList.total : 0"
                :list="adminList ? adminList.list : []"
                :selection-change="selectionChange"
                :page-index-change="pageIndexChange"
                :page-size-change="pageSizeChange"
                :page-size="pageSize"
                >
            </basic-list>
        </template>
    </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from '@/mixins/entityDialog'
import ExactList from '@/mixins/exactList'
import { mapState } from 'vuex'
export default {
    mixins: [EntityDialog, ExactList],
    data () {
        return {
            rules: {},
            pageSize: 10,
            typeItem: '',
            roleNameLike: '',
            dataType: [],
            typeList: [],
            selRows: [],
            dataExtInfoList: [],
            apiIdList: [],
            pickIdList: [],
            adminList: {},
            selCode: '', // 保存选择的数据类型code
            fields: [
                // { key: 'tenantName', name: '企业编码' },
                // { key: 'startTime', name: '企业名称' },
                // { key: 'startTime', name: '仓库编码' },
                // { key: 'startTime', name: '仓库名称' },
            ],
            searchList: {

            },
            typeId: null,
            extendFieldEnumMap: {}
        }
    },
    computed: {
        ...mapState('app', ['tenementCode'])
    },
    props: {
        selectItem: {
            type: Object,
            default () {
                return {}
            }
        },
        winClose: {
            type: Function,
            default () {
                return () => {}
            }
        },
        commit: Function
    },
    watch: {
        'state.adminList': {
            deep: true,
            immediate: true,
            handler: function (newVal) {
                this.adminList = newVal || []
                // 默认值
                this.giveCheck()
            }
        },
        'state.dataType': {
            deep: true,
            immediate: true,
            handler: function (newVal) {
                this.dataType = newVal
                // 设置默认选项和查询
                newVal[0] && (this.typeItem = newVal[0].typeCode)
                newVal[0] && this.dtTypeChange(newVal[0].typeCode)
            }
        },
    },
    methods: {
        query () {
            this.dtTypeChange(this.selCode, true)
        },
        handleReset() {
            this.searchList = {}
            if (this.dataType.length) {
                this.typeItem = this.dataType[0].typeCode
                this.dtTypeChange(this.typeItem)
            }
        },
        handleOk () {
            this.$emit('func',this.selRows,this.query.appCode)
            if(this.selRows.length){
                
            }else{
                return this.$message.error('请至少选择一项')
            }
        },
        // 类型选择回调
        dtTypeChange (code, flag) {
            this.selCode = code
            if (!flag) {
                this.searchList = {}
            }
            let getitem = this.dataType.filter((ev)=> {
                return code === ev.typeCode
            })
            this.dataExtInfoList = this.handleSetSearch(getitem[0].dataExtInfoList)
            this.fields = []
            this.typeId = getitem[0].id
            this.$parent.updateState({ entity: {searchList: this.searchList, typeId: getitem[0].id}})
            this.$parent.dispatch('queryDataAuthorityList').then((_data)=> {
                // 判断是否有数据
                this.$parent.adminDialogHasData = _data.length > 0
                this.dataExtInfoList.forEach((ev)=> {
                    const col = _.pick(ev, ['key', 'name'])
                    if (ev.type === 'enums') {
                        col.render = (h, { row }) => {
                            const itemEnum = this.extendFieldEnumMap[col.key].find(item => item.value === row[col.key])
                            const value =  itemEnum ? itemEnum.label : ''
                            return <span>{value}</span>
                        }
                    }
                    this.fields.push(col)
                })
                // 如果没有row数据项的话放一个空项占位
                if(this.dataExtInfoList.length===0) {
                    this.fields.push({
                        key: '-',
                        name: '-',
                    })
                }
            })
        },
        // 关闭和取消按钮
        handleClose (ev) {
            this.winClose (ev)
        },
        // 选择触发事件 获取当前行数据
        selectionChange (rows,ind) {
            this.selRows = rows;
            this.pickIdList.length = 0
            rows.forEach((item)=> {
                this.pickIdList.push(item.id)
            })
            this.$parent.updateState({ pickIdList: this.pickIdList})
        },
        giveCheck() {
            // 设置数据勾选
            const self = this;
            this.$nextTick(()=> {
                this.apiIdList.length = 0
                this.adminList && this.adminList.list && this.adminList.list.forEach((item, ind)=> {
                    const _table = self.$refs.adminTB.$refs.table
                    // 设置状态
                    item && _table.toggleRowSelection(item,item.isOwnData === 1)
                    // 存储id
                    this.apiIdList.push(item.id)
                })
                if(this.apiIdList.length > 0) {
                    this.$parent.updateState({ apiIdList: this.apiIdList})
                }
            })

        },
        // 切换页数
        pageIndexChange (_index) {
            let _ind = _index - 1
            // 更新页面数据
            // this.pageSize = _ind
            this.$parent.updateState({ dataPageIndex: _ind })
            // 查询列表
            this.$parent.dispatch('queryDataAuthorityList')
        },//
        // 切换每页显示条数
        pageSizeChange (_size) {
            // 查询列表
            this.pageSize = _size
           this.$parent.updateState({ dataPageSize: _size})
            // 查询列表
            this.$parent.dispatch('queryDataAuthorityList')
        },
        handleSetSearch(array) {
            array = array || []
            array = array.filter(item => item.isEffective === 1)
            const result = []
            this.extendFieldEnumMap = {}
            array.forEach(item => {
                const row = { key: `ext${item.extNo}`, name: item.extName, value: undefined, type: 'input' }
                if (item.isEnum == 1) {
                    row.type = 'enums'
                    row.enums = jt.fn.generateEnums(item.enumValue, ',')
                    this.extendFieldEnumMap[row.key] = _.cloneDeep(row.enums)
                }
                result.push(row)
            })
            return result
        },
        async querySearchThink(value, cb, key) {
            const query = { ...this.searchList, typeId: this.typeId, tenementCode: this.tenementCode, userId: this.$store.state[this.$parent.storeKey].userId }
            const params = { data: query, page: { pageIndex: 1, pageSize: 10 } }
            const { data, msg, code } = await api.users.DataAssignList(params)
            if (code === 200) {
                data.rows = data.rows || []
                const array = Array.from(new Set(data.rows.map(item => item[key])))
                const result = array.map(item => ({value: item}))
                cb(result)
            } else {
                cb()
            }
        }
    }
}
</script>

<style lang="scss" scope>
    /deep/ .el-form {
        width: 100%;
    }
    .entity-dlg__block-bd.formFix {
        input {
            width: 200px;
        }
        .col-r {
            float: right;
            position: relative;
            padding: 0 12px 0 25px;
            width: 162px;
            .el-button {
                width: 75px;
            }
        }
    }
</style>
