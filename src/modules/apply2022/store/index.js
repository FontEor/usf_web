import Vuex from "vuex";
import Bus from "../mixins/bus";

import { steps, stepsButtonsState, interceptors } from './steps';
const defaultIndex = 1;

const defaultStateForm = () => ({
    // 租户
    tenantId: undefined,
    tenantName: undefined,
    // 用户机构
    usfOrgId: undefined,
    // 用户编码
    userCode: undefined,
    applyType: 'self', // 申请类型 self 个人 other 代人申请
    assignType: 1, // 分配权限 1分配 2清除全部 4清除部分
    userCodesForOther: [], // 代人申请的账户 提交时废弃字段 逻辑中间保留用作数据处理
    usersForOther: [], // 代人申请的用户（含扩展字段信息）
    userSystemTypeForOther: 1, // 代人申请用户类型，代人申请必填
    orgCodeForOther: "", // 代人申请的所选机构
    applyRemark: '', // 申请原因
    entryMethod: 0, // 录入方式 0默认 1上传
})

const store = new Vuex.Store({
    namespaced: true,
    state: {
        applyType: "applyAdmin", // 权限申请类型 管理员 applyAdmin 业务 applyUser 与路由name一致
        // 步骤请求
        form: defaultStateForm,
        stepState: {
            // 当前步骤索引
            currentIndex: defaultIndex,
            // 当前步骤名称
            currentName: steps[defaultIndex],
            // 是否禁用下一步
            disabledNext: false,
            // 按钮权限
            buttons: stepsButtonsState[steps[defaultIndex]],
            // 提交是否进行中
            submitLoading: false
        },
        // 前端使用的数据
        errorUserExportList: [], // 错误账号导出数据
        illegalUserCodes: [], // 错误标色数据
        usersList: [], // 被申请人数据列表
        configInfo:{},//业务权限配置信息
        baseInfo:"",//业务权限配置信息字符串
        baseUSFInfo:"",//USF系统配置信息字符串
        fakeUserData: false, // 前端伪造的用户数据
    },
    // 不知为何的报错 奇了怪了
    // getters: {
    //     stepButtons(state) {
    //         return stepsButtonsState[state.stepState.currentName];
    //     }
    // },
    mutations: {
        // 不计算拦截器
        updateActiveApplyStepNoInterceptor(state, { step }) {
            store.commit('updateActiveApplyStep', { step, allowInterceptor: false })
        },
        // 进入下一步 或者上一步
        updateActiveApplyStep(state, { step, allowInterceptor = true }) {
            const index = state.stepState.currentIndex;
            let targetIndex = index + step;
            if (targetIndex >= 0) {
                if(targetIndex >= steps.length) {
                    targetIndex = steps.length - 1;
                }
                const tagetStepName = steps[targetIndex];
                // 拦截器名称
                let interceptorName = interceptors[tagetStepName]
                // 如果不是 代人申请
                // 那么没必要进入拦截器 置空拦截器名称
                if(state.form.applyType !== 'other') {
                    interceptorName = undefined;
                }
                // 如果存在拦截器 允许拦截 并且是下一步
                if(interceptorName && allowInterceptor && step > 0) {
                    Bus.$emit(interceptorName);
                } else {
                    // 如果是上一步 并且 当前是第二步
                    if(step < 0 && index === 2) {
                        // 如果机构是假数据那么
                        if(state.fakeUserData === true) {
                            state.fakeUserData = false;
                            return Bus.$emit('againChooseOrg');
                        }
                    }
                    // 如果没有拦截器 或者是上一步 直接操作
                    state.stepState.currentIndex = targetIndex;
                    state.stepState.currentName = tagetStepName;
                    state.stepState.buttons = stepsButtonsState[tagetStepName]
                }
            } else {
                throw new Error(`步骤传递错误:${step}`)
            }
        },
        updateForm(state, { key, value }) {
            switch (key) {
                // 如果是租户数据变化
                case 'tenantId':
                    Bus.$emit('tenantIdChange', value)
                    break;
                // 如果是机构数据变化
                case 'usfOrgId':
                    Bus.$emit('usfOrgIdChange', value)
                    break;
                default:
                    break;
            }
            state.form[key] = value;
        },
        updateNextButtonDisabled(state, boolean) {
            state.stepState.disabledNext = boolean;
        },
        clearAllData(state) {
            state.form = defaultStateForm();
            state.stepState = {
                // 当前步骤索引
                currentIndex: defaultIndex,
                // 当前步骤名称
                currentName: steps[defaultIndex],
                // 是否禁用下一步
                disabledNext: false,
                // 按钮权限
                buttons: stepsButtonsState[steps[defaultIndex]],
                // 提交是否进行中
                submitLoading: false,
            };
        },
        updateErrorUserExportList(state, { list, errorCode }) {
            const rows = (list || []).map(userCode => {
                return {
                    userCode: userCode,
                    errorCode: errorCode
                }
            });
            [].push.apply(state.errorUserExportList, rows);
        },
        updateErrorUserExportListExcel(state, { list }) {
            const rows = (list || []).map(user => {
                return {
                    userCode: user.userCode,
                    errorCode: -1,
                    message: user.failReason
                }
            });
            [].push.apply(state.errorUserExportList, rows);
        },
        clearErrorUserExportList(state) {
            state.errorUserExportList.length = 0;
        },
        updateApplyType(state, type) {
            if(['applyAdmin', 'applyUser'].includes(type)) {
                state.applyType = type;
                return
            }
            throw new Error('未知的申请类型');
        },
        updateIllegalUserCodes(state, errors) {
            state.illegalUserCodes = errors || [];
        },
        updateSubmitLoading(state, boolean) {
            state.submitLoading = boolean;
        },
        updateUsersList(state, list) {
            state.usersList = list;
        },
        updataConfigInfo(state,configInfo){
            state.configInfo = configInfo;
        },
        updatabaseInfo(state,baseInfo){
            state.baseInfo = baseInfo;
        },
        updatabaseUSFInfo(state,baseUSFInfo){
            state.baseUSFInfo = baseUSFInfo;
        },
        updateFakeUserData(state, boolean) {
            state.fakeUserData = boolean;
        }
    },
    actions: {}
});

export default store;
