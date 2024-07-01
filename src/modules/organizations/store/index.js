import { pageListMerge, generateActions } from "@/store/helper";
import store from "@/store";
// 获取参数
function getParams(state = {}) {
    const VIEWMODELMAP = [
        {
            key: 0,
            value: "全部显示"
        },
        {
            key: 1,
            value: "仅显示机构"
        },
        {
            key: 2,
            value: "仅显示部门"
        }
    ];
    const { pageIndex = 0, pageSize = 10 } = state;
    const viewModel = _.trim(_.get(state, "query.viewModel"));
    const view = _.filter(VIEWMODELMAP, function(o) {
        return o.value === viewModel;
    });
    if (view && view.length) {
        state.query.orgType = view[0].key;
        state.query.viewModel = view[0].value;
    }
    const { orgName = "", orgCode = "", orgType } = state.query || {};
    const data = orgType
        ? {
              orgName,
              orgType,
              orgCode,
              ...state.query
          }
        : {
              orgName,
              orgCode,
              ...state.query
          };
    const page = {
        pageIndex: pageIndex + 1,
        pageSize
    };
    if (!orgName) {
        page.pageIndex = 1;
        page.pageSize = 1000000000;
        state.showPage = false;
    } else {
        state.showPage = true;
    }
    return {
        data,
        page
    };
}
// 处理数据
function getRows(data = {}, state = {}) {
    const { orgName, orgType } = state.query || {};
    const rows = data.rows || [];
    let resRows = rows;
    if (orgType) {
        resRows = rows.filter(row => row.orgType === orgType);
    }
    tools.filterDisabledKeys(resRows, "isOwnOrg");
    if (!orgName) {
        return tools.dataToTree(resRows);
    }
    return resRows;
}
// 过滤类型和判断是否有管理权限
function setRows(data = [], state) {
    let rows = _.cloneDeep(data);
    if (state.query.orgType) {
        rows = rows.filter(row => row.orgType === state.query.orgType);
    }
    tools.filterDisabledKeys(rows, "isOwnOrg");
    return rows;
}
// 默认状态
const DEFAULTS = {
    // 搜索
    query: {
        orgName: "",
        orgType: 0,
        viewModel: ""
    },
    lazyTreeNodeMap: {},
    // 表单窗体
    entity: {},
    // 分页
    showPage: true,
    // 用户窗体
    userEntity: {
        pageIndex: 0,
        pageSize: 10,
        list: [],
        total: 0,
        searchUserName: "",
        orgId: null,
        loading: false
    },
    // 更换父节点窗体
    subEntity: {
        list: [],
        total: 0,
        loading: false,
        id: null,
        newParentId: null,
        prop: {
            children: "children",
            label: "orgName"
        }
    },
    rolesEntity: {
        pageIndex: 0,
        pageSize: 10,
        list: [],
        appList: [],
        total: 0,
        loading: false,
        orgId: null,
        orgCode: null,
        appCode: null,
        roleNameLike: "",
        roleCodeLike: "",
        menuRoleIdList: [],
        allMenuRoleIdList: []
    },
    userList: [],
    dataType: [],
    adminList: {},
    extList: []
};

