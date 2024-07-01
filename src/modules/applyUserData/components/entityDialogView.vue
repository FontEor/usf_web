<template>
    <basic-dialog
        class="goods-sel-dlg"
        :title="title"
        width="80%"
        :visible="visible"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk"
        :isShowFooterAll="true"
        :showFt="action !== 'view'"
        :okText="okText"
        :closeText="closeText">
        <el-form ref="form1" class="search-form" size="small" label-width="100px" :model="dto" :rules="rules">
            <div class="col-l">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="dto.roleName" clearable :disabled="action === 'view'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="角色编码" prop="roleCode">
                            <el-input v-model="dto.roleCode" placeholder="英文或数字或下划线" clearable :disabled="action !== 'add'" />
                        </el-form-item>
                    </el-col>
                     <el-col :span="8">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="dto.remark" clearable :disabled="action === 'view'" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="col-r"></div>
        </el-form>
        <el-form class="search-form" size="small" label-width="100px" :model="query">
            <div class="col-l">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="数据类型">
                            <el-select v-model="query.type" clearable value-key="id" @change="onChangeDataType">
                                <el-option v-for="item in types" :key="item.id" :value="item" :label="item.typeName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8"  v-for="item in activeFields" :key="item.id">
                        <el-form-item :label="item.extName" >
                            <el-input v-model.trim="query['ext'+item.extNo]" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="col-r">
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
            </div>
        </el-form>
        <basic-list
            ref="basicList"
            select-type="multiple"
            :tableH="500"
            :show-select-col="list.length !== 0"
            :show-action-col="false"
            :show-index-col="false"
            :fields="fields"
            :setClmnsFlg="false"
            :list="list"
            :loading="loading"
            :total="total"
            :page-index="pageIndex"
            :page-size="pageSize"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :selection-change="selectionChange"
            :useRowClick="action !== 'view'"
            :is-tab-disabel="action === 'view'"
            />
    </basic-dialog>
</template>

<script>
import BasicDialog from '@/components/basicDialog'
import BasicList from '@/components/basicList'

const DEFAULTS = {
    loading: false,
    total: 0,
    query: { type: undefined },
    pageIndex: 0,
    pageSize: 10,
    list: [],
    selRows: [],
    types: [],
    activeFields: [],
    rules: {
        roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { pattern: CNST.REG_EXP.NORMAL, message: '角色名称不可输入特殊字符' },
            { max: 30, message: "角色名称长度不能超过30个字符" },
        ],
        roleCode: [
            { required: true, message: '请输入角色编码', trigger: 'blur' },
            { pattern: CNST.REG_EXP.NORMAL, message: '角色编码不可输入特殊字符' },
            { max: 50, message: "角色编码长度不能超过50个字符" },
        ],
        remark: [
            { max: 120, message: "备注长度不能超过120个字符" },
        ]
    }
}

