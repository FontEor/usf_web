/**
 * 5.3    USF平台管理员
 */
const config = {
    prefix: '/platformAdmin',
    items: [
        // 新增
        {key: 'add', url: '/addPlatformAdmin'},
        // 删除
        {key: 'delete', url: '/deletePlatformAdmin'},
        //列表
        {key: 'queryPage', url: '/queryPlatformAdminList'},

        //用户类型  prd 5.2
        {key: 'IsPlatformAdmin', url: '/IsPlatformAdmin',method:'get'},
    ]
}

export default req.generate(config)
