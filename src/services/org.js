/**
 * 机构管理相关接口
 */
const config = {
    prefix: '/org',
    items: [
        // 添加机构
        { key: 'add', url: '/addOrg' },
        // 查询机构
        { key: 'query', url: '/queryAllOrgList' },
        { key: 'queryByParentid', url: '/queryOrgList' },
        // 删除机构
        { key: 'delete', url: '/deleteOrg' },
        // 更新机构
        { key: 'update', url: '/editOrg' },
        // 查询机构用户列表
        { key: 'queryUsers', url: '/queryOrgUserListByPage.do', prefix: '/user' },
        // 查询机构菜单角色列表
        { key: 'roleList', url: '/role/list' },
        // 查询所选机构数据角色列表
        { key: 'dataRoleList', url: '/dataRole/list' },
        // 更改某机构菜单角色
        { key: 'addOrgRoleRel', url: '/addOrgRoleRel', prefix: '/orgRoleRel' },
        // 查询应用列表
        { key: 'appList', url: '/queryAppList.do', prefix: '/application' },
        // 变更父节点
        { key: 'updateParent', url: '/changeParentOrg' },
        // 查询该节点下所有父节点
        { key: 'queryByRoot', url: '/queryAllOrgListyByRoot' },
        // 所属机构 【入参】tenementCode: "xxx"
        { key: 'queryTreeOrgList', url: '/queryTreeOrgList' },
        
        // 验证类型为企业的机构删除条件
        {
            key: 'validateOrgTypeSatisfy',
            url: '/validateOrgTypeSatisfy'
        },
        {
            key: 'queryOrgCount',
            url: '/queryOrgCount'
        },
        // 获取可申请角色列表接口
        {
            key: 'allowApplyRoleList',
            url: '/role/listForApplyRole',
            method: "post"
        },
        // 可申请角色保存接口
        {
            key: 'allowApplyRoleSave',
            url: '/setOrgAppRole',
            method: "post"
        },
    ]
}

export default req.generate(config)
