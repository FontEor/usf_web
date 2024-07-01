/**
 * 数据字典相关接口
 */
const config = {
    prefix: '',
    items: [
        // 用户列表查询
        { key: 'querySmartLog', url: '/smartLog/querySmartLog' },
        // 查询业务类型
        { key: 'queryAllWorkType', url: '/smartLog/queryAllWorkType' },
        // 查询操作类型
        { key: 'queryAllOperateType', url: '/smartLog/queryAllOperateType' },
        
    ]
}

export default req.generate(config)