export default {
    components: {
        BasicDialog,
        BasicList
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        updateVis: {
            type: Function,
            default: () => {}
        },
        handleSave: {
            type: Function,
            default: () => {}
        },
        action: {
            type: String,
            default: undefined
        },
        entity: {
            type: Object,
        },
        tenementCode: {
            type: [ Number, String, undefined ],
            default: undefined
        },
        title: {
            type: String,
            default: ""
        }
    },
    beforeCreate () {
        this.dtoFields = [ 'roleName', 'roleCode', 'remark' ]
    },
    created () {
        this.queryTypeList()
    },
    activated () {
        this.queryTypeList()
    },
    data () {
        return {
            ..._.cloneDeep(DEFAULTS),
            dto: this.getDefaultDto(),
            // 展示字段
            fields: this.getActiveFields()
        }
    },
    watch: {
        visible (newVal) {
            if (newVal) {
                this.query = { ...DEFAULTS.query }
                this.pageIndex = 0
                this.dto = _.pick(this.entity, ['roleName', 'roleCode', 'id', 'remark' ])
                this.queryList()
            }
        },
        action (newVal) {
            if (newVal === 'add') {
                this.dto = this.getDefaultDto()
            }
        }
    },
    methods: {
        handleClose () {
          this.$emit('funcl')
        },
        handleClosed () {
            // debugger
            const defaults = _.cloneDeep(_.get(DEFAULTS, ['selRows', 'query']))
            for (let key in defaults) {
                this[key] = defaults[key]
            }
            this.$refs.basicList.resetData()
            this.activeFields.length = 0
            this.list = []
            this.fields = this.getActiveFields()
        },
        handleOk () {
            this.$refs.form1.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    const params = this.toEnd()
                    this.handleSave({ params, type: this.action })
                    // this.updateVis(false)
                }
            });
        },
        pageIndexChange (index) {
            this.pageIndex = index - 1
            this.queryList()
        },
        pageSizeChange (size) {
            this.pageIndex = 0
            this.pageSize = size
            this.queryList()
        },
        selectionChange (rows) {
            this.selRows = rows
        },
        handleSearch () {
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        handleReset () {
            this.query = _.cloneDeep(DEFAULTS.query)
            this.pageIndex = DEFAULTS.pageIndex
            this.activeFields.length = 0
            this.fields = this.getActiveFields()
            this.queryList()
        },
        queryList () {
            this.list.length = 0
            let { id } = this.query.type || {}
            if (!id) return
            const data = { typeId: id, tenementCode: this.tenementCode, dataRoleId: this.entity.id, ..._.omit(this.query, [ 'type' ]) }
            jt.object.removeEmptyAttr(data)
            const params = { data, page: { pageIndex: this.pageIndex + 1, pageSize: this.pageSize } }
            // jt.object.removeEmptyAttr(query)
            // this.$refs.basicList.$refs.table.clearSelection(this.list)
            api.dataRole.queryDataResourceList(params).then( ({ code, data }) => {
                if (code === 200) {
                    this.list =  data.rows || []
                    this.total = data.rowTotal || 0
                    // 设置默认选中状态
                    this.$nextTick(() => {
                        let arr = this.list.filter( item => item.tenementId )
                        arr.forEach( item => { this.$refs.basicList.$refs.table.toggleRowSelection(item, true) } )
                    })
                }
            } )
        },
        toEnd () {
            // 角色信息 this.dto 所选用户 this.selRows
            const dataResourceIds = []
            this.selRows.forEach( item => { dataResourceIds.push(item.id) } )
            const allDataResourceIds = []
            this.list.forEach( item => { allDataResourceIds.push(item.id) } )
            const paramsFix = {
                tenementCode: this.$store.state.app.tenementInfoObj.tenementCode,
                allDataResourceIds, // 当前页的数据资源id列表
                // 选中的数据资源id列表
                dataResourceIds

            }
            jt.object.removeEmptyAttr(paramsFix)
            const params = { ...this.dto, ...paramsFix }
            if (this.action === 'add') {
                delete params.id
            }
            return params
        },
        getDefaultDto () {
            const dto = {}
            this.dtoFields.forEach( item => { dto[item] = undefined } )
            return dto
        },
        // 数据类型枚举
        queryTypeList () {
            const params = {
                data: { tenementCode: this.tenementCode },
                page: { pageIndex: 1, pageSize: 1000 }
            }
            api.dataRole.queryTypeList(params).then( ({code, data}) => {
                if (code === 200) {
                    this.types = data.rows || []
                }
            } )
        },
        //  数据类型联动
        onChangeDataType (dataType) {
            this.list.length = 0
            this.activeFields = Object.assign([], dataType.dataExtInfoList || [])
            this.fields = this.getActiveFields()
            const queryExtFields = {}
            this.activeFields.forEach( item => {
                if (item.extNo) queryExtFields[`ext${item.extNo}`] = undefined
            } )
            this.query = { ..._.pick(this.query, ['type']), ...queryExtFields }
            this.queryList()
        },
        getActiveFields () {
            const showFields = []
            const fields = this.activeFields || []
            fields.forEach( item => { showFields.push({ key: `ext${item.extNo}`, name: item.extName }) } )
            return showFields
        }
    },
    computed: {
        // titleName () {
        //     if (this.action === 'add') {
        //         return '添加数据角色'
        //     } else if (this.action === 'edit') {
        //         return '编辑数据角色'
        //     } else if (this.action === 'view') {
        //         return '数据角色详情'
        //     }
        // },
        queryExtFields () {
            const queryExtFields = {}
            this.activeFields.forEach( item => {
                if (item.extNo) queryExtFields[`ext${item.extNo}`] = undefined
            } )
            return queryExtFields
        },
        closeText () {
            if (this.action === 'add') {
                return '取消'
            } else {
                return '关闭'
            }
        },
        okText () {
            if (this.action === 'edit') {
                return '保存'
            } else if (this.action === 'add') {
                return '确认'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.search-form {
    display: flex;
    .col-l {
        flex: 1;
        display: flex;
        .el-row {
            flex: 1;
            display: flex;
            flex-wrap:wrap;
            margin-right: 20px;
        }
    }
    .col-r {
        width: 140px;
    }
}
/deep/ .basic-list {
  width: 100% !important;
  display: inline-block;
}
</style>

