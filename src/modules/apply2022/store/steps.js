// 步骤流程定义位置
export const steps = ['step0', 'step1', 'step2', 'step3', 'step4'];

// 步骤对应按钮状态
export const stepsButtonsState = {
    step0: {
        prev: false,
        next: false,
        processCenter: false,
        goIndex: false,
        confirmClose: false,
        confirm: false,
    },
    step1: {
        prev: false,
        next: false,
        processCenter: false,
        goIndex: false,
        confirmClose: false,
        confirm: false,
    },
    step2: {
        prev: true,
        next: true,
        processCenter: false,
        goIndex: false,
        confirmClose: false,
        confirm: false,
    },
    step3: {
        prev: true,
        next: false,
        processCenter: false,
        goIndex: false,
        confirmClose: false,
        confirm: true,
    },
    step4: {
        prev: false,
        next: false,
        processCenter: true,
        goIndex: true,
        confirmClose: false,
        confirm: false,
    }
}

export const breadcrumbs = {
    step0: ['入口选择'],
    step1: ['入口选择', '租户选择'],
    step2: ['入口选择', '租户选择', '信息确认'],
    step3: ['入口选择', '租户选择', '信息确认', '权限配置'],
    step4: ['入口选择', '租户选择', '信息确认', '权限配置', '完成申请'],

    history: ['入口选择', '我的申请']
}

// 是否有拦截器: 拦截器事件名称
export const interceptors = {
    step3: 'step2Valid'
}
