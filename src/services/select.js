/**
 *  下拉相关
 */
const config = {
    items: [
        // 软件系统枚举
        { key: 'querySoftSystemList', url: '/queryAppList.do' , prefix: '/application' }
    ]
}

export default req.generate(config)
