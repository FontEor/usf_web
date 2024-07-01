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
                                <el-option v-for="(item,ind) in dataType" :label="`${item.typeName}(${item.typeCode})`" :value="item.typeCode" :key="ind"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="OrgName">
                            <el-input v-model="orgName" placeholder="请输入机构名称"></el-input>
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
                        <div style="width: 270px" class="col-r">
                            <el-button type="primary" size="small" @click="query">查询</el-button>
                            <el-button size="small" @click="handleReset">重置</el-button>
<!--                            <el-button size="small" class="el-button&#45;&#45;danger" @click="assignAllDSToUser">一键分配</el-button>-->
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
                :page-index="pageIndex"
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
            pageIndex: 0,
            typeItem: '',
            orgName : '',
            roleNameLike: '',
            dataType: [],
            typeList: [],
            dataExtInfoList: [],
            apiIdList: [],
            pickIdList: [],
            adminList: {},
            selCode: '', // 保存选择的数据类型code
            fields: [
                {key:"dataCode",name:"数据编码"}
                // { key: 'orgCode', name: '机构编码' },
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
                this.adminList = newVal
                // 默认值
                this.giveCheck()
            }
        },
        'state.dataType': {
            deep: true,
            immediate: true,
            handler: function (newVal) {
                this.dataType = newVal
                this.orgName = ''
                // 设置默认选项和查询
                newVal[0] && (this.typeItem = newVal[0].typeCode)
                newVal[0] && this.dtTypeChange(newVal[0].typeCode)
            }
        },
        'visible'(n) {
            if (!n) {
                this.resetPager();
            }
        }
    },
    methods: {
        assignAllDSToUser() {
            let info="确定授权全部数据权限到选定用户？";
            this.$confirm(info, '操作提示').then(() => {
                // 1.准备参数
                let type = this.$parent.storeKey === 'organizations' ? 'orgId' : 'userId';
                const query = {
                    typeId: this.typeId,
                    tenementCode: this.tenementCode,
                    [type]: this.$store.state[this.$parent.storeKey].userId
                };
                const params = {data: query, page: {pageIndex: 1, pageSize: 2147483647}};
                // 2.调用API
                api.users.assignAllDSToUser(params).then(res => {
                    if (res.code === 200) {
                        this.$message({message: res.msg, type: 'success'});
                        this.handleClose();
                        this.$parent.dispatch("queryList")
                    } else {
                        this.$message({message: res.msg, type: 'error'});
                    }
                })
            });
        },
        query () {
            // 分页器回到第一页
            this.pageIndex = 0;
            this.$parent.updateState({ adminPageIndex: 0 })
            this.dtTypeChange(this.selCode, true)
        },
        // 重置 分页
        resetPager() {
            this.pageIndex = 0;
            this.$parent.updateState({ adminPageIndex: this.pageIndex })
        },
        handleReset() {
            this.searchList = {}
            if (this.dataType.length) {
                this.typeItem = this.dataType[0].typeCode
                this.dtTypeChange(this.typeItem)
            }
        },
        handleOk () {

            if (!this.$refs.form) {
                return
            }
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                let params = this.toEnd()
                this.handleSave({ params, type: this.action})
            })
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
            this.fields = [{key:"dataCode",name:"数据编码"}]
            this.typeId = getitem[0].id
            this.$parent.updateState({ entity: {searchList: this.searchList, typeId: getitem[0].id, orgName: this.orgName}})
            this.$parent.dispatch('DataAssignList').then((_data)=> {
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
                this.fields.push({key:"orgCode",name : "Org"})
                this.fields.push({key:"orgName",name : "OrgName"})
            })
        },
        // 关闭和取消按钮
        handleClose (ev) {
            this.winClose (ev)

        },
        handleChange (ev) {
        },
        // 选择触发事件 获取当前行数据
        selectionChange (rows,ind) {
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
                const _table = self.$refs.adminTB && self.$refs.adminTB.$refs.table
                this.adminList && this.adminList.list && this.adminList.list.forEach((item, ind)=> {
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
            this.pageIndex = _ind;
            this.$parent.updateState({ adminPageIndex: _ind })
            // 查询列表
            this.$parent.dispatch('DataAssignList')
        },
        // 切换每页显示条数
        pageSizeChange (_size) {
            // 查询列表
            this.pageSize = _size
            this.pageIndex = 0;
            this.$parent.updateState({ adminPageSize: _size, adminPageIndex: 0 })
            // 查询列表
            this.$parent.dispatch('DataAssignList')
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
        querySearchThink(value, cb, key) {
            let type = this.$parent.storeKey == 'organizations' ? 'orgId' : 'userId'
            const query = { ...this.searchList, typeId: this.typeId, tenementCode: this.tenementCode, [type]:  this.$store.state[this.$parent.storeKey].userId}
            const params = { data: query, page: { pageIndex: 1, pageSize: 10 } }
            if(this.$parent.storeKey == 'organizations'){
                api.organizations.queryBaseDataList(params).then(res => {
                    if (res.code === 200) {
                        const array = Array.from(new Set(res.data.rows.map(item => item[key])))
                        const result = array.map(item => ({value: item}))
                        cb(result)
                    } else {
                        cb()
                    }
                })
            }else{
                 api.users.DataAssignList(params).then(res => {
                     if (res.code === 200) {
                        const array = Array.from(new Set(res.data.rows.map(item => item[key])))
                        const result = array.map(item => ({value: item}))
                        cb(result)
                    } else {
                        cb()
                    }
                 })
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
