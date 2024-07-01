/**
 * 弹窗中既有查询又有列表。类似于分配权限这种的弹窗.混入一些基本方法
 */

import BasicDialog from '@/components/basicDialog'
import BasicList from '@/components/basicList'
import DlgSearch from '@/components/basicDialog/components/search'
import { mapState } from 'vuex'

const DEFAULTS = {
    pageSize: 10,
    pageIndex: 0,
    total: 0,
    selRows: [],
    tableH: 442,
    loading: false
}
export default {
    components: {
        BasicDialog,
        BasicList,
        DlgSearch
    },
    props: {
        moduleName: String,
        visible: {
            type: Boolean,
            default: false
        },
        updateVis: {
            type: Function,
            default: () => {}
        },
        updateState: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            ...DEFAULTS,
            query: this.getDefaultSearchQuery()
        }
    },
    computed: {
        ...mapState('app', ['showButtonList', 'showAllButton']),
        page() {
            return { pageIndex: this.pageIndex + 1, pageSize: this.pageSize }
        }
    },
    methods: {
        handleClose () {
            this.updateVis(false)
        },
        pageIndexChange(pageIndex) {
            this.pageIndex = pageIndex - 1
            this.queryList && this.queryList()
        },
        pageSizeChange(pageSize) {
            this.pageIndex = DEFAULTS.pageIndex
            this.pageSize = pageSize
            this.queryList && this.queryList()
        },
        selectionChange (rows) {
            this.selRows = rows
        },
        handleClosed() {
            this.handleRest()
            for (let prop in DEFAULTS) {
                this[prop] = DEFAULTS[prop]
            }
        },
        getDefaultSearchQuery() {
            const fields = this.searchQueryFields || []
            const query = {}
            const toString = Object.prototype.toString
            fields.forEach(item => {
                if (toString.call(item) === '[object Object]') {
                    query[item.key] = item.default
                } else {
                    query[item] = undefined
                }
            })
            return query
        },
        handleRest() {
            this.query = this.getDefaultSearchQuery()
        },
        handleSearch() {
            this.pageIndex = 0
            this.queryList()
        },
        updateLoading(loading) {
            this.loading = loading
        },
        buttonData(_str = '') {
            const btnItem = _.find(this.showButtonList, { code: _str }, null)
            let _btn = {}
            // 设置按钮全部显示
            this.showAllButton && (_btn = {
                item: {},
                name: 'button',
                has: false,
            })
            // 返回真实按钮
            btnItem && (_btn = {
                item: btnItem,
                name: btnItem.name || '',
                has: true,
            })
            return _btn
        }
    }
}
