export const initPage = () => {
    return {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 1,
        rowTotal: 0
    }
}

export default {
    data() {
        return {
            list: [],
            total: 0,
            page: initPage(),
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
        }
    }
}