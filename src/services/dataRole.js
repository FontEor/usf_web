/**
 * 数据角色管理相关接口
 */

const config = {
    prefix: '/dataRole',
    items: [
        // 分页查询数据角色列表信息
        { key: 'queryDataRoleList', url: '/queryDataRoleListByPage.do' },
        // 添加数据角色
        { key: 'addDataRole', url: '/addDataRole.do' },
        // 更新数据角色
        { key: 'editDataRole', url: '/editDataRole.do' },
        // 删除数据角色
        { key: 'deleteDataRole', url: '/deleteDataRole.do' },
        // 分配用户
        { key: 'assignUserForDataRoles', url: '/assignUserForDataRoles.do' },
        // 用户分配数据角色列表
        { key: 'queryDataRoleByUser', url: '/queryDataRoleByUser.do' },
        // 查询角色下关联用户数量
        { key: 'queryUsersOfDataRole', url: '/getUserCountByDataRoleId.do' }
    ]
}

const config_1 = {
    prefix: '/user',
    items: [
        { key: 'queryUserList', url: '/queryUserListForAddUserDataRoleRel.do' }
    ]
}

const config_2 = {
    prefix: '/data',
    items: [
        // 数据类型枚举
        { key: 'queryTypeList', url: '/type/list' },
        // 数据资源列表
        // { key: 'queryDataResourceList', url: '/assign/list' }
        { key: 'queryDataResourceList', url: '/assign/listForRole' }
    ]
}

export default {
    ...req.generate(config),
    ...req.generate(config_1),
    ...req.generate(config_2)
}