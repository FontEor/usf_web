<template>
    <basic-dialog
        title="扩展字段"
        :width="1000"
        :visible="visible"
        :ok-text="okText"
        :close-text="closeText"
        :handle-close="handleClose"
        :handle-ok="handleOk">
        <el-table
            border
            size="small"
            :stripe="true"
            :data="list"
            :indent="15"
            :height="500"
            style="width: 100%">
            <div slot="empty">
                <img src="../../../imgs/empty.png" alt="" />
            </div>
            <template v-for="item of fields">
                <el-table-column
                    :key="item.key"
                    v-if="item.render"
                    :prop="item.key"
                    :align="item.align || 'center'"
                    :width="item.width ? item.width + 'px' : undefined"
                    :min-width="item.minWidth ? item.minWidth + 'px' : '120px'"
                    :label="item.name">
                        <template slot-scope="scope">
                            <column
                                :index="scope.$index"
                                :row="scope.row"
                                :col="scope.column"
                                :field="item"
                                :render="item.render"/>
                        </template>
                </el-table-column>
                <el-table-column
                    v-else
                    :key="item.key"
                    :prop="item.key"
                    :label="item.name"
                    :align="item.align || 'center'"
                    :width="item.width ? item.width + 'px' : undefined"
                    :min-width="item.minWidth ? item.minWidth + 'px' : '120px'"
                    :render-header="item.hdRender">
                </el-table-column>
            </template>
        </el-table>
    </basic-dialog>
</template>

<script>
import BasicDialog from '@/components/basicDialog'
import Column from '@/components/tableColumn'

export default {
    components: {
        BasicDialog,
        Column
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
        okText: {
            type: String,
            default: '保存'
        },
        closeText: {
            type: String,
            default: '取消'
        },
        handleSave: {
            type: Function,
            default: () => {}
        },
        list: Array,
        fields: Array
    },
    methods: {
        handleClose() {
            this.updateVis(false)
        },
        handleOk() {
            const done = this.handleClose
            this.handleSave({ done })
        }
    }
}
</script>
