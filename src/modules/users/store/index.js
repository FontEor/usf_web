import { pageListMerge, generateActions } from "@/store/helper";

// 处理数据
function getRows(data = {}, state = {}) {
    const { orgName, orgType } = state.query || {};
    const rows = data.rows || [];
    return tools.dataToTree(rows);
}

// 默认状态
const DEFAULTS = {
    entity: {},
    userList: {},
    adminList: {},
    adminList2: {},
    adminList3: {},
    dataType: [],
    dataType2: [],
    menuList: {},
    appCode: "",
    extList: [],
    extList2: [],
    viewMenuListData: [],
    viewMenuTotal: 0,
    appList: [],
    viewPageSize: 1000000,
    viewPageIndex: 1,
    viewAppCode: "",
    viewMenuRoleListData: [],
    viewMenuRoleTotal: 0,
    viewMenuRolePageSize: 10,
    viewMenuRolePageIndex: 0,
    // 分页
    showPage: false
};
// 这里指向 /services 下的 index.js 中引用的 users.js
const _api = api.users;
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
                    // ..._apiList,
                    { key: "updateEntity", callee: "update" }
                ]
            }),
            // 用户管理 列表查询
            async queryList({ commit, state }) {
                commit("update", { loading: true });
                const { code, msg, data } = await _api.queryUserListByPage({
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

                const payload = { loading: false };

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
            // 添加 用户
            async addUser({ commit, state }) {
                state.entity.id = undefined;
                console.log("===addUser:", state);
                commit("update", { loading: true });
                const encrypt = new window.JSEncrypt();
                encrypt.setPublicKey(CNST.PUBLICKEY);
                const userPassWd = encrypt.encrypt(state.entity.userPassWd);
                console.log(userPassWd);
                const { code, msg, data } = await _api.addUser({
                    ...state.entity,
                    userPassWd,
                    userTystemType: 1 // 账号体系类型
                });
                const payload = { loading: false };
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
                commit("update", { loading: true });
                const { code, msg, data } = await _api.editUser({
                    ...state.entity,
                    userTystemType: 1 // 账号体系类型
                });
                const payload = { loading: false };
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
            // 启用
            async enableUser({ commit, state }) {
                console.log("===enableUser:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.enableUser({
                    id: state.setId
                });
                const payload = { loading: false };
                if (code === 200) {
                    this._vm.$message.success(msg);
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            // 停用
            async disableUser({ commit, state }) {
                console.log("===disableUser:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.disableUser({
                    id: state.setId
                });
                const payload = { loading: false };
                if (code === 200) {
                    this._vm.$message.success(msg);
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            // 点击编辑查询用户详情
            async findUserById({ commit, state }) {
                console.log("===findUserById:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.findUserById({
                    id: state.setId
                });
                const payload = { loading: false };
                if (code === 200) {
                    // this._vm.$message.success(msg)
                    commit("update", payload);
                    return data;
                } else {
                    this._vm.$message.error(msg);
                    commit("update", payload);
                }
            },
            // 所属部门
            async queryTreeOrgList({ commit, state }) {
                console.log("===queryTreeOrgList:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.queryTreeOrgList({
                    data: {
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode
                        // "orgType": 1 //不传值：查询所有机构(机构/部门)；传值：查类型为机构的传1   查类型为部门的传2
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    payload["treeOrgList"] = data;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            // 查询菜单角色列表
            async listForUser({ commit, state }) {
                console.log("===listForUser:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.listForUser({
                    data: {
                        appCode: state.appCode,
                        userId: state.userId,
                        roleNameLike: state.roleNameLike,
                        roleCodeLike: state.roleCodeLike,
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode
                    },
                    page: {
                        pageIndex: state.menuPageIndex + 1 || 1,
                        pageSize: state.menuPageSize || 10
                    }
                });
                const payload = { loading: false };
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
            // 查询数据角色列表
            async queryDataRoleByUser({ commit, state }) {
                console.log("===queryDataRoleByUser:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.queryDataRoleByUser({
                    data: {
                        tenementCode: this.state.app.tenementCode,
                        userId: state.userId,
                        roleName: state.roleNameLike,
                        roleCodeLike: state.roleCodeLike,
                    },
                    page: {
                        pageIndex: state.dataPageIndex + 1 || 1,
                        pageSize: state.dataPageSize || 10
                    }
                });
                const payload = { loading: false };
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
            async updateUserRole({ commit, state }) {
                console.log("===updateUserRole:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.updateUserRole({
                    data: {
                        userId: state.userId,
                        select: state.pickIdList,
                        all: state.apiIdList
                    }
                });
                const payload = { loading: false };
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
            async assignDataRoles({ commit, state }) {
                console.log("===assignDataRoles:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.assignDataRoles({
                    id: state.userId,
                    allDataRoleIdList: state.apiIdList,
                    dataRoleIdList: state.pickIdList
                });
                const payload = { loading: false };
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
            // 设置数据权限 数据类型 下拉列表
            async DataTypeList({ commit, state }) {
                console.log("===DataTypeList:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.DataTypeList({
                    data: {
                        typeNameLike: "",
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode
                    },
                    page: {
                        pageIndex: state.dataPageIndex + 1 || 1,
                        pageSize: 1000000000
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    payload["dataType"] = rows;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            // 设置数据权限 数据类型 下拉列表
            async DataTypeList2({ commit, state }) {
                console.log("===DataTypeList:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.DataTypeList({
                    data: {
                        typeNameLike: "",
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode
                    },
                    page: {
                        pageIndex: state.dataPageIndex + 1 || 1,
                        pageSize: 1000000000
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    payload["dataType2"] = rows;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            // 查询数据权限列表 new
            async DataAssignList({ commit, state }) {
                // debugger
                console.log("===DataAssignList:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.DataAssignList({
                    data: {
                        // "tenementCode": "xinzhou",
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        typeId: state.entity.typeId,
                        userId: state.userId,
                        orgName: state.entity.orgName,
                        ...state.entity.searchList
                    },
                    page: {
                        pageIndex: state.adminPageIndex + 1 || 1,
                        pageSize: state.adminPageSize || 10
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    let _adminList = {};
                    _adminList.list = rows;
                    _adminList.total = _.get(data, "rowTotal") || 0;
                    payload["adminList"] = _adminList;
                } else {
                    this._vm.$message.error(msg);
                }

                commit("update", payload);
                return payload.adminList.list;
            },
            // 查询数据权限列表
            async queryUserBaseData({ commit, state }) {
                console.log("===queryUserBaseData:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.queryUserBaseData({
                    data: {
                        // "tenementCode": "xinzhou",
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        typeId: state.entity.typeId,
                        userId: state.userId,
                        ...state.entity.searchList
                    },
                    page: {
                        pageIndex: state.adminPageIndex + 1 || 1,
                        pageSize: state.adminPageSize || 10
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    let _adminList = {};
                    _adminList.list = rows || [];
                    _adminList.total = _.get(data, "rowTotal") || 0;
                    payload["adminList2"] = _adminList;
                } else {
                    this._vm.$message.error(msg);
                }

                commit("update", payload);
                return payload.adminList2.list;
            },
            // 查询userGroup
            async queryUserGroup({ commit, state }) {
                commit("update", { loading: true });
                const { code, msg, data } = await _api.queryUserGroup({
                    data: {
                        // "tenementCode": "xinzhou",
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        id: state.userId,
                        userCode: state.userCode
                    },
                    page: {
                        pageIndex: state.adminPageIndex + 1 || 1,
                        pageSize: state.adminPageSize || 10
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    rows.forEach(row => {
                        row.children = [];
                        row.hasChildren = true;
                    });
                    let _adminList = {};
                    _adminList.list = rows || [];
                    _adminList.total = _.get(data, "rowTotal") || 0;
                    payload["adminList3"] = _adminList;
                } else {
                    this._vm.$message.error(msg);
                }

                commit("update", payload);
                return payload.adminList3.list;
            },
            // 保存 数据权限
            async DataAssign({ commit, state }) {
                console.log("===DataAssign:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.DataAssign({
                    data: {
                        userId: state.userId,
                        select: state.pickIdList,
                        all: state.apiIdList
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    if (data && data.length > 0) {
                        const h = this._vm.$createElement;
                        const failResultList = data.map(item =>
                            h(
                                "p",
                                null,
                                `数据资源编码：${
                                    item.dataCode
                                }，分配失败原因：${item.mark}`
                            )
                        );
                        this._vm.$message.error({
                            message: h(
                                "section",
                                { style: "color:#E1251B;" },
                                [h("p", null, "用户分配数据资源失败")].concat(
                                    failResultList
                                )
                            ),
                            duration: 5000,
                            showClose: true,
                            customClass: "data-resource-message"
                        });
                        commit("update", payload);
                        return "assign";
                    }
                    this._vm.$message.success(msg);
                    commit("update", payload);
                    return true;
                } else {
                    this._vm.$message.error(msg);
                    commit("update", payload);
                    return false;
                }
            },
            // 查询用户扩展字段列表
            async queryExtList({ commit, state }) {
                console.log("===queryExtList state===:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await _api.queryExtList({
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
                    const newExtList = handleSetExtendFields(extList);
                    console.log(state.extList2, "state.extList211");
                    state.extList2 = [];
                    if (newExtList.length > 0) {
                        for (var i = 0; i < newExtList.length; i++) {
                            if (newExtList[i].type !== "textarea") {
                                state.extList2.push(newExtList[i]);
                            }
                        }
                    }
                    console.log(state.extList2, "state.extList2");
                    commit("update", payload);
                    return data;
                } else {
                    // this._vm.$message.error(msg)
                    commit("update", payload);
                    return null;
                }
            },

            // 添加用户扩展字段
            async extAdd({ commit, state }, { extColumnList = [] }) {
                console.log("===queryExtList extColumnList===:", extColumnList);
                const tenementCode = this.state.app.tenementCode;
                const _extColumnList = extColumnList.map(item => {
                    item.tenementCode = tenementCode;
                    return item;
                });
                // const _extColumnList = extColumnList.filter((item) => {
                //     return item.extName !== ''
                // }).map((item) => {
                //     item.tenementCode = tenementCode
                //     return item
                // })
                const { code, msg, data } = await _api.extAdd({
                    data: _extColumnList
                });
                if (code === 200) {
                    return data;
                } else {
                    return null;
                }
            },

            // 编辑用户扩展字段
            async extUpdate({ commit, state }, { extColumnList }) {
                console.log("===queryExtList extColumnList===:", extColumnList);
                const tenementCode = this.state.app.tenementCode;
                const _extColumnList = extColumnList.map(item => {
                    item.tenementCode = tenementCode;
                    return item;
                });
                const { code, msg, data } = await _api.extUpdate({
                    data: _extColumnList
                });
                if (code === 200) {
                    return data;
                } else {
                    return null;
                }
            },
            // 查看菜单资源权限列表
            async viewMenuList({ commit, state }) {
                commit("update", { loading: true });
                // 在这里做判断搜索类型
                const params = {
                    page: {
                        pageSize: state.viewPageSize,
                        pageIndex: state.viewPageIndex
                    },
                    data: state.query
                };
                const { code, msg, data = {} } = await _api.viewMenuForUser({
                    data: {
                        ...params.data,
                        appCode: state.viewAppCode,
                        id: state.userId
                    },
                    page: params.page
                });
                const payload = { loading: false };
                if (code === 200) {
                    const rows = getRows(data, state);
                    console.log("queryList rows:", rows);
                    payload.viewMenuListData = rows;
                    payload.viewMenuTotal = data.rowTotal;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
            },
            // 软件系统
            async queryAppList({ commit, state }) {
                commit("update", { loading: true });
                // 在这里做判断搜索类型
                const {
                    code,
                    msg,
                    data = {}
                } = await api.menuPermissions.queryAppList({
                    tenementCode: this.state.app.tenementInfoObj.tenementCode
                });

                const payload = { loading: false };
                if (code === 200) {
                    payload["appList"] = data;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
                return payload;
            },
            async queryGlobalSwitchAboutUserCfg({ commit, state }) {
                console.log("===queryGlobalSwitchAboutUserCfg===:");
                const {
                    success,
                    msg
                } = await _api.queryGlobalSwitchAboutUserCfg();
                const payload = {
                    loading: false
                };
                commit("update", payload);
                return success;
            },
            //重置用户密码、手机号、邮箱
            async resetUserInfoPTE({ commit, state }) {
                console.log("===resetUserInfoPTE===:", state);
                const { code, msg, data } = await _api.resetUserInfoPTE({
                    data: {
                        userId: state.userId,
                        userSelectType: state.entity.userSelectType,
                        userPassWd: state.entity.userPassWd,
                        confirmUserPassWd: state.entity.confirmUserPassWd,
                        userTel: state.entity.userTel,
                        confirmUserTel: state.entity.confirmUserTel,
                        userEmail: state.entity.userEmail,
                        confirmUserEmail: state.entity.confirmUserEmail
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
            // 查看用户菜单角色
            async viewMenuRoleList({ commit, state }) {
                commit("update", { loading: true });
                // 在这里做判断搜索类型
                const params = {
                    page: {
                        pageSize: state.viewMenuRolePageSize,
                        pageIndex: state.viewMenuRolePageIndex + 1
                    },
                    data: state.query
                };
                const { code, msg, data = {} } = await _api.viewMenuRoleForUser({
                    data: {
                        ...params.data,
                        appCode: state.viewAppCode,
                        userId: state.userId,
                    },
                    page: params.page
                });
                const payload = { loading: false };
                if (code === 200) {
                    payload.viewMenuRoleListData = data.rows || [];
                    payload.viewMenuRoleTotal = data.rowTotal;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
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
