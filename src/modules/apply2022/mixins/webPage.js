import { initPage } from "./list";
import store from "../store";
import { get } from "lodash";

export default {
    computed: {
        formData() {
            return store.state.form;
        }
    },
    watch: {
        // formData: {
        //     deep: true,
        //     handle(n, o) {
        //         const newOrg = get(n, 'usfOrgId');
        //         const oldOrg = get(o, 'usfOrgId');
        //         if(newOrg !== oldOrg) {
        //             this.clearData();
        //         }
        //     }
        // }
    },
    data() {
        return {
            tableData: [],
            list: [],
            page: initPage(),
            showPager: false
        }
    },
    methods: {
        // 切换页数
        pageIndexChange(index) {
            this.page.pageIndex = index;
            this.getList();
        }, //
        // 切换每页显示条数
        pageSizeChange(size) {
            this.page.pageSize = size;
            this.page.pageIndex = 1
            this.getList();
        },
        resetPage() {
            this.page = initPage();
        },
        getList(reload = true) {
            if (this.tableData.length > 10) {
                this.showPager = true;
                const start = (this.page.pageIndex - 1) * this.page.pageSize;
                const end = this.page.pageIndex * this.page.pageSize;
                this.list = this.tableData.slice(start, end)
                this.page.rowTotal = this.tableData.length;
                this.page.pageTotal = Math.ceil(this.page.rowTotal / this.page.pageSize)
            } else {
                this.showPager = false;
                this.list = this.tableData;
            }
            const table = this.$refs.table;
            if(reload && table && table.reloadData) {
                table.reloadData(this.list);
            }
        },
        pageChange({ currentPage, pageSize }) {
            if (this.page.pageIndex !== currentPage) {
                this.pageIndexChange(currentPage)
            }
            if (this.page.pageSize !== pageSize) {
                this.pageSizeChange(pageSize)
            }
        },
        clearData() {
            this.tableData.length = 0;
            this.resetPage();
            this.getList();
        }
    }
}