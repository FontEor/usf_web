/**
 * 数据角色管理权限相关接口
 */

const config = {
   prefix: '/dataRole',
   items: [
      // 数据角色列表
      { key: 'queryDataRoleList', url: '/user/own/list' },
      // 用户列表
      { key: 'queryAdminDataRoleUserListByPage', url: '/assign/users/list' },
      // 分配权限
      { key: 'assginDataRoleManagementRights', url: '/assign/users' }
   ]
}

export default {
   ...req.generate(config)
}