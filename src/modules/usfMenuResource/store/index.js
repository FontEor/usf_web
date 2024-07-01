import { generateActions, pageListMerge } from "@/store/helper";

// 默认状态
const DEFAULTS = {
    entity: {},
    query: {
        appCode: "usf",
        roleNameLike: ""
    },
    menuRoleList:{},
    parentId: {}
};

export default pageListMerge(
    {
        namespaced: true,
        actions: {
            ...generateActions({
                caller: api.menuResource,
                items: [
                    { key: "createEntity", callee: "add" },
                    { key: "updateEntity", callee: "update" },
                    { key: "queryEntity", callee: "view" },
                    { key: "delete", callee: "delete" },
                    { key: "exist", callee: "exist", wrapByData: false }, //菜单名称是否存在
                    { key: "seqExist", callee: "seqExist", wrapByData: false } //菜单序号
                ]
            }),
            // 查询关联菜单角色列表
            async listForResourceOne({ commit, state }) {
                console.log("===listForResourceOne:", state);
                commit("update", { loading: true });
                const {
                    code,
                    msg,
                    data
                } = await api.rolePermissions.listForResourceOne({
                    data: {
                        id: state.id,
                        roleNameLike: state.roleNameLike
                    },
                    page: {
                        pageIndex: state.menuPageIndex + 1 || 1,
                        pageSize: state.menuPageSize || 10
                    }
                });
                let payload = { loading: false };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    let _menuList = {};
                    _menuList.list = rows;
                    _menuList.total = _.get(data, "rowTotal") || 0;
                    payload["menuRoleList"] = _menuList;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            // 保存关联菜单角色列表勾选
            async updateRolesForResource({ commit, state }) {
                console.log("===updateRolesForResource:", state);
                commit("update", { loading: true });
                const {
                    code,
                    msg,
                    data
                } = await api.rolePermissions.updateRolesForResource({
                    data: {
                        appCode: state.appCode,
                        id: state.id,
                        select: state.pickIdList,
                        all: state.apiIdList
                    }
                });
                let payload = { loading: false };
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
            async queryList({ commit, state }) {
                commit("update", { loading: true });
                const { code, msg, data } = await api.menuResource.queryPage({
                    data: {
                        ...state.query,
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode
                    },
                    page: {
                        //  pageIndex: state.pageIndex,
                        pageIndex: 1,
                        pageSize: 10000
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    if (data && data.rows) {
                        state.rowsTree = data.rows;
                        const rows = tools.dataToTree(data.rows);
                        if (rows[0]) {
                            let expandNum = rows[0].id;
                            state.expandKey = [expandNum + ""];
                        }
                        payload.list = rows;
                        payload.total = data.rowTotal;
                    } else {
                        state.rowsTree = [];
                        const rows = [];
                        payload.list = [];
                        payload.total = 0;
                    }
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            }
        }
    },
    DEFAULTS
);
