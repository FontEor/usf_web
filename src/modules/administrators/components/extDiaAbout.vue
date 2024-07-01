<template>
    <basic-dialog
    class="goods-sel-dlg"
    :title="buttonData('glysqfpsjglqx').name"
    width="80%"
    :visible="visible"
    :append-to-body="appendToBody"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :isShowFooterAll="action !== 'view'"
    >
    <el-form
        ref="form1"
        class="search-form"
        size="small"
        :model="dto"
        :rules="rules"
    >
        <div class="col-l"></div>
        <div class="col-r"></div>
    </el-form>
    <el-form
        class="search-form"
        size="small"
        label-width="100px"
        :model="query"
    >
        <div class="col-l">
        <el-row>
            <el-col :span="8">
            <el-form-item label="数据类型">
                <el-select v-model="query.type" value-key="id" @change="onChangeDataType">
                <el-option
                    v-for="item in types"
                    :key="item.id"
                    :value="item"
                    :label="item.typeName"
                />
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8" v-for="item in activeFields" :key="item.id">
            <el-form-item :label="item.name">
                <!-- <el-input v-if="item.type === 'input'" v-model.trim="query[item.key]" :maxlength="30" clearable/> -->
                <el-autocomplete
                    v-if="item.type === 'input'"
                    v-model.trim="query[item.key]"
                    :debounce="500"
                    :fetch-suggestions="(value, cb) => querySearchThink(value, cb, item.key)"
                    :placeholder="'请输入' + item.name"
                    :maxlength="30"
                    clearable >
                </el-autocomplete>
                <el-select v-else-if="item.type === 'enums'" v-model.trim="query[item.key]" :placeholder="`请选择${item.name}`" clearable filterable>
                    <el-option
                        v-for="subItem in item.enums"
                        :key="subItem.code"
                        :label="subItem.label"
                        :value="subItem.value"
                        />
                </el-select>
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
        :selectable="selectable"
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
    />
    </basic-dialog>
</template>

<script>
import BasicDialog from "@/components/basicDialog"
import ExactList from "@/mixins/exactList"

import BasicList from "@/components/basicList"
import { mapState } from "vuex"

const DEFAULTS = {
    loading: false,
    total: 0,
    query: { types: undefined },
    pageIndex: 0,
    pageSize: 10,
    list: [],
    selRows: [],
    types: [],
    activeFields: [],
    rules: {
        roleName: [
            { required: true, message: "请输入角色名称", trigger: "change" }
        ],
        roleCode: [{ required: true, message: "请输入角色编码", trigger: "change" }]
    }
}

