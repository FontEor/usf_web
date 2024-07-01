/**
 * 缓存工具模块几个列表
 */
const config = {
    prefix: '/cache',
    items: [
        {key: 'getCacheUserInfo', url: '/getCacheUserInfo'},//用户列表
        {key: 'getCacheUserRoleInfo', url: '/getCacheUserRoleInfo'},//用户角色列表
        {key: 'getCacheUserResourceInfo', url: '/getCacheUserResourceInfo'},//用户资源 资源列表
        {key: 'getAccountSysTypeInfo', url: '/getAccountSysTypeInfo'},//账号体系枚举值
        {key: 'getCacheRoleResourceList', url: '/getCacheRoleResourceList'},// 角色资源
        {key: 'getAllTenementList', url: '/getAllTenementList'},//租户列表接口
        {key: 'getAllAppInfoListByTenement', url: '/getAllAppInfoListByTenement'},//应用枚举接口
        {key: 'findService', url: '/findService'},//方法调用页面
        {key: 'getAllServiceList', url: '/getAllServiceList'},//服务下拉
    ]
}

export default req.generate(config)
