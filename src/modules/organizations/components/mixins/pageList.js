import PageBase from '@/mixins/pageBase'
import permissionMixins from "@/mixins/permission"

import {
    mapState,
    mapGetters
} from 'vuex'

const ACTIONTYPES = {
    ADD: 'add',
    VIEW: 'view',
    ROLE: 'role',
    EDIT: 'edit',
    LEVEL: 'level',
    DELETE: 'delete'
}
const ACTIONNAMES = {
    [ACTIONTYPES.ADD]: '添加子机构',
    [ACTIONTYPES.VIEW]: '查看机构成员',
    [ACTIONTYPES.ROLE]: '分配机构菜单角色',
    [ACTIONTYPES.EDIT]: '编辑机构',
    [ACTIONTYPES.LEVEL]: '变更父机构'
}
const ORGTYPES = [{
        key: 1,
        value: '企业'
    },
    {
        key: 2,
        value: '部门'
    }
]
const VIEWMODELMAP = [{
        key: 0,
        value: '全部显示'
    },
    {
        key: 1,
        value: '仅显示企业'
    },
    {
        key: 2,
        value: '仅显示部门'
    }
]
/**
 * 列表页公共方法混入
 */
export default {
    mixins: [PageBase, permissionMixins],
    data() {
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
            ORGTYPES: ORGTYPES,
            maps: new Map()
        }
    },
    watch: {
        'app.view.height'() {
            this.$nextTick(this.calcHeight)
        }
    },
    computed: {
        ...mapGetters('app', ['tenementCode']),
        getEditOrgTypes() {
            if (this.currentRow && this.currentRow.orgType === 2) {
                return ORGTYPES.filter((item) => {
                    return item.key === 2
                })
            } else {
                return ORGTYPES
            }
        }
    },
    activated() {
        this.$nextTick(this.calcHeight)
    },
    methods: {
        // 计算高度
        calcHeight() {
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
        onViewChange(val) {
            val = _.trim(val)
            const view = _.filter(VIEWMODELMAP, function (o) {
                return o.value === val
            })
            if (view && view.length) {
                this.state.query.orgType = view[0].key
                this.state.query.viewModel = view[0].value
                this.queryList()
            }
        },
        // list列表选择框自定义设置函数
        handleSelectionChange(rows) {
            this.selectedRows = rows
            this.currentRow = rows.length === 1 ? rows[0] : {}
            console.log('handleSelectionChange', this.currentRow)
        },
        // 判断是否只选中一行
        checkSingleRow(rows) {
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
        updateDlgVis(vis) {
            this.commonDlgVis[this.commonDlgActn] = vis
        },
        // 检查和更新弹框状态及引入回调
        checkAndUpdateDlgVis(type, {
            prev,
            done
        } = {}) {
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
        // 添加子机构对话框
        handleAdd() {
            const done = () => {
                this.updateState({
                    entity: {
                        parentId: this.currentRow.id
                    }
                })
            }
            this.checkAndUpdateDlgVis(ACTIONTYPES.ADD, {
                done
            })
        },
        // 编辑机构对话框
        handleEdit() {
            const prev = () => {
                // const {
                //     isModify
                // } = this.currentRow
                // if (isModify === 0) {
                //     this.$message.error('该机构不可编辑！')
                //     return true
                // }
                return false
            }
            const done = () => {
                this.updateState({
                    entity: {
                        ...this.currentRow
                    }
                })
            }
            this.checkAndUpdateDlgVis(ACTIONTYPES.EDIT, {
                prev,
                done
            })
        },
        // 查看机构用户对话框
        handleViewUsers() {
            this.checkAndUpdateDlgVis(ACTIONTYPES.VIEW)
        },

        handleRoles() {
            const done = () => {
                const rolesEntity = {
                    ...this.state.rolesEntity,
                    id: this.currentRow.id
                }
                this.updateState({
                    rolesEntity
                })
            }
            this.checkAndUpdateDlgVis(ACTIONTYPES.ROLE, {
                done
            })
        },
        // 变更父机构 orgType=1:机构，2:部门(PRD中说明只有部门可变更父节点)
        handleOrgChange() {
            const prev = () => {
                const {
                    isModify,
                    orgType
                } = this.currentRow
                if (orgType !== 2) {
                    this.$message.error('该机构不可变更父机构，仅类型为【部门】的机构才可以变更父机构！')
                    return true
                }
                // if (isModify === 0) {
                //     this.$message.error('该机构不可编辑！')
                //     return true
                // }
                return false
            }
            const done = () => {
                const {
                    id
                } = this.currentRow
                this.state.subEntity.id = id
                this.state.subEntity.newParentId = null
                const subEntity = {
                    ...this.state.subEntity
                }
                this.updateState({
                    subEntity
                })
                const data = {
                    id
                }
                this.queryListByRoot({
                    data
                })
            }
            this.checkAndUpdateDlgVis(ACTIONTYPES.LEVEL, {
                prev,
                done
            })
        },
        // 保存按钮响应事件
        handleSave({
            params = {},
            type,
            extendFieldKeys = []
        }) {
            const done = () => {
                this.updateDlgVis(false)
                this.queryList(type)
            }
            switch (type) {
                case ACTIONTYPES.ADD:
                    this.maps.set('tree', {
                        type,
                        tree: this.currentRow
                    })
                    const addFields = ['parentId', 'orgName', 'orgCode', 'orgType', 'principal', 'remark']
                    const nParams = _.pick(params, [ ...addFields, ...extendFieldKeys ])
                    nParams.tenementCode = this.tenementCode
                    this.dispatch('createEntity', {
                        params: nParams,
                        done
                    })
                    break;
                case ACTIONTYPES.EDIT:
                    this.maps.set('tree', {
                        type,
                        tree: {
                            id: this.currentRow.parentId
                        }
                    })
                    const editFields = ['id', 'orgName', 'principal', 'remark' ]
                    const editParams = _.pick(params, [ ...editFields, ...extendFieldKeys ])
                    this.dispatch('updateEntity', {
                        params: editParams,
                        done
                    })
                    break;
                case ACTIONTYPES.LEVEL:
                    const {
                        id, newParentId
                    } = this.state.subEntity
                    if (!id || !newParentId) {
                        // this.updateDlgVis(false)
                        this.$message.error('请选择父机构')
                        break
                    }
                    this.maps.set('tree', {
                        type,
                        tree: {
                            id: this.currentRow.parentId,
                            newParentId
                        }
                    })
                    const data = {
                        id,
                        newParentId
                    }
                    this.dispatch('updateParent', {
                        data,
                        done
                    })
                    this.dispatch('queryList')
                    break
                case ACTIONTYPES.ROLE: {
                    const {
                        id,
                        menuRoleIdList = [],
                        allMenuRoleIdList = [],
                        pageIndex,
                        pageSize
                    } = this.state.rolesEntity
                    if (!allMenuRoleIdList.length) {
                        return
                    }
                    const data = {
                        id,
                        menuRoleIdList,
                        allMenuRoleIdList
                    }
                    const page = {
                        pageIndex,
                        pageSize
                    }
                    this.dispatch('updateRoles', {
                        data,
                        page,
                        done: () => {
                            const rolesDialog = this.$refs.rolesDialog
                            if (rolesDialog && rolesDialog.pageIndexChange) {
                                // 返回第一页
                                this.$nextTick(() => {
                                    rolesDialog.pageIndexChange(1)
                                })
                            }
                        }
                    })
                }
                break
            default:
                break
            }
        },
        // load子节点
        loadChilden(row, treeNode, resolve) {
            const id = row.id;
            this.maps.set(id, {
                row,
                treeNode,
                resolve
            })
            this.dispatch('load', {
                parentId: id
            }).then((arr) => {
                console.log( arr ,"org de ");
                if (arr && arr.length) {
                    this.$set(this.state.lazyTreeNodeMap, id, []);
                    row.children = arr
                    resolve(arr)
                } else {
                    row.hasChild = false
                    resolve([])
                }
            })
        },
        /**
         * author: songchunrui3
         * 懒加载规则：添加-更新本节点 修改、删除-更新本节点的父节点 变更父机构-更新本节点的父节点+新的父节点
         */
        queryList() {
            const {
                orgName = '',
                orgCode = '',
            } = this.state.query
            //判断18个扩展字段是否存在
            let extExist = false
            for (let i = 1; i <= 18; i++){
                let extValue = this.state.query['ext' + i]
                if(String(_.trim(extValue)) && String(_.trim(extValue)) != 'undefined'){
                    extExist = true
                    break
                }
            }
            if (String(_.trim(orgName)) || String(_.trim(orgCode)) || extExist) {
                this.dispatch('queryList')
            } else {
                if (this.maps.has('tree')) {
                    let {
                        type,
                        tree
                    } = this.maps.get('tree')
                    let id = tree.id
                    switch (type) {
                        case ACTIONTYPES.ADD:
                            if (this.maps.has(id)) {
                                let {
                                    row,
                                    treeNode,
                                    resolve
                                } = this.maps.get(id)
                                this.loadChilden(row, treeNode, resolve)
                            } else if (this.currentRow) {
                                this.currentRow.hasChild = true
                            }
                            break;
                        case ACTIONTYPES.EDIT:
                        case ACTIONTYPES.DELETE:
                            if (this.maps.has(id)) {
                                let {
                                    row,
                                    treeNode,
                                    resolve
                                } = this.maps.get(id)
                                this.loadChilden(row, treeNode, resolve)
                            }
                            break;
                        case ACTIONTYPES.LEVEL:
                            this.$nextTick(() => {
                                if (this.maps.has(id)) {
                                    let {
                                        row,
                                        treeNode,
                                        resolve
                                    } = this.maps.get(id)
                                    this.loadChilden(row, treeNode, resolve)
                                }
                                setTimeout(() => {
                                    const newParentId = tree.newParentId
                                    if (this.maps.has(newParentId)) {
                                        let {
                                            row,
                                            treeNode,
                                            resolve
                                        } = this.maps.get(newParentId)
                                        this.loadChilden(row, treeNode, resolve)
                                    }
                                }, 500);
                            })
                            break;

                        default:
                            break;
                    }
                    this.maps.set('tree', null)
                } else {
                    // 一般加载
                    this.dispatch('query')
                }
            }
        },
        // 查询该用户所有具有管理权限的机构
        queryListAll() {
            this.dispatch('queryListAll')
        },
        // 查询机构用户
        queryListUser(payload) {
            this.dispatch('queryListUser', payload)
        },
        // 父机构查询，用于变更父机构
        queryListByRoot(payload) {
            this.dispatch('queryListByRoot', payload)
        },
        // 查询机构菜单角色
        queryListRoles(payload) {
            this.dispatch('queryListRoles', payload)
        },
        // 验证类型为企业的机构删除条件
        validateOrgTypeSatisfy(payload) {
            this.dispatch('validateOrgTypeSatisfy', payload)
        },
        // 响应分页索引发生改变
        pageIndexChange(index) {
            this.state.pageIndex = index - 1
            this.updateState({
                pageIndex: index
            })
            this.queryList()
        },
        // 响应分页尺寸发生改变
        pageSizeChange(size) {
            this.updateState({
                pageIndex: 0,
                pageSize: size
            })
            this.queryList()
        },
        // 删除按钮响应事件
        handleDelete() {
            const DELETEMSG = {
                0: '该机构下XXXX！',
                1: `该机构下有XXX个成员，删除该机构后，这些成员也会被全部删除，您确认要删除该机构吗？`,
                2: '请先选择机构',
                3:'该数据通过接口创建，界面不支持修改和删除，请调用接口修改或删除'
            }
            this.maps.set('tree', {
                type: ACTIONTYPES.DELETE,
                tree: {
                    id: this.currentRow.parentId
                }
            })
            console.log('handleDelete', this.currentRow)
            const {
                id,
                isModify,
                orgType
            } = this.currentRow
            const params = {
                id
            }
            const done = () => {
                if (this.state.list.length <= 1) {
                    this.updateState({
                        pageIndex: 0
                    })
                }
                this.queryList()
            }
            if (orgType === 1) {
                // this.$message.error(DELETEMSG[0])
                const data = {
                    id: id
                }
                // 类型为企业的机构需要满足删除的条件
                this.dispatch('validateOrgTypeSatisfy', {
                    data,
                    noEntiry: true,
                    done: (_data = {}) => {
                        const data = _data
                        console.log('data', data)
                        DELETEMSG[0] = DELETEMSG[0].replace('XXXX', data)
                        this.$confirm(DELETEMSG[0], '确认删除').then(() => {
                          
                            this.dispatch('deleteEntity', {
                                params,
                                done
                            })
                            this.queryList()
                        }).catch(() => {})
                    }
                })
            } else if (isModify) {
                const data = {
                    orgId: id,
                    searchUserName: ''
                }
                const page = {
                    pageIndex: 0,
                    pageSize: 1000000000
                }
                // 先查询本机构下用户数量，再删除
                this.dispatch('queryListUser', {
                    data,
                    page,
                    noEntiry: true,
                    done: (_data = {}) => {
                        const nums = _data.rowTotal
                        console.log('nums', nums)
                        DELETEMSG[1] = DELETEMSG[1].replace('XXX', nums)
                        this.$confirm(DELETEMSG[1], '确认删除').then(() => {
                            this.dispatch('deleteEntity', {
                                params,
                                done
                            })
                            this.queryList()
                        }).catch(() => {})
                    }
                })
            } else if (isModify===0) {
                this.$message.error(DELETEMSG[3])
            }
            else {
                this.$message.error(DELETEMSG[2])
            }
        }
    }
}
