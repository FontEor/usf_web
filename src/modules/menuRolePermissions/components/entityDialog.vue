<template>
    <basic-dialog
        class="goods-sel-dlg"
        :title="title"
        :width="720"
        :visible="visible"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :isShowFooterAll="true"
        :showFt="false"
        :closeText="closeText">
        <el-form ref="form1" class="search-form" size="small" label-width="100px" :model="dto" >
            <div class="col-l">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="dto.roleName" :maxlength="30" clearable :disabled="action === 'view'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="角色编码" prop="roleCode">
                            <el-input v-model="dto.roleCode" :maxlength="30" clearable :disabled="action !== 'add'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="dto.remark" :maxlength="30" clearable :disabled="action !== 'add'" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <!--<div class="col-r"></div>-->
        </el-form>
        <el-form class="tree-cont" disabled>
            <el-tree
                ref="tree"
                show-checkbox
                node-key="id"
                highlight-current
                :data="listTree"
                :default-expand-all="true"
                :props="{ children: 'children', label: 'resourceName' }"
                :check-strictly="false"
                />
        </el-form>
    </basic-dialog>
</template>

<script>
import BasicDialog from '@/components/basicDialog'
import BasicList from '@/components/basicList'

const DEFAULTS = {
    loading: false,
    listTree: [],
    selRows: [],
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
        title: {
            type: String,
            default: ""
        },
        tenementCode: [ String, Number ]
    },
    beforeCreate () {
        this.dtoFields = [ 'roleName', 'roleCode', 'remark' ]
    },
    data () {
        return {
            ..._.cloneDeep(DEFAULTS),
            dto: this.getDefaultDto(),
            selectKeys: []
        }
    },
    watch: {
        visible (newVal) {
            if (newVal) {
                this.query = { ...DEFAULTS.query }
                this.dto = _.pick(this.entity, ['roleName', 'roleCode', 'remark', 'id'])
                this.queryMenuResourceByRole(this.dto.id)
            }
        }
    },
    methods: {
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            // debugger
            const defaults = _.cloneDeep(_.get(DEFAULTS, ['selRows', 'query']))
            for (let key in defaults) {
                this[key] = defaults[key]
            }
        },
        getDefaultDto () {
            const dto = {}
            this.dtoFields.forEach( item => { dto[item] = undefined } )
            return dto
        },
        queryMenuResourceByRole (id) {
            const params = { data: { id, tenementCode: this.tenementCode } }
            api.menuRolePermissions.queryMenuResourceByRole(params).then( ({ code, data }) => {
                if (code === 200) {
                    // 已选资源: data.role.resourceIds， 全部资源: data.resourceList
                    const selectedIds = data.role.resourceIds || []
                    this.listTree = tools.dataToTree(data.resourceList)
                    const parentIds = []
                    getParentIds (this.listTree)
                    function getParentIds (arr) {
                        if (arr.constructor !== Array) throw Error("not Array ")
                        arr.forEach( item => {
                            if (item.children && item.children.length) {
                                parentIds.push(item.id)
                                getParentIds (item.children)
                            }
                        } )
                    }
                    const repeatRemove = _.difference(selectedIds, parentIds)
                    this.$nextTick( () => { this.$refs.tree.setCheckedKeys(repeatRemove) } )
                }
            } )
        }
    },
    computed: {
        // titleName () {
        //     if (this.action === 'add') {
        //         return '菜单角色'
        //     } else if (this.action === 'edit') {
        //         return '菜单角色'
        //     } else if (this.action === 'view') {
        //         return '菜单角色'+this.title
        //     }
        // },
        isDisableSelect () {
            return this.action !== 'view'
        },
        queryExtFields () {
            const queryExtFields = {}
            this.activeFields.forEach( item => {
                if (item.extNo) queryExtFields[`ext${item.extNo}`] = undefined
            } )
            return queryExtFields
        },
        closeText () {
            if (this.action !== 'view') {
                return '取消'
            } else {
                return '关闭'
            }
        },
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
.basic-list {
    padding-top: 0;
}
.tree-cont /deep/ {
    height: 400px;
    .el-tree-node__label {
        margin-left: 10px;
    }
}
</style>
