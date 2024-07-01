<template>
    <div class="apply-2022-auth-choose-c">
        <div>
            <h3>

                选择机构管理权限
                <span v-if="orgSelectHint">
                    <a :href="orgSelectHint" target="_blank">如何选择权限?</a>
                </span>
                <span v-else>
                    <a href="javascript:void(0);">如何选择权限?</a>
                </span>
            </h3>
            <!-- :tree-config="{ transform: false, rowField: 'id', iconOpen:
            'el-icon-arrow-down', iconClose: 'el-icon-arrow-right', iconLoaded:
            'el-icon-loading', parentField: 'parentId', hasChild: 'hasChild' }" -->
            <vxe-table stripe border="inner" ref="table" :row-config="{ isHover: true }" :column-config="{resizable: true}" :data="list" max-height="550">
                <vxe-column field="orgName" title="机构名称"></vxe-column>
                <vxe-column field="orgFullName" title="机构全称"></vxe-column>
                <vxe-column field="orgCode" title="机构编码"></vxe-column>
                <vxe-column field="isAdmin" title="是否已分配" show-overflow>
                    <template #default="{ row }">
                        <span :style="{
                            color: row.isAdmin ? '#12B35D' : '#FC3737'
                        }">
                            {{ (row.isAdmin && "是") || "否" }}
                        </span>
                    </template>
                </vxe-column>
                <vxe-column field="id" title="操作" width="80">
                    <template #default="{ row }">
                        <el-button type="text" @click="onDelete(row)">删除</el-button>
                    </template>
                </vxe-column>
            </vxe-table>
            <el-button class="apply-2022-auth-choose-add" type="text" icon="el-icon-circle-plus-outline"
                @click="dialogVisible = true">
                添加权限
            </el-button>
            <vxe-pager v-show="showPager" border size="medium" :current-page="page.pageIndex" :page-size="page.pageSize"
                :total="page.rowTotal" :layouts="[
                    'Total',
                    'PrevPage',
                    'JumpNumber',
                    'NextPage',
                    'Sizes',
                    'FullJump'
                ]" @page-change="pageChange">
            </vxe-pager>
            <div v-show="!showPager" style="width: 100%; height: 44px;"></div>
        </div>
        <InstitutionManagementDialog ref="InstitutionManagementDom" diaTitle="添加机构管理权限" :visible="dialogVisible"
            :getTableData="getTableData" :getSearchData="getSearchData" :loading="loading"
            :updateVis="visible => (dialogVisible = visible)" @selectConfirm="coSelectConfirm"
            :itemTenementCode="itemTenementCode" :preSelectedList="tableData" />
    </div>
</template>

<script>
import filterMixins from "../../mixins/filters";
import webPageMixins from "../../mixins/webPage";
import changeMixin from "../../mixins/change";
import InstitutionManagementDialog from "../dialog/InstitutionManagementDialog.vue";
import axios from "axios";
import { intersection } from "lodash";
import store from "../../store";

