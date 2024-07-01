import { pageListMerge, generateActions } from '@/store/helper'
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
    const { orgName = '', orgType } = (state.query || {})
    const data = state.query
    // const data = orgType ? { orgName, orgType } : { orgName }
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
// 默认状态
const DEFAULTS = {
    // 搜索
    query: {
        orgName: '',
        orgType: 0,
        viewModel: '',
        appCode: '',
        roleNameLike: ''
    },
    // 表单窗体
    entity: {
    },
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
            caller: api.menuPermissions,
            items: [
                { key: 'createEntity', callee: 'add' },
                { key: 'updateEntity', callee: 'update'},
                { key: 'deleteEntity', callee: 'delete' },
                { key: 'queryAppList', callee: 'queryAppList' },
            ]
        }),
        async 'queryList' ({ commit, state }) {
            commit('update', { loading: true })
            // 在这里做判断搜索类型
            const params = getParams(state)
            const { code, msg, data = {} } = await api.menuPermissions.query({
                data: {
                    ...params.data,
                    tenementCode: this.state.app.tenementInfoObj.tenementCode
                },
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
        // 软件系统
        async 'queryAppList' ({ commit, state }) {
            commit('update', { loading: true })
            // 在这里做判断搜索类型
            const { code, msg, data = {} } = await api.menuPermissions.queryAppList({
                tenementCode: this.state.app.tenementInfoObj.tenementCode
            })

            const payload = { loading: false }
            if (code === 200) {
                payload['appList'] = data
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
            return payload
        },
        // 查询该机构所有用户
        async 'queryListUser' ({ commit, state }, args = {}) {
            if (!args.noEntiry) commit('update', { userEntity: { ...state.userEntity, loading: true } })
            const { code, msg, data = {} } = await api.menuPermissions.queryUsers({
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
            const { code, msg, data = [] } = await api.menuPermissions.queryByRoot({
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
            const { code, msg } = await api.menuPermissions.updateParent({
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
