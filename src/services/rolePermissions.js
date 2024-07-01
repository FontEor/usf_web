const config = {
    prefix: '/role',
    items: [
        // 查询列表
        { key: 'queryBrands', url: '/list' },

        { key: 'rolePermissionList', url: '/listForApply' },
        // 删除
        { key: 'deleteEntity', url: '/delete' },
        // 更新
        { key: 'update', url: '/update' },
        //角色新增
        { key: 'roleAdd', url: '/add' },
        // 查询分页列
        { key: 'queryPage', url: '/queryPage' },
        //
        { key: 'queryTheListDig', url: '/queryTheListDigList' },
        //queryEntity 详情 role/get
        { key: 'queryEntity', url: '/get' },
        //点击分配
        { key: 'findUserRole', url: '/findUserRole' },
        //点击编辑 然后提交
        { key: 'updateCommit', url: '/update' },
        //查看该角色下有多少用户
        { key: 'count', url: '/count' ,prefix:'/role/user'},
        //查看是否重名
        { key: 'isHasUser', url: '/exist' },
        //模拟 弹窗请求的list
        { key: 'mockList', url: '/queryMenuRoleUserListByPage.do',prefix:'/user'},
        //点击分配菜单角色 然后点击确认按钮
        { key: 'assignUserWithMenuRole', url: '/assignUserWithMenuRole.do',prefix:'/user'},
        ///user/queryOrgUserListByPage.do  queryMenuRoleUserListByPage.do
       //枚举  软件系统
       { key: 'queryAppList', url: '/queryAppList.do',prefix:'/application'},
        // 禁用菜单角色
        { key: 'disableResourceRole', url: '/disableResourceRole' },
        // 启用菜单角色
        { key: 'enableResourceRole', url: '/enableResourceRole' },
        // 导出菜单角色
        { key: 'exportRoleWithPerm', url: '/export/exportRoleWithPerm.do' },
        // 导出用户菜单角色
        { key: 'exportRoleWithUser', url: '/export/exportRoleWithUser.do' },
        // 查询是否显示敏感下拉列表
        {
            key: 'showSensitiveRoleSelect',
            url: '/showSensitiveRoleSelect'
        },
        // 查询关联菜单角色对话框表格数据
        {key:"listForResourceOne",url:"/listForResourceOne"},
        // 更新关联菜单角色
        {key:"updateRolesForResource",url:"/updateRolesForResource"}

    ]
}
const config2 = {
    prefix: '/resource',
    items: [
        // 查询列表
        { key: 'findUserResource', url: '/findUserResource' },
        { key: 'findResourceByRole', url: '/findResourceByRole' },
        {key: 'searchOneList',url:'/user/searchOne/list'},
    ]
}

const  config3 = {
    prefix : '/common/ext/role',
    items :[
        // 查询用户扩展字段列表
        {
            key: 'queryRoleExtList',
            url: '/list'
        },
        // 编辑用户扩展字段列表
        {
            key: 'extRoleAddOrEdit',
            url: '/addOrEdit'
        }
    ]
}
///role/findUserRole
///role/update  deleteBrands
export default{
    ...req.generate(config),
    ...req.generate(config2),
    ...req.generate(config3)
 }
