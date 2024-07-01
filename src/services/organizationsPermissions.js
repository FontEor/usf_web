const config = {
    prefix: '/role',
    items: [
        // 查询列表
        { key: 'queryBrands', url: '/list' },
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
        //机构管理点击设置超级管理员走的接口 弹窗列表
        { key: 'queryOrgAdminUserListByPage', url: '/queryOrgAdminUserListByPage.do',prefix:'/user'},
        //设置机构超级管理员
        { key: 'setOrgAdmin', url: '/setOrgAdmin',prefix:'/orgAdmin' },
    ]
}

///orgAdmin/setOrgAdmin

const config2 = {
    prefix: '/resource',
    items: [
        // 查询列表
        { key: 'findUserResource', url: '/findUserResource' },
     
    ]
}
///role/findUserRole
///role/update  deleteBrands
export default{
    ...req.generate(config),
    ...req.generate(config2)
 } 
