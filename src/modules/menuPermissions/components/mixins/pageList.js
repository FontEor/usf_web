import PageBase from '@/mixins/pageBase'

const ACTIONTYPES = {
    ADD: 'add',
    VIEW: 'view',
    ROLE: 'role',
    EDIT: 'edit',
    LEVEL: 'level'
}
const ACTIONNAMES = {
    [ACTIONTYPES.ADD]: '添加子机构',
    [ACTIONTYPES.VIEW]: '查看机构成员',
    [ACTIONTYPES.ROLE]: '管理机构菜单角色',
    [ACTIONTYPES.EDIT]: '编辑机构',
    [ACTIONTYPES.LEVEL]: '变更父机构'
}
const ORGTYPES = [
    { key: 1, value: '企业' },
    { key: 2, value: '部门' }
]
/**
 * 列表页公共方法混入
 */
export default {
    mixins: [ PageBase ],
    data () {
        return {
            // 实体弹窗是否可见
            commonDlgVis: {
                [ACTIONTYPES.ADD]: false,
                [ACTIONTYPES.VIEW]: false,
                [ACTIONTYPES.ROLE]: false,
                [ACTIONTYPES.EDIT]: false,
                [ACTIONTYPES.LEVEL]: false,
            },
            // 动作类型字典
            ACTIONTYPES: ACTIONTYPES,
            // 实体弹窗动作类型
            commonDlgActn: ACTIONTYPES.ADD,
            // 是否立即查询
            immediateQuery: true,
            // 表格一高度
            tableH1: null,
            // 编码前缀(菜单编码)
            codePrefix: `${this.$route.meta.code}|`,
            // 机构用到的弹框标题map
            ACTIONNAMES: ACTIONNAMES,
            // 已选择的机构数组
            selectedRows: [],
            // 当前选择的机构对象
            currentRow: {},
            // 部门类型字典
            ORGTYPES: ORGTYPES
        }
    },
    watch: {
        'app.view.height' () {
            this.$nextTick(this.calcHeight)
        }
    },
    computed: {
        getEditOrgTypes () {
            if (this.currentRow && this.currentRow.orgType === 2) {
                return ORGTYPES.filter((item) => {
                    return item.key === 2
                })
            } else {
                return ORGTYPES
            }
        }
    },
    activated () {
        this.$nextTick(this.calcHeight)
    },
    methods: {
        // 计算高度
        calcHeight () {
            if (this._inactive) {
                return
            }
            const $search = this.$refs.exactSearch
            if (!$search) {
                return
            }
            const searchH = $search.$el.offsetHeight
            const pageH = this.app.view.height
            if (!pageH) {
                return
            }
            this.tableH1 = pageH - searchH - 80
        },
        onViewChange (val) {
            val = _.trim(val)
            const VIEWMODELMAP = [
                { key: 0, value: '全部显示' },
                { key: 1, value: '仅显示机构' },
                { key: 2, value: '仅显示部门' }
            ]
            const view = _.filter(VIEWMODELMAP, function(o) { return o.value === val })
            if (view && view.length) {
                this.state.query.orgType = view[0].key
                this.state.query.viewModel = view[0].value
                this.queryList()
            }
        },
        // list列表选择框自定义设置函数
        handleSelectionChange (rows) {
            this.selectedRows = rows
            this.currentRow = rows.length === 1 ? rows[0] : {}
        },
        // 判断是否只选中一行
        checkSingleRow (rows) {
            const SELECTTIPS = {
                none: '请先选择机构',
                mult: '只能选择一个机构进行编辑'
            }
            const msg = !rows.length ? SELECTTIPS['none'] : rows.length > 1 ? SELECTTIPS['mult'] : ''
            if (msg) {
                this.$message.error(msg)
                return false
            } else {
                return true
            }
        },
        // 更新实体弹框可见状态
        updateDlgVis (vis) {
            this.commonDlgVis[this.commonDlgActn] = vis
        },
        // 检查和更新弹框状态及引入回调
        checkAndUpdateDlgVis (type, { prev, done } = {}) {
            if (!type) return
            if (this.checkSingleRow(this.selectedRows)) {
                if (prev && prev()) {
                    return
                } else {
                    this.commonDlgActn = type
                    this.updateDlgVis(true)
                    done && done()
                }
            }
        },
        // 添加子机构
        handleAdd () {
            const done = () => {
                this.updateState({ entity: {
                    parentId: this.currentRow.id
                }})
            }
            this.checkAndUpdateDlgVis(ACTIONTYPES.ADD, { done })
        },
        // 编辑机构
        handleEdit () {
            const prev = () => {
                const { isModify } = this.currentRow
                if (isModify === 0) {
                    this.$message.error('该机构不可编辑')
                    return true
                }
                return false
            }
            const done = () => {
                this.updateState({ entity: { ...this.currentRow } })
            }
            this.checkAndUpdateDlgVis(ACTIONTYPES.EDIT,  { prev, done })
        },
        // 查看机构用户
        handleViewUsers () {
            this.checkAndUpdateDlgVis(ACTIONTYPES.VIEW)
        },
        // 变更父机构 orgType=1:机构，2:部门(PRD中说明只有部门可变更父节点)
        handleOrgChange () {
            const prev = () => {
                const { isModify, orgType } = this.currentRow
                if (isModify === 0 || orgType !== 2) {
                    this.$message.error('该机构不可变更父机构')
                    return true
                }
                return false
            }
            const done = () => {
                const { orgCode } = this.currentRow
                this.state.subEntity.orgCode = orgCode
                const subEntity = { ...this.state.subEntity }
                this.updateState({ subEntity })
                const data = { orgCode }
                this.queryListByRoot({ data })
            }
            this.checkAndUpdateDlgVis(ACTIONTYPES.LEVEL, { prev, done })
        },
        // 保存按钮响应事件
        handleSave ({ params = {}, type }) {
            const done = () => {
                this.updateDlgVis(false)
                this.queryList()
            }
            switch (type) {
                case ACTIONTYPES.ADD:
                    this.dispatch('createEntity', {
                        params: {
                            parentId: params.parentId,
                            orgName: params.orgName,
                            orgType: params.orgType,
                            principal: params.principal,
                            remark: params.remark,
                            tenementId: params.tenementId
                        },
                        done
                    })
                    break;
                case ACTIONTYPES.EDIT:
                    this.dispatch('updateEntity', {
                        params: {
                            orgId: params.id,
                            orgName: params.orgName,
                            orgCode: params.orgCode,
                            principal: params.principal,
                            remark: params.remark
                        },
                        done
                    })
                    break;
                case ACTIONTYPES.LEVEL:
                    const { orgCode, newParentCode } = this.state.subEntity
                    const data = {
                        orgCode,
                        newParentCode
                    }
                    this.dispatch('updateParent', { data, done })
                    break;
                default:
                    break;
            }
        },
        // 列表分页查询
        queryList () {
            this.dispatch('queryList')
        },
        // 查询该用户所有具有管理权限的机构
        queryListAll () {
            this.dispatch('queryListAll')
        },
        // 查询机构用户
        queryListUser (payload) {
            this.dispatch('queryListUser', payload)
        },
        // 父机构查询
        queryListByRoot (payload) {
            this.dispatch('queryListByRoot', payload)
        },
        // 响应分页索引发生改变
        pageIndexChange (index) {
            this.state.pageIndex = index - 1
            this.updateState({ pageIndex: index })
            this.queryList()
        },
        // 响应分页尺寸发生改变
        pageSizeChange (size) {
            this.updateState({ pageIndex: 0, pageSize: size })
            this.queryList()
        },
        // 删除按钮响应事件
        handleDelete () {
            const DELETEMSG = {
                0: '该机构信息不可删除',
                1: `该机构下有XXX个成员，删除该机构后，这些成员也会被全部删除，您确认要删除该机构吗？`
            }
            const { orgCode, isModify } = this.currentRow
            const params = { orgCode }
            const done = () => {
                if (this.state.list.length <= 1) {
                    this.updateState({ pageIndex: 0 })
                }
                this.queryList()
            }
            if (isModify) {
                const { id } = this.currentRow
                const data = { orgId: id, searchUserName: '' }
                const page = { pageIndex: 0, pageSize: 1000000000 }
                this.dispatch('queryListUser', {
                    data,
                    page,
                    noEntiry: true,
                    callback: (_data = {}) => {
                        const nums = _data.rowTotal
                        DELETEMSG[1] = DELETEMSG[1].replace('XXX', nums)
                        this.$confirm(DELETEMSG[1], '操作提示').then(() => {
                            this.dispatch('deleteEntity', { params, done })
                        }).catch(() => {})
                    }
                })
            } else {
                this.$message.error(DELETEMSG[0])
            }
        }
    }
}
