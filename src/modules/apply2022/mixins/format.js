import { groupBy, forIn, get } from "lodash";
import { mapState } from "vuex";
import store from "../store";
import Bus from "./bus";
import toolMixin from "../components/steps/InfoConfirm/tool";

export default {
    mixins: [toolMixin],
    computed: {
        ...mapState("app", ["tenementCode"]),
        formData() {
            return store.state.form;
        },
        usersList() {
            return store.state.usersList;
        }
    },
    mounted() {
        Bus.$on("clearAllAuthData", this.clearAllData);
    },
    beforeDestroy() {
        Bus.$off("clearAllAuthData", this.clearAllData);
    },
    methods: {
        formatIds(list, field = "id") {
            return list.map(item => item[field]);
        },
        formatIdMap(list, byField, field) {
            const dataMap = groupBy(list, byField);
            forIn(dataMap, (value, key) => {
                value = value || [];
                dataMap[key] = value.map(item => {
                    return item[field];
                });
            });
            return dataMap;
        },
        formatData(ignoreValid) {
            // 申请总数量
            let total = 0;
            //系统超管isUsfAdministrator
            const usfAdministrator =
                this.$refs.usfAdministrator &&
                this.$refs.usfAdministrator.isUsfAdministrator;
            const usfMenus =
                this.$refs.usfMenuAuth && this.$refs.usfMenuAuth.tableData;
            const usfRoleCode = this.formatIds(usfMenus || [], "roleCode");
            // groupCodes
            const userGroups =
                this.$refs.userGroup && this.$refs.userGroup.tableData;
            const groupCodes = this.formatIds(userGroups || [], "groupCode");
            // menuRoleMap
            const menuAuths =
                this.$refs.menuAuth && this.$refs.menuAuth.tableData;
            const menuRoleMap = this.formatIdMap(
                menuAuths || [],
                "appCode",
                "roleCode"
            );
            // dataRoleCodes
            const dataRoles =
                this.$refs.dataRole && this.$refs.dataRole.tableData;
            const dataRoleCodes = this.formatIds(dataRoles || [], "roleCode");
            // dataResourceMap
            const dataResources =
                this.$refs.dataResource && this.$refs.dataResource.tableData;
            const dataResourceMap = this.formatIdMap(
                dataResources || [],
                "typeCode",
                "dataCode"
            );
            // 机构管理权限
            const dataInstitutionManagement =
                this.$refs.institutionManagement &&
                this.$refs.institutionManagement.tableData;
            const orgCodes = this.formatIds(
                dataInstitutionManagement || [],
                "orgCode"
            );

            // 如果不忽略验证
            if (!ignoreValid) {
                // 验证数据
                let length = 0;
                //debugger
                if (usfAdministrator) {
                    length += 1;
                }
                if (usfRoleCode) {
                    length += usfRoleCode.length;
                }
                if (groupCodes) {
                    length += groupCodes.length;
                }
                if (menuAuths) {
                    length += menuAuths.length;
                }
                if (dataRoleCodes) {
                    length += Object.keys(dataRoleCodes).length;
                }
                if (dataResourceMap) {
                    length += Object.keys(dataResourceMap).length;
                }
                if (orgCodes) {
                    length += orgCodes.length;
                }
                if (length === 0) {
                    this.$message.error(
                        "系统检测到您尚未配置任何权限，请根据实际需要勾选，否则无法提交申请。"
                    );
                    return undefined;
                }
                total = length;
            }
            let orgCodeForOther = this.formData.orgCodeForOther;
            // 如果是代人申请
            if (this.formData.applyType === "other") {
                // 如果机构数据不存在 说明用户已经存在
                if (!orgCodeForOther) {
                    const userCode = get(this.formData, "userCodesForOther[0]");
                    const instance = this.usersList.find(
                        user => user.userCode === userCode
                    );
                    if (instance) {
                        orgCodeForOther = instance.orgCode;
                    }
                }
            }
            return {
                tenementCode: this.tenantId,
                applyUser: this.formData.userCode,
                orgCode: this.formData.usfOrgId,
                applyType: this.formData.applyType,
                assignType: +this.formData.assignType,
                userCodesForOther: this.formData.userCodesForOther.map(
                    user => user.userCode
                ),
                usersForOther:
                    this.formData.assignType === "1"
                        ? this.pickUserDataAssignType(
                              this.formData.usersForOther
                          )
                        : this.pickUserData(this.formData.usersForOther),
                userSystemTypeForOther: this.formData.userSystemTypeForOther,
                orgCodeForOther: orgCodeForOther,
                usfRoleCode,
                groupCodes,
                menuRoleMap,
                dataRoleCodes,
                dataResourceMap,
                orgCodes: orgCodes,
                applyRemark: this.formData.applyRemark,
                _total: total,
                isUsfAdministrator: usfAdministrator ? 1 : 0
            };
        },
        clearAllData() {
            const $usfMenus = this.$refs.usfMenuAuth;
            // groupCodes
            const $userGroups = this.$refs.userGroup;
            // menuRoleMap
            const $menuAuths = this.$refs.menuAuth;
            // dataRoleCodes
            const $dataRoles = this.$refs.dataRole;
            // dataResourceMap
            const $dataResources = this.$refs.dataResource;
            // 机构管理权限
            const $institutionManagement = this.$refs.institutionManagement;
            [
                $usfMenus,
                $userGroups,
                $menuAuths,
                $dataRoles,
                $dataResources,
                $institutionManagement
            ].forEach(com => {
                if (com) {
                    com.tableData = [];
                    com.getList && com.getList();
                }
            });
            //系统超管权限
            const $usfAdministrator = this.$refs.usfAdministrator;
            if ($dataResources) {
                $dataResources.tableDataGroup = {};
            }
            if ($usfAdministrator) {
                $usfAdministrator.isUsfAdministrator = 0;
            }
        }
    }
};
