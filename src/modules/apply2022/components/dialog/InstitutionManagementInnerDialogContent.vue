<template>
    <div>
        <el-row :gutter="0">
            请确认本次操作内容，确认无误后点击保存，如需修改点击上一步。
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-tag type="success" class="type-des"
                    >本次新勾选项</el-tag
                >
                <vxe-table align="left" :data="addShowList" :column-config="{resizable: true}" height="300px">
                    <vxe-column field="orgName" title="机构名称"></vxe-column>
                    <vxe-column field="orgCode" title="机构编码"></vxe-column>
                </vxe-table>
                <el-pagination
                    class="pt-12"
                    :current-page="addPageInfo.pageIndex"
                    :page-size="addPageInfo.pageSize"
                    :page-sizes="[10, 20, 50, 100, 200, 300, 500]"
                    :total="addPageInfo.total"
                    layout="total, sizes, prev, jumper, slot, next "
                    @current-change="handleAddPageIndexChange"
                    @size-change="handleAddPageSizeChange"
                >
                    <span class="page-count"> / {{ addPageInfo.rowPage }}</span>
                </el-pagination>
            </el-col>
            <el-col :span="12">
                <el-tag type="info" class="type-des"
                    >本次取消勾选项</el-tag
                >
                <vxe-table align="left" :data="deleteShowList" :column-config="{resizable: true}" height="300px">
                    <vxe-column field="orgName" title="机构名称"></vxe-column>
                    <vxe-column field="orgCode" title="机构编码"></vxe-column>
                </vxe-table>
                <el-pagination
                    class="pt-12"
                    :current-page="deletePageInfo.pageIndex"
                    :page-size="deletePageInfo.pageSize"
                    :page-sizes="[10, 20, 50, 100, 200, 300, 500]"
                    :total="deletePageInfo.total"
                    layout="total, sizes, prev, jumper, slot, next "
                    @current-change="handleDeletePageIndexChange"
                    @size-change="handleDeletePageSizeChange"
                >
                    <span class="page-count">
                        / {{ deletePageInfo.rowPage }}</span
                    >
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    props: {
        addList: {
            type: Array,
            default: () => []
        },
        deleteList: {
            type: Array,
            default: () => []
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        addList: {
            handler(newList) {
                this.addPageInfo.total = newList.length;
                this.getList(this.addList, this.addPageInfo, "addShowList");
            },
            deep: true,
            immediate: true
        },
        deleteList: {
            handler(newList) {
                this.deletePageInfo.total = newList.length;
                this.getList(
                    this.deleteList,
                    this.deletePageInfo,
                    "deleteShowList"
                );
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            addPageInfo: {
                pageIndex: 1,
                pageSize: 10,
                total: this.addList.length,
                rowPage: 1
            },
            deletePageInfo: {
                pageIndex: 1,
                pageSize: 10,
                total: this.deleteList.length,
                rowPage: 1
            },
            addShowList: [],
            deleteShowList: []
        };
    },
    methods: {
        handleAddPageIndexChange(pageIndex) {
            this.addPageInfo.pageIndex = pageIndex;
            this.getList(this.addList, this.addPageInfo, "addShowList");
        },
        handleAddPageSizeChange(pageSize) {
            this.addPageInfo.pageSize = pageSize;
            this.getList(this.addList, this.addPageInfo, "addShowList");
        },

        handleDeletePageIndexChange(pageIndex) {
            this.deletePageInfo.pageIndex = pageIndex;
            this.getList(
                this.deleteList,
                this.deletePageInfo,
                "deleteShowList"
            );
        },
        handleDeletePageSizeChange(pageSize) {
            this.deletePageInfo.pageSize = pageSize;
            this.getList(
                this.deleteList,
                this.deletePageInfo,
                "deleteShowList"
            );
        },
        getList(orgList, pageInfo, useListName) {
            if (orgList.length > 10) {
                const start = (pageInfo.pageIndex - 1) * pageInfo.pageSize;
                const end = pageInfo.pageIndex * pageInfo.pageSize;
                const rowPage = Math.ceil(orgList.length / pageInfo.pageSize);
                pageInfo.rowPage = rowPage;
                this[useListName] = orgList.slice(start, end);
            } else {
                this[useListName] = orgList;
            }
        }
    },
    name: "InstitutionManagementInnerDialogContent"
};
</script>
<style lang="scss" scoped>
.type-des {
    margin: 16px 0 12px 0;
}
</style>