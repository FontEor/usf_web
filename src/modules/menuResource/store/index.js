import {generateActions, pageListMerge} from '@/store/helper'

// 默认状态
const DEFAULTS = {
    appSource:"",
    entity: {},
    query: {
        "appCode": undefined,
        "roleName": undefined,
        "roleCode": undefined
    },
    expandKey: [],
    menuList: {},
    menuRoleList:{},
    parentId:{},
    lazyTreeNodeMap:{},
      // 更换父节点窗体
      subEntity: {
        list: [],
        total: 0,
        loading: false,
        id: null,
        newParentId: null,
        prop: {
            children: 'children',
            label: 'resourceName'
        }
    },
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.menuResource,
            items: [
                { key: 'createEntity', callee: 'add' },
                { key: 'updateEntity', callee: 'update' },
                { key: 'queryEntity', callee: 'view' },
                { key: 'delete', callee: 'delete' },
                { key: 'queryList', callee: 'queryPage' },
                { key: 'queryAppListForMenuResource', callee: 'queryAppListForMenuResource' },
                { key: 'exist', callee: 'exist',wrapByData:false }, //菜单名称是否存在
                { key: 'seqExist', callee: 'seqExist',wrapByData:false }, //菜单序号
            ]
        }),
        async 'queryList' ({ commit, state }) {
            if (!state.query.appCode) {
                return false
            }
            commit('update', { loading: true })
            const { code, msg, data } = await api.menuResource.queryPage({
                data: {
                    ...state.query,
                    tenementCode:  this.state.app.tenementInfoObj.tenementCode
                },
                page: {
                    pageIndex: 1,
                    pageSize: 10000
                }
            })
            const payload = { loading: false }
            if (code === 200) {
               if (data && data.rows) {
                   state.rowsTree = data.rows
                   const rows =  tools.dataToTree(data.rows)
                   if(rows[0]){
                       let expandNum=rows[0].id
                      //  state.expandKey=[expandNum+'']
                       state.expandKey.splice(0,1,expandNum)
                   }

                   payload.list = rows
                   payload.total = data.rowTotal

               } else {

                   state.rowsTree = []
                   const rows =  []
                   payload.list = []
                   payload.total = 0
               }
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
           // 加载子节点
           async 'load'({
            commit,
            state
        }, {
            parentId
        }) {
            commit('update', {
                loading: true
            });
            let rows = [];

            const { code, msg, data } = await api.menuResource.queryPage({
                data: {
                    parentId:parentId,
                    ...state.query,
                    tenementCode:  this.state.app.tenementInfoObj.tenementCode
                },
                page: {
                    pageIndex: 1,
                    pageSize: 500
                }
            })
            let payload = {
                loading: false
            };
            if (code === 200) {
                rows = data.rows;
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
            return rows
        },
        // 查询菜单角色列表
        async 'listMenuRole' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await api.users.listForUser({
                data: {
                    "appCode": state.appCode,
                    "userId": state.userId,
                    "roleName": state.roleName,
                    "roleCode": state.roleCode,
                    "tenementCode": this.state.app.tenementInfoObj.tenementCode,
                },
                page: {
                    pageIndex: state.menuPageIndex + 1 || 1,
                    pageSize: state.menuPageSize || 10
                }
            })
            const payload = { loading: false }
            if (code === 200) {
                const rows = _.get(data, 'rows') || []
                rows.forEach(row => {
                    row.children = []
                    row.hasChildren = true
                })
                let _menuList = {}
                _menuList.list = rows
                _menuList.total = _.get(data, 'rowTotal') || 0
                payload['menuList'] = _menuList
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
        // 已分配保存
        async 'saveMenuRole'({state,commit}){
            commit('update', {loading:true})
            const {code, msg, data = {}} = await api.menuResource.saveMenuRole({

            })
            const payload = { loading: false }
            if (code === 200) {
                this._vm.$message.error(msg)
                commit('update', payload)
                return true
            } else {
                this._vm.$message.error(msg)
                return false
            }
        },
        // 查询关联菜单角色列表
        async listForResourceOne({ commit, state }){
            commit('update', { loading: true })
            const { code, msg, data } = await api.rolePermissions.listForResourceOne({
                data: {
                    "id": state.id,
                    "roleNameLike": state.roleNameLike,
                },
                page: {
                    pageIndex: state.menuPageIndex + 1 || 1,
                    pageSize: state.menuPageSize || 10
                }
            })
            let payload = { loading: false }
            if (code === 200) {
                const rows = _.get(data, 'rows') || []
                let _menuList = {}
                _menuList.list = rows
                _menuList.total = _.get(data, 'rowTotal') || 0
                payload['menuRoleList'] = _menuList
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
        // 保存关联菜单角色列表勾选
        async updateRolesForResource({ commit, state }){
            commit('update', { loading: true })
            const { code, msg, data } = await api.rolePermissions.updateRolesForResource({
                data: {
                    "appCode": state.appCode,
                    "id": state.id,
                    "select": state.pickIdList,
                    "all": state.apiIdList
                }
            })
            let payload = { loading: false }
            if (code === 200) {
                this._vm.$message.success(msg);
                commit("update", payload);
                return true;
            } else {
                this._vm.$message.error(msg);
                commit("update", payload);
                return false;
            }
        },
        // 菜单资源管理的阿萨德 软件系统
        async 'queryAppListForMenuResource' ({ commit, state }) {
            commit('update', { loading: true })
            // 在这里做判断搜索类型
            const { code, msg, data = {} } = await api.menuResource.queryAppListForMenuResource({
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
        //以下可删
        async 'exchange' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await api.menuResource.exchange()
            const payload = { loading: false }
            if (code === 200) {
                this._vm.$message.error(msg)
                commit('update', payload)
                return true
            } else {
                this._vm.$message.error(msg)
                return false
            }

        },
    }
}, DEFAULTS)
