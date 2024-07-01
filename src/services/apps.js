/**
 * 应用管理模块相关接口
 */
const config = {
    prefix: '/application',
    items: [
        // 新增
        { key: 'add', url: '/addApp.do' },
        // 删除应用
        { key: 'delete', url: '/stopApp.do' },
        // 更新应用信息
        { key: 'update', url: '/editApp.do' },
        //详情
        { key: 'view', url: '/getAppById.do' },
        // 列表
        { key: 'queryPage', url: '/queryAppListByPage.do' },
        // 查询安全开关
        {key: 'querySafetySwitch', url: '/isSafetySwitchOpened'}
    ]
}

export default req.generate(config)
