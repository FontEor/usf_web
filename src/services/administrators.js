const config = {
    prefix: "/user",
    items: [
        // 查询列表
        { key: "queryBrands", url: "/queryUserListByPage.do" },
        // 删除
        { key: "deleteEntity", url: "/delete" },
        // 更新
        { key: "update", url: "/update" },
        //角色新增
        { key: "roleAdd", url: "/add" },
        // 查询分页列
        { key: "queryPage", url: "/queryPage" },
        { key: "queryTheListDig", url: "/queryTheListDigList" },
        //queryEntity 详情 role/get
        { key: "queryEntity", url: "/get" },
        //点击分配
        { key: "findUserRole", url: "/findUserRole" },
        //点击编辑 然后提交
        { key: "updateCommit", url: "/update" },
        //查看该角色下有多少用户
        { key: "count", url: "/count", prefix: "/role/user" },
        //查看是否重名
        { key: "isHasUser", url: "/exist" },
        //机构管理点击设置超级管理员走的接口 弹窗列表
        {
            key: "queryOrgAdminUserListByPage",
            url: "/queryOrgAdminUserListByPage.do",
            prefix: "/user"
        },
        //设置机构超级管理员
        { key: "setOrgAdmin", url: "/setOrgAdmin", prefix: "/orgAdmin" },
        ///org/queryOrgManagerList 4.4功能6 分配树的列表
        {
            key: "queryOrgManagerList",
            url: "/queryOrgManagerList",
            prefix: "/org"
        },
        ///org/queryOrgManagerList 4.4功能6 分配树的列表
        {
            key: "queryOrgManagerListV2",
            url: "/queryOrgManagerListV2",
            prefix: "/org"
        },
        ///orgAdmin/assignOrgAdmin  4.4 分配的点击
        { key: "assignOrgAdmin", url: "/assignOrgAdmin", prefix: "/orgAdmin" },
        ///orgAdmin/assignOrgAdminPageList  分配的点击
        {
            key: "assignOrgAdminPageList",
            url: "/assignOrgAdminPageList",
            prefix: "/orgAdmin"
        },
        //4.4  菜单角色列表/admin/resource/role/list
        { key: "Mlist", url: "/list", prefix: "/admin/resource/role" },
        //枚举  软件系统
        { key: "hond", url: "/queryAppList.do", prefix: "/application" },
        /// //admin/assign/roles/to/userr 4.4菜单角色关系
        {
            key: "assignRoleManagementToUser",
            url: "/user",
            prefix: "/admin/assign/roles/to"
        },
        ///admin/data/role/list  分配数据角色
        { key: "aList", url: "/list", prefix: "/admin/data/role" },
        ///admin/assign/data/roles/to/user 数据角色管理权限
        { key: "assUser", url: "/user", prefix: "/admin/assign/data/roles/to" },
        ///admin/resource/list  树  4.4第三个按钮列表
        { key: "Tlist", url: "/list", prefix: "/admin/resource" },
        //Cresource 4.4 第三个按钮提交 /admin/assign/resource
        { key: "Cresource", url: "/resource", prefix: "/admin/assign" },
        ///admin/data/list 4.4第四个按钮
        { key: "Alist", url: "/list", prefix: "/admin/data" },
        ///admin/assign/data 4.4分配数据管理权限
        { key: "disData", url: "/data", prefix: "/admin/assign" },
    ]
};
const config2 = {
    prefix: "",
    items: [
        // 查询列表
        { key: "findUserResource", url: "/resource/findUserResource" },
        { key: "queryExtList", url: "/common/ext/role/list" },

    ]
};
const config3 = {
    prefix: "/admin",
    items: [
        // 用户组查询
        { key: "queryUserGroupList", url: "/queryGroupAuthList.do" },
        // 分配用户组管理权限
        { key: "userGroupAllotSave", url: "/assign/userGroupAuthAdmin.do" }
    ]
};
export default {
    ...req.generate(config),
    ...req.generate(config2),
    ...req.generate(config3),
};
