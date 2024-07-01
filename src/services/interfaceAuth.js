/**
 * 应用管理模块相关接口
 */
const config = {
    prefix: '/rule',
    items: [
        // 规则新增
        { key: 'add', url: '/addRule' },
        // 规则删除
        { key: 'delete', url: '/deleteRuleById' },
        // 规则编辑接口
        { key: 'update', url: '/editRule' },
        // 根据ID查询接口
        { key: 'view', url: '/queryRuleById' },
        // 根据条件分页规则查询接口
        { key: 'queryPage', url: '/queryRuleByPage' },
        // 查询安全等级接口
        { key: 'querySafetyLevelData', url: '/querySafetyLevelData', method: 'get' },
        // 账户系统类别接口
        { key: 'queryUserSystemTypeData', url: '/queryUserSystemTypeData' }
    ]
}

export default req.generate(config)
