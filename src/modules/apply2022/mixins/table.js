import Bus from "./bus";
import listMixins from "./list";

export default {
    mixins: [listMixins],
    created() {
        Bus.$on('clearChecked', this.clearAllCheckbox.bind(this))
    },
    beforeDestroy() {
        Bus.$off('clearChecked', this.clearAllCheckbox.bind(this))
    },
    watch: {
        visible (n) {
            if(n) {
                this.handleReset();
            }
        }
    },
    methods: {
        onCheckMethod({ row }) {
            return !row.disabled && !row.choosed;
        },
        onVisibleMethod({ row }) {
            return !row.choosed
        },
        clearAllCheckbox() {
            if(this.$refs.table) {
                this.$refs.table.clearCheckboxRow();
                this.$refs.table.clearCheckboxReserve();
            }
        },
        // 关闭后清空页面数据
        handleClosed() {
            // 需求中不能清空上次勾选
            this.clearAllCheckbox();
        },
        handleSearch() {
            this.resetPage();
            this.getList();
        },
        // 更新列表数据
        assignListData(data) {
            Object.assign(this.page, {
                pageIndex: data.pageIndex,
                pageSize: data.pageSize,
                pageTotal: data.pageTotal,
                rowTotal: data.rowTotal,
            })
            this.list = data.rows;
        },
        handleOk() {
            const reserveRows = this.$refs.table.getCheckboxReserveRecords(true);
            const rows = this.$refs.table.getCheckboxRecords(true);
            const chooses = [...reserveRows, ...rows];
            const total = chooses.reduce((total, choose) => {
                if (!choose.choosed) {
                    total += 1;
                }
                return total
            }, 0)
            const currentPageTotal = this.list.reduce((total, data) => {
                if (!data.choosed) {
                    total += 1;
                }
                return total
            }, 0)
            // 如果选中数量超过5条 或者 当前页为全选状态 那么弹出提示
            if (total > 5 ||(total > 0 && total === currentPageTotal)) {
                this.$confirm(
                    `<div class='apply-2022-confirm-content'><p><i class='el-icon-warning'></i><span>您是否要勾选${total}项</span></p></div>`,
                    "",
                    {
                        dangerouslyUseHTMLString: true,
                    }
                ).then(() => {
                    chooses.forEach((item) => (item.choosed = true));
                    this.$emit("confirm", chooses);
                    this.$message({
                        type: "success",
                        message: "保存成功!",
                    });
                });
            } else {
                chooses.forEach((item) => (item.choosed = true));
                this.$emit("confirm", chooses);
                this.$message({
                    type: "success",
                    message: "保存成功!",
                });
            }
        },
    }
}
