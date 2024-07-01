import { pageListMerge, generateActions } from '@/store/helper'
import store from '@/store'
// 获取参数
function getParams (state = {}) {
    const VIEWMODELMAP = [
        { key: 0, value: '全部显示' },
        { key: 1, value: '仅显示机构' },
        { key: 2, value: '仅显示部门' }
    ]
    const { pageIndex = 0, pageSize = 10 } = state
    const viewModel = _.trim(_.get(state, 'query.viewModel'))
    const view = _.filter(VIEWMODELMAP, function(o) { return o.value === viewModel })
    if (view && view.length) {
        state.query.orgType = view[0].key
        state.query.viewModel = view[0].value
    }
    const { orgName = '', orgCode = '', orgType } = (state.query || {})
    const { tenementCode } = state.query || {}
    const data = orgType ? { orgName, orgCode, orgType ,tenementCode} : { orgName, orgCode, tenementCode }
    const page = {
        pageIndex: pageIndex + 1,
        pageSize
    }
    if (!orgName) {
        page.pageIndex = 1
        page.pageSize = 1000000000
        state.showPage = false
    } else {
        state.showPage = true
    }
    return {
        data,
        page
    }
}
// 处理数据
function getRows (data = {}, state = {}) {
    const { orgName, orgType } = (state.query || {})
    const rows = data.rows || []
    let resRows = rows
    if (orgType) {
        resRows = rows.filter((row) => row.orgType === orgType)
    }
    if (!orgName) {
        return tools.dataToTree(resRows)
    }
    return resRows
}
// 过滤类型和判断是否有管理权限
function setRows (data = [], state) {
    let rows = _.cloneDeep(data)
    if (state.query.orgType) {
        rows = rows.filter((row) => row.orgType === state.query.orgType)
    }
    tools.filterDisabledKeys(rows, 'isOwnOrg')
    rows.forEach(item => {
        if (item.hasChild) {
            item.hasChild = true
            item.children = []
        }
    });
    return rows
}
// 默认状态
const DEFAULTS = {
    // 搜索
    query: {
        orgName: '',
        orgType: 0,
        viewModel: '',

    },
    // 表单窗体
    entity: {
    },
    lazyTreeNodeMap: {},
    // 分页
    showPage: true,
    // 缓存list，用于视图切换
    originRow: [],
    // 用户窗体
    userEntity: {
        pageIndex: 0,
        pageSize: 10,
        list: [],
        total: 0,
        searchUserName: '',
        orgId: null,
        loading: false
    },
    // 更换父节点窗体
    subEntity: {
        list: [],
        total: 0,
        loading: false,
        orgCode: null,
        newParentCode: null,
        prop: {
            children: 'children',
            label: 'orgName'
        }
    }
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.org,
            items: [
                { key: 'createEntity', callee: 'add' },
                { key: 'updateEntity', callee: 'update'},
                { key: 'deleteEntity', callee: 'delete' },


            ]
        }),
        // 加载子节点
        async 'load' ({ commit, state }, { parentId }) {
            commit('update', { loading: true })
            let rows = []
            const params = getParams(state)
            params.data.tenementCode = store.getters.tenementCode
            if (parentId) params.data.parentId = parentId
            const { code, msg, data = [] } = await api.org.queryByParentid({
                data: params.data
            })
            let payload = { loading: false }
            if (code === 200) {
                api.org.queryOrgCount({ data: params.data}).then(res => {
                    console.log(res);
                    if (res.code === 200 && res.data != null && res.data === true) {
                        this._vm.$message.warning("子节点过多，展示前300，未展示节点请查询！");
                    }
                });


                rows = setRows(data, state)
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
            return data
        },
        // 首次查询
        async 'query' ({ commit, state }) {
            commit('update', { loading: true })
            // 在这里做判断搜索类型
            const params = getParams(state)
            params.data.tenementCode = store.getters.tenementCode
            const { code, msg, data = [] } = await api.org.queryByParentid({
                data: params.data
            })
            const payload = { loading: false }
            if (code === 200) {
                const rows = setRows(data, state)
                payload.list = rows
                payload.total = data.length
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
            return payload.list
        },
        async 'queryList' ({ commit, state }) {
            commit('update', { loading: true })
            // 在这里做判断搜索类型
            const params = getParams(state)
            const { code, msg, data = {} } = await api.org.query({
                data: params.data,
                page: params.page
            })
            const payload = { loading: false }
            if (code === 200) {
                const rows = getRows(data, state)
                payload.list = rows
                payload.total = data.rowTotal
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
        // 查询该机构所有用户
        async 'queryListUser' ({ commit, state }, args = {}) {
            if (!args.noEntiry) commit('update', { userEntity: { ...state.userEntity, loading: true } })
            const { code, msg, data = {} } = await api.org.queryUsers({
                data: args.data,
                page: args.page
            })
            const payload = { userEntity: { ...state.userEntity, loading: false }}
            if (code === 200) {
                const rows = data.rows
                payload.userEntity.list = rows
                payload.userEntity.total = data.rowTotal
            } else {
                this._vm.$message.error(msg)
            }
            if (typeof args.callback === 'function') args.callback(data)
            if (!args.noEntiry) commit('update', payload)
        },
        // 获取该机构所有根节点
        async 'queryListByRoot' ({ commit, state }, args = {}) {
            commit('update', { subEntity: { ...state.subEntity, loading: true } })
            const { code, msg, data = [] } = await api.org.queryByRoot({
                data: args.data
            })
            const payload = { subEntity: { ...state.subEntity, loading: false }}
            if (code === 200) {
                // noTop: parentId不为空，orgCode:当前机构orgCode， iterators:disable过滤函数
                const rows = tools.dataToTree(data, {
                    noTop: true,
                    orgCode: state.subEntity.orgCode,
                    iterators: tools.disabledTrees
                })
                payload.subEntity.list = rows
                payload.subEntity.total = data.length
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
        // 变更父节点
        async 'updateParent' ({ commit, state }, { data = {}, done }) {
            commit('update', { subEntity: { ...state.subEntity, loading: true } })
            const { code, msg } = await api.org.updateParent({
                data
            })
            const payload = { subEntity: { ...state.subEntity, loading: false }}
            if (code === 200) {
                this._vm.$message.success(msg)
                if (done) done()
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        }
    }
}, DEFAULTS)
