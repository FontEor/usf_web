/**
 * 菜单角色管理权限相关接口
 */
const config = {
    prefix: '/role',
    items: [
        // 用户列表
        { key: 'queryMenuRoleUserListByPage', url:'/assign/users/list' },
        // 给用户分配权限
        { key: 'grant', url: '/assign/users' },
        // 角色下的菜单资源
        { key: 'queryMenuResourceByRole', url: '/get' },
        // 菜单角色列表
        { key: 'queryRoleList', url: '/user/own/list' }
    ]
}

export default req.generate(config)