export default {
    name: "InstitutionManagement",
    mixins: [filterMixins, webPageMixins, changeMixin],
    components: {
        InstitutionManagementDialog
    },
    data() {
        return {
            dialogVisible: false,
            loading: false,
            orgTableData: [],
        };
    },
    computed: {
        itemTenementCode() {
            return this.tenantId;
        },
        applyType() {
            return store.state.applyType;
        },
        orgSelectHint() {
            return store.state.configInfo && store.state.configInfo.orgSelectHint
        },
    },
    mounted() {
        this.InstitutionManagementDom = this.$refs["InstitutionManagementDom"];
    },
    methods: {
        getTableData(rowInfo) {
            this.loading = true;
            return new Promise((resolve, reject) => {
                axios({
                    method: "post",
                    // 业务权限没有 机构 不用处理
                    url: "/adminApply/queryOrgListStepByStep.do",
                    data: {
                        tenementCode: this.itemTenementCode,
                        parentId: (rowInfo && rowInfo.id) || null
                    },
                    params: {
                        tenementCode: this.itemTenementCode
                    }
                })
                    .then(response => {
                        this.loading = false;
                        const { data, code, msg } = response.data || {};
                        if (+code === 200) {
                            const { orgIds = [], orgListPage } = data || {};
                            const list = orgListPage.rows;
                            const total = orgListPage.total;
                            total > 1000 &&
                                this.$message({
                                    type: "warning",
                                    message:
                                        "已超出界面展示范围，请使用查询功能进行定位"
                                });
                            list.forEach(dataItem => {
                                const parentIdList = (dataItem.parentIds || "")
                                    .split(",")
                                    .filter(item => item)
                                    .map(item => +item);
                                const isAdmin =
                                    intersection(
                                        [...parentIdList, dataItem.id],
                                        orgIds
                                    ).length > 0;
                                // 之前已经勾选当前元素
                                // 之前已经勾选当前元素的父元素
                                const include =
                                    this.orgTableData.filter(item => {
                                        return (
                                            +item.id === +dataItem.id ||
                                            parentIdList.includes(+item.id)
                                        );
                                    }).length > 0;
                                // 是否已分配只影响禁用状态
                                dataItem.isAdmin = isAdmin;
                                dataItem.selected = include;
                                dataItem.disabled = isAdmin || include;
                                dataItem.hasChild = true;
                            });
                            resolve({
                                data: list,
                                total: total
                            });
                        } else {
                            this.$message.error({ message: msg });
                            reject();
                        }
                    })
                    .catch(err => {
                        this.loading = false;
                        this.$message.error({ message: err });
                        reject();
                    });
            });
        },
        coSelectConfirm({ selectedAllList, orgSelectedAllList, selectList }) {
            this.orgTableData = orgSelectedAllList;
            this.tableData = selectedAllList;
            this.getList();
        },
        getSearchData({ query, pageInfo }) {
            return new Promise((resolve, reject) => {
                this.loading = true;
                axios({
                    method: "post",
                    // 业务权限没有 机构 不用处理
                    url: "/adminApply/queryOrgListByCondition.do",
                    data: {
                        data: {
                            tenementCode: this.itemTenementCode,
                            orgCode: query.orgCode,
                            orgName: query.orgName
                        },
                        page: {
                            pageSize: pageInfo.pageSize,
                            pageIndex: pageInfo.pageIndex
                        }
                    },
                    params: {
                        tenementCode: this.itemTenementCode
                    }
                }).then(response => {
                    const { data, code, msg } = response.data || {};
                    this.loading = false;
                    if (+code === 200) {
                        const { orgIds, restPage } = data || {};
                        const {
                            pageIndex,
                            pageSize,
                            pageTotal,
                            rowTotal,
                            rows
                        } = restPage;
                        const pageInfo = {
                            pageIndex,
                            pageSize,
                            pageTotal,
                            rowTotal
                        };
                        rows.forEach(dataItem => {
                            const parentIdList = (dataItem.parentIds || "")
                                .split(",")
                                .map(item => +item);
                            const isAdmin =
                                intersection(
                                    [...parentIdList, dataItem.id],
                                    orgIds
                                ).length > 0;
                            const include =
                                this.orgTableData.filter(
                                    item =>
                                        +item.id === +dataItem.id ||
                                        parentIdList.includes(+item.id)
                                ).length > 0;
                            dataItem.isAdmin = isAdmin;
                            dataItem.selected = isAdmin || include;
                            dataItem.disabled = isAdmin || include;
                        });
                        resolve({ data: rows, pageInfo });
                    } else {
                        this.$message.error(msg);
                    }
                });
            });
        },
        onDelete(row) {
            this.$confirm(
                "<div class='apply-2022-confirm-content'><p><i class='el-icon-warning'></i><span>确认要删除这些信息么？</span></p></div>",
                "",
                {
                    dangerouslyUseHTMLString: true
                }
            ).then(() => {
                const table = this.$refs.table;
                const {
                    selectedAllList,
                    orgSelectedAllList
                } = this.InstitutionManagementDom.deleteItem(row);
                this.tableData = selectedAllList;
                this.orgTableData = orgSelectedAllList;
                table.reloadData(this.tableData);
                this.getList(false);
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            });
        }
    }
};
</script>

<style>

</style>
