//通用的枚举值

export default {
    //菜单资源管理枚举
    resourceType: {
        0: '菜单',
        1: '按钮',
        2: '其他'
    },
    yesOrNo: {
        0: '否',
        1: '是'
    },
    highRiskType: {
        0:'空',
        1: '精准查询',
        2: '批量下载',
        3: '批量查询',
        4: '跨仓查询'
    },
    sensitiveType: {
        0:'空',
        1: '个人隐私类',
        2: '个人隐私类（内部）',
        3: '商家类',
        4: '财务类',
        5: '销售类',
        6: '合约类',
        7: '操作风险类'
    },
    dids: {
        1: "公共库",
        2: "商家工作台库"
    },
    didList: [{
        label: "公共库",
        value: 1
    }, {
        label: "商家工作台库",
        value: 2
    }],
    applyHistoryState: [{
        label: "驳回",
        value: -1
    }, {
        label: "审批中",
        value: 0
    }, {
        label: "审批完成",
        value: 1
    }, {
        label: "撤回",
        value: 2
    }, {
        label: "异常",
        value: 3
    }]
}
