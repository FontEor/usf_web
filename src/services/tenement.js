/**
 * 租户管理模块相关接口
 */
const config = {
    prefix: '/tenement',
    items: [
        // 新增
        { key: 'add', url: '/addTenement.do' },
        // 删除租户
        { key: 'delete', url: '/deleteTenement.do' },
        // 更新租户信息
        { key: 'update', url: '/editTenement.do' },
        // 根据ID获取租户信息
         { key: 'view', url: '/getTenementById.do' ,wrapByData:false},
        // 列表
        { key: 'queryPage', url: '/queryTenementListByPage.do' },
        // 全局租户信息 tenement/findTenementListByUserCode.do
        { key: 'findTenementCode', url: '/findTenementListByUserCode.do' },
        // 获取usf菜单
        { key: 'querySusfResource', url: '/querySusfResource', prefix: '/accessLogin' },
        // 弹窗数据统计
        { key: 'logSwitchMenuEdition', url: '/logSwitchMenuEdition', prefix: '/accessLogin' },
        // 根据租户获取自动分配及审批流信息
        { key: 'getPositionAutoAssignInfo', url: '/getPositionAutoAssignInfo' },
        // 编辑租户开启和关闭自动分配权限
        { key: 'editPositionAutoAssignInfo', url: '/editPositionAutoAssignInfo' },
        // 仓库枚举请求
        { key: 'getDidMap', url: "/getDidMap" }
    ]
}
const config2 = {
    prefix: '/applyFlow',
    items: [
        // 设置权限申请审批流程回显
        { key: 'findFlowList', url: '/findFlowList.do' },
        // 设置权限申请审批流程回显
        { key: 'editApplyFlow', url: '/editApplyFlow.do' },
    ]
}
const config3 = {
    prefix: '/tenementMemphisCfg',
    items: [
        // 获取
        { key: 'findTenementMemphisCfg', url: '/findTenementMemphisCfg.do' },
        // 设置
        { key: 'editTenementMemphisCfg', url: '/editTenementMemphisCfg.do' },
        // 获取开关
        { key: 'queryGlobalSwitchAboutUserCfg', url: '/queryGlobalSwitchAboutUserCfg' },
    ]
}

export default {
    ...req.generate(config),
    ...req.generate(config2),
    ...req.generate(config3)
} 
