/**
 * 数据字典相关接口
 */
const config = {
    // prefix: '/user',
    prefix: "",
    items: [
        // 查询用户组扩展字段
        {
            key: 'queryGroupExtList',
            url: '/common/ext/usergroup/list'
        },
        // 添加用户组扩展字段
        {
            key: 'extGroupAdd',
            url: 'common/ext/usergroup/addOrEdit'
        },
        // 添加用户
        {
            key: "addUser",
            url: "/userGroup/addUserGroup.do"
        },
        // 删除
        {
            key: "deleteUser",
            url: "/userGroup/deleteUserGroup.do"
        },
        // 编辑用户
        {
            key: "editUser",
            url: "/userGroup/editUserGroup.do"
        },
        // 查询分页列表
        {
            key: "queryPage",
            url: "/userGroup/queryUserGroupList.do"
        },
        // 更新
        {
            key: "update",
            url: "/user/queryOrgList"
        },
        // 账号类型下拉数据
        {
            key: "systype",
            url: "/user/getAccountSysType.do"
        },
        // 查询用户组菜单角色列表
        {
            key: "ResourceRoleByGroup",
            url: "/userGroup/resource/role/list"
        },
        //查看用户组菜单角色
        {
            key: "viewResourceRoleByGroup",
            url: "/userGroup/viewResourceRoleByGroup.do"
        },
        // 查询用户组数据角色列表
        {
            key: "DataRoleListByGroup",
            url: "/userGroup/data/role/list"
        },
        // 查看用户组数据角色列表
        {
            key: "viewDataRoleListByGroup",
            url: "/userGroup/viewDataRoleListByGroup.do"
        },
        // 保存 菜单角色列表
        {
            key: "addMenuRoleToUserGroup",
            url: "/userGroup/addMenuRoleToUserGroup.do"
        },
        // 保存 数据角色列表
        {
            key: "addDataRoleToUserGroup",
            url: "/userGroup/addDataRoleToUserGroup.do"
        },
        // 查询 组成员
        {
            key: "UserListByGroup",
            url: "/userGroup/users/list"
        },
        // 查看 组成员
        {
            key: "viewUserListByGroup",
            url: "/userGroup/viewUserListByGroup.do"
        },
        // 保存 组成员
        {
            key: "addUserToUserGroup",
            url: "/userGroup/addUserToUserGroup.do"
        },
        // 查询菜单角色列表
        {
            key: 'listForUser',
            url: '/role/listForUser'
        },
    ]
};

export default req.generate(config);
