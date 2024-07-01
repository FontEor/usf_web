<template>
    <basic-dialog
    :visible="visible"
    :title="buttonData('glysqfpsjjsglqx').name"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk">
    <el-form
        ref="form"
        size="small"
        label-position="center"
        label-width="90px"
        :model="dto"
        :rules="rules"
        @submit.native.prevent
    >
        <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
            <el-row :gutter="24">
            <el-col :span="8">
                <el-form-item label="角色" prop="website">
                <el-input v-model="query.roleNameLike" class="widthSet" :maxlength="30" clearable/>
                </el-form-item>
            </el-col>
            <el-col :span="16" class="setPosition">
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
            </el-col>
            </el-row>
        </div>
        </div>
    </el-form>
    <basic-list
        ref="basicList"
        select-type="single"
        :show-select-col="true"
        :show-action-col="false"
        :fields="fields"
        :setClmnsFlg="false"
        :list="list"
        class="heightSet"
        :total="total"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange"
        :page-index="pageIndex"
        :page-size="pageSize"
        selectType="multiple"
    />
    <!-- 上面的
            :total="total"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :selection-change="selectionChange"
            :loading="loading"
            :page-index="pageIndex"
            :page-size="pageSize"

    -->
    </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog"
import ExactList from "@/mixins/exactList"
import { mapState } from "vuex"
const DEFAULTS = {
    query: {
        roleNameLike: undefined
    },
    loading: false,
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    list: [],
    selRows: []
}
export default {
    mixins: [EntityDialog, ExactList],
    data() {
        return {
            rules: {},
            fields: [
                { key: "roleName", name: "名称" },
                { key: "source", name: "来源" },
                { key: "rootOrgName", name: "所属机构名称" }
            ],
            list: [],
            query: {
                code: undefined,
                name: undefined
            },
            pageIndex: 0,
            pageSize: 10,
            total: 0,

            //用于存储多行的那个列
            pageDate: {}
        }
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
        state: {
            type: Object,
            default: {}
        },
        roleListId: {
            type: Number,
            default: 0
        },
        roleCode: {
            type: String,
            default: undefined
        },
        userId: {
            type: Number,
            default: 0
        }
    },
    beforeCreate() {
        this.allFields = ["userName", "userCode", "userAlias", "id"]
        this.disFields = []
    },
    mounted() {},
    watch: {
        visible(newVal) {
            if (newVal) {
                this.query = { ...DEFAULTS.query, ..._.cloneDeep(this.params) }
                this.pageIndex = DEFAULTS.pageIndex - 1
                this.queryList()
            }
        },
        tenementInfoObj: {
            deep: true,
            immediate: false,
            handler: function(newVal) {
                newVal.isLoad && this.queryList()
            }
        }
    },

    computed: {
        ...mapState("app", ["tenementInfoObj"])
    },

    methods: {
        handleClose() {
            this.updateVis(false)
        },
        handleClosed() {
            const defaults = _.cloneDeep(_.get(DEFAULTS, ["selRows", "query"]))
            for (let key in defaults) {
                this[key] = defaults[key]
            }
            this.$refs.basicList.resetData()
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
            .assUser({
                data: {
                    id: this.userId,
                    allDataRoleIdList: allArr,
                    dataRoleIdList: checkedArr
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
            //这里很关键  是点击翻页的地方，我需要在这存储当前页 以及选中的那一行
            if (this.selRows.length) {
            this.pageDate[this.pageIndex] = this.selRows
            }
            this.pageIndex = index - 1
            this.queryList()
        },
        pageSizeChange(size) {
            this.pageIndex = DEFAULTS.pageIndex - 1
            this.pageSize = size
            this.queryList()
        },
        selectionChange(rows) {
            this.selRows = rows
        },
        handleSearch() {
            this.pageIndex = DEFAULTS.pageIndex - 1
            this.queryList()
        },
        handleReset() {
            this.query = _.cloneDeep(DEFAULTS.query)
            this.pageIndex = DEFAULTS.pageIndex - 1
            this.queryList()
        },
        queryList() {
            const query = _.cloneDeep(this.query)
            jt.object.removeEmptyAttr(query)
            //根据角色查弹窗用户的列表
            this.query.tenementCode = this.tenementInfoObj.tenementCode
            this.query.userId = this.userId

            api.administrators
            .aList({
                ...query,
                ///roleListId     角色id
                data: { menuRoleId: this.roleListId, ...this.query },
                page: {
                    pageIndex: this.pageIndex + 1,
                    pageSize: this.pageSize
                }
            })
            .then(({ code, data }) => {
                if (code == "200") {
                    this.list = _.get(data, "rows") || []
                    this.total = _.get(data, "rowTotal") || 0
                    //处理默认选中
                    this.$nextTick(() => {
                        let arr = []
                        this.list.forEach((item, index) => {
                            if (item.isOwnRole == 1) {
                                arr.push(item)
                            }
                        })
                        arr.forEach(item => {
                            this.$refs.basicList.$refs.table.toggleRowSelection(item, true)
                        })
                    })
                }
            })
        },
        //选中
        selectionChange(rows) {
            this.selRows = rows
            this.handleSelectionChange && this.handleSelectionChange(rows)
        }
    }
}
</script>

<style  scoped>
.setPosition {
    /* text-align: center*/
    text-align: right;
}
.widthSet {
    width: 300px;
}
</style>
