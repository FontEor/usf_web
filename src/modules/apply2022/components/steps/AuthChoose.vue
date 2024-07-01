<template>
    <div class="apply-2022-auth-choose-container">
        <!-- 必须是业务申请 applyUser 并且是 代人申请和本人申请时显示 -->
        <PinsContainer
            v-if="applyType === 'applyUser' && (formData.applyType === 'other' || (formData.applyType === 'self' && formData.assignType==='2') )"
            :accounts="formData.usersForOther"
            :errors="errorUserExportList"
            :applyType="formData.applyType"
            :userCode="formData.userCode"
            :title="formData.assignType == 1 ? '申请' : '关闭'"
        />
        <!-- 如果是不是关闭权限时 -->
        <template v-if="formData.assignType != 2">
            <!-- 必须是 管理员申请 时显示 applyAdmin -->
            <USFMenuAuth ref="usfMenuAuth" v-if="applyType === 'applyAdmin' && show.usfMenuAuth"/>
            <!-- 必须是 管理员申请 时显示 -->
            <InstitutionManagement ref="institutionManagement" v-if="applyType === 'applyAdmin' && show.institutionManagement" />
            <UserGroup ref="userGroup" v-if="show.userGroup" :applyType="formData.applyType"/>
            <MenuAuth ref="menuAuth" v-if="show.menuAuth" :applyType="formData.applyType"/>
            <DataRole ref="dataRole" v-if="show.dataRole" :applyType="formData.applyType"/>
            <DataResource ref="dataResource" v-if="show.dataResource" :applyType="formData.applyType"/>
            <SystemSuperAdmin ref="usfAdministrator" v-if="show.usfAdministrator && applyType === 'applyAdmin' " :applyType="formData.applyType"/>
        </template>
        <WriteHelper />
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Loading } from 'element-ui';
import axios from "axios";
import USFMenuAuth from "../authorization/USFMenuAuth.vue";
import UserGroup from "../authorization/UserGroup.vue";
import WriteHelper from "../WriteHelper.vue";
import MenuAuth from "../authorization/MenuAuth.vue";
import DataRole from "../authorization/DataRole.vue";
import DataResource from "../authorization/DataResource/Index.vue";
import InstitutionManagement from "../authorization/InstitutionManagement.vue";
import PinsContainer from "../PinsContainer.vue"
import SystemSuperAdmin from "../authorization/SystemSuperAdmin.vue"

import formatMixin from "../../mixins/format";
import Bus from "../../mixins/bus";
import store from "../../store/index.js";
import changeMixin from "../../mixins/change";

export default {
    name: "ApplyAuthChoose",
    mixins: [formatMixin, changeMixin],
    components: {
        USFMenuAuth,
        WriteHelper,
        UserGroup,
        MenuAuth,
        DataRole,
        DataResource,
        InstitutionManagement,
        PinsContainer,
        SystemSuperAdmin
    },
    data() {
        return {
            show: {
                "usfMenuAuth": true,
                "institutionManagement": true,
                "userGroup": true,
                "menuAuth": true,
                "dataRole": true,
                "dataResource": true,
                "usfAdministrator":true,
            }
        };
    },
    created() {
        Bus.$on("submitApply", this.submitApply);
    },
    beforeDestroy() {
        Bus.$off("submitApply", this.submitApply);
    },
    computed: {
        formData() {
            return store.state.form
        },
        errorUserExportList() {
            return store.state.errorUserExportList
        },
        applyType() {
            return store.state.applyType
        },
    },
    mounted() {
        this.getShowAuth();
    },
    methods: {
        ...mapMutations("apply2022", ["updateActiveApplyStep"]),
        tenantIdChange() {
            // 获取展示权限接口
            this.getShowAuth();
            this.clearAllData();
        },
        getShowAuth() {
            if(this.tenantId) {
                // 这里需要根据路由请求不同的接口
                let url = "/adminApply/getAdminApplyCfg";
                if(this.applyType === 'applyUser') {
                    url = "/businessApply/getBusinessApplyCfg"
                }
                axios({
                    method: "post",
                    url: url,
                    data: {
                        tenementCode: this.tenantId
                    },
                    params: {
                        tenementCode: this.tenantId
                    }
                })
                .then(response => {
                    if (response.data.code === 200) {
                        Object.assign(this.show, response.data.data);
                    }
                })
                .catch(reject => {
                    console.log("/adminApply/getAdminApplyCfg 请求失败", reject);
                });
            }
        },
        async submitApply(ignore) {
            try {
                store.commit("updateSubmitLoading", true);
                const data = this.formatData(ignore);
                // 如果忽略 或者 Data 说明有数据验证不通过
                if (data) {
                    // 如果是申请权限
                    if(data.assignType === 1) {
                        await this.$confirm(`您本次将申请${data._total}项权限，是否继续提交？`, '提示', {
                            confirmButtonText: '继续提交',
                            cancelButtonText: '返回编辑',
                            type: 'warning'
                        });
                    }
                    delete data._total;
                    let url = "/adminApply/submitApply.do";
                    if(this.applyType === 'applyUser') {
                        url = "/businessApply/submitApply.do"
                    }
                    let loading = Loading.service({
                        lock: true,
                        text: "数据提交中"
                    })
                    axios({
                        method: "post",
                        url: url,
                        data: data,
                        params: {
                            tenementCode: this.tenantId
                        }
                    })
                    .then(response => {
                        loading.close();
                        store.commit("updateSubmitLoading", false);
                        if (response.data.code === 200) {
                            store.commit("updateActiveApplyStep", { step: 1 });
                        } else {
                            this.$message.error(response.data.msg)
                        }
                    })
                    .catch(reject => {
                        loading.close();
                        store.commit("updateSubmitLoading", false);
                        console.log(`${url}: 请求失败`, reject);
                    });
                } else {
                    store.commit("updateSubmitLoading", false);
                }
            } catch (error) {
                console.log('####### 提交报错了', error);
                store.commit("updateSubmitLoading", false);
            }
        },
    }
};
</script>

<style></style>