export default pageListMerge(
    {
        namespaced: true,
        actions: {
            ...generateActions({
                caller: api.org,
                items: [
                    {
                        key: "createEntity",
                        callee: "add"
                    },
                    {
                        key: "updateEntity",
                        callee: "update"
                    },
                    {
                        key: "deleteEntity",
                        callee: "delete"
                    }
                ]
            }),
            // 加载子节点
            async load({ commit, state }, { parentId }) {
                commit("update", {
                    loading: true
                });
                let rows = [];
                const params = getParams(state);
                params.data.tenementCode = store.getters.tenementCode;
                if (parentId) params.data.parentId = parentId;
                const { code, msg, data = [] } = await api.org.queryByParentid({
                    data: params.data
                });
                let payload = {
                    loading: false
                };
                if (code === 200) {
                    api.org.queryOrgCount({ data: params.data }).then(res => {
                        console.log(res);
                        if (
                            res.code === 200 &&
                            res.data != null &&
                            res.data === true
                        ) {
                            this._vm.$message.warning(
                                "子节点过多，展示前300，未展示节点请查询！"
                            );
                        }
                    });

                    rows = setRows(data, state);
                    console.log(rows, "org de ");
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
                return rows;
            },
            // 首次查询
            async query({ commit, state }) {
                commit("update", {
                    loading: true
                });
                // 在这里做判断搜索类型
                const params = getParams(state);
                params.data.tenementCode = store.getters.tenementCode;
                const { code, msg, data = [] } = await api.org.queryByParentid({
                    data: params.data
                });
                const payload = {
                    loading: false
                };
                if (code === 200) {
                    const rows = setRows(data, state);
                    payload.list = rows;
                    payload.total = data.length;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
                return payload.list;
            },
            //分页查询
            async queryList({ commit, state }) {
                commit("update", {
                    loading: true
                });
                console.time();
                // 在这里做判断搜索类型
                const params = getParams(state);
                params.data.tenementCode = store.getters.tenementCode;
                const { code, msg, data = {} } = await api.org.query({
                    data: params.data,
                    page: params.page
                });
                const payload = {
                    loading: false
                };
                if (code === 200) {
                    const rows = getRows(data, state);
                    payload.list = rows;
                    payload.total = data.rowTotal;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
                console.timeEnd();
                return payload.list;
            },
            // 查询该机构所有用户
            async queryListUser({ commit, state }, args = {}) {
                if (!args.noEntiry)
                    commit("update", {
                        userEntity: {
                            ...state.userEntity,
                            loading: true
                        }
                    });
                const { code, msg, data = {} } = await api.org.queryUsers({
                    data: args.data,
                    page: args.page
                });
                const payload = {
                    userEntity: {
                        ...state.userEntity,
                        loading: false
                    }
                };
                if (code === 200) {
                    const rows = data.rows;
                    payload.userEntity.list = rows;
                    payload.userEntity.total = data.rowTotal;
                    if (typeof args.done === "function") args.done(data);
                } else {
                    this._vm.$message.error(msg);
                }
                if (!args.noEntiry) commit("update", payload);
                return data;
            },
            // 验证类型为企业的机构删除条件
            async validateOrgTypeSatisfy({ commit, state }, args = {}) {
                if (!args.noEntiry)
                    commit("update", {
                        userEntity: {
                            ...state.userEntity,
                            loading: true
                        }
                    });
                const {
                    code,
                    msg,
                    data
                } = await api.org.validateOrgTypeSatisfy({
                    data: args.data
                });
                const payload = {
                    userEntity: {
                        ...state.userEntity,
                        loading: false
                    }
                };
                if (code === 200) {
                    if (typeof args.done === "function") args.done(data);
                } else {
                    this._vm.$message.error(data);
                }
                if (!args.noEntiry) commit("update", payload);
                return data;
            },
            // 设置数据权限 数据类型 下拉列表
            async DataTypeList({ commit, state }) {
                console.log("===DataTypeList:", state);
                commit("update", { loading: true });
                const {
                    code,
                    msg,
                    data
                } = await api.organizations.DataTypeList({
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
            // 查询数据权限列表
            async DataAssignList({ commit, state }) {
                console.log("===DataAssignList:", state);
                commit("update", { loading: true });
                const {
                    code,
                    msg,
                    data
                } = await api.organizations.queryBaseDataList({
                    data: {
                        // "tenementCode": "xinzhou",
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode,
                        typeId: state.entity.typeId,
                        orgId: state.userId,
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
            // 保存机构分配数据角色
            async addOrgDataRoleRel({ commit, state }) {
                console.log("===addOrgDataRoleRel:", state);
                commit("update", { loading: true });
                const {
                    code,
                    msg,
                    data
                } = await api.organizations.addOrgDataRoleRel({
                    data: {
                        id: state.userId,
                        dataRoleIdList: state.pickIdList,
                        allDataRoleIdList: state.apiIdList
                    },

                    page: {
                        pageIndex: state.dataPageIndex || 0,
                        pageSize: state.dataPageSize || 10
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    this._vm.$message.success(msg);
                    commit("update", payload);
                    return false; // 提交成功后也不关闭
                } else {
                    this._vm.$message.error(msg);
                    commit("update", payload);
                    return false;
                }
            },
            // 保存 数据权限
            async DataAssign({ commit, state }) {
                console.log("===DataAssign:", state);
                commit("update", { loading: true });
                const {
                    code,
                    msg,
                    data
                } = await api.organizations.assignOrgData({
                    data: {
                        orgId: state.userId,
                        selectIds: state.pickIdList,
                        allCurrentIds: state.apiIdList
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    this._vm.$message.success(msg);
                    commit("update", payload);
                    return false; // 提交成功后也不关闭
                } else {
                    this._vm.$message.error(msg);
                    commit("update", payload);
                    return false;
                }
            },
            // 获取该机构所有根节点
            async queryListByRoot({ commit, state }, args = {}) {
                commit("update", {
                    subEntity: {
                        ...state.subEntity,
                        loading: true
                    }
                });
                const { code, msg, data = [] } = await api.org.queryByRoot({
                    data: args.data
                });
                const payload = {
                    subEntity: {
                        ...state.subEntity,
                        loading: false
                    }
                };
                if (code === 200) {
                    // noTop: parentId不为空，id:当前机构id， iterators:disable过滤函数
                    const rows = tools.dataToTree(data, {
                        noTop: true,
                        id: state.subEntity.id,
                        iterators: tools.disabledTrees
                    });
                    payload.subEntity.list = rows;
                    payload.subEntity.total = data.length;
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
                return data;
            },
            // 变更父节点-父子节点关系变更
            async updateParent({ commit, state }, { data = {}, done }) {
                commit("update", {
                    subEntity: {
                        ...state.subEntity,
                        loading: true
                    }
                });
                const { code, msg } = await api.org.updateParent({
                    data
                });
                const payload = {
                    subEntity: {
                        ...state.subEntity,
                        loading: false
                    }
                };
                if (code === 200) {
                    this._vm.$message.success(msg);
                    if (typeof done === "function") done(data);
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
                return {
                    code,
                    msg
                };
            },
            // 机构角色列表
            async queryListRoles({ commit, state }, args = {}) {
                commit("update", {
                    rolesEntity: {
                        ...state.rolesEntity,
                        loading: true
                    }
                });
                const { code, msg, data = {} } = await api.org.roleList({
                    data: args.data,
                    page: args.page
                });
                const payload = {
                    rolesEntity: {
                        ...state.rolesEntity,
                        loading: false
                    }
                };
                let checkedRows = [];
                if (code === 200) {
                    const rows = _.result(data, "rows", []);
                    checkedRows = tools.filterJSON(rows, "isOwnRole", 1);
                    payload.rolesEntity.list = rows;
                    payload.rolesEntity.total = data.rowTotal;
                    payload.rolesEntity.allMenuRoleIdList = tools.getJSONKeys(
                        rows,
                        "id"
                    );
                    payload.rolesEntity.menuRoleIdList = tools.getJSONKeys(
                        checkedRows,
                        "id"
                    );
                    if (typeof args.done === "function") args.done(checkedRows);
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
                return data;
            },
            // 更新机构菜单角色
            async updateRoles(
                { commit, state },
                { data = {}, page = {}, done }
            ) {
                commit("update", {
                    rolesEntity: {
                        ...state.rolesEntity,
                        loading: true
                    }
                });
                const { code, msg } = await api.org.addOrgRoleRel({
                    data,
                    page
                });
                const payload = {
                    rolesEntity: {
                        ...state.rolesEntity,
                        loading: false
                    }
                };
                if (code === 200) {
                    this._vm.$message.success(msg);
                    if (typeof done === "function") done();
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
                return {
                    code,
                    msg
                };
            },
            // 根据机构查询数据角色列表
            async queryDataRolesList({ commit, state }) {
                console.log("===queryDataRolesList:", state);
                commit("update", { loading: true });
                const { code, msg, data } = await api.org.dataRoleList({
                    data: {
                        orgId: state.userId,
                        roleNameLike: state.roleNameLike || "",
                        roleCodeLike: state.roleCodeLike || "",
                        tenementCode: this.state.app.tenementInfoObj
                            .tenementCode
                    },
                    page: {
                        pageIndex: state.dataPageIndex + 1 || 1,
                        pageSize: state.dataPageSize || 10
                    }
                });
                const payload = { loading: false };
                if (code === 200) {
                    const rows = _.get(data, "rows") || [];
                    let _userList = {};
                    _userList.list = rows;
                    _userList.total = _.get(data, "rowTotal") || 0;
                    payload["userList"] = _userList;
                } else {
                    this._vm.$message.error(msg);
                }

                commit("update", payload);
            },

            // 查询机构扩展字段列表
            async queryExtList({ commit, state }) {
                console.log(
                    "===dddddddddddddddddddqueryExtList state===:",
                    state
                );
                commit("update", { loading: true });
                const {
                    code,
                    msg,
                    data
                } = await api.organizations.queryExtendField({
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
                } else {
                    this._vm.$message.error(msg);
                }
                commit("update", payload);
                return data;
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
            ];
        }
        return elem;
    });
    return fields;
}

function f(params) {
    // 111
    let ret = false;

    console.log("sssss");

    console.log("sssss1111 ==== " + ret);

    return ret;
}