export default {
    mixins: [ExactList],
    components: {
        BasicDialog,
        BasicList
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        appendToBody: {
            type: Boolean,
            default: true
        },
        params: {
            type: Object,
            default() {
            return {}
            }
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
            type: Object
        },
        userId: {
            type: Number,
            default: 0
        }
    },
    beforeCreate() {
        this.dtoFields = ["roleName", "roleCode", "remark"]
    },
    created() {
        this.queryTypeList()
    },
    data() {
        return {
            ..._.cloneDeep(DEFAULTS),
            dto: this.getDefaultDto(),
            // 展示字段
            fields: this.handleSetField(),
            changeIndex: 0
        }
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.query = { ...DEFAULTS.query }
                this.pageIndex = 0
                this.dto = _.pick(this.entity, [
                    "roleName",
                    "roleCode",
                    "id",
                    "remark"
                ])
                this.queryTypeList()
            }
        },
        tenementInfoObj: {
            deep: true,
            immediate: false,
            handler: function(newVal) {
                newVal.isLoad && this.queryList()
            }
        },
        action(newVal) {
            if (newVal === "add") {
            this.dto = this.getDefaultDto()
            }
        }
    },
    methods: {
        handleClose() {
            this.updateVis(false)
        },
        handleClosed() {
            // debugger
            const defaults = _.cloneDeep(_.get(DEFAULTS, ["selRows", "query"]))
            for (let key in defaults) {
            this[key] = defaults[key]
            }
            this.$refs.basicList.resetData()
            this.activeFields.length = 0
            this.list = []
            this.fields = this.handleSetField()
        },
        handleOk() {
            //该页所有的code编码的数组
            let allArr = []
            //该页点击的code编码数组
            let checkedArr = []

            this.list.forEach((item, index) => {
            allArr.push(item.id)
            })
            this.selRows.forEach((item, index) => {
            checkedArr.push(item.id)
            })
            api.administrators
            .disData({
                data: {
                id: this.userId,
                allDataIdList: allArr,
                dataIdList: checkedArr
                }
            })
            .then(({ code, data, msg }) => {
                if (code == "200") {
                this.handleSearch()
                return this.$message.success(msg)
                } else {
                return this.$message.error(msg)
                }
            })
        },
        pageIndexChange(index) {
            this.pageIndex = index - 1
            this.queryList()
        },
        pageSizeChange(size) {
            this.pageIndex = 0
            this.pageSize = size
            this.queryList()
        },
        selectionChange(rows) {
            this.selRows = rows
        },
        handleSearch() {
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        handleReset() {
            this.query = _.cloneDeep(DEFAULTS.query)
            this.pageIndex = DEFAULTS.pageIndex
            this.activeFields.length = 0
            this.fields = this.handleSetField()
            // this.queryList()
            this.queryTypeList2()
        },
        queryList() {
            this.list.length = 0
            //为代码稳健 防止报错
            let id = this.query.type?this.query.type.id:null
            if (!id) return
            const data = {
            tenementCode: this.tenementInfoObj.tenementCode,
            userId: this.userId,
            typeId: id,
            dataRoleId: this.entity.id,
            ..._.omit(this.query, ["type"])
            }
            jt.object.removeEmptyAttr(data)
            const params = {
            data,
            page: { pageIndex: this.pageIndex + 1, pageSize: this.pageSize }
            }
            // jt.object.removeEmptyAttr(query)
            api.administrators.Alist(params).then(({ code, data }) => {
            if (code === 200) {
                this.list = data.rows || []
                this.total = data.rowTotal || 0
                // 设置默认选中状态
                this.$nextTick(() => {
                let arr = this.list.filter(item => item.isOwnData == 1)
                arr.forEach(item => {
                    this.$refs.basicList.$refs.table.toggleRowSelection(item, true)
                })
                })
            }
            })
        },
        toEnd() {
            // 角色信息 this.dto 所选用户 this.selRows
            const dataResourceIds = []
            this.selRows.forEach(item => {
                dataResourceIds.push(item.id)
            })
            const allDataResourceIds = []
            this.list.forEach(item => {
                allDataResourceIds.push(item.id)
            })
            const paramsFix = {
                tenementCode: this.tenementInfoObj.tenementCode,
                allDataResourceIds, // 当前页的数据资源id列表
                dataResourceIds // 选中的数据资源id列表
            }
            jt.object.removeEmptyAttr(paramsFix)
            const params = { ...this.dto, ...paramsFix }
            if (this.action === "add") {
                delete params.id
            }
            return params
        },
        getDefaultDto() {
            const dto = {}
            this.dtoFields.forEach(item => {
                dto[item] = undefined
            })
            return dto
        },
        selectable() {
            return this.isDisableSelect
        },
        // 数据类型枚举
        queryTypeList() {
            const params = {
                data: { tenementCode: this.tenementInfoObj.tenementCode },
                page: { pageIndex: 1, pageSize: 10000000 }
            }
            api.dataRole.queryTypeList(params).then(({ code, data }) => {
                if (code === 200) {
                    this.types = data.rows || []

                    this.query.type = data.rows[0]
                    this.onChangeDataType(data.rows[0])
                }
            })
        },
        queryTypeList2() {
            const params = {
                data: { tenementCode: this.tenementInfoObj.tenementCode },
                page: { pageIndex: 1, pageSize: 10 }
            }
            api.dataRole.queryTypeList(params).then(({ code, data }) => {
                if (code === 200) {
                    this.types = data.rows || []

                    this.query.type = data.rows[this.changeIndex]
                    this.onChangeDataType(data.rows[this.changeIndex])
                }
            })
        },
        //  数据类型联动
        onChangeDataType(dataType) {
            this.changeIndex = this.types.indexOf(dataType)
            dataType = dataType ? dataType : {}
            this.list.length = 0
            this.activeFields = this.handleSetField(dataType.dataExtInfoList)
            this.fields = this.activeFields.map(item => {
                return _.pick(item, ['key', 'name', 'render'])
            })
            const queryExtFields = {}
            this.activeFields.forEach( item => {
                if (item.key) {
                    queryExtFields[item.key] = undefined
                }
            } )
            this.query = { ..._.pick(this.query, ["type"]), ...queryExtFields }
            this.queryList()
        },
        handleSetField (array) {
            array = array || []
            array = array.filter(item => item.isEffective === 1)
            const fields = []
            for (let i = 0, len = array.length; i < len; i++) {
                const item = array[i]
                const col = {
                    id: item.id,
                    key: `ext${item.extNo}`,
                    name: item.extName,
                    type: 'input'
                }
                if (item.isEnum == 1) {
                    col.type = 'enums'
                    col.enums = jt.fn.generateEnums(item.enumValue, ',')
                    col.render = (h, { row }) => {
                        const enumValue = col.enums.find(item => item.value === row[col.key])
                        return <span>{ enumValue ? enumValue.label : '' }</span>
                    }
                }
                fields.push(col)
            }
            return fields
        },
        async querySearchThink(value, cb, key) {
            
            const query = _.cloneDeep(this.query)
            query.typeId = query.type.id
            query.userId = this.userId
            query.tenementCode = this.tenementInfoObj.tenementCode,
            delete query.type
            jt.object.removeEmptyAttr(query)
            const params = { data: query, page: { pageIndex: 1, pageSize: 10 } }
            const { data, msg, code } = await api.administrators.Alist(params)
            if (code === 200) {
                data.rows = data.rows || []
                const array = Array.from(new Set(data.rows.map(item => item[key])))
                const result = array.map(item => ({value: item}))
                cb(result)
            } else {
                cb()
            }
        }
   },
    computed: {
        ...mapState("app", ["tenementInfoObj"]),

        isDisableSelect() {
            return this.action !== "view"
        },
        queryExtFields() {
            const queryExtFields = {}
            this.activeFields.forEach(item => {
                if (item.extNo) queryExtFields[`ext${item.extNo}`] = undefined
            })
            return queryExtFields
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
            flex-wrap: wrap;
            margin-right: 20px;
        }
        .el-autocomplete {
            width: 100%;
        }
    }
    .col-r {
        width: 140px;
    }
}
.basic-list {
    padding-top: 0;
}
// .goods-sel-dlg {
//     .el-input,
//     .el-select {
//         width: 90% !important;
//     }
// }
</style>

