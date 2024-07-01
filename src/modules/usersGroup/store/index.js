import { pageListMerge, generateActions } from "@/store/helper";
// 默认状态
const DEFAULTS = {
    entity: {},
    userList: {},
    adminList: {},
    dataType: [],
    menuList: {},
    appCode: "",
    extList: []
};
// 这里指向 /services 下的 index.js 中引用的 users.js
const _api = api.usersGroup;
let _apiList = [];
for (var _k in _api) {
    _apiList.push({
        key: _k,
        callee: _k
    });
}

export default pageListMerge(
    {
        namespaced: true,
        actions: {
            ...generateActions({
                caller: _api,
                // dispatch调用指向这里的key, callee 对应 users.js 里面的key
                items: [
                    ..._apiList,
                    {
                        key: "updateEntity",
                        callee: "update"
                    }
                ]
            }),
            // 用户组管理 列表查询
            async queryList({ commit, state }) {
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.queryPage({
                    data: {
                        ...state.query,
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode
                    },
                    page: {
                        pageIndex: state.pageIndex + 1,
                        pageSize: state.pageSize,
                        pageTotal: 1
                    }
                });

                const payload = {
                    loading: false
                };

                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    payload.list = rows;
                    payload.total = _.get(data, "rowTotal") || 0;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            // 添加 用户组
            async addUser({ commit, state }) {
                state.entity.id = undefined;
                console.log("===addUser:", state);
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.addUser({
                    data: {
                        ...state.entity
                    }
                });
                const payload = {
                    loading: false
                };
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
            // 编辑 用户
            async editUser({ commit, state }) {
                console.log("===editUser:", state);
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.editUser({
                    data: {
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        ...state.entity
                    }
                });
                const payload = {
                    loading: false
                };
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
            // 查询菜单角色列表
            async listForUser({ commit, state }) {
                console.log("===listForUser:", state);
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.ResourceRoleByGroup({
                    data: {
                        userGroupId: state.userId,
                        appCode: state.appCode,
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        roleNameLike: state.roleNameLike,
                        roleCodeLike: state.roleCodeLike
                    },
                    page: {
                        pageIndex: state.menuPageIndex + 1 || 1,
                        pageSize: state.menuPageSize || 10
                    }
                });
                const payload = {
                    loading: false
                };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    let _menuList = {};
                    _menuList.list = rows;
                    _menuList.total = _.get(data, "rowTotal") || 0;
                    payload["menuList"] = _menuList;
                } else {
                    this._vm.$message.error(msg);
                }

                commit("update", payload);
            },
            // 查看菜单角色列表
            async viewResourceRoleByGroup({ commit, state }) {
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.viewResourceRoleByGroup({
                    data: {
                        userGroupId: state.userId,
                        appCode: state.appCode,
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        roleNameLike: state.roleNameLike,
                        roleCodeLike: state.roleCodeLike
                    },
                    page: {
                        pageIndex: state.menuPageIndex + 1 || 1,
                        pageSize: state.menuPageSize || 10
                    }
                });
                const payload = {
                    loading: false
                };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    let _menuList = {};
                    _menuList.list = rows;
                    _menuList.total = _.get(data, "rowTotal") || 0;
                    payload["menuList"] = _menuList;
                } else {
                    this._vm.$message.error(msg);
                }

                commit("update", payload);
            },
            async queryGroupExtList({ commit, state }) {
                commit("update", { loading: true });
                const { code, msg, data } = await _api.queryGroupExtList({
                    data: {
                        tenementCode: this.state.app.tenementCode
                    }
                });

                const payload = { loading: false };
                if (code === 200) {
                    const extList = data
                        ? data.filter(item => item.isEffective === 1)
                        : [];
                    payload.extList = handleSetExtendFields(extList);
                    commit("update", payload);
                    return data;
                } else {
                    // this._vm.$message.error(msg)
                    commit("update", payload);
                    return null;
                }
            },

            //用户组保存扩展字段
            async extGroupAdd({ commit, state }, { extColumnList = [] }) {
                console.log("===queryExtList extColumnList===:", extColumnList);
                const tenementCode = this.state.app.tenementCode;
                const _extColumnList = extColumnList.map(item => {
                    item.tenementCode = tenementCode;
                    return item;
                });
                const { code, msg, data } = await _api.extGroupAdd({
                    data: _extColumnList
                });
                if (code === 200) {
                    return data;
                } else {
                    return null;
                }
            },

            // 查询数据角色列表
            async DataRoleListByGroup({ commit, state }) {
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.DataRoleListByGroup({
                    data: {
                        userGroupId: state.userId,
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        roleNameLike: state.roleNameLike,
                        roleCodeLike: state.roleCodeLike
                    },
                    page: {
                        pageIndex: state.dataPageIndex + 1 || 1,
                        pageSize: state.dataPageSize || 10
                    }
                });
                const payload = {
                    loading: false
                };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    let _userList = {};
                    _userList.list = rows;
                    _userList.total = _.get(data, "rowTotal") || 0;
                    payload["userList"] = _userList;
                } else {
                    this._vm.$message.error(msg);
                }

                commit("update", payload);
            },
            // 查看数据角色列表
            async viewDataRoleListByGroup({ commit, state }) {
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.viewDataRoleListByGroup({
                    data: {
                        userGroupId: state.userId,
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        roleNameLike: state.roleNameLike,
                        roleCodeLike: state.roleCodeLike
                    },
                    page: {
                        pageIndex: state.dataPageIndex + 1 || 1,
                        pageSize: state.dataPageSize || 10
                    }
                });
                const payload = {
                    loading: false
                };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    let _userList = {};
                    _userList.list = rows;
                    _userList.total = _.get(data, "rowTotal") || 0;
                    payload["userList"] = _userList;
                } else {
                    this._vm.$message.error(msg);
                }

                commit("update", payload);
            },
            // 保存 菜单角色
            async addMenuRoleToUserGroup({ commit, state }) {
                console.log("===updateUserRole:", state);
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.addMenuRoleToUserGroup({
                    data: {
                        id: state.userId,
                        menuRoleIdList: state.pickIdList,
                        allMenuRoleIdList: state.apiIdList,
                        appCode: state.appCode
                    }
                });
                const payload = {
                    loading: false
                };
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
            // 保存 数据角色
            async addDataRoleToUserGroup({ commit, state }) {
                console.log("===addDataRoleToUserGroup:", state);
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.addDataRoleToUserGroup({
                    data: {
                        id: state.userId,
                        allDataRoleIdList: state.apiIdList,
                        dataRoleIdList: state.pickIdList
                    }
                });
                const payload = {
                    loading: false
                };
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
            // 查询 组成员列表
            async DataTypeList({ commit, state }) {
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.UserListByGroup({
                    data: {
                        userGroupId: state.userId,
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        userNameLike: state.userNameLike,
                        userCodeLike: state.userCodeLike,
                        userAliasLike: state.userAliasLike
                    },
                    page: {
                        pageIndex: state.dataPageIndex + 1 || 1,
                        pageSize: state.dataPageSize || 10
                    }
                });
                const payload = {
                    loading: false
                };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    let adminList = {};
                    adminList.list = rows;
                    adminList.total = _.get(data, "rowTotal") || 0;
                    payload["adminList"] = adminList;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            // 查看 组成员列表
            async viewUserListByGroup({ commit, state }) {
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.viewUserListByGroup({
                    data: {
                        userGroupId: state.userId,
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        userNameLike: state.userNameLike,
                        userCodeLike: state.userCodeLike,
                        userAliasLike: state.userAliasLike
                    },
                    page: {
                        pageIndex: state.dataPageIndex + 1 || 1,
                        pageSize: state.dataPageSize || 10
                    }
                });
                const payload = {
                    loading: false
                };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    let adminList = {};
                    adminList.list = rows;
                    adminList.total = _.get(data, "rowTotal") || 0;
                    payload["adminList"] = adminList;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            //保存 组成员
            async addUserToUserGroup({ commit, state }) {
                console.log("===addUserToUserGroup:", state);
                commit("update", {
                    loading: true
                });
                const { code, msg, data } = await _api.addUserToUserGroup({
                    data: {
                        userGroupId: state.userId,
                        allUserIdList: state.apiIdList,
                        userIdList: state.pickIdList
                    }
                });
                const payload = {
                    loading: false
                };
                if (code === 200) {
                    this._vm.$message.success(msg);
                    commit("update", payload);
                    return true;
                } else {
                    this._vm.$message.error(msg);
                    commit("update", payload);
                    return false;
                }
            }
        }
    },
    DEFAULTS
);
// 设置添加、编辑弹窗内的扩展字段及规则
function handleSetExtendFields(data = []) {
    const fields = data.map(item => {
        const elem = {
            key: `ext${item.extNo}`,
            name: item.extName,
            required: false,
            type: "input",
            placeholder: "请填写"
        };
        if (item.isRequired === 1) {
            elem.required = true;
            elem.placeholder = "必填";
        }
        if (item.isEnum === 1) {
            elem.type = "select";
            elem.options = jt.fn.generateEnums(item.enumValue, ",");
        }
        if (item.isBigField === 1) {
            elem.type = "textarea";
        }
        if (elem.type === "select" || elem.type === "textarea") {
            elem.rules = [
                {
                    required: elem.required,
                    trigger: "change",
                    message: `请选择${elem.name}`
                }
            ];
        } else if (elem.type === "input") {
            elem.rules = [
                {
                    required: elem.required,
                    trigger: ["blur", "chamge"],
                    message: `请输入${elem.name}`
                }
                // { pattern: CNST.REG_EXP.NORMAL, message: elem.name + '不可输入特殊字符', trigger: 'change' },
                // { trigger: ['change', 'blur'], validator: tools.genValidator({ validateFn: tools.maxCNValidator, message: elem.name + '长度不能超过30个字符', maxLength: 30 }).bind(this) }
            ];
        }
        if (elem.type !== "select") {
            if (elem.rules) {
                elem.rules.push({
                    validator: (rule, value, callback) => {
                        if (value) {
                            if(/\n/.test(value)) {
                                callback(new Error('不允许使用换行符'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    },
                    trigger: 'blur'
                })
            } else {
                elem.rules = [{
                    validator: (rule, value, callback) => {
                        if (value) {
                            if(/\n/.test(value)) {
                                callback(new Error('不允许使用换行符'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    },
                    trigger: 'blur'
                }]
            }
        }
        return elem;
    });
    return fields;
}
