/**
 * 数据字典相关接口
 */
const config = {
    // prefix: '/user',
    prefix: "",
    items: [
        // 新增
        {
            key: "add",
            url: "/add"
        },
        // 删除
        {
            key: "delete",
            url: "/delete"
        },
        // 更新
        {
            key: "update",
            url: "/user/queryOrgList"
        },
        // 查询分页列表
        {
            key: "queryPage",
            url: "/user/queryPage"
        },
        // 根据字典类型查询字典列表
        {
            key: "queryDictByType",
            url: "/user/getDictValue"
        },
        // 用户列表查询
        {
            key: "queryUserListByPage",
            url: "/user/queryUserListByPage.do"
        },
        // 添加用户
        {
            key: "addUser",
            url: "/user/addUser.do"
        },
        // 导出用户
        {
            method: "get",
            key: "exportUser",
            url: "/user/export/exportUser.do"
        },
        // 编辑用户
        {
            key: "editUser",
            url: "/user/editUser.do"
        },
        // 启用
        {
            key: "enableUser",
            url: "/user/enableUser.do"
        },
        // 停用
        {
            key: "disableUser",
            url: "/user/disableUser.do"
        },
        // 批量启用/停用用户
        {
            key: "batchEnableOrDisableUser",
            url: "/user/batchEnableOrDisableUser.do"
        },
        // 点击编辑查询用户详情
        {
            key: "findUserById",
            url: "/user/findUserById.do"
        },
        // 账号类型下拉数据
        {
            key: "systype",
            url: "/user/getAccountSysType.do"
        },
        //判断用户是否存在
        {
            key: "account",
            url: "/user/jugeAccountExist.do"
        },
        //判断用户是否为erp用户
        {
            key: "erptype",
            url: "/jugeLoginUserErpType"
        },

        //判断是否展示创建mfs账号的通道
        {
            key: "isShowCreateMfsAccountOption",
            url: "/isShowCreateMfsAccount"
        },

        // 所属部门
        {
            key: "queryTreeOrgList",
            url: "/org/queryTreeOrgList"
        },
        // 查询菜单角色列表
        {
            key: "listForUser",
            url: "/role/listForUser"
        },
        // 查询数据角色列表
        {
            key: "queryDataRoleByUser",
            url: "/dataRole/queryDataRoleByUser.do"
        },
        // 保存 菜单角色列表
        {
            key: "updateUserRole",
            url: "/role/updateUserRole"
        },
        // 保存 数据角色列表
        {
            key: "assignDataRoles",
            url: "/user/assignDataRoles.do"
        },
        // 查询 数据类型列表
        {
            key: "DataTypeList",
            url: "data/type/list"
        },
        // 查询 数据权限列表
        {
            key: "DataAssignList",
            url: "data/assign/list"
        },
        // 授权所有数据资源到用户
        {
            key: "assignAllDSToUser",
            url: "data/assignAllDSToUser"
        },
        // 保存 数据权限
        {
            key: "DataAssign",
            url: "data/assign"
        },
        // 查询用户扩展字段列表
        {
            key: "queryExtList",
            url: "/common/ext/user/list"
        },

        // 编辑用户扩展字段列表
        {
            key: "extUpdate",
            url: "/common/ext/user/update"
        },
        // 添加用户扩展字段
        {
            key: "extAdd",
            url: "/common/ext/user/add"
        },
        // 查询用户组扩展字段
        {
            key: "queryGroupExtList",
            url: "/common/ext/usergroup/list"
        },
        // 添加用户组扩展字段
        {
            key: "extGroupAdd",
            url: "common/ext/usergroup/addOrEdit"
        },
        // 删除
        { key: "deleteUser", url: "/user/deleteUser.do" },
        // 批量删除用户
        { key: "batchDeleteUser", url: "/user/batchDeleteUser.do" },
        //账号解冻
        { key: "unlockUser", url: "/user/unlockUser.do" },
        // 所属部门懒加载
        { key: "queryOrgList", url: "/org/queryOrgList" },
        // 判断是否显示添加类型框
        { key: "showAddAccountType", url: "/user/showAddAccountType" },
        // 查看用户数据权限列表
        { key: "queryUserBaseData", url: "/data/queryUserBaseData" },
        // 查看userGroup
        { key: "queryUserGroup", url: "/user/viewGroupForUser" },
        // 查看单个数据权限来源
        {
            key: "queryUserBaseDataAssignSource",
            url: "/data/queryUserBaseDataAssignSource"
        },
        // 查看菜单权限列表
        { key: "viewMenuForUser", url: "/user/viewMenuForUser" },
        // 查看菜单角色权限列表
        { key: "viewMenuRoleForUser", url: "/user/viewMenuRoleForUser" },
        // 查看单个菜单角色权限来源
        {
            key: "queryUserMenuRoleSource",
            url: "/user/viewSingleMenuRoleSource"
        },
        // 查看某个菜单权限来源
        { key: "viewSingleMenuSource", url: "/user/viewSingleMenuSource" },
        // 添加用户是否展示部门搜索切换按钮
        { key: "judgeShowChangeButton", url: "org/judgeShowChangeButton" },
        // 添加用户部远程模糊搜索接口
        { key: "blurryQueryOrg", url: "org/blurryQueryOrg" },
        // 添加用户远程获取机构保存
        { key: "addUserByRpcOrg", url: "user/addUserByRpcOrg.do" },
        //查询全局开关，判断启用停用用户时是否修改文案描述
        {
            key: "queryGlobalSwitchAboutUserCfg",
            url: "/tenementMemphisCfg/queryGlobalSwitchAboutUserCfg"
        },
        //重置用户密码、手机号、邮箱
        {
            key: "resetUserInfoPTE",
            url: "/userInfoReset/resetUserInfoPTE"
        },
        //查询用户账号对应的用户信息
        {
            key: "findUserInfo",
            url: "/user/findUserInfo.do"
        },
        //获取登录类型
        {
            key: "getLoginType",
            url: "/user/getLoginType.do"
        },
        // 获取ERP用户信息
        {
            method: "get",
            key: "getUserErpInfo",
            url: "/apply/getUserErpInfo"
        },
        // 根据业务系统名模糊搜索业务系统列表
        {
            // 修改请求方式由get 改为post
            method: "post",
            key: "getApplicationListByName",
            url: "/apply/getApplicationListByName",
            // url默认拼接当前租户tenementCode,replaceTenementCode为true时，移除当前租户，增加params传参{tenementCode：}
            // replaceTenementCode: true
        },
        // 根据业务系统id查找租户
        {
            method: "get",
            key: "getTenementListByAppId",
            url: "/apply/getTenementListByAppId",
            replaceTenementCode: true
        },
        // 根据租户id查找根机构
        {
            key: "getOrgByTenementCode",
            url: "/apply/getOrgByTenementCode",
            replaceTenementCode: true
        },
        // 根据根机构id查找下一级机构列表
        {
            key: "getOrgListByParentOrgCode",
            url: "/apply/getOrgListByParentOrgCode",
            replaceTenementCode: true
        },
        // 根据业务系统id和根机构id查询菜单角色列表
        {
            key: "getPermissionRoleListByAppCodeAndorgCode",
            url: "/apply/getPermissionRoleListByAppCodeAndorgCode",
            replaceTenementCode: true
        },
        // 根据租户id查找数据角色列表
        {
            key: "getDataRoleListByTenementCode",
            url: "/apply/getDataRoleListByTenementCode",
            replaceTenementCode: true
        },
        // 根据userCode查询菜单角色列表
        {
            key: "menuRolelistForUser",
            url: "/apply/menuRolelistForUser",
            replaceTenementCode: true
        },
        // 根据userCode查询数据角色列表
        {
            key: "applyQueryDataRoleByUserCode",
            url: "/apply/queryDataRoleByUserCode.do",
            replaceTenementCode: true
        },
        // 提交个人申请
        {
            key: "submitUserRoleAndDataApply",
            url: "/apply/submitUserRoleAndDataApply.do",
            replaceTenementCode: true
        }
    ]
};

export default req.generate(config);
