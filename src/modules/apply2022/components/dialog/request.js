import axios from "axios";
import { get } from "lodash";
import store from "../../store/index.js";

export default {
    computed: {
        // applyUser applyAdmin
        applyType() {
            return store.state.applyType;
        },
        // applyType
        storeForm() {
            return store.state.form;
        },
        usersList() {
            return store.state.usersList;
        }
    },
    methods: {
        // 获取数据角色列表接口
        getDataRoleRequest() {
            const config = {
                method: "post",
                data: {
                    data: {
                        tenementCode: this.tenantId,
                        ...this.query
                    },
                    page: this.page
                },
                params: {
                    tenementCode: this.tenantId
                }
            };
            switch (this.applyType) {
                case "applyUser":
                    config.url = "/businessApply/queryDataRoleList.do";
                    config.data.data.applyType = this.storeForm.applyType;
                    config.data.data.assignType = this.storeForm.assignType;
                    // self 个人 other 代人申请
                    switch (this.storeForm.applyType) {
                        case "self":
                            config.data.data.orgCode =
                                this.storeForm.usfOrgId || undefined;
                            break;
                        case "other":
                            // 判定是否为代人申请
                            config.data.data.usersForOther = this.storeForm.usersForOther;
                            if (this.storeForm.assignType === "1") {
                                config.data.data.usersForOther = this.storeForm.usersForOther.map(
                                    ({ id, orgId, orgName, userCode }) => ({
                                        id,
                                        orgCode: orgId,
                                        orgName,
                                        userCode
                                    })
                                );
                            }
                            config.data.data.userSystemTypeForOther = this.storeForm.userSystemTypeForOther;
                            // 拾取一个申请账号
                            const userCode = this.storeForm
                                .userCodesForOther[0];
                            const instance = this.usersList.find(
                                item => item.userCode === userCode
                            );
                            // 如果有此用户那么使用他的机构 否则 使用代人申请快速创建中的机构数据
                            if (instance) {
                                config.data.data.orgCode = instance.orgCode;
                            } else {
                                config.data.data.orgCode = this.storeForm.orgCodeForOther;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case "applyAdmin":
                    config.url = "/adminApply/queryDataRoleAuthList.do";
                    break;
                default:
                    console.log(
                        "未知的申请类型: getDataRoleRequest",
                        this.applyType
                    );
                    break;
            }
            return axios(config);
        },
        // 获取用户组列表接口
        getUserGroupRequest() {
            const config = {
                method: "post",
                data: {
                    data: {
                        tenementCode: this.tenantId,
                        ...this.query
                    },
                    page: this.page
                },
                params: {
                    tenementCode: this.tenantId
                }
            };
            switch (this.applyType) {
                case "applyUser":
                    config.url = "/businessApply/queryGroupList.do";
                    config.data.data.applyType = this.storeForm.applyType;
                    config.data.data.assignType = this.storeForm.assignType;
                    // self 个人 other 代人申请
                    switch (this.storeForm.applyType) {
                        case "self":
                            config.data.data.orgCode =
                                this.storeForm.usfOrgId || undefined;
                            break;
                        case "other":
                            // 判定是否为代人申请
                            config.data.data.usersForOther = this.storeForm.usersForOther;
                            if (this.storeForm.assignType === "1") {
                                config.data.data.usersForOther = this.storeForm.usersForOther.map(
                                    ({ id, orgId, orgName, userCode }) => ({
                                        id,
                                        orgCode: orgId,
                                        orgName,
                                        userCode
                                    })
                                );
                            }
                            config.data.data.userSystemTypeForOther = this.storeForm.userSystemTypeForOther;
                            // 拾取一个申请账号
                            const userCode = this.storeForm
                                .userCodesForOther[0];
                            const instance = this.usersList.find(
                                item => item.userCode === userCode
                            );
                            // 如果有此用户那么使用他的机构 否则 使用代人申请快速创建中的机构数据
                            if (instance) {
                                config.data.data.orgCode = instance.orgCode;
                            } else {
                                config.data.data.orgCode = this.storeForm.orgCodeForOther;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case "applyAdmin":
                    config.url = "/adminApply/queryGroupAuthList.do";
                    break;
                default:
                    console.log(
                        "未知的申请类型: getUserGroupRequest",
                        this.applyType
                    );
                    break;
            }
            return axios(config);
        },
        // 获取菜单角色
        getMenuRoleRequest() {
            const config = {
                method: "post",
                data: {
                    data: {
                        tenementCode: this.tenantId,
                        ...this.query
                    },
                    page: this.page
                },
                params: {
                    tenementCode: this.tenantId
                }
            };
            switch (this.applyType) {
                case "applyUser":
                    config.url = "/businessApply/queryMenuRoleList.do";
                    config.data.data.applyType = this.storeForm.applyType;
                    config.data.data.assignType = this.storeForm.assignType;
                    // self 个人 other 代人申请
                    switch (this.storeForm.applyType) {
                        case "self":
                            config.data.data.orgCode =
                                this.storeForm.usfOrgId || undefined;
                            break;
                        case "other":
                            // 判定是否为代人申请
                            config.data.data.usersForOther = this.storeForm.usersForOther;
                            if (this.storeForm.assignType === "1") {
                                config.data.data.usersForOther = this.storeForm.usersForOther.map(
                                    ({ id, orgId, orgName, userCode }) => ({
                                        id,
                                        orgCode: orgId,
                                        orgName,
                                        userCode
                                    })
                                );
                            }
                            config.data.data.userSystemTypeForOther = this.storeForm.userSystemTypeForOther;
                            // 拾取一个申请账号
                            const userCode = this.storeForm
                                .userCodesForOther[0];
                            const instance = this.usersList.find(
                                item => item.userCode === userCode
                            );
                            // 如果有此用户那么使用他的机构 否则 使用代人申请快速创建中的机构数据
                            if (instance) {
                                config.data.data.orgCode = instance.orgCode;
                            } else {
                                config.data.data.orgCode = this.storeForm.orgCodeForOther;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case "applyAdmin":
                    config.url = this.isUsfUse
                        ? "/adminApply/queryUsfRoleForUser.do"
                        : "/adminApply/queryRoleAuthList.do";
                    break;
                default:
                    console.log(
                        "未知的申请类型: getMenuRoleRequest",
                        this.applyType
                    );
                    break;
            }
            return axios(config);
        },
        // 获取数据资源权限
        getDataResourceRequest() {
            const config = {
                method: "post",
                url: "/adminApply/queryDataResourceAuthList.do",
                data: {
                    data: {
                        tenementCode: this.tenantId,
                        ...this.query
                    },
                    page: this.page
                },
                params: {
                    tenementCode: this.tenantId
                }
            };
            switch (this.applyType) {
                case "applyUser":
                    config.url = "/businessApply/queryDataResourceList.do";
                    config.data.data.applyType = this.storeForm.applyType;
                    config.data.data.assignType = this.storeForm.assignType;
                    // self 个人 other 代人申请
                    switch (this.storeForm.applyType) {
                        case "self":
                            config.data.data.orgCode =
                                this.storeForm.usfOrgId || undefined;
                            break;
                        case "other":
                            // 判定是否为代人申请
                            config.data.data.usersForOther = this.storeForm.usersForOther;
                            if (this.storeForm.assignType === "1") {
                                config.data.data.usersForOther = this.storeForm.usersForOther.map(
                                    ({ id, orgId, orgName, userCode }) => ({
                                        id,
                                        orgCode: orgId,
                                        orgName,
                                        userCode
                                    })
                                );
                            }
                            config.data.data.userSystemTypeForOther = this.storeForm.userSystemTypeForOther;
                            // 拾取一个申请账号
                            const userCode = this.storeForm
                                .userCodesForOther[0];
                            const instance = this.usersList.find(
                                item => item.userCode === userCode
                            );
                            // 如果有此用户那么使用他的机构 否则 使用代人申请快速创建中的机构数据
                            if (instance) {
                                config.data.data.orgCode = instance.orgCode;
                            } else {
                                config.data.data.orgCode = this.storeForm.orgCodeForOther;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case "applyAdmin":
                    config.url = "/adminApply/queryDataResourceAuthList.do";
                    break;
                default:
                    console.log(
                        "未知的申请类型: getDataResourceRequest",
                        this.applyType
                    );
                    break;
            }
            return axios(config);
        },
        validDataResourceRequest(rows = []) {
            return Promise.resolve();
            const data = {};
            rows.map(row => {
                if (!data[row.typeCode]) {
                    data[row.typeCode] = [];
                }
                data[row.typeCode].push(row.dataCode);
            });
            const config = {
                method: "post",
                url: "/businessApply/validUserAuthorizeDataResourceBySpi.do",
                data: {
                    tenementCode: this.tenantId,
                    applyUser: this.storeForm.userCode,
                    assignType: this.storeForm.assignType,
                    applyType: this.storeForm.applyType,
                    dataResourceMaps: data,
                    userCodesForOther: this.storeForm.userCodesForOther
                },
                params: {
                    tenementCode: this.tenantId
                }
            };
            return axios(config).then(response => {
                const errors = get(response, "data.data", []) || [];
                if (errors.length) {
                    const messages = [];
                    errors.forEach(error => {
                        messages.push(
                            `用户「${error.userCode}」在数据类型「${
                                error.typeCode
                            }」中的资源「${error.dataCode}」,错误信息： ${
                                error.mark
                            }`
                        );
                    });
                    this.$message.error(messages.join("\n"));
                    return Promise.reject();
                } else {
                    return Promise.resolve();
                }
            });
        }
    }
};
