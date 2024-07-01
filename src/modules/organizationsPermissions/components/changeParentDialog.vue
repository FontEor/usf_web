<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="dlgWidth"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
            <div class="basic-search basic-search--small">
                <el-tree
                    :loading="state.subEntity.loading"
                    default-expand-all
                    show-checkbox
                    check-strictly
                    node-key="id"
                    ref="tree"
                    highlight-current
                    check-on-click-node
                    :data="state.subEntity.list"
                    @check-change="handleCheckChange"
                    :props="state.subEntity.prop">
                </el-tree>
            </div>
    </basic-dialog>
</template>

<script>
import EntityDialog from './mixins/entityDialog'
export default {
    mixins: [EntityDialog],
    props: {
        state: {
            type: Object,
            default () {
                return {}
            }
        },
        currentRow: {
            type: Object,
             default () {
                return {}
            }
        }
    },
    data () {
        return {
            list: []
        }
    },
    methods: {
        handleCheckChange(data = {}, checked, indeterminate) {
            if (checked) {
                this.$refs.tree.setCheckedNodes([data]);
                const { orgCode } = data
                this.state.subEntity.newParentCode = orgCode
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.basic-search {
    padding: 10px 0 0;
    .basic-search__bd {
        display: flex;
        .col-l {
            flex: 1;
            .el-form {
                display: flex;
                flex-wrap: wrap;
            }
            /deep/ .el-form-item {
                padding-right: 15px;
                box-sizing: border-box;
            }
        }
        .col-r {
            position: relative;
            padding: 0 0 0 25px;
            width: 162px;
            .el-button {
                width: 75px;
            }
        }
    }
}
.basic-search--small {
    /deep/ .el-form-item__label {
        font-weight: 500;
    }
}
.el-tree-node__label {
    margin-left: 10px;
}
</style>
